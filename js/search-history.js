/**
 * Search History Manager
 * Gerencia histórico de consultas do usuário
 * Sincroniza com Redis via API
 * @version 0.0.8
 */

// SecureStorage - Wrapper para localStorage (fallback local)
const SecureStorage = (() => {
    return {
        getItem: (key) => {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : null;
            } catch (e) {
                console.error('Erro ao obter do localStorage:', e);
                return null;
            }
        },
        setItem: (key, value) => {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.error('Erro ao salvar no localStorage:', e);
                return false;
            }
        },
        removeItem: (key) => {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (e) {
                console.error('Erro ao remover do localStorage:', e);
                return false;
            }
        }
    };
})();

const SearchHistory = (() => {
    const STORAGE_KEY = 'inelegis_search_history';
    const MAX_HISTORY = 50;
    const MAX_RECENT = 10;
    const API_URL = '/api/search-history';
    
    // Obter userId do Analytics ou gerar um novo
    function getUserId() {
        if (typeof window !== 'undefined' && window.Analytics?.getUserId) {
            return window.Analytics.getUserId();
        }
        // Fallback: usar ID do localStorage
        let userId = localStorage.getItem('inelegis_user_id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('inelegis_user_id', userId);
        }
        return userId;
    }

    /**
     * Sincroniza busca com Redis via API
     */
    async function syncToRedis(search) {
        try {
            const userId = getUserId();
            
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, search })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const result = await response.json();
            console.log('✅ Histórico sincronizado com Redis');
            return result;
            
        } catch (error) {
            console.warn('⚠️ Falha ao sincronizar com Redis:', error.message);
            return null;
        }
    }

    /**
     * Busca histórico do Redis
     */
    async function fetchFromRedis(limit = MAX_HISTORY) {
        try {
            const userId = getUserId();
            
            const response = await fetch(`${API_URL}?userId=${userId}&limit=${limit}`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            return data.history || [];
            
        } catch (error) {
            console.warn('⚠️ Falha ao buscar do Redis:', error.message);
            return null;
        }
    }

    /**
     * Busca estatísticas do Redis
     */
    async function fetchStatsFromRedis() {
        try {
            const userId = getUserId();
            
            const response = await fetch(`${API_URL}?userId=${userId}&stats=true`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            return data.stats || null;
            
        } catch (error) {
            console.warn('⚠️ Falha ao buscar stats do Redis:', error.message);
            return null;
        }
    }

    /**
     * Adiciona uma consulta ao histórico
     */
    function addSearch(search) {
        try {
            const history = getHistory();
            
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
                console.log('Histórico: Duplicata detectada, não adicionando');
                return false;
            }

            // Adicionar ao início
            history.unshift(search);

            // Limitar tamanho
            if (history.length > MAX_HISTORY) {
                history.splice(MAX_HISTORY);
            }

            // Salvar localmente
            SecureStorage.setItem(STORAGE_KEY, history);
            
            // Sincronizar com Redis (async, não bloqueia)
            syncToRedis(search).catch(err => {
                console.warn('Sync Redis falhou:', err);
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
        try {
            const history = SecureStorage.getItem(STORAGE_KEY);
            return Array.isArray(history) ? history : [];
        } catch (error) {
            console.error('Erro ao obter histórico:', error);
            return [];
        }
    }

    /**
     * Obtém histórico com fallback para Redis
     */
    async function getHistoryAsync() {
        // Tentar Redis primeiro
        const redisHistory = await fetchFromRedis();
        
        if (redisHistory && redisHistory.length > 0) {
            // Atualizar cache local
            SecureStorage.setItem(STORAGE_KEY, redisHistory);
            return redisHistory;
        }
        
        // Fallback para local
        return getHistory();
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
     * Obtém estatísticas com fallback para Redis
     */
    async function getStatsAsync() {
        const redisStats = await fetchStatsFromRedis();
        
        if (redisStats) {
            return redisStats;
        }
        
        return getStats();
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
        exportToText,
        syncToRedis,
        fetchFromRedis
    };
})();

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.SearchHistory = SearchHistory;
}
