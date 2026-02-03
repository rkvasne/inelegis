/**
 * Validator Service - Supabase Edition
 * Serviço responsável por alimentar os dropdowns de validação estruturada.
 * Consulta dados diretamente do Supabase.
 * @version 2.1.0 (Only-Supabase)
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

      const normas = await supabaseClient.from("normas", {
        select: "codigo,nome_curto,nome_completo",
        order: "nome_curto.asc",
      });

      this.normasCache = normas.map((n) => ({
        codigo: n.codigo,
        nome: n.nome_curto || n.nome_completo,
        nome_completo: n.nome_completo, // Expose full name for UI
      }));

      console.log(
        "[ValidatorService] Carregadas",
        this.normasCache.length,
        "normas do Supabase",
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
      // Primeiro buscar o ID da norma
      const normas = await supabaseClient.from("normas", {
        select: "id",
        filter: { codigo: sanitizedLaw },
      });

      if (!normas.length) return [];

      const normaId = normas[0].id;

      // Buscar artigos inelegíveis dessa norma
      const artigos = await supabaseClient.from("artigos_inelegiveis", {
        select: "artigo",
        filter: { norma_id: normaId },
        order: "artigo.asc",
      });

      // Remover duplicatas e ordenar numericamente
      const uniqueArtigos = [...new Set(artigos.map((a) => a.artigo))];
      return uniqueArtigos.sort((a, b) => parseInt(a) - parseInt(b));
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
          ? InputValidator.validateText(paragraph, 50)
          : null,
        p_inciso: inciso ? InputValidator.validateText(inciso, 20) : null,
        p_alinea: alinea ? InputValidator.validateText(alinea, 10) : null,
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
      return { resultado: "ERRO", motivo: "Erro interno de verificação" };
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
