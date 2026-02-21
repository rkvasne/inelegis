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
}
