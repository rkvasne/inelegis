/**
 * Search History Manager - Supabase Edition
 * Gerencia histórico de consultas do usuário
 * Sincroniza com Supabase via REST API
 * @version 2.0.0
 */

const SEARCH_HISTORY_DEBUG_ENABLED = (() => {
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

function historyDebugLog(...args) {
    if (SEARCH_HISTORY_DEBUG_ENABLED) {
        console.debug('[SearchHistory]', ...args);
    }
}

const SearchHistory = (() => {
    const USER_ID_COOKIE = 'inelegis_uid';
    const LEGACY_USER_ID_KEY = 'inelegis_user_id';
    const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 ano
    let cachedHistory = [];

    const MAX_HISTORY = 50;
    const MAX_RECENT = 10;

    // Configuração Supabase (carregada do window.__SUPABASE_CONFIG__)
    function getSupabaseConfig() {
        if (typeof window !== 'undefined' && window.__SUPABASE_CONFIG__) {
            return window.__SUPABASE_CONFIG__;
        }
        return null;
    }

    function getCachedHistory() {
        return cachedHistory.slice();
    }

    function setCachedHistory(entries) {
        cachedHistory = Array.isArray(entries) ? entries.slice(0, MAX_HISTORY) : [];
    }

    /**
     * Calcula estatísticas baseadas em um array de histórico
     */
    function calculateStats(history) {
        const stats = {
            total: history.length,
            inelegiveis: 0,
            elegiveis: 0,
            leisMaisConsultadas: {},
            artigosMaisConsultados: {}
        };

        history.forEach(search => {
            if (search.resultado === 'inelegivel') {
                stats.inelegiveis++;
            } else if (search.resultado === 'elegivel') {
                stats.elegiveis++;
            }

            stats.leisMaisConsultadas[search.lei] =
                (stats.leisMaisConsultadas[search.lei] || 0) + 1;

            const key = `${search.lei} - Art. ${search.artigo}`;
            stats.artigosMaisConsultados[key] =
                (stats.artigosMaisConsultados[key] || 0) + 1;
        });

        // Formatar rankings
        stats.leisMaisConsultadas = Object.entries(stats.leisMaisConsultadas)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

        stats.artigosMaisConsultados = Object.entries(stats.artigosMaisConsultados)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

        return stats;
    }

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

    // Obter userId do Analytics ou gerar um novo persistido em cookie
    function getUserId() {
        if (typeof window !== 'undefined' && window.Analytics?.getUserId) {
            return window.Analytics.getUserId();
        }

        let userId = readCookie(USER_ID_COOKIE);

        if (!userId && typeof localStorage !== 'undefined') {
            try {
                const legacyId = localStorage.getItem(LEGACY_USER_ID_KEY);
                if (legacyId) {
                    userId = legacyId;
                    localStorage.removeItem(LEGACY_USER_ID_KEY);
                }
            } catch (error) {
                console.warn('Histórico: não foi possível migrar userId legado:', error);
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
     * Sincroniza busca com Supabase
     */
    async function syncToSupabase(search) {
        const config = getSupabaseConfig();
        if (!config) {
            historyDebugLog('Supabase não configurado, salvando apenas em cache local');
            return null;
        }

        try {
            const userId = getUserId();

            const response = await fetch(`${config.url}/rest/v1/rpc/add_to_history`, {
                method: 'POST',
                headers: {
                    'apikey': config.anonKey,
                    'Authorization': `Bearer ${config.anonKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    p_user_id: userId,
                    p_lei: search.lei,
                    p_artigo: search.artigo,
                    p_resultado: search.resultado,
                    p_tipo_crime: search.tipoCrime || null,
                    p_observacoes: search.observacoes || null
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const result = await response.json();
            historyDebugLog('Histórico sincronizado com Supabase');
            return result;

        } catch (error) {
            console.warn('⚠️ Falha ao sincronizar com Supabase:', error.message);
            return null;
        }
    }

    /**
     * Busca histórico do Supabase
     */
    async function fetchFromSupabase(limit = MAX_HISTORY) {
        const config = getSupabaseConfig();
        if (!config) {
            historyDebugLog('Supabase não configurado');
            return null;
        }

        try {
            const userId = getUserId();

            const response = await fetch(`${config.url}/rest/v1/rpc/get_user_history`, {
                method: 'POST',
                headers: {
                    'apikey': config.anonKey,
                    'Authorization': `Bearer ${config.anonKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    p_user_id: userId,
                    p_limit: limit
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();

            // Mapear para formato esperado pelo frontend
            return data.map(item => ({
                lei: item.lei,
                artigo: item.artigo,
                resultado: item.resultado,
                timestamp: item.timestamp,
                tipoCrime: item.tipo_crime,
                observacoes: item.observacoes
            }));

        } catch (error) {
            console.warn('⚠️ Falha ao buscar do Supabase:', error.message);
            return null;
        }
    }

    /**
     * Busca estatísticas do Supabase
     */
    async function fetchStatsFromSupabase() {
        const config = getSupabaseConfig();
        if (!config) {
            return null;
        }

        try {
            const userId = getUserId();

            const response = await fetch(`${config.url}/rest/v1/rpc/get_user_stats`, {
                method: 'POST',
                headers: {
                    'apikey': config.anonKey,
                    'Authorization': `Bearer ${config.anonKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ p_user_id: userId })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            return data[0] || null;

        } catch (error) {
            console.warn('⚠️ Falha ao buscar stats do Supabase:', error.message);
            return null;
        }
    }

    /**
     * Adiciona uma consulta ao histórico
     */
    function addSearch(search) {
        try {
            const history = getCachedHistory();

            if (!search.timestamp) {
                search.timestamp = new Date().toISOString();
            }

            // Verificar duplicatas recentes
            const now = new Date(search.timestamp).getTime();
            const isDuplicate = history.some(item => {
                const itemTime = new Date(item.timestamp).getTime();
                const timeDiff = Math.abs(now - itemTime);

                return item.lei === search.lei &&
                    item.artigo === search.artigo &&
                    item.resultado === search.resultado &&
                    timeDiff < 5000;
            });

            if (isDuplicate) {
                historyDebugLog('Duplicata detectada, ignorando entrada');
                return false;
            }

            // Adicionar ao início
            history.unshift(search);

            // Limitar tamanho
            if (history.length > MAX_HISTORY) {
                history.splice(MAX_HISTORY);
            }

            // Atualizar cache em memória
            setCachedHistory(history);

            // Sincronizar com Supabase (async, não bloqueia)
            syncToSupabase(search).catch(err => {
                console.warn('Sync Supabase falhou:', err);
            });

            return true;
        } catch (error) {
            console.error('Erro ao adicionar ao histórico:', error);
            return false;
        }
    }

    /**
     * Obtém todo o histórico (local)
     */
    function getHistory() {
        return getCachedHistory();
    }

    /**
     * Obtém histórico com fallback para Supabase
     */
    async function getHistoryAsync() {
        // Tentar Supabase primeiro
        const supabaseHistory = await fetchFromSupabase();

        if (Array.isArray(supabaseHistory) && supabaseHistory.length > 0) {
            setCachedHistory(supabaseHistory);
            return supabaseHistory;
        }

        return getCachedHistory();
    }

    /**
     * Obtém consultas recentes
     */
    function getRecent(limit = MAX_RECENT) {
        const history = getHistory();
        return history.slice(0, limit);
    }

    /**
     * Obtém consultas mais frequentes
     */
    function getFrequent(limit = 10) {
        const history = getHistory();
        const frequency = {};

        history.forEach(search => {
            const key = `${search.lei}|${search.artigo}`;
            if (!frequency[key]) {
                frequency[key] = { ...search, count: 0 };
            }
            frequency[key].count++;
        });

        return Object.values(frequency)
            .sort((a, b) => b.count - a.count)
            .slice(0, limit);
    }

    /**
     * Busca no histórico
     */
    function search(query) {
        if (!query || typeof query !== 'string') {
            return [];
        }

        const history = getHistory();
        const lowerQuery = query.toLowerCase();

        return history.filter(search => {
            return search.lei.toLowerCase().includes(lowerQuery) ||
                search.artigo.toLowerCase().includes(lowerQuery);
        });
    }

    /**
     * Limpa todo o histórico - DESABILITADO
     */
    function clear() {
        console.warn('Operação não permitida: Limpeza de histórico desabilitada');
        return false;
    }

    /**
     * Remove uma consulta específica - DESABILITADO
     */
    function remove(index) {
        console.warn('Operação não permitida: Remoção de histórico desabilitada');
        return false;
    }

    /**
     * Obtém estatísticas do histórico
     */
    function getStats() {
        const history = getHistory();

        const stats = {
            total: history.length,
            inelegiveis: 0,
            elegiveis: 0,
            leisMaisConsultadas: {},
            artigosMaisConsultados: {}
        };

        history.forEach(search => {
            if (search.resultado === 'inelegivel') {
                stats.inelegiveis++;
            } else if (search.resultado === 'elegivel') {
                stats.elegiveis++;
            }

            stats.leisMaisConsultadas[search.lei] =
                (stats.leisMaisConsultadas[search.lei] || 0) + 1;

            const key = `${search.lei} - Art. ${search.artigo}`;
            stats.artigosMaisConsultados[key] =
                (stats.artigosMaisConsultados[key] || 0) + 1;
        });

        stats.leisMaisConsultadas = Object.entries(stats.leisMaisConsultadas)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

        stats.artigosMaisConsultados = Object.entries(stats.artigosMaisConsultados)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

        return stats;
    }

    /**
     * Obtém estatísticas com fallback para Supabase
     */
    async function getStatsAsync() {
        const supabaseStats = await fetchStatsFromSupabase();

        // Sempre buscar o histórico para calcular as listas de Top Leis/Artigos
        const history = await getHistoryAsync();

        if (supabaseStats) {
            const localStats = calculateStats(history);
            return {
                total: parseInt(supabaseStats.total) || 0,
                inelegiveis: parseInt(supabaseStats.inelegiveis) || 0,
                elegiveis: parseInt(supabaseStats.elegiveis) || 0,
                naoConsta: parseInt(supabaseStats.nao_consta) || 0,
                primeiraConsulta: supabaseStats.primeira_consulta,
                ultimaConsulta: supabaseStats.ultima_consulta,
                leisMaisConsultadas: localStats.leisMaisConsultadas,
                artigosMaisConsultados: localStats.artigosMaisConsultados
            };
        }

        return getStats();
    }

    /**
     * Inicializa o histórico sincronizando com a nuvem
     */
    async function init() {
        historyDebugLog('Inicializando histórico...');
        getUserId(); // Garantir que UID existe
        return getHistoryAsync();
    }

    /**
     * Exporta histórico para texto
     */
    function exportToText() {
        const history = getHistory();

        let text = 'HISTÓRICO DE CONSULTAS - INELEGIS\n';
        text += '='.repeat(50) + '\n\n';

        history.forEach((search, index) => {
            const date = new Date(search.timestamp);
            text += `${index + 1}. ${search.lei} - Art. ${search.artigo}\n`;
            text += `   Resultado: ${search.resultado.toUpperCase()}\n`;
            text += `   Data: ${date.toLocaleString('pt-BR')}\n\n`;
        });

        text += '='.repeat(50) + '\n';
        text += `Total de consultas: ${history.length}\n`;
        text += `Exportado em: ${new Date().toLocaleString('pt-BR')}\n`;

        return text;
    }

    // API pública
    return {
        init,
        add: addSearch,
        getAll: getHistory,
        getAllAsync: getHistoryAsync,
        getRecent,
        getFrequent,
        search,
        clear,
        remove,
        getStats,
        getStatsAsync,
        exportToText
    };
})();

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.SearchHistory = SearchHistory;
}
