/**
 * Validator Service
 * Serviço responsável por alimentar os dropdowns de validação estruturada.
 * Substitui a lógica de busca livre por seleção hierárquica.
 */

export class ValidatorService {
    constructor() {
        this.dataNormalizer = null;
    }

    /**
     * Inicializa com a instância global de dados (window.__INELEG_NORMALIZADO__ ou window.DataNormalizer)
     * @returns {boolean} True se inicializado com sucesso
     */
    init() {
        if (typeof window !== 'undefined') {
            // Caso 1: Array Direto (ETL Novo) - PRIORIDADE MÁXIMA
            if (window.__INELEG_NORMALIZADO__ && Array.isArray(window.__INELEG_NORMALIZADO__)) {
                console.log('[ValidatorService] Usando window.__INELEG_NORMALIZADO__ (', window.__INELEG_NORMALIZADO__.length, 'registros)');
                this.dataNormalizer = {
                    getAll: () => window.__INELEG_NORMALIZADO__
                };
                return true;
            }
            // Caso 2: Interface Legada (Wrapper) - apenas se tiver getAll
            if (window.DataNormalizer && typeof window.DataNormalizer.getAll === 'function') {
                console.log('[ValidatorService] Usando window.DataNormalizer (legado)');
                this.dataNormalizer = window.DataNormalizer;
                return true;
            }
        }
        console.error('[ValidatorService] ERRO: Nenhuma fonte de dados encontrada!');
        return false;
    }

    /**
     * Retorna a lista de todas as leis/códigos disponíveis na base
     * @returns {Array<{codigo: string, nome: string}>} Lista ordenada alfabeticamente
     */
    getLaws() {
        if (!this.dataNormalizer) return [];

        const lawsMap = new Map();

        // Iterar sobre todos os registros para coletar leis únicas
        this.dataNormalizer.getAll().forEach(item => {
            if (item.codigo && !lawsMap.has(item.codigo)) {
                // Tenta extrair um nome amigável
                let nome = item.codigo;
                if (item.codigo === 'CP') nome = 'Código Penal (Decreto-Lei 2.848/40)';
                else if (item.codigo === 'CPM') nome = 'Código Penal Militar';
                else if (item.codigo === 'CE' || item.codigo === 'CODIGO_ELEITORAL') nome = 'Código Eleitoral (Lei 4.737/65)';
                else if (item.lei_nome) nome = item.lei_nome;

                lawsMap.set(item.codigo, nome);
            }
        });

        // Converter para array e ordenar
        return Array.from(lawsMap.entries())
            .map(([codigo, nome]) => ({ codigo, nome }))
            .sort((a, b) => a.nome.localeCompare(b.nome));
    }

    /**
     * Retorna todos os artigos disponíveis para uma determinada lei
     * @param {string} lawCode Código da lei (ex: 'CP')
     * @returns {Array<string>} Lista de números de artigos ordenados (ex: ['121', '121-A', '155'])
     */
    getArticlesByLaw(lawCode) {
        if (!this.dataNormalizer) return [];

        const articles = new Set();

        // Filtrar registros da lei
        const records = this.dataNormalizer.getAll().filter(item => item.codigo === lawCode);

        records.forEach(item => {
            if (item.estruturado && item.estruturado.artigos) {
                item.estruturado.artigos.forEach(art => articles.add(art));
            }
        });

        // Ordenar logicamente (Numéricamente, tratando sufixos como 121-A)
        return Array.from(articles).sort((a, b) => {
            // Extrair número base e sufixo
            const parse = (s) => {
                const match = s.match(/(\d+)(-?[A-Za-z]*)?/);
                return match ? { num: parseInt(match[1]), suffix: match[2] || '' } : { num: 0, suffix: '' };
            };

            const pA = parse(a);
            const pB = parse(b);

            if (pA.num !== pB.num) return pA.num - pB.num;
            return pA.suffix.localeCompare(pB.suffix);
        });
    }

    /**
     * Recupera os detalhes de um artigo específico
     * @param {string} lawCode 
     * @param {string} articleNum 
     */
    getArticleDetails(lawCode, articleNum) {
        if (!this.dataNormalizer) return null;

        // Busca exata usando a lógica existente do DataNormalizer ou filtro direto
        // O DataNormalizer.query espera estrutura { lei, artigo... }
        // Vamos filtrar manualmente para garantir precisão nesta nova UI

        const records = this.dataNormalizer.getAll().filter(item =>
            item.codigo === lawCode &&
            item.estruturado &&
            item.estruturado.artigos.includes(articleNum)
        );

        if (records.length === 0) return null;

        // Pode haver múltiplos registros para o mesmo artigo (ex: exceções ou contextos diferentes?)
        // Geralmente é um registro principal. Se houver mais, retornamos todos para análise.
        // No contexto atual, retornamos o primeiro match ou combinamos.

        return records.map(r => ({
            crime: r.crime,
            observacao: r.observacao,
            excecoes: r.excecoes || [],
            norma_completa: r.norma
        }));
    }
}

// Singleton para uso global se necessário
export const validatorService = new ValidatorService();
