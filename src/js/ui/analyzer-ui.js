import { validatorService } from "../services/validator-service.js";
import { showToast } from "../utils/toast.js";

/**
 * Controller para Análise de Dispositivo de Sentença.
 * Extrai artigos de texto e realiza validação em lote.
 */
export class AnalyzerUI {
  constructor() {
    this.textarea = document.getElementById("dispositivoText");
    this.btnAnalisar = document.getElementById("btnAnalisarDispositivo");
    this.resultsContainer = document.getElementById("analyzer-results");
    this.tbody = document.getElementById("analyzer-tbody");
    this.statsText = document.getElementById("analyzer-stats");
  }

  init() {
    if (!this.btnAnalisar) return;

    this.btnAnalisar.addEventListener("click", () => this.analisar());

    // Tecla Enter para disparar análise
    if (this.textarea) {
      this.textarea.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          this.analisar();
        }
      });
    }
  }

  /**
   * Executa a análise do texto fornecido
   */
  async analisar() {
    const texto = this.textarea.value.trim();
    if (!texto) {
      showToast(
        "Por favor, insira o texto do dispositivo da sentença.",
        "warning",
      );
      return;
    }

    // Mostrar loading
    this.btnAnalisar.disabled = true;
    this.btnAnalisar.innerHTML =
      '<span class="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span> Analisando...';

    try {
      const extraidosRaw = this.extrairArtigosCompletos(texto);
      const extraidos = extraidosRaw.filter((item) =>
        this.validarExtracao(item),
      );
      const falhas = extraidosRaw.length - extraidos.length;

      if (extraidos.length === 0) {
        if (falhas > 0) {
          showToast(
            "Detectamos citações, mas o formato está confuso ou fora do padrão. A consulta não será realizada para evitar erros. Use os exemplos de ajuda.",
            "warning",
            6000,
          );
        } else {
          showToast(
            "Não conseguimos identificar nenhuma citação de artigo/lei no texto. Verifique o formato.",
            "warning",
          );
        }
        return;
      }

      if (falhas > 0) {
        showToast(
          `Identificamos ${extraidos.length} artigos válidos, mas ignoramos ${falhas} trechos confusos para garantir sua segurança.`,
          "info",
        );
      }

      this.resultsContainer.classList.remove("hidden");
      this.tbody.innerHTML = "";

      let totalInelegivel = 0;

      for (const item of extraidos) {
        // Lookup pretty name if possible
        const lawInfo = (await validatorService.getLaws()).find(
          (l) => l.codigo === item.lei,
        );
        const lawDisplayName = lawInfo ? lawInfo.lei || lawInfo.nome : item.lei;

        const detailText = [];
        if (item.paragrafo) detailText.push(`§ ${item.paragrafo}`);
        if (item.inciso) detailText.push(`Inc. ${item.inciso}`);
        if (item.alinea) detailText.push(`Al. ${item.alinea}`);
        const fullDetail =
          detailText.length > 0 ? ` (${detailText.join(", ")})` : "";

        const row = document.createElement("tr");
        row.style.borderBottom = "1px solid var(--border-color)";
        row.innerHTML = `
                    <td class="p-4 align-top">
                        <div class="flex flex-col gap-1">
                            <span class="font-bold text-neutral-900 text-sm">${lawDisplayName}</span>
                            <span class="text-sm text-neutral-600 font-mono">Art. ${item.artigo}${fullDetail}</span>
                        </div>
                    </td>
                    <td class="p-4 align-top" id="status-${item.uid}">
                        <div class="flex items-center gap-2">
                            <div class="w-4 h-4 rounded-full border-2 border-neutral-200 border-t-neutral-400 animate-spin"></div>
                            <span class="text-neutral-400 text-sm">Verificando...</span>
                        </div>
                    </td>
                    <td class="p-4 align-top" id="ase-${item.uid}">
                        <span class="text-neutral-300">-</span>
                    </td>
                    <td class="p-4 align-top text-right">
                        <button class="btn btn-secondary btn-sm" data-uid="${item.uid}" disabled title="Aguardando verificação...">
                            Ver
                        </button>
                    </td>
                `;
        this.tbody.appendChild(row);

        // Validar (Poderia ser em lote no futuro, mas por enquanto mantemos a RPC individual)
        this.validarIndividual(item);
      }

      this.statsText.textContent = `Identificamos ${extraidos.length} dispositivos legais citados.`;
      this.resultsContainer.scrollIntoView({ behavior: "smooth" });
    } finally {
      this.btnAnalisar.disabled = false;
      this.btnAnalisar.innerHTML = `
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                Analisar Dispositivo
            `;
    }
  }

  /**
   * Valida um item individualmente e atualiza a linha
   */
  async validarIndividual(item) {
    const result = await validatorService.verifyEligibility(
      item.lei,
      item.artigo,
      item.paragrafo,
      item.inciso,
      item.alinea,
    );
    const statusCell = document.getElementById(`status-${item.uid}`);
    const aseCell = document.getElementById(`ase-${item.uid}`);

    if (!statusCell || !aseCell) return;

    // Análise de ASE (Prioridade para ASE 370 se houver indício no contexto ou resultado)
    const textoInabilitacao =
      /inabilitação|suspensão.*direitos|suspensos.*direitos/gi;
    const temIndicador370 =
      textoInabilitacao.test(item.contexto || "") ||
      textoInabilitacao.test(this.textarea.value);

    if (result.resultado === "INELEGIVEL") {
      statusCell.innerHTML =
        '<span class="analyzer-badge danger">INELEGÍVEL</span>';
      const itemE = result.item_alinea_e ? `Item ${result.item_alinea_e}` : "";
      const tipoCrime = result.tipo_crime
        ? `<div class="text-sm text-neutral-900 font-medium mt-1 pt-1">${result.tipo_crime}</div>`
        : "";

      if (temIndicador370) {
        aseCell.innerHTML = `
                    <div class="flex flex-col gap-1">
                        <span class="font-bold text-danger-700 text-sm">ASE 370 / 337 (Motivo 7)</span>
                        ${tipoCrime}
                        <span class="text-xs text-neutral-500">Com inabilitação de direitos</span>
                    </div>`;
      } else {
        aseCell.innerHTML = `
                    <div class="flex flex-col gap-1">
                        <span class="font-bold text-danger-700 text-sm">ASE 337 (Motivo 7)</span>
                        <div class="text-xs text-neutral-600">Alínea "e", ${itemE}</div>
                        ${tipoCrime}
                    </div>`;
      }

      // Atualizar botão Ver para abrir modal INELEGÍVEL
      this.updateViewButton(item, result, "INELEGIVEL");
    } else if (result.resultado === "ELEGIVEL") {
      const isExcecao = result.eh_excecao;
      statusCell.innerHTML = isExcecao
        ? '<span class="analyzer-badge warning">ELEGÍVEL (EXCEÇÃO)</span>'
        : '<span class="analyzer-badge success">ELEGÍVEL</span>';
      aseCell.textContent = temIndicador370
        ? "ASE 370 (Suspensão)"
        : "Não gera restrição";

      // Abrir modal ELEGÍVEL automaticamente ao clicar no Ver
      this.updateViewButton(item, result, "ELEGIVEL");
    } else {
      // NAO_CONSTA = Elegível (artigo não encontrado na base)
      statusCell.innerHTML =
        '<span class="analyzer-badge success">ELEGÍVEL</span>';
      aseCell.innerHTML = temIndicador370
        ? '<span class="text-warning-700 font-medium">ASE 370?</span><br><small>Verificar se há condenação criminal</small>'
        : "Não gera restrição";

      // Abrir modal ELEGÍVEL (não consta = elegível)
      this.updateViewButton(
        item,
        { ...result, resultado: "ELEGIVEL" },
        "ELEGIVEL",
      );
    }

    // Registrar no Histórico e Analytics (Análise Automática)
    if (typeof SearchHistory !== "undefined") {
      SearchHistory.add({
        lei: item.lei,
        artigo: item.artigo,
        resultado: result.resultado.toLowerCase(),
        tipoCrime: result.tipo_crime,
        observacoes: `[Análise Automática] ${result.observacoes || result.motivo || ""}`,
      });
    }

    if (typeof Analytics !== "undefined") {
      Analytics.trackSearch({
        lei: item.lei,
        artigo: item.artigo,
        resultado: result.resultado.toLowerCase(),
        temExcecao: result.resultado === "ELEGIVEL",
        context: "sentence_analyzer",
      });
    }
  }

  /**
   * Atualiza o botão "Ver" para abrir o modal correto
   * @param {object} item - Item analisado
   * @param {object} result - Resultado da verificação
   * @param {string} tipo - Tipo do resultado (INELEGIVEL, ELEGIVEL)
   */
  updateViewButton(item, result, tipo) {
    // Encontrar a row e o botão
    const row = document.querySelector(`#status-${item.uid}`)?.closest("tr");
    if (!row) return;

    const btn = row.querySelector(`button[data-uid="${item.uid}"]`);
    if (!btn) return;

    // Habilitar botão
    btn.disabled = false;
    btn.title = "Ver detalhes completos";

    // Armazenar dados no dataset do botão
    btn.dataset.lei = item.lei;
    btn.dataset.artigo = item.artigo;
    btn.dataset.paragrafo = item.paragrafo || "";
    btn.dataset.inciso = item.inciso || "";
    btn.dataset.alinea = item.alinea || "";
    btn.dataset.resultado = tipo;
    btn.dataset.tipoCrime = result.tipo_crime || "";
    btn.dataset.itemAlineaE = result.item_alinea_e || "";
    btn.dataset.excecoes = result.excecoes_detalhes || "";
    btn.dataset.ehExcecao = result.eh_excecao ? "true" : "false";

    // Adicionar evento de clique
    btn.addEventListener("click", () => {
      window.openAnalyzerResultModal(btn.dataset);
    });
  }

  /**
   * Valida se a extração de um item parece legítima ou se é "lixo" de processamento.
   * @param {object} item
   * @returns {boolean}
   */
  validarExtracao(item) {
    // Lista de palavras proibidas ou fragmentos de regex que indicam falha
    const junkWords = [
      "agrafo",
      "inciso",
      "alinea",
      "paragrafo",
      "artigo",
      "lei",
    ];

    // Validar parágrafo (deve ser número, "unico" ou nulo)
    if (item.paragrafo) {
      const p = item.paragrafo.toLowerCase();
      if (junkWords.some((word) => p.includes(word))) return false;
      if (!/^\d+$/.test(p) && p !== "unico" && p !== "único") return false;
    }

    // Validar inciso (deve ser Romano ou número)
    if (item.inciso) {
      const i = item.inciso.toUpperCase();
      if (junkWords.some((word) => i.includes(word.toUpperCase())))
        return false;
      if (!/^[IVXLCDM]+$/.test(i) && !/^\d+$/.test(i)) return false;
    }

    // Validar alínea (deve ser uma letra única)
    if (item.alinea) {
      const a = item.alinea.toLowerCase();
      if (junkWords.some((word) => a.includes(word))) return false;
      if (!/^[a-z]$/.test(a)) return false;
    }

    return true;
  }

  /**
   * Extrai artigos e tenta identificar a lei correspondente de forma robusta.
   * @param {string} texto
   */
  extrairArtigosCompletos(texto) {
    const resultados = [];

    // Mapeamento de termos para códigos da base
    const lawKeywords = {
      cp: "CP",
      "código penal": "CP",
      penal: "CP",
      ce: "CE",
      "código eleitoral": "CE",
      eleitoral: "CE",
      "lc 64": "LC_64_90",
      "lei das inelegibilidades": "LC_64_90",
      "lei 64": "LC_64_90",
      ctb: "lei_9503_97",
      trânsito: "lei_9503_97",
      9.504: "lei_9504_97",
      "lei das eleicoes": "lei_9504_97",
      "lei das eleitas": "lei_9504_97",
      cpm: "CPM",
      militar: "CPM",
      eca: "ECA",
      "estatuto da crianca": "ECA",
    };

    // Identificar lei prevalente no texto (global)
    let primaryLaw = "CP";
    const textoLower = texto.toLowerCase();
    for (const [key, code] of Object.entries(lawKeywords)) {
      if (textoLower.includes(key)) {
        primaryLaw = code;
        break;
      }
    }

    // Dividir por sentenças ou novas linhas para manter contextos curtos e precisos
    const clausulas = texto.split(/[;\n]+/);

    clausulas.forEach((clausula) => {
      if (!clausula.trim()) return;

      let leiDaClausula = null;
      for (const [key, code] of Object.entries(lawKeywords)) {
        if (clausula.toLowerCase().includes(key)) {
          leiDaClausula = code;
          break;
        }
      }
      const currentLaw = leiDaClausula || primaryLaw;

      // Regex para blocos de artigos (Art. 1, 2 e 3)
      const regexArt =
        /(?:art\.?s?\.?\s+)([\d\w\-\.]+)(?:\s*(?:,|e|ou|c\/c)\s*(?!art)([\d\w\-\.]+))?(?:\s*(?:,|e|ou|c\/c)\s*(?!art)([\d\w\-\.]+))?/gi;

      let m;
      while ((m = regexArt.exec(clausula)) !== null) {
        // Contexto: do fim do match atual até o próximo "Art." ou fim da cláusula
        const start = regexArt.lastIndex;
        const preview = clausula.slice(start);
        const nextArtMatch = preview.match(/art\.?s?\.?/i);
        const contextEnd = nextArtMatch ? nextArtMatch.index : preview.length;
        const context = preview.slice(0, contextEnd).toLowerCase();

        // Extração Múltipla (Parágrafos, Incisos, Alíneas)
        const extractMulti = (ctx, single, plural, valuePattern) => {
          const allMarkers = (plural + "|" + single)
            .split("|")
            .sort((a, b) => b.length - a.length)
            .map((marker) => marker.replace(".", "\\."));

          const pattern = `(?:${allMarkers.join("|")})\\s*((?:${valuePattern})(?:\\s*(?:,|e|ou)\\s*(?:${valuePattern}))*)`;
          const regex = new RegExp(pattern, "i");
          const matchVal = ctx.match(regex);

          if (!matchVal) return [null];

          const clean = matchVal[1]
            .split(/\s*(?:,|e|ou)\s*/)
            .map((v) => v.replace(/[º°ª'"'']/g, "").trim())
            .filter((v) => v && !/^(caput)$/i.test(v));

          return clean.length > 0 ? clean : [null];
        };

        const paragrafos = extractMulti(
          context,
          "§|parágrafo|paragrafo|par",
          "§§|parágrafos|paragrafos",
          "\\d+|único|unico|caput",
        );
        const incisos = extractMulti(
          context,
          "inciso|inc",
          "incisos|incs",
          "[ivxlcdm]+|\\d+|único|unico",
        );
        const alineas = extractMulti(
          context,
          "alínea|alinea|al",
          "alíneas|alineas|als",
          "['\"]?[a-z]['\"]?",
        );

        const articlesFound = [m[1], m[2], m[3]]
          .filter((v) => v && /^\d/.test(v))
          .map((v) => v.replace(/\.$/, "").trim());

        articlesFound.forEach((art) => {
          paragrafos.forEach((p) => {
            incisos.forEach((inc) => {
              alineas.forEach((al) => {
                resultados.push({
                  lei: currentLaw,
                  artigo: art,
                  paragrafo: p,
                  inciso: inc ? inc.toUpperCase() : null,
                  alinea: al ? al.toLowerCase() : null,
                  uid: Math.random().toString(36).substring(2, 9),
                  contexto: context,
                });
              });
            });
          });
        });
      }
    });

    // Post-process: remoção de duplicatas exatas
    return resultados.filter(
      (v, i, a) =>
        a.findIndex(
          (t) =>
            t.artigo === v.artigo &&
            t.lei === v.lei &&
            t.paragrafo === v.paragrafo &&
            t.inciso === v.inciso &&
            t.alinea === v.alinea,
        ) === i,
    );
  }
}

// Funções globais para suporte ao HTML
window.switchTab = function (mode) {
  const simpleBtn = document.getElementById("tab-simple");
  const advancedBtn = document.getElementById("tab-advanced");
  const simpleContent = document.getElementById("simple-mode-content");
  const advancedContent = document.getElementById("advanced-mode-content");

  if (mode === "simple") {
    simpleBtn.classList.add("active");
    advancedBtn.classList.remove("active");
    simpleContent.classList.remove("hidden");
    advancedContent.classList.add("hidden");
  } else {
    simpleBtn.classList.remove("active");
    advancedBtn.classList.add("active");
    simpleContent.classList.add("hidden");
    advancedContent.classList.remove("hidden");
  }
};

window.viewDetails = function (lei, artigo) {
  // Alternar para aba simples e preencher
  window.switchTab("simple");
  const leiSelect = document.getElementById("leiSelect");
  if (leiSelect) {
    leiSelect.value = lei;
    leiSelect.dispatchEvent(new Event("change"));

    // Aguardar popular artigos
    setTimeout(() => {
      const artigoSelect = document.getElementById("artigoSelect");
      if (artigoSelect) {
        artigoSelect.value = artigo;
        artigoSelect.dispatchEvent(new Event("change"));
      }
    }, 500);
  }
};

/**
 * Abre o modal de resultado a partir da análise de dispositivo
 * @param {object} data - Dados do resultado
 */
window.openAnalyzerResultModal = async function (data) {
  const isInelegivel = data.resultado === "INELEGIVEL";
  const isElegivel = data.resultado === "ELEGIVEL";

  // Buscar nome da lei
  const lawInfo = (await validatorService.getLaws()).find(
    (l) => l.codigo === data.lei,
  );
  const lawDisplayName = lawInfo ? lawInfo.lei || lawInfo.nome : data.lei;

  // Configurações visuais
  let statusClass, statusText, statusIcon;

  if (isInelegivel) {
    statusClass = "ineligible";
    statusText = "INELEGÍVEL";
    statusIcon = `<svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>`;
  } else {
    statusClass = data.ehExcecao === "true" ? "warning" : "eligible";
    statusText = data.ehExcecao === "true" ? "ELEGÍVEL (EXCEÇÃO)" : "ELEGÍVEL";
    statusIcon = `<svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>`;
  }

  let incidencia = `Art. ${data.artigo}`;
  if (data.paragrafo) incidencia += `, § ${data.paragrafo}`;
  if (data.inciso) incidencia += `, Inc. ${data.inciso}`;
  if (data.alinea) incidencia += `, Al. ${data.alinea}`;

  const bodyHTML = `
    <div class="result-modal-v3">
      <!-- Card de Status Principal -->
      <div class="modal-status-card ${statusClass}">
        <div class="modal-result-icon">
          ${statusIcon}
        </div>
        <div>
          <span class="status-label">RESULTADO</span>
          <h2 class="status-value">${statusText}</h2>
        </div>
      </div>

      <!-- Grid de Informações Técnicas - 3 colunas -->
      <div class="grid grid-cols-3 gap-3 mb-3">
        <div class="info-card info-card-compact">
          <span class="info-label">CRIME/DELITO</span>
          <p class="info-value">
            ${data.tipoCrime || "Não consta crime impeditivo"}
            ${data.itemAlineaE ? ` (${data.itemAlineaE})` : ""}
          </p>
        </div>
        <div class="info-card info-card-compact">
          <span class="info-label">NORMA/INCIDÊNCIA</span>
          <p class="info-value">${incidencia}</p>
          <p class="info-subtext">${lawDisplayName}</p>
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
        <span class="ase-value">
          ${isInelegivel ? "ASE 337 - Motivo 7: Condenação criminal" : "Não gera restrição eleitoral"}
        </span>
      </div>

      <!-- Disclaimer de Exceções -->
      ${data.excecoes
      ? `
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
              ${data.excecoes}
            </div>
          </div>
        </div>
      </div>
      `
      : ""
    }
    </div>
  `;

  // Abrir Modal
  if (window.ModalManager) {
    const subtitle = document.getElementById("modalSubtitle");
    if (subtitle) subtitle.textContent = lawDisplayName;

    const title = document.getElementById("modalTitle");
    if (title) title.textContent = "Resultado da Consulta";

    window.ModalManager.open(statusClass, statusText, bodyHTML);
  }
};
