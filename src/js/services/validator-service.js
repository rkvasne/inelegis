/**
 * Validator Service - Supabase Edition
 * Serviço responsável por alimentar os dropdowns de validação estruturada.
 * Consulta dados diretamente do Supabase.
 * @version 0.3.7 (Only-Supabase)
 */

import { supabaseClient } from "./supabase-client.js";
import { InputValidator } from "../utils/input-validator.js";

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
      console.error(
        "[ValidatorService] Supabase não configurado. Verifique as variáveis de ambiente.",
      );
      return false;
    }

    this.initialized = true;
    console.log("[ValidatorService] Inicializado com Supabase");
    return true;
  }

  /**
   * Retorna a lista de todas as leis/códigos disponíveis
   * @returns {Promise<Array<{codigo: string, nome: string}>>}
   */
  async getLaws() {
    if (!this.initialized) {
      console.error("[ValidatorService] Serviço não inicializado");
      return [];
    }

    try {
      // Usar cache se disponível
      if (this.normasCache) {
        return this.normasCache;
      }

      // Consulta adaptada para a nova tabela unificada usando o cliente leve customizado
      console.log("[DEBUG] Buscando leis no Supabase...");
      let data;

      try {
        data = await supabaseClient.from("crimes_inelegibilidade", {
          select: "codigo,lei",
        });
        console.log("[DEBUG] Dados recebidos:", data?.length || 0, "registros");
      } catch (err) {
        console.error("[DEBUG] Erro fatal ao buscar leis:", err);
        return [];
      }

      // Cliente customizado lança exceção em erro, então se chegou aqui é sucesso.
      // E retorna o array diretamente, não { data, error }

      // Remover duplicatas via JS
      const uniqueLaws = new Map();

      // O cliente customizado retorna array direto ou lança erro, não retorna { maximize }
      if (Array.isArray(data)) {
        data.forEach((item) => {
          if (!uniqueLaws.has(item.codigo)) {
            uniqueLaws.set(item.codigo, {
              codigo: item.codigo,
              lei: item.lei, // Nome completo da lei já vem pronto do banco
            });
          }
        });
      }

      const result = Array.from(uniqueLaws.values()).sort((a, b) =>
        a.codigo.localeCompare(b.codigo),
      );
      console.log("[DEBUG] ValidatorService.getLaws result:", result);
      this.normasCache = result;

      console.log(
        "[ValidatorService] Carregadas",
        this.normasCache.length,
        "normas do Supabase (Schema V2)",
      );
      return this.normasCache;
    } catch (error) {
      console.error("[ValidatorService] Erro ao buscar normas:", error);
      return [];
    }
  }

  /**
   * Retorna os artigos de uma lei específica
   * @param {string} lawCode Código da norma
   * @returns {Promise<string[]>} Lista de artigos
   */
  async getArticlesByLaw(lawCode) {
    if (!this.initialized) return [];

    const sanitizedLaw = InputValidator.validateLawCode(lawCode);
    if (!sanitizedLaw) {
      console.warn(
        "[ValidatorService] lawCode inválido ou malformatado:",
        lawCode,
      );
      return [];
    }

    try {
      // Busca direta na nova tabela usando cliente leve
      const artigos = await supabaseClient.from("crimes_inelegibilidade", {
        select: "artigo",
        filter: { codigo: sanitizedLaw },
        order: "artigo.asc",
      });

      if (!Array.isArray(artigos)) return [];

      // Remover duplicatas e nulos
      const uniqueArtigos = [
        ...new Set(artigos.map((a) => a.artigo).filter((a) => a)),
      ];

      // Ordenação numérica inteligente
      return uniqueArtigos.sort((a, b) => {
        const numA = parseInt(a.replace(/\D/g, "")) || 0;
        const numB = parseInt(b.replace(/\D/g, "")) || 0;
        if (numA === numB) return a.localeCompare(b);
        return numA - numB;
      });
    } catch (error) {
      console.error("[ValidatorService] Erro ao buscar artigos:", error);
      return [];
    }
  }

  /**
   * Verifica elegibilidade usando a função RPC do Supabase
   * @param {string} lawCode Código da norma
   * @param {string} article Número do artigo
   * @param {string} [paragraph] Parágrafo (opcional)
   * @param {string} [inciso] Inciso (opcional)
   * @param {string} [alinea] Alínea (opcional)
   * @returns {Promise<object>} Resultado da verificação
   */
  async verifyEligibility(
    lawCode,
    article,
    paragraph = null,
    inciso = null,
    alinea = null,
  ) {
    if (!this.initialized) {
      return { resultado: "ERRO", motivo: "Serviço não inicializado" };
    }

    // Sanitização e Validação Estrutural
    const sanitizedLaw = InputValidator.validateLawCode(lawCode);
    const sanitizedArticle = InputValidator.validateArticle(article);

    if (!sanitizedLaw || !sanitizedArticle) {
      return {
        resultado: "ERRO",
        motivo: "Parâmetros de entrada inválidos ou malformatados",
      };
    }

    try {
      const result = await supabaseClient.rpc("verificar_elegibilidade", {
        p_codigo_norma: sanitizedLaw,
        p_artigo: sanitizedArticle,
        p_paragrafo: paragraph
          ? InputValidator.normalizeDetail(paragraph)
          : null,
        p_inciso: inciso ? InputValidator.normalizeDetail(inciso) : null,
        p_alinea: alinea ? InputValidator.normalizeDetail(alinea) : null,
      });

      if (result && result.length > 0) {
        return result[0];
      }

      return {
        resultado: "NAO_CONSTA",
        motivo: "Artigo não encontrado na base",
      };
    } catch (error) {
      console.error("[ValidatorService] Erro na verificação:", error);
      return {
        resultado: "ERRO",
        motivo: `Erro interno: ${error.message || String(error)}`,
      };
    }
  }

  /**
   * Obtém detalhes completos de um artigo (compatibilidade com UI antiga)
   * @param {string} lawCode
   * @param {string} article
   * @returns {Promise<Array>}
   */
  async getArticleDetails(lawCode, article) {
    const result = await this.verifyEligibility(lawCode, article);

    if (result.resultado === "INELEGIVEL") {
      return [
        {
          crime: result.tipo_crime || "Crime previsto na tabela",
          norma_completa: `${lawCode}, Art. ${article}`,
          observacao: result.observacoes,
          excecoes: [],
        },
      ];
    }

    return [];
  }
}

// Instância singleton
export const validatorService = new ValidatorService();

// Exportar para uso global
if (typeof window !== "undefined") {
  window.validatorService = validatorService;
}

