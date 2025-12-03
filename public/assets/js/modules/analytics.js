/**
 * Analytics Module
 * Envia dados anônimos de uso para análise
 * @version 0.1.0
 */

const ANALYTICS_DEBUG_ENABLED = (() => {
    if (typeof globalThis === 'undefined') {
        return false;
    }
    if (globalThis.INelegisDebug === true) {
        return true;
    }
    if (globalThis.process && globalThis.process.env && globalThis.process.env.INELEGIS_DEBUG === 'true') {
        return true;
    }
    return false;
})();

function analyticsDebugLog(...args) {
    if (ANALYTICS_DEBUG_ENABLED) {
        console.debug('[Analytics]', ...args);
    }
}

const Analytics = (() => {
    // Configuração
    const CONFIG = {
        endpoint: '/api/analytics', // Endpoint do backend
        enabled: true,
        batchSize: 10,
        flushInterval: 30000, // 30 segundos
        retryAttempts: 3
    };

    // Fila de eventos
    let eventQueue = [];
    let flushTimer = null;
    const USER_ID_COOKIE = 'inelegis_uid';
    const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 ano
    const FAILED_SESSION_KEY = 'analytics_failed_events';

    function readCookie(name) {
        if (typeof document === 'undefined') {
            return null;
        }
        const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
        return match ? decodeURIComponent(match[1]) : null;
    }

    function writeCookie(name, value, maxAgeSeconds) {
        if (typeof document === 'undefined') {
            return false;
        }
        const parts = [
            `${name}=${encodeURIComponent(value)}`,
            'path=/'
        ];
        if (typeof maxAgeSeconds === 'number') {
            parts.push(`max-age=${maxAgeSeconds}`);
        }
        document.cookie = parts.join('; ');
        return true;
    }

    function readFailedEvents() {
        let events = [];

        if (typeof sessionStorage !== 'undefined') {
            try {
                const raw = sessionStorage.getItem(FAILED_SESSION_KEY);
                if (raw) {
                    events = JSON.parse(raw);
                }
            } catch (error) {
                console.warn('Analytics: falha ao ler eventos salvos na sessão:', error);
                sessionStorage.removeItem(FAILED_SESSION_KEY);
            }
        }

        if ((!events || events.length === 0) && typeof window !== 'undefined' && window.SecureStorage) {
            try {
                const legacy = window.SecureStorage.getItem('analytics_failed');
                if (Array.isArray(legacy) && legacy.length > 0) {
                    events = legacy;
                    window.SecureStorage.removeItem('analytics_failed');
                }
            } catch (error) {
                console.warn('Analytics: falha ao migrar eventos legados:', error);
            }
        }

        return Array.isArray(events) ? events : [];
    }

    function writeFailedEvents(events) {
        if (typeof sessionStorage === 'undefined') {
            return;
        }
        try {
            sessionStorage.setItem(FAILED_SESSION_KEY, JSON.stringify(events));
        } catch (error) {
            console.error('Analytics: falha ao salvar eventos na sessão:', error);
        }
    }

    function clearFailedEvents() {
        if (typeof sessionStorage === 'undefined') {
            return;
        }
        try {
            sessionStorage.removeItem(FAILED_SESSION_KEY);
        } catch (error) {
            console.error('Analytics: falha ao limpar eventos na sessão:', error);
        }
    }

    /**
     * Gera ID único anônimo do usuário
     * @returns {string} ID anônimo
     */
    function getUserId() {
        let userId = readCookie(USER_ID_COOKIE);

        if (!userId && typeof window !== 'undefined' && window.SecureStorage) {
            try {
                const legacyId = window.SecureStorage.getItem('analytics_user_id');
                if (legacyId) {
                    userId = legacyId;
                    window.SecureStorage.removeItem('analytics_user_id');
                }
            } catch (error) {
                console.warn('Analytics: falha ao migrar userId legado:', error);
            }
        }

        if (!userId) {
            const randomPart = Math.random().toString(36).substring(2, 11);
            const timePart = Date.now().toString(36);
            userId = `user_${timePart}_${randomPart}`;
        }

        writeCookie(USER_ID_COOKIE, userId, COOKIE_MAX_AGE);
        return userId;
    }

    /**
     * Coleta informações do navegador (anônimas)
     * @returns {Object} Dados do navegador
     */
    function getBrowserInfo() {
        return {
            userAgent: navigator.userAgent,
            language: navigator.language,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
    }

    /**
     * Registra uma busca
     * @param {Object} search - Dados da busca
     */
    function trackSearch(search) {
        if (!CONFIG.enabled) return;

        const event = {
            type: 'search',
            userId: getUserId(),
            timestamp: new Date().toISOString(),
            data: {
                lei: search.lei,
                artigo: search.artigo,
                resultado: search.resultado,
                temExcecao: search.temExcecao || false,
                tempoResposta: search.tempoResposta || null
            },
            browser: getBrowserInfo(),
            version: '0.1.0'
        };

        addToQueue(event);
    }

    /**
     * Registra um erro
     * @param {Object} error - Dados do erro
     */
    function trackError(error) {
        if (!CONFIG.enabled) return;

        const event = {
            type: 'error',
            userId: getUserId(),
            timestamp: new Date().toISOString(),
            data: {
                message: error.message,
                stack: error.stack,
                lei: error.lei || null,
                artigo: error.artigo || null
            },
            browser: getBrowserInfo(),
            version: '0.1.0'
        };

        addToQueue(event);
    }

    /**
     * Registra uma ação do usuário
     * @param {string} action - Nome da ação
     * @param {Object} data - Dados adicionais
     */
    function trackAction(action, data = {}) {
        if (!CONFIG.enabled) return;

        const event = {
            type: 'action',
            userId: getUserId(),
            timestamp: new Date().toISOString(),
            data: {
                action,
                ...data
            },
            browser: getBrowserInfo(),
            version: '0.1.0'
        };

        addToQueue(event);
    }

    /**
     * Adiciona evento à fila
     * @param {Object} event - Evento a adicionar
     */
    function addToQueue(event) {
        eventQueue.push(event);

        // Flush automático se atingir tamanho do batch
        if (eventQueue.length >= CONFIG.batchSize) {
            flush();
        } else {
            // Agendar flush
            scheduleFlush();
        }
    }

    /**
     * Agenda flush automático
     */
    function scheduleFlush() {
        if (flushTimer) return;

        flushTimer = setTimeout(() => {
            flush();
            flushTimer = null;
        }, CONFIG.flushInterval);
    }

    /**
     * Envia eventos para o backend
     * @param {number} attempt - Tentativa atual
     */
    async function flush(attempt = 1) {
        if (eventQueue.length === 0) return;

        const events = [...eventQueue];
        eventQueue = [];

        try {
            const response = await fetch(CONFIG.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    events,
                    timestamp: new Date().toISOString()
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            analyticsDebugLog(`Eventos enviados (${events.length})`);
        } catch (error) {
            console.warn('⚠️ Analytics: Erro ao enviar eventos', error);

            // Retry com backoff exponencial
            if (attempt < CONFIG.retryAttempts) {
                const delay = Math.pow(2, attempt) * 1000;
                setTimeout(() => {
                    // Re-adicionar eventos à fila
                    eventQueue.unshift(...events);
                    flush(attempt + 1);
                }, delay);
            } else {
                console.error('❌ Analytics: Falha após múltiplas tentativas');
                // Salvar localmente para não perder dados
                saveFailedEvents(events);
            }
        }
    }

    /**
     * Salva eventos que falharam no envio
     * @param {Array} events - Eventos que falharam
     */
    function saveFailedEvents(events) {
        try {
            const failed = readFailedEvents();
            failed.push(...events);
            
            // Limitar a 100 eventos
            if (failed.length > 100) {
                failed.splice(0, failed.length - 100);
            }
            
            writeFailedEvents(failed);
        } catch (error) {
            console.error('Erro ao salvar eventos falhados:', error);
        }
    }

    /**
     * Tenta reenviar eventos falhados
     */
    async function retryFailedEvents() {
        try {
            const failed = readFailedEvents();
            
            if (!failed || failed.length === 0) return;

            analyticsDebugLog(`Reenviando eventos falhados (${failed.length})`);
            
            eventQueue.push(...failed);
            clearFailedEvents();
            
            await flush();
        } catch (error) {
            console.error('Erro ao reenviar eventos falhados:', error);
        }
    }

    /**
     * Flush antes de sair da página
     */
    function setupBeforeUnload() {
        window.addEventListener('beforeunload', () => {
            if (eventQueue.length > 0) {
                // Usar sendBeacon para envio garantido
                const blob = new Blob([JSON.stringify({
                    events: eventQueue,
                    timestamp: new Date().toISOString()
                })], { type: 'application/json' });
                
                navigator.sendBeacon(CONFIG.endpoint, blob);
            }
        });
    }

    /**
     * Inicializa o módulo
     */
    function init() {
        setupBeforeUnload();
        retryFailedEvents();
        
        analyticsDebugLog('Analytics inicializado');
    }

    /**
     * Desabilita analytics (GDPR/LGPD)
     */
    function disable() {
        CONFIG.enabled = false;
        eventQueue = [];
        if (flushTimer) {
            clearTimeout(flushTimer);
            flushTimer = null;
        }
        analyticsDebugLog('Analytics desabilitado');
    }

    /**
     * Habilita analytics
     */
    function enable() {
        CONFIG.enabled = true;
        analyticsDebugLog('Analytics habilitado');
    }

    /**
     * Verifica se está habilitado
     * @returns {boolean}
     */
    function isEnabled() {
        return CONFIG.enabled;
    }

    // API pública
    return {
        init,
        trackSearch,
        trackError,
        trackAction,
        disable,
        enable,
        isEnabled,
        flush,
        getUserId
    };
})();

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.Analytics = Analytics;
}
