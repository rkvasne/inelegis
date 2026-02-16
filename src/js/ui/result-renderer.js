/**
 * Result Renderer
 * Responsável por gerar o HTML semântico e visual para os resultados da consulta.
 */

import { RESULTS } from "../services/validator-service.js";
import { escapeHtml } from "../utils/escape-html.js";

export class ResultRenderer {
  /**
   * Gera o HTML e metadados do modal de resultado de elegibilidade (único exibidor).
   * Usado pela consulta simples e pela análise por extração.
   * @param {Object} result - Resultado (resultado, tipo_crime, item_alinea_e, excecoes_artigo, eh_excecao, etc.)
   * @param {Object} context - Contexto (artigo, paragrafo, inciso, alinea, leiNome, tipoComunicacao)
   * @returns {{ html: string, statusClass: string, statusText: string }}
   */
  static render(result, context) {
    const {
      resultado,
      tipo_crime,
      observacoes,
      item_alinea_e,
      excecoes_artigo,
      mensagem,
    } = result;
    const { artigo, paragrafo, inciso, alinea, leiNome, tipoComunicacao } =
      context;

    const isInelegivel = resultado === RESULTS.INELIGIBLE;
    const isElegivel = resultado === RESULTS.ELIGIBLE;
    const isNotFound = resultado === RESULTS.NOT_FOUND;
    // Exceção: elegível por exceção legal (registro com tipo_crime ou excecoes_artigo)
    const isExcecao =
      result.eh_excecao === true ||
      (isElegivel &&
        (tipo_crime != null ||
          (excecoes_artigo && excecoes_artigo.trim() !== "")));

    const config = this._getVisualConfig(resultado, isExcecao);
    const incidencia = this._formatIncidencia(
      artigo,
      paragrafo,
      inciso,
      alinea,
    );
    const aseInfo = this._calculateASE(
      isInelegivel,
      tipoComunicacao,
      isExcecao,
    );
    const safeTipoCrime = escapeHtml(
      tipo_crime || "Não consta crime impeditivo",
    );
    const safeItemAlinea = item_alinea_e
      ? ` (${escapeHtml(item_alinea_e)})`
      : "";
    const safeIncidencia = escapeHtml(incidencia);
    const safeLeiNome = escapeHtml(leiNome || "");

    const html = `
      <div class="result-modal-v3">
        <!-- Card de Status Principal -->
        <div class="modal-status-card ${config.statusClass}">
          <div class="modal-result-icon">
            ${config.icon}
          </div>
          <div>
            <span class="status-label">RESULTADO</span>
            <h2 class="status-value">${config.statusText}</h2>
            ${isExcecao ? '<p class="text-sm font-medium opacity-90 mt-1">O artigo geraria inelegibilidade, mas uma exceção legal se aplica.</p>' : ""}
          </div>
        </div>

        <!-- Grid de Informações Técnicas -->
        <div class="grid grid-cols-3 gap-3 mb-3">
          <div class="info-card info-card-compact">
            <span class="info-label">CRIME/DELITO</span>
            <p class="info-value">${safeTipoCrime}${safeItemAlinea}</p>
          </div>
          <div class="info-card info-card-compact">
            <span class="info-label">NORMA/INCIDÊNCIA</span>
            <p class="info-value">${safeIncidencia}</p>
            <p class="info-subtext">${safeLeiNome}</p>
          </div>
          <div class="info-card info-card-compact">
            <span class="info-label">DATA DE OCORRÊNCIA</span>
            <p class="info-value">Trânsito em Julgado</p>
            <p class="info-subtext">Da sentença condenatória</p>
          </div>
        </div>

        <!-- ASE -->
        <div class="ase-card-compact">
          <span class="ase-label">ASE DE ANOTAÇÃO</span>
          <span class="ase-value">${aseInfo}</span>
        </div>

        <!-- Alerta de Exceções Hierárquicas -->
        ${this._renderExceptionAlert(excecoes_artigo)}
        
        <!-- Mensagem de Contexto SSoT -->
        ${mensagem ? `<p class="text-[10px] text-slate-400 mt-2 italic text-center">${escapeHtml(mensagem)}</p>` : ""}
      </div>
    `;
    return {
      html,
      statusClass: config.statusClass,
      statusText: config.statusText,
    };
  }

  /** @private */
  static _getVisualConfig(resultado, isExcecao = false) {
    if (resultado === RESULTS.INELIGIBLE) {
      return {
        statusClass: "ineligible",
        statusText: "INELEGÍVEL",
        icon: `<svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>`,
      };
    }
    if (resultado === RESULTS.ELIGIBLE) {
      return {
        statusClass: isExcecao ? "warning" : "eligible",
        statusText: isExcecao ? "ELEGÍVEL (EXCEÇÃO)" : "ELEGÍVEL",
        icon: `<svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>`,
      };
    }
    return {
      statusClass: "not-found",
      statusText: "NÃO ENCONTRADO",
      icon: `<svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>`,
    };
  }

  /** @private */
  static _formatIncidencia(artigo, paragrafo, inciso, alinea) {
    let parts = [`Art. ${artigo}`];
    if (paragrafo) parts.push(`§ ${paragrafo}`);
    if (inciso) parts.push(`Inc. ${inciso}`);
    if (alinea) parts.push(`Alínea ${alinea}`);
    return parts.join(", ");
  }

  /** @private
   * ASE conforme Manual ASE (docs/references/manual-ase.md).
   * Não depende de exceção; depende de tipo de comunicação e resultado.
   */
  static _calculateASE(isInelegivel, tipoComunicacao, _isExcecao = false) {
    if (tipoComunicacao === "condenacao") {
      return `ASE 337 - Motivo ${isInelegivel ? "7" : "2"}: Condenação criminal`;
    }
    if (tipoComunicacao === "extincao") {
      if (isInelegivel) {
        return "ASE 370 e ASE 540 (Motivo 4)";
      }
      return "ASE 370 - Cessação do impedimento";
    }
    if (
      (tipoComunicacao === "analise" || tipoComunicacao === "dispositivo") &&
      !isInelegivel
    ) {
      return "Consulte o manual - informe Condenação ou Extinção";
    }
    if (
      (tipoComunicacao === "analise" || tipoComunicacao === "dispositivo") &&
      isInelegivel
    ) {
      return "Consulte o manual - informe Condenação ou Extinção";
    }
    return "Consulte o manual para este tipo de comunicação";
  }

  /** @private */
  static _renderExceptionAlert(excecoes) {
    if (!excecoes) return "";
    return `
      <div class="exception-alert-card border-2 border-warning-200 bg-warning-50 p-4 rounded-xl">
        <div class="flex items-start gap-3">
          <div class="text-warning-600 mt-0.5">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
          </div>
          <div>
            <h4 class="text-sm font-black text-warning-900 uppercase mb-1">Atenção: Exceções Existentes</h4>
            <p class="text-xs text-warning-800 leading-normal">
              Este artigo possui exceções que podem <strong>NÃO gerar inelegibilidade</strong> caso o condenado se enquadre em uma delas:
            </p>
            <div class="mt-2 p-3 bg-white/60 rounded-lg text-[11px] font-medium text-warning-900 border border-warning-100">
              ${escapeHtml(excecoes)}
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
