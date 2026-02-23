import { validatorService, RESULTS } from "../services/validator-service.js";
import { ResultRenderer } from "./result-renderer.js";

/**
 * Validator UI Controller
 * Manages the Validation Interface, dropdowns, and coordination between service and renderer.
 * @version SSoT-Synchronized
 */
export class ValidatorUI {
  constructor() {
    this.leiSelect = document.querySelector("#leiSelect");
    this.artigoSelect = document.querySelector("#artigoSelect");
    this.resultContainer = document.querySelector("#validator-result");

    this.selectedLaw = null;
    this.selectedLawName = null;
    this.relatedDevices = [];
  }

  /**
   * Initializes the component and waits for the service to be ready.
   */
  async init() {
    if (this.leiSelect) {
      this.leiSelect.innerHTML = '<option value="">Carregando leis...</option>';
      this.leiSelect.disabled = true;
    }

    const serviceReady = await validatorService.init();

    if (!serviceReady) {
      if (this.leiSelect) {
        this.leiSelect.innerHTML =
          '<option value="">Erro: Dados indisponíveis</option>';
      }
      return;
    }

    await this.setupLeiSelect();
    this.setupArtigoSelect();
  }

  /**
   * Configures the Law selection dropdown.
   */
  async setupLeiSelect() {
    if (!this.leiSelect) return;

    const laws = await validatorService.getLaws();

    this.leiSelect.innerHTML =
      '<option value="" selected>Selecione a lei ou código...</option>';
    this.leiSelect.disabled = false;

    laws.forEach((law) => {
      const option = document.createElement("option");
      option.value = law.codigo;
      option.textContent = law.lei || law.codigo;
      this.leiSelect.appendChild(option);
    });

    this.leiSelect.addEventListener("change", (e) => {
      const codigo = e.target.value;
      if (codigo) {
        const lawName = e.target.options[e.target.selectedIndex].textContent;
        this.selectLaw(codigo, lawName);
        this._hideArrowIndicator();
      } else {
        this._resetArtigoSelect();
        this.hideResult();
      }
    });

    this._setupParagrafoUnicoLogic();
    this._setupCompositeRuleInputs();
    this.setupActionButtons();
    this._setupEnterKeySearch();
  }

  /** @private */
  _hideArrowIndicator() {
    const arrow = document.getElementById("leiArrowIndicator");
    if (arrow) arrow.classList.remove("show");
  }

  /** @private */
  _resetArtigoSelect() {
    if (this.artigoSelect) {
      this.artigoSelect.innerHTML =
        '<option value="" selected>Selecione primeiro a lei...</option>';
      this.artigoSelect.disabled = true;
    }
  }

  /** @private */
  _setupParagrafoUnicoLogic() {
    const checkUnico = document.getElementById("paragrafoUnicoCheck");
    const inputParagrafo = document.getElementById("paragrafoInput");
    if (checkUnico && inputParagrafo) {
      checkUnico.addEventListener("change", (e) => {
        inputParagrafo.disabled = e.target.checked;
        if (e.target.checked) inputParagrafo.value = "";
      });
    }
  }

  /** @private - Enter aciona o botão Pesquisar quando focado em input de busca */
  _setupEnterKeySearch() {
    const triggerSearch = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const btn = document.getElementById("btnPesquisar");
        if (btn && this.selectedLaw && this.artigoSelect?.value) {
          btn.click();
        } else if (btn) {
          this._highlightMissingFields();
        }
      }
    };
    const ids = [
      "leiSelect",
      "artigoSelect",
      "paragrafoInput",
      "incisoInput",
      "alineaInput",
    ];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener("keydown", triggerSearch);
    });
  }

  setupActionButtons() {
    const btnClear = document.getElementById("btnClearSearch");
    if (btnClear) {
      btnClear.addEventListener("click", () => this.clearSearch());
    }

    const btnPesquisar = document.getElementById("btnPesquisar");
    if (btnPesquisar) {
      btnPesquisar.addEventListener("click", () => {
        const artigoNum = this.artigoSelect?.value;
        if (this.selectedLaw && artigoNum) {
          this.validateSelection(artigoNum);
        } else {
          this._highlightMissingFields();
        }
      });
    }
  }

  /** @private */
  _highlightMissingFields() {
    const fields = [
      { condition: !this.selectedLaw, el: this.leiSelect },
      { condition: !this.artigoSelect?.value, el: this.artigoSelect },
    ];

    fields.forEach(({ condition, el }) => {
      if (condition && el) {
        el.classList.add("ring-2", "ring-red-500");
        setTimeout(() => el.classList.remove("ring-2", "ring-red-500"), 1000);
      }
    });
  }

  clearSearch() {
    this.leiSelect.value = "";
    this._resetArtigoSelect();

    ["paragrafoInput", "incisoInput", "alineaInput"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    });

    const checkUnico = document.getElementById("paragrafoUnicoCheck");
    if (checkUnico) checkUnico.checked = false;

    this.selectedLaw = null;
    this.selectedLawName = null;
    this.relatedDevices = [];
    this._renderRelatedDevices();

    [
      "ctxFiguras301302",
      "ctxRefereArt1AlineaE",
      "ctxCpmArt266Culposo",
      "ctxCp129Cc12",
      "ctxLei10826Art16Cc2",
    ].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.checked = false;
    });

    [
      "ccArtigoInput",
      "ccParagrafoInput",
      "ccIncisoInput",
      "ccAlineaInput",
    ].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    });

    this._renderContextSummary();

    this.hideResult();

    const arrow = document.getElementById("leiArrowIndicator");
    if (arrow) arrow.classList.add("show");
  }

  async selectLaw(codigo, nome) {
    this.selectedLaw = codigo;
    this.selectedLawName = nome;
    await this.populateArtigoSelect(codigo);
    this.hideResult();
  }

  async populateArtigoSelect(lawCode) {
    if (!this.artigoSelect) return;

    this.artigoSelect.innerHTML =
      '<option value="">Carregando artigos...</option>';
    this.artigoSelect.disabled = true;

    const articles = await validatorService.getArticlesByLaw(lawCode);

    if (articles.length === 0) {
      this.artigoSelect.innerHTML =
        '<option value="" disabled selected>Lei sem restrições mapeadas</option>';
      return;
    }

    this.artigoSelect.innerHTML =
      '<option value="" selected>Selecione o artigo...</option>';
    articles.forEach((art) => {
      const option = document.createElement("option");
      option.value = art;
      option.textContent = `Art. ${art}`;
      this.artigoSelect.appendChild(option);
    });

    this.artigoSelect.disabled = false;
  }

  setupArtigoSelect() {
    if (this.artigoSelect) {
      this.artigoSelect.addEventListener("change", () => this.hideResult());
    }
  }

  async validateSelection(artigoNum) {
    const context = {
      artigo: artigoNum,
      paragrafo: document.getElementById("paragrafoUnicoCheck")?.checked
        ? "unico"
        : document.getElementById("paragrafoInput")?.value || null,
      inciso: document.getElementById("incisoInput")?.value || null,
      alinea: document.getElementById("alineaInput")?.value || null,
      leiNome: this.selectedLawName,
      tipoComunicacao: document.querySelector(
        'input[name="tipoComunicacao"]:checked',
      )?.value,
      relacionados: this.relatedDevices,
      contextoRegra: this._collectRuleContext(),
    };

    if (this.resultContainer) {
      this.resultContainer.classList.add("hidden");
    }

    try {
      const result = await validatorService.verifyEligibility(
        this.selectedLaw,
        artigoNum,
        context.paragrafo,
        context.inciso,
        context.alinea,
        context.relacionados,
        context.contextoRegra,
      );

      this._trackAnalytics(result, context);
      this.renderResult(result, context);
    } catch (error) {
      console.error("[ValidatorUI] Validation failed:", error);
    }
  }

  /** @private */
  _trackAnalytics(result, context) {
    // Search History Trace
    if (typeof SearchHistory !== "undefined") {
      SearchHistory.add({
        lei: this.selectedLaw,
        artigo: context.artigo,
        resultado: result.resultado.toLowerCase(),
        tipoCrime: result.tipo_crime,
        inciso: context.inciso,
        alinea: context.alinea,
        paragrafo: context.paragrafo,
        observacoes: `[Manual] ${result.observacoes || result.mensagem || ""}`,
      });
    }

    // Performance/Telemetry
    if (typeof Analytics !== "undefined") {
      Analytics.trackSearch({
        lei: this.selectedLaw,
        artigo: context.artigo,
        resultado: result.resultado.toLowerCase(),
        temExcecao: result.resultado === RESULTS.ELIGIBLE,
        context: "structured_search",
      });
    }
  }

  renderResult(result, context) {
    const { html, statusClass, statusText } = ResultRenderer.render(
      result,
      context,
    );

    if (window.ModalManager) {
      const subtitle = document.getElementById("modalSubtitle");
      if (subtitle) subtitle.textContent = this.selectedLawName;

      const title = document.getElementById("modalTitle");
      if (title) title.textContent = "Resultado da Consulta";

      window.ModalManager.open(statusClass, statusText, html);
    }
  }

  hideResult() {
    if (this.resultContainer) {
      this.resultContainer.classList.add("hidden");
      this.resultContainer.innerHTML = "";
    }
  }

  /** @private */
  _setupCompositeRuleInputs() {
    const addBtn = document.getElementById("btnAddRelacionado");
    const clearBtn = document.getElementById("btnClearRelacionados");
    if (addBtn) {
      addBtn.addEventListener("click", () => {
        const artigo = document.getElementById("ccArtigoInput")?.value || "";
        const paragrafo =
          document.getElementById("ccParagrafoInput")?.value || "";
        const inciso = document.getElementById("ccIncisoInput")?.value || "";
        const alinea = document.getElementById("ccAlineaInput")?.value || "";

        const artigoNormalizado = artigo.trim().toUpperCase();
        if (!artigoNormalizado) return;

        const incisos = this._expandIncisoInput(inciso);
        const novos = incisos.length > 0 ? incisos : [null];
        novos.forEach((inc) => {
          const item = {
            artigo: artigoNormalizado,
            paragrafo: paragrafo.trim() || null,
            inciso: inc,
            alinea: alinea.trim() || null,
          };
          const key = `${item.artigo}|${item.paragrafo || ""}|${item.inciso || ""}|${item.alinea || ""}`;
          const exists = this.relatedDevices.some((d) => {
            const k = `${d.artigo}|${d.paragrafo || ""}|${d.inciso || ""}|${d.alinea || ""}`;
            return k === key;
          });
          if (!exists) this.relatedDevices.push(item);
        });

        [
          "ccArtigoInput",
          "ccParagrafoInput",
          "ccIncisoInput",
          "ccAlineaInput",
        ].forEach((id) => {
          const el = document.getElementById(id);
          if (el) el.value = "";
        });

        this._renderRelatedDevices();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        this.relatedDevices = [];
        this._renderRelatedDevices();
      });
    }

    [
      "ctxFiguras301302",
      "ctxRefereArt1AlineaE",
      "ctxCpmArt266Culposo",
      "ctxCp129Cc12",
      "ctxLei10826Art16Cc2",
    ].forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("change", () => this._renderContextSummary());
      }
    });

    this._renderContextSummary();
  }

  /** @private */
  _expandIncisoInput(value) {
    const raw = (value || "").trim().toUpperCase();
    if (!raw) return [];

    // Ex.: "I a V" / "I-V"
    const range = raw.match(/^([IVXLCDM]+)\s*(?:A|-)\s*([IVXLCDM]+)$/);
    if (!range) return [raw];

    const start = this._romanToInt(range[1]);
    const end = this._romanToInt(range[2]);
    if (!start || !end || end < start || end - start > 30) return [raw];

    const out = [];
    for (let i = start; i <= end; i += 1) {
      out.push(this._intToRoman(i));
    }
    return out;
  }

  /** @private */
  _romanToInt(roman) {
    const map = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
    let total = 0;
    let prev = 0;
    for (let i = roman.length - 1; i >= 0; i -= 1) {
      const curr = map[roman[i]] || 0;
      if (curr < prev) total -= curr;
      else total += curr;
      prev = curr;
    }
    return total;
  }

  /** @private */
  _intToRoman(num) {
    const values = [
      [1000, "M"],
      [900, "CM"],
      [500, "D"],
      [400, "CD"],
      [100, "C"],
      [90, "XC"],
      [50, "L"],
      [40, "XL"],
      [10, "X"],
      [9, "IX"],
      [5, "V"],
      [4, "IV"],
      [1, "I"],
    ];
    let n = num;
    let out = "";
    values.forEach(([v, r]) => {
      while (n >= v) {
        out += r;
        n -= v;
      }
    });
    return out;
  }

  /** @private */
  _renderRelatedDevices() {
    const list = document.getElementById("relacionadosList");
    if (!list) return;
    if (this.relatedDevices.length === 0) {
      list.innerHTML =
        '<li class="text-xs text-neutral-500">Nenhum dispositivo adicionado na combinação.</li>';
      this._renderContextSummary();
      return;
    }

    list.innerHTML = this.relatedDevices
      .map((item, idx) => {
        const parts = [`Art. ${item.artigo}`];
        if (item.paragrafo) parts.push(`§ ${item.paragrafo}`);
        if (item.inciso) parts.push(`Inc. ${item.inciso}`);
        if (item.alinea) parts.push(`Alínea ${item.alinea}`);
        return `
          <li class="u-flex-between" style="gap: 0.5rem;">
            <span class="text-xs">${parts.join(", ")}</span>
            <button type="button" class="btn btn-secondary btn-sm" data-related-remove="${idx}">Remover</button>
          </li>
        `;
      })
      .join("");

    list.querySelectorAll("[data-related-remove]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.getAttribute("data-related-remove"));
        this.relatedDevices.splice(idx, 1);
        this._renderRelatedDevices();
      });
    });

    this._renderContextSummary();
  }

  /** @private */
  _collectRuleContext() {
    const flag = (id) => !!document.getElementById(id)?.checked;
    const ctx = {};
    if (flag("ctxFiguras301302")) ctx.figuras_301_302 = true;
    if (flag("ctxRefereArt1AlineaE")) ctx.refere_art1_alinea_e = true;
    if (flag("ctxCpmArt266Culposo")) ctx.cpm_art266_culposo = true;
    if (flag("ctxCp129Cc12")) ctx.cp129_cc12 = true;
    if (flag("ctxLei10826Art16Cc2")) ctx.lei10826_art16_cc2 = true;
    return ctx;
  }

  /** @private */
  _getSelectedContexts() {
    const flags = [
      {
        id: "ctxFiguras301302",
        label: "CP art. 304 ligado aos arts. 301/302",
      },
      {
        id: "ctxRefereArt1AlineaE",
        label: 'Lei 2.889/56 arts. 2º/3º com referência ao art. 1º, alínea "e"',
      },
      {
        id: "ctxCpmArt266Culposo",
        label: "CPM arts. 262-265 combinados com art. 266 (culposo)",
      },
      {
        id: "ctxCp129Cc12",
        label: "CP art. 129 §§2º/3º em combinação com §12",
      },
      {
        id: "ctxLei10826Art16Cc2",
        label: "Lei 10.826/03 art. 16 em combinação com §2º",
      },
    ];

    return flags.filter((f) => document.getElementById(f.id)?.checked);
  }

  /** @private */
  _renderContextSummary() {
    const summary = document.getElementById("ccResumoSelecionado");
    if (!summary) return;

    const selectedContexts = this._getSelectedContexts();
    const hasRelated = this.relatedDevices.length > 0;
    const hasContext = selectedContexts.length > 0;

    if (!hasRelated && !hasContext) {
      summary.innerHTML =
        '<p class="text-xs text-neutral-500">Resumo da combinação: nenhum item adicional selecionado.</p>';
      return;
    }

    const chips = [];
    if (hasRelated) {
      chips.push(
        `<span class="cc-chip cc-chip-primary">Relacionados: ${this.relatedDevices.length}</span>`,
      );
    }

    selectedContexts.forEach((ctx) => {
      chips.push(`
        <span class="cc-chip">
          <span>${ctx.label}</span>
          <button type="button" class="cc-chip-remove" data-ctx-remove="${ctx.id}" aria-label="Desmarcar ${ctx.label}">x</button>
        </span>
      `);
    });

    summary.innerHTML = `
      <p class="text-xs u-mb-1"><strong>Resumo da combinação antes de pesquisar:</strong></p>
      <div class="cc-chip-list">
        ${chips.join("")}
      </div>
    `;

    summary.querySelectorAll("[data-ctx-remove]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-ctx-remove");
        const checkbox = document.getElementById(id);
        if (checkbox) {
          checkbox.checked = false;
          this._renderContextSummary();
        }
      });
    });
  }
}
