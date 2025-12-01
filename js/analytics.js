/**
 * Analytics Module
 * Envia dados anônimos de uso para análise
 * @version 0.0.6
 */

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

    /**
     * Gera ID único anônimo do usuário
     * @returns {string} ID anônimo
     */
    function getUserId() {
        let userId = SecureStorage.getItem('analytics_user_id');
        
        if (!userId) {
            // Gerar ID anônimo (não identifica o usuário)
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            SecureStorage.setItem('analytics_user_id', userId);
        }
        
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
            version: '0.0.6'
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
            version: '0.0.6'
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
            version: '0.0.6'
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

            console.log(`✅ Analytics: ${events.length} eventos enviados`);
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
            const failed = SecureStorage.getItem('analytics_failed') || [];
            failed.push(...events);
            
            // Limitar a 100 eventos
            if (failed.length > 100) {
                failed.splice(0, failed.length - 100);
            }
            
            SecureStorage.setItem('analytics_failed', failed);
        } catch (error) {
            console.error('Erro ao salvar eventos falhados:', error);
        }
    }

    /**
     * Tenta reenviar eventos falhados
     */
    async function retryFailedEvents() {
        try {
            const failed = SecureStorage.getItem('analytics_failed');
            
            if (!failed || failed.length === 0) return;

            console.log(`🔄 Analytics: Reenviando ${failed.length} eventos falhados`);
            
            eventQueue.push(...failed);
            SecureStorage.removeItem('analytics_failed');
            
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
        
        console.log('📊 Analytics inicializado');
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
        console.log('🚫 Analytics desabilitado');
    }

    /**
     * Habilita analytics
     */
    function enable() {
        CONFIG.enabled = true;
        console.log('✅ Analytics habilitado');
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
        flush
    };
})();

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.Analytics = Analytics;
}
