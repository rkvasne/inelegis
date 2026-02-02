/**
 * Validator Service - Supabase Edition
 * Serviço responsável por alimentar os dropdowns de validação estruturada.
 * Consulta dados diretamente do Supabase.
 * @version 2.0.0
 */

import { supabaseClient } from './supabase-client.js';

export class ValidatorService {
    constructor() {
        this.initialized = false;
        this.normasCache = null;
    }

    /**
     * Inicializa o serviço verificando a conexão com Supabase
     * @returns {boolean} True se inicializado com sucesso
     */
    async init() {
        if (!supabaseClient.isConfigured()) {
            console.error('[ValidatorService] Supabase não configurado. Verifique as variáveis de ambiente.');

            // Fallback para dados estáticos se existirem
            if (typeof window !== 'undefined' && window.__INELEG_NORMALIZADO__) {
                console.warn('[ValidatorService] Usando fallback de dados estáticos');
                this.initialized = true;
                this.useStaticData = true;
                return true;
            }
            return false;
        }

        this.initialized = true;
        this.useStaticData = false;
        console.log('[ValidatorService] Inicializado com Supabase');
        return true;
    }

    /**
     * Retorna a lista de todas as leis/códigos disponíveis
     * @returns {Promise<Array<{codigo: string, nome: string}>>}
     */
    async getLaws() {
        if (!this.initialized) {
            console.error('[ValidatorService] Serviço não inicializado');
            return [];
        }

        // Fallback para dados estáticos
        if (this.useStaticData) {
            return this._getLawsFromStatic();
        }

        try {
            // Usar cache se disponível
            if (this.normasCache) {
                return this.normasCache;
            }

            const normas = await supabaseClient.from('normas', {
                select: 'codigo,nome_curto,nome_completo',
                order: 'nome_curto.asc'
            });

            this.normasCache = normas.map(n => ({
                codigo: n.codigo,
                nome: n.nome_curto || n.nome_completo
            }));

            console.log('[ValidatorService] Carregadas', this.normasCache.length, 'normas do Supabase');
            return this.normasCache;

        } catch (error) {
            console.error('[ValidatorService] Erro ao buscar normas:', error);
            // Tentar fallback
            if (typeof window !== 'undefined' && window.__INELEG_NORMALIZADO__) {
                console.warn('[ValidatorService] Usando fallback estático');
                return this._getLawsFromStatic();
            }
            return [];
        }
    }

    /**
     * Fallback: Extrai leis dos dados estáticos
     * @private
     */
    _getLawsFromStatic() {
        const data = window.__INELEG_NORMALIZADO__ || [];
        const lawsMap = new Map();

        data.forEach(item => {
            if (item.codigo && !lawsMap.has(item.codigo)) {
                let nome = item.lei_nome || item.codigo;
                lawsMap.set(item.codigo, nome);
            }
        });

        return Array.from(lawsMap.entries())
            .map(([codigo, nome]) => ({ codigo, nome }))
            .sort((a, b) => a.nome.localeCompare(b.nome));
    }

    /**
     * Retorna os artigos de uma lei específica
     * @param {string} lawCode Código da norma
     * @returns {Promise<string[]>} Lista de artigos
     */
    async getArticlesByLaw(lawCode) {
        if (!this.initialized || !lawCode) return [];

        // Fallback para dados estáticos
        if (this.useStaticData) {
            return this._getArticlesFromStatic(lawCode);
        }

        try {
            // Primeiro buscar o ID da norma
            const normas = await supabaseClient.from('normas', {
                select: 'id',
                filter: { codigo: lawCode }
            });

            if (!normas.length) return [];

            const normaId = normas[0].id;

            // Buscar artigos inelegíveis dessa norma
            const artigos = await supabaseClient.from('artigos_inelegiveis', {
                select: 'artigo',
                filter: { norma_id: normaId },
                order: 'artigo.asc'
            });

            // Remover duplicatas e ordenar numericamente
            const uniqueArtigos = [...new Set(artigos.map(a => a.artigo))];
            return uniqueArtigos.sort((a, b) => parseInt(a) - parseInt(b));

        } catch (error) {
            console.error('[ValidatorService] Erro ao buscar artigos:', error);
            return this._getArticlesFromStatic(lawCode);
        }
    }

    /**
     * Fallback: Extrai artigos dos dados estáticos
     * @private
     */
    _getArticlesFromStatic(lawCode) {
        const data = window.__INELEG_NORMALIZADO__ || [];
        const articles = new Set();

        data.filter(item => item.codigo === lawCode).forEach(item => {
            if (item.estruturado?.artigos) {
                item.estruturado.artigos.forEach(art => articles.add(art));
            }
        });

        return Array.from(articles).sort((a, b) => parseInt(a) - parseInt(b));
    }

    /**
     * Verifica elegibilidade usando a função RPC do Supabase
     * @param {string} lawCode Código da norma
     * @param {string} article Número do artigo
     * @param {string} [paragraph] Parágrafo (opcional)
     * @returns {Promise<object>} Resultado da verificação
     */
    async verifyEligibility(lawCode, article, paragraph = null) {
        if (!this.initialized) {
            return { resultado: 'ERRO', motivo: 'Serviço não inicializado' };
        }

        // Fallback para dados estáticos
        if (this.useStaticData) {
            return this._verifyFromStatic(lawCode, article);
        }

        try {
            const result = await supabaseClient.rpc('verificar_elegibilidade', {
                p_codigo_norma: lawCode,
                p_artigo: article,
                p_paragrafo: paragraph
            });

            if (result && result.length > 0) {
                return result[0];
            }

            return {
                resultado: 'NAO_CONSTA',
                motivo: 'Artigo não encontrado na base'
            };

        } catch (error) {
            console.error('[ValidatorService] Erro na verificação:', error);
            return this._verifyFromStatic(lawCode, article);
        }
    }

    /**
     * Fallback: Verifica usando dados estáticos
     * @private
     */
    _verifyFromStatic(lawCode, article) {
        const data = window.__INELEG_NORMALIZADO__ || [];

        const match = data.find(item =>
            item.codigo === lawCode &&
            item.estruturado?.artigos?.includes(article)
        );

        if (match) {
            return {
                resultado: 'INELEGIVEL',
                tipo_crime: match.crime,
                observacoes: match.observacao,
                motivo: `Artigo consta na lista de inelegibilidade`
            };
        }

        return {
            resultado: 'NAO_CONSTA',
            motivo: 'Artigo não encontrado na base estática'
        };
    }

    /**
     * Obtém detalhes completos de um artigo (compatibilidade com código antigo)
     * @param {string} lawCode 
     * @param {string} article 
     * @returns {Promise<Array>}
     */
    async getArticleDetails(lawCode, article) {
        const result = await this.verifyEligibility(lawCode, article);

        if (result.resultado === 'INELEGIVEL') {
            return [{
                crime: result.tipo_crime || 'Crime previsto na tabela',
                norma_completa: `${lawCode}, Art. ${article}`,
                observacao: result.observacoes,
                excecoes: []
            }];
        }

        return [];
    }
}

// Instância singleton
export const validatorService = new ValidatorService();

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.validatorService = validatorService;
}
