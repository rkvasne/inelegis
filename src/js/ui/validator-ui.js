import { validatorService, RESULTS } from "../services/validator-service.js";
import { ResultRenderer } from "./result-renderer.js";
import { showToast } from "../utils/toast.js";

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
    this._setupUppercaseInputs();
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
    const checkCaput = document.getElementById("paragrafoCaputCheck");
    const checkUnico = document.getElementById("paragrafoUnicoCheck");
    const inputParagrafo = document.getElementById("paragrafoInput");
    if (checkCaput && checkUnico && inputParagrafo) {
      const syncMainParagrafoState = () => {
        if (checkCaput.checked) {
          checkUnico.checked = false;
          inputParagrafo.value = "";
          inputParagrafo.disabled = true;
          return;
        }
        if (checkUnico.checked) {
          checkCaput.checked = false;
          inputParagrafo.value = "";
          inputParagrafo.disabled = true;
          return;
        }
        inputParagrafo.disabled = false;
      };

      checkCaput.addEventListener("change", (e) => {
        if (e.target.checked) {
          checkUnico.checked = false;
        }
        syncMainParagrafoState();
      });

      checkUnico.addEventListener("change", (e) => {
        if (e.target.checked) {
          checkCaput.checked = false;
        }
        syncMainParagrafoState();
      });

      inputParagrafo.addEventListener("input", () => {
        // Se o usuário digitar um parágrafo, sai do modo caput/único explicitamente.
        if (inputParagrafo.value.trim() !== "") {
          checkCaput.checked = false;
          checkUnico.checked = false;
          inputParagrafo.disabled = false;
        }
      });

      // Sincroniza estado inicial da UI (evita caput marcado com parágrafo preenchido).
      syncMainParagrafoState();
    }
  }

  /** @private */
  _setupUppercaseInputs() {
    const toAsciiUpper = (value = "") =>
      String(value)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase();

    const forceUpper = (id, sanitizer = null) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener("input", () => {
        const next = toAsciiUpper(el.value || "");
        el.value = typeof sanitizer === "function" ? sanitizer(next) : next;
      });
    };

    forceUpper("incisoInput", (v) => v.replace(/[^IVXLCDM]/g, ""));
    forceUpper("alineaInput", (v) => v.replace(/[^A-Z]/g, ""));
    forceUpper("ccArtigoInput", (v) => v.replace(/[^0-9A-Z-]/g, ""));
    forceUpper("ccParagrafoInput", (v) => v.replace(/[^0-9A-Z]/g, ""));
    forceUpper("ccIncisoInput", (v) => v.replace(/[^IVXLCDMA -]/g, ""));
    forceUpper("ccAlineaInput", (v) => v.replace(/[^A-Z]/g, ""));
  }

  /** @private - Enter aciona o botão Pesquisar quando focado em input de busca */
  _setupEnterKeySearch() {
    const triggerSearch = async (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const btn = document.getElementById("btnPesquisar");
        if (!btn) return;
        await this._triggerSearch();
      }
    };
    const ids = [
      "leiSelect",
      "artigoSelect",
      "paragrafoInput",
      "incisoInput",
      "alineaInput",
      "ccArtigoInput",
      "ccParagrafoInput",
      "ccIncisoInput",
      "ccAlineaInput",
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
      btnPesquisar.addEventListener("click", async () => {
        await this._triggerSearch();
      });
    }
  }

  /** @private */
  async _triggerSearch() {
    const artigoNum = this.artigoSelect?.value;
    if (!this.selectedLaw || !artigoNum) {
      this._highlightMissingFields();
      return;
    }

    const proceed = await this._confirmPendingCompositeDraft();
    if (!proceed) return;

    await this.validateSelection(artigoNum);
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
    const checkCaput = document.getElementById("paragrafoCaputCheck");
    if (checkUnico) checkUnico.checked = false;
    if (checkCaput) checkCaput.checked = false;
    const inputParagrafo = document.getElementById("paragrafoInput");
    if (inputParagrafo) inputParagrafo.disabled = false;

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
    const ccCaputCheck = document.getElementById("ccCaputCheck");
    const ccParagrafoInput = document.getElementById("ccParagrafoInput");
    if (ccCaputCheck) ccCaputCheck.checked = false;
    if (ccParagrafoInput) ccParagrafoInput.disabled = false;

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
    const isCaput = !!document.getElementById("paragrafoCaputCheck")?.checked;
    const isUnico = !!document.getElementById("paragrafoUnicoCheck")?.checked;
    const context = {
      artigo: artigoNum,
      paragrafo: isCaput
        ? "caput"
        : isUnico
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
    if (!this._validateCompositeInput(context)) return;

    if (this.resultContainer) {
      this.resultContainer.classList.add("hidden");
    }

    try {
      const effectiveQuery = this._buildEffectiveCompositeQuery(context);
      const result = await validatorService.verifyEligibility(
        this.selectedLaw,
        artigoNum,
        effectiveQuery.paragrafo,
        effectiveQuery.inciso,
        effectiveQuery.alinea,
        effectiveQuery.relacionados,
        context.contextoRegra,
      );

      this._trackAnalytics(result, context);
      this.renderResult(result, context);
    } catch (error) {
      console.error("[ValidatorUI] Validation failed:", error);
    }
  }

  /** @private */
  _normalizeLegalDetail(value) {
    return (value || "")
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[§º°ª]/g, "");
  }

  /** @private */
  _validateCompositeInput(context) {
    const law = (this.selectedLaw || "").toUpperCase();
    const article = (context.artigo || "").toUpperCase();
    const hasCompositeInput =
      (context.relacionados || []).length > 0 ||
      Object.keys(context.contextoRegra || {}).length > 0;
    if (!hasCompositeInput) return true;

    // Guard-rail de UX para o caso mais sensível da tabela CRE:
    // Art. 149-A, caput I a V, c.c. §1º, II
    if (law === "CP" && article === "149-A") {
      const mainParagrafo = this._normalizeLegalDetail(context.paragrafo);
      const mainInciso = (context.inciso || "").trim().toUpperCase();
      const hasMainPar1Inc2 = mainParagrafo === "1" && mainInciso === "II";
      const hasMainCaputIav =
        (mainParagrafo === "" || mainParagrafo === "caput") &&
        ["I", "II", "III", "IV", "V"].includes(mainInciso);

      const related = context.relacionados || [];
      const hasRelatedCaputIav = related.some((r) => {
        const p = this._normalizeLegalDetail(r.paragrafo);
        const i = (r.inciso || "").trim().toUpperCase();
        return (
          (r.artigo || "").toUpperCase() === "149-A" &&
          (p === "" || p === "caput") &&
          ["I", "II", "III", "IV", "V"].includes(i)
        );
      });

      const hasRelatedPar1Inc2 = related.some((r) => {
        const p = this._normalizeLegalDetail(r.paragrafo);
        const i = (r.inciso || "").trim().toUpperCase();
        return (
          (r.artigo || "").toUpperCase() === "149-A" && p === "1" && i === "II"
        );
      });

      if (!hasMainPar1Inc2 && !hasMainCaputIav && hasRelatedPar1Inc2) {
        showToast(
          "No Art. 149-A c.c., informe no dispositivo principal §1, II ou um inciso do caput (I a V).",
          "warning",
          7000,
        );
        return false;
      }

      if (hasMainPar1Inc2 && !hasRelatedCaputIav) {
        showToast(
          "Falta informar, no bloco de combinação, um inciso do caput (I a V) do Art. 149-A.",
          "warning",
          6000,
        );
      }

      if (hasMainCaputIav && !hasRelatedPar1Inc2) {
        showToast(
          "Falta informar, no bloco de combinação, o Art. 149-A §1, inciso II.",
          "warning",
          6000,
        );
      }
    }

    return true;
  }

  /** @private
   * Normaliza o cenário CP 149-A c.c. para a forma esperada pela RPC v2.
   * Aceita entrada invertida do usuário:
   * - principal: caput I-V
   * - relacionado: §1 II
   * e converte para:
   * - principal: §1 II
   * - relacionado: caput I-V
   */
  _buildEffectiveCompositeQuery(context) {
    const base = {
      paragrafo: context.paragrafo,
      inciso: context.inciso,
      alinea: context.alinea,
      relacionados: context.relacionados,
    };

    const law = (this.selectedLaw || "").toUpperCase();
    const article = (context.artigo || "").toUpperCase();
    if (law !== "CP" || article !== "149-A") return base;

    const mainParagrafo = this._normalizeLegalDetail(context.paragrafo);
    const mainInciso = (context.inciso || "").trim().toUpperCase();
    const mainIsCaputIav =
      (mainParagrafo === "" || mainParagrafo === "caput") &&
      ["I", "II", "III", "IV", "V"].includes(mainInciso);

    const related = Array.isArray(context.relacionados)
      ? [...context.relacionados]
      : [];
    const findRelatedPar1Inc2Idx = related.findIndex((r) => {
      const p = this._normalizeLegalDetail(r?.paragrafo);
      const i = (r?.inciso || "").trim().toUpperCase();
      const a = (r?.artigo || "").toUpperCase();
      return a === "149-A" && p === "1" && i === "II";
    });

    // Caso invertido: usuário colocou caput no principal e §1 II em relacionados.
    if (mainIsCaputIav && findRelatedPar1Inc2Idx >= 0) {
      const normalizedRelated = related.filter(
        (_, idx) => idx !== findRelatedPar1Inc2Idx,
      );

      const alreadyHasMainAsRelated = normalizedRelated.some((r) => {
        const a = (r?.artigo || "").toUpperCase();
        const p = this._normalizeLegalDetail(r?.paragrafo);
        const i = (r?.inciso || "").trim().toUpperCase();
        return a === "149-A" && (p === "" || p === "caput") && i === mainInciso;
      });

      if (!alreadyHasMainAsRelated) {
        normalizedRelated.push({
          artigo: "149-A",
          paragrafo: "caput",
          inciso: mainInciso,
          alinea: null,
        });
      }

      return {
        paragrafo: "1",
        inciso: "II",
        alinea: context.alinea,
        relacionados: normalizedRelated,
      };
    }

    return base;
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
    const caputCheck = document.getElementById("ccCaputCheck");
    const paragrafoInput = document.getElementById("ccParagrafoInput");
    if (caputCheck && paragrafoInput) {
      const syncCcParagrafoState = () => {
        if (caputCheck.checked) {
          paragrafoInput.value = "";
          paragrafoInput.disabled = true;
          return;
        }
        paragrafoInput.disabled = false;
      };

      caputCheck.addEventListener("change", (e) => {
        syncCcParagrafoState();
      });

      paragrafoInput.addEventListener("input", () => {
        if (paragrafoInput.value.trim() !== "") {
          caputCheck.checked = false;
          paragrafoInput.disabled = false;
        }
      });

      syncCcParagrafoState();
    }
    if (addBtn) {
      addBtn.addEventListener("click", () => {
        this._addRelatedDeviceFromInputs();
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
  _readRelatedDraftInputs() {
    const artigo = (
      document.getElementById("ccArtigoInput")?.value || ""
    ).trim();
    const ccCaput = !!document.getElementById("ccCaputCheck")?.checked;
    const paragrafo = ccCaput
      ? "caput"
      : (document.getElementById("ccParagrafoInput")?.value || "").trim();
    const inciso = (
      document.getElementById("ccIncisoInput")?.value || ""
    ).trim();
    const alinea = (
      document.getElementById("ccAlineaInput")?.value || ""
    ).trim();

    return { artigo, paragrafo, inciso, alinea, ccCaput };
  }

  /** @private */
  _hasPendingRelatedDraft() {
    const draft = this._readRelatedDraftInputs();
    return !!(
      draft.artigo ||
      draft.paragrafo ||
      draft.inciso ||
      draft.alinea ||
      draft.ccCaput
    );
  }

  /** @private */
  _clearRelatedDraftInputs() {
    [
      "ccArtigoInput",
      "ccParagrafoInput",
      "ccIncisoInput",
      "ccAlineaInput",
    ].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    });

    const caputCheck = document.getElementById("ccCaputCheck");
    const paragrafoInput = document.getElementById("ccParagrafoInput");
    if (caputCheck) caputCheck.checked = false;
    if (paragrafoInput) paragrafoInput.disabled = false;
  }

  /** @private */
  _addRelatedDeviceFromInputs() {
    const draft = this._readRelatedDraftInputs();
    const artigoNormalizado = draft.artigo.toUpperCase();
    if (!artigoNormalizado) return false;

    const incisos = this._expandIncisoInput(draft.inciso);
    const novos = incisos.length > 0 ? incisos : [null];
    novos.forEach((inc) => {
      const item = {
        artigo: artigoNormalizado,
        paragrafo: draft.paragrafo || null,
        inciso: inc,
        alinea: draft.alinea || null,
      };
      const key = `${item.artigo}|${item.paragrafo || ""}|${item.inciso || ""}|${item.alinea || ""}`;
      const exists = this.relatedDevices.some((d) => {
        const k = `${d.artigo}|${d.paragrafo || ""}|${d.inciso || ""}|${d.alinea || ""}`;
        return k === key;
      });
      if (!exists) this.relatedDevices.push(item);
    });

    this._clearRelatedDraftInputs();
    this._renderRelatedDevices();
    return true;
  }

  /** @private */
  async _confirmPendingCompositeDraft() {
    if (!this._hasPendingRelatedDraft()) return true;

    const draft = this._readRelatedDraftInputs();
    if (!draft.artigo) {
      const action = await this._showConfirmDialog({
        title: "Campos c.c. sem artigo",
        message:
          "Há campos de combinação (c.c.) preenchidos sem 'Artigo relacionado'. Deseja pesquisar sem adicionar esse rascunho?",
        primaryLabel: "Pesquisar assim",
        secondaryLabel: "Voltar",
      });
      return action === "primary";
    }

    const action = await this._showConfirmDialog({
      title: "Adicionar combinação antes da busca?",
      message:
        "Você preencheu o bloco c.c. e ainda não clicou em 'Adicionar'. Deseja adicionar agora e incluir nesta pesquisa?",
      primaryLabel: "Adicionar e pesquisar",
      secondaryLabel: "Pesquisar sem adicionar",
    });

    if (action === "primary") {
      this._addRelatedDeviceFromInputs();
    }

    return action !== "dismiss";
  }

  /** @private */
  _showConfirmDialog({
    title = "Confirmar ação",
    message = "",
    primaryLabel = "Confirmar",
    secondaryLabel = "Cancelar",
  }) {
    return new Promise((resolve) => {
      const overlay = document.getElementById("confirmDialogOverlay");
      const titleEl = document.getElementById("confirmDialogTitle");
      const messageEl = document.getElementById("confirmDialogMessage");
      const btnPrimary = document.getElementById("confirmDialogPrimary");
      const btnSecondary = document.getElementById("confirmDialogSecondary");
      const btnClose = document.getElementById("confirmDialogClose");

      if (
        !overlay ||
        !titleEl ||
        !messageEl ||
        !btnPrimary ||
        !btnSecondary ||
        !btnClose
      ) {
        resolve("dismiss");
        return;
      }

      titleEl.textContent = title;
      messageEl.textContent = message;
      btnPrimary.textContent = primaryLabel;
      btnSecondary.textContent = secondaryLabel;

      const cleanup = () => {
        overlay.classList.add("hidden");
        overlay.setAttribute("aria-hidden", "true");
        btnPrimary.removeEventListener("click", onPrimary);
        btnSecondary.removeEventListener("click", onSecondary);
        btnClose.removeEventListener("click", onDismiss);
        overlay.removeEventListener("click", onOverlay);
        document.removeEventListener("keydown", onEsc);
      };

      const onPrimary = () => {
        cleanup();
        resolve("primary");
      };
      const onSecondary = () => {
        cleanup();
        resolve("secondary");
      };
      const onDismiss = () => {
        cleanup();
        resolve("dismiss");
      };
      const onOverlay = (e) => {
        if (e.target === overlay) onDismiss();
      };
      const onEsc = (e) => {
        if (e.key === "Escape") onDismiss();
      };

      btnPrimary.addEventListener("click", onPrimary);
      btnSecondary.addEventListener("click", onSecondary);
      btnClose.addEventListener("click", onDismiss);
      overlay.addEventListener("click", onOverlay);
      document.addEventListener("keydown", onEsc);

      overlay.classList.remove("hidden");
      overlay.setAttribute("aria-hidden", "false");
      btnPrimary.focus();
    });
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
        if (item.paragrafo) {
          const p = this._normalizeLegalDetail(item.paragrafo);
          parts.push(p === "caput" ? "caput" : `§ ${item.paragrafo}`);
        }
        if (item.inciso) parts.push(`Inc. ${item.inciso}`);
        if (item.alinea) parts.push(`Alínea ${item.alinea}`);
        return `
          <li>
            <button type="button" class="cc-remove-inline-btn" data-related-remove="${idx}" aria-label="Remover dispositivo relacionado">
              <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                </path>
              </svg>
            </button>
            <span class="cc-related-item-text">${parts.join(", ")}</span>
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
