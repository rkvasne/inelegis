/**
 * Validator Service - Supabase Edition
 * Service responsible for providing data to structured validation dropdowns.
 * @version SSoT-Synchronized
 */

import { supabaseClient } from "./supabase-client.js";
import { InputValidator } from "../utils/input-validator.js";

/**
 * @typedef {Object} LawItem
 * @property {string} codigo - National law code (e.g., CP, CE)
 * @property {string} lei - Full human-readable name
 */

/**
 * @typedef {Object} EligibilityResult
 * @property {string} resultado - ELEGIVEL, INELEGIVEL, NAO_CONSTA, ERRO
 * @property {string} [tipo_crime] - Description of the crime category
 * @property {string} [observacoes] - Legal details/exceptions
 * @property {string} [mensagem] - Contextual message from DB
 * @property {string} [item_alinea_e] - Reference to LC 64/90
 * @property {string} [excecoes_artigo] - List of related exceptions
 */

export const RESULTS = {
  ELIGIBLE: "ELEGIVEL",
  INELIGIBLE: "INELEGIVEL",
  NOT_FOUND: "NAO_CONSTA",
  ERROR: "ERRO",
};

export class ValidatorService {
  constructor() {
    this.initialized = false;
    this.normasCache = null;
  }

  /**
   * Initializes the service by checking Supabase connection
   * @returns {Promise<boolean>}
   */
  async init() {
    if (!supabaseClient.isConfigured()) {
      console.error("[ValidatorService] Missing Supabase configuration.");
      return false;
    }

    this.initialized = true;
    return true;
  }

  /**
   * Returns a unique list of available laws
   * @returns {Promise<LawItem[]>}
   */
  async getLaws() {
    if (!this.initialized) return [];

    try {
      if (this.normasCache) return this.normasCache;

      const data = await supabaseClient.from("crimes_inelegibilidade", {
        select: "codigo,lei",
      });

      if (!Array.isArray(data)) return [];

      // Unified law mapping logic
      const uniqueLawsMap = new Map();
      data.forEach(({ codigo, lei }) => {
        if (!uniqueLawsMap.has(codigo)) {
          uniqueLawsMap.set(codigo, { codigo, lei });
        }
      });

      this.normasCache = Array.from(uniqueLawsMap.values()).sort((a, b) =>
        a.codigo.localeCompare(b.codigo),
      );

      return this.normasCache;
    } catch (error) {
      console.error("[ValidatorService] Failed to fetch laws:", error);
      return [];
    }
  }

  /**
   * Gets restricted articles for a specific law
   * @param {string} lawCode
   * @returns {Promise<string[]>}
   */
  async getArticlesByLaw(lawCode) {
    if (!this.initialized) return [];

    const sanitizedLaw = InputValidator.validateLawCode(lawCode);
    if (!sanitizedLaw) return [];

    try {
      const articles = await supabaseClient.from("crimes_inelegibilidade", {
        select: "artigo",
        filter: { codigo: sanitizedLaw },
        order: "artigo.asc",
      });

      if (!Array.isArray(articles)) return [];

      return [...new Set(articles.map((a) => a.artigo).filter(Boolean))].sort(
        (a, b) => {
          const numA = parseInt(a.replace(/\D/g, "")) || 0;
          const numB = parseInt(b.replace(/\D/g, "")) || 0;
          return numA === numB ? a.localeCompare(b) : numA - numB;
        },
      );
    } catch (error) {
      console.error("[ValidatorService] Failed to fetch articles:", error);
      return [];
    }
  }

  /**
   * Core logic for eligibility check via Supabase RPC
   * @param {string} lawCode
   * @param {string} article
   * @param {string} [paragraph]
   * @param {string} [inciso]
   * @param {string} [alinea]
   * @returns {Promise<EligibilityResult>}
   */
  async verifyEligibility(
    lawCode,
    article,
    paragraph = null,
    inciso = null,
    alinea = null,
  ) {
    if (!this.initialized) {
      return { resultado: RESULTS.ERROR, motivo: "Service not initialized" };
    }

    const sanitizedLaw = InputValidator.validateLawCode(lawCode);
    const sanitizedArticle = InputValidator.validateArticle(article);

    if (!sanitizedLaw || !sanitizedArticle) {
      return {
        resultado: RESULTS.ERROR,
        motivo: "Invalid input parameters",
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

      return (result && result[0]) || { resultado: RESULTS.NOT_FOUND };
    } catch (error) {
      console.error("[ValidatorService] Verification error:", error);
      return {
        resultado: RESULTS.ERROR,
        motivo: `Internal Error: ${error.message}`,
      };
    }
  }

  /**
   * Legacy compatibility wrapper for article details
   * @param {string} lawCode
   * @param {string} article
   * @returns {Promise<Array>}
   */
  async getArticleDetails(lawCode, article) {
    const result = await this.verifyEligibility(lawCode, article);

    if (result.resultado === RESULTS.INELIGIBLE) {
      return [
        {
          crime: result.tipo_crime || "Crime impeditivo",
          norma_completa: `${lawCode}, Art. ${article}`,
          observacao: result.observacoes,
          excecoes: [],
        },
      ];
    }

    return [];
  }
}

export const validatorService = new ValidatorService();

if (typeof window !== "undefined") {
  window.validatorService = validatorService;
}
