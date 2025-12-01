/**
 * Search History Manager
 * Gerencia histórico de consultas do usuário
 * @version 0.0.6
 */

const SearchHistory = (() => {
    const STORAGE_KEY = 'inelegis_search_history';
    const MAX_HISTORY = 50;
    const MAX_RECENT = 10;

    /**
     * Adiciona uma consulta ao histórico
     * @param {Object} search - Dados da consulta
     * @param {string} search.lei - Código da lei
     * @param {string} search.artigo - Número do artigo
     * @param {string} search.resultado - Resultado (inelegivel/elegivel)
     * @param {string} search.timestamp - Data/hora da consulta
     */
    function addSearch(search) {
        try {
            const history = getHistory();
            
            // Adicionar timestamp se não existir
            if (!search.timestamp) {
                search.timestamp = new Date().toISOString();
            }

            // Adicionar ao início do array
            history.unshift(search);

            // Limitar tamanho
            if (history.length > MAX_HISTORY) {
                history.splice(MAX_HISTORY);
            }

            // Salvar
            SecureStorage.setItem(STORAGE_KEY, history);
            
            return true;
        } catch (error) {
            console.error('Erro ao adicionar ao histórico:', error);
            return false;
        }
    }

    /**
     * Obtém todo o histórico
     * @returns {Array} Array de consultas
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
     * Obtém consultas recentes
     * @param {number} limit - Número máximo de resultados
     * @returns {Array} Array de consultas recentes
     */
    function getRecent(limit = MAX_RECENT) {
        const history = getHistory();
        return history.slice(0, limit);
    }

    /**
     * Obtém consultas mais frequentes
     * @param {number} limit - Número máximo de resultados
     * @returns {Array} Array de consultas frequentes
     */
    function getFrequent(limit = 10) {
        const history = getHistory();
        
        // Contar frequência de cada combinação lei+artigo
        const frequency = {};
        
        history.forEach(search => {
            const key = `${search.lei}|${search.artigo}`;
            if (!frequency[key]) {
                frequency[key] = {
                    ...search,
                    count: 0
                };
            }
            frequency[key].count++;
        });

        // Ordenar por frequência
        const sorted = Object.values(frequency)
            .sort((a, b) => b.count - a.count)
            .slice(0, limit);

        return sorted;
    }

    /**
     * Busca no histórico
     * @param {string} query - Termo de busca
     * @returns {Array} Array de consultas que correspondem
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
     * Limpa todo o histórico
     * @returns {boolean} Sucesso da operação
     */
    function clear() {
        try {
            SecureStorage.removeItem(STORAGE_KEY);
            return true;
        } catch (error) {
            console.error('Erro ao limpar histórico:', error);
            return false;
        }
    }

    /**
     * Remove uma consulta específica
     * @param {number} index - Índice da consulta
     * @returns {boolean} Sucesso da operação
     */
    function remove(index) {
        try {
            const history = getHistory();
            
            if (index >= 0 && index < history.length) {
                history.splice(index, 1);
                SecureStorage.setItem(STORAGE_KEY, history);
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Erro ao remover do histórico:', error);
            return false;
        }
    }

    /**
     * Obtém estatísticas do histórico
     * @returns {Object} Estatísticas
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
            // Contar resultados
            if (search.resultado === 'inelegivel') {
                stats.inelegiveis++;
            } else if (search.resultado === 'elegivel') {
                stats.elegiveis++;
            }

            // Contar leis
            stats.leisMaisConsultadas[search.lei] = 
                (stats.leisMaisConsultadas[search.lei] || 0) + 1;

            // Contar artigos
            const key = `${search.lei} - Art. ${search.artigo}`;
            stats.artigosMaisConsultados[key] = 
                (stats.artigosMaisConsultados[key] || 0) + 1;
        });

        // Ordenar leis mais consultadas
        stats.leisMaisConsultadas = Object.entries(stats.leisMaisConsultadas)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .reduce((obj, [key, value]) => {
                obj[key] = value;
                return obj;
            }, {});

        // Ordenar artigos mais consultados
        stats.artigosMaisConsultados = Object.entries(stats.artigosMaisConsultados)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .reduce((obj, [key, value]) => {
                obj[key] = value;
                return obj;
            }, {});

        return stats;
    }

    /**
     * Exporta histórico para texto
     * @returns {string} Histórico formatado
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
        getRecent,
        getFrequent,
        search,
        clear,
        remove,
        getStats,
        exportToText
    };
})();

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.SearchHistory = SearchHistory;
}
