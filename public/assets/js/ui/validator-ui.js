import { validatorService } from "../services/validator-service.js";

/**
 * Controller da Interface de Validação.
 * Gerencia os Dropdowns (Leis e Artigos) e a exibição de resultados.
 * @version 2.0.0 - Supabase Edition
 */
export class ValidatorUI {
  constructor() {
    /** @type {HTMLSelectElement} */
    this.leiSelect = document.querySelector("#leiSelect");
    /** @type {HTMLSelectElement} */
    this.artigoSelect = document.querySelector("#artigoSelect");
    /** @type {HTMLElement} */
    this.resultContainer = document.querySelector("#validator-result");

    /** @type {string|null} Código da lei selecionada */
    this.selectedLaw = null;
    /** @type {string|null} Nome amigável da lei selecionada */
    this.selectedLawName = null;

    console.log(
      "[ValidatorUI] Constructor - leiSelect:",
      !!this.leiSelect,
      "artigoSelect:",
      !!this.artigoSelect,
    );
  }

  /**
   * Inicializa o componente.
   * Aguarda inicialização do serviço (agora async para Supabase).
   */
  async init() {
    console.log("[ValidatorUI] init() chamado");

    // Mostrar loading
    if (this.leiSelect) {
      this.leiSelect.innerHTML = '<option value="">Carregando leis...</option>';
      this.leiSelect.disabled = true;
    }

    // Inicializar serviço (agora é async)
    const serviceReady = await validatorService.init();

    if (!serviceReady) {
      console.error(
        "[ValidatorUI] ERRO: validatorService.init() retornou false",
      );
      if (this.leiSelect) {
        this.leiSelect.innerHTML =
          '<option value="">Erro: Dados indisponíveis</option>';
      }
      return;
    }

    console.log("[ValidatorUI] Service OK. Carregando leis...");

    await this.setupLeiSelect();
    this.setupArtigoSelect();

    console.log("[ValidatorUI] Inicialização COMPLETA");
  }

  /**
   * Configura o Dropdown de Leis com os dados do serviço.
   */
  async setupLeiSelect() {
    if (!this.leiSelect) {
      console.error("[ValidatorUI] ERRO: #leiSelect não encontrado no DOM!");
      return;
    }

    // Buscar leis (agora é async)
    const laws = await validatorService.getLaws();
    console.log(
      "[ValidatorUI] setupLeiSelect - laws encontradas:",
      laws.length,
    );

    // Limpa opções
    this.leiSelect.innerHTML =
      '<option value="" selected>Selecione a lei ou código...</option>';
    this.leiSelect.disabled = false;

    // Renderizar opções
    laws.forEach((law) => {
      const option = document.createElement("option");
      option.value = law.codigo;
      // A coluna 'lei' já contém o nome completo (ex: "Código Penal (DL 2.848/40)")
      option.textContent = law.lei;
      this.leiSelect.appendChild(option);
    });

    console.log(
      "[ValidatorUI] Opções adicionadas ao select:",
      this.leiSelect.options.length,
    );

    // Evento de Mudança
    this.leiSelect.addEventListener("change", async (e) => {
      const codigo = e.target.value;
      const nome = e.target.options[e.target.selectedIndex].text;

      if (codigo) {
        // Agora usamos o texto completo do option, confiando no nome amigável vindo do banco
        const lawName = e.target.options[e.target.selectedIndex].textContent;
        await this.selectLaw(codigo, lawName);
        // Esconder a setinha indicadora após primeira seleção
        const arrowIndicator = document.getElementById("leiArrowIndicator");
        if (arrowIndicator) {
          arrowIndicator.classList.remove("show");
        }
      } else {
        // Reset se selecionar "Selecione..."
        this.artigoSelect.innerHTML =
          '<option value="" selected>Selecione primeiro a lei...</option>';
        this.artigoSelect.disabled = true;
        this.hideResult();
      }
    });

    // Setup Checkbox Parágrafo Único
    const checkUnico = document.getElementById("paragrafoUnicoCheck");
    const inputParagrafo = document.getElementById("paragrafoInput");
    if (checkUnico && inputParagrafo) {
      checkUnico.addEventListener("change", (e) => {
        inputParagrafo.disabled = e.target.checked;
        if (e.target.checked) inputParagrafo.value = "";
      });
    }

    // Setup dos botões de ação (Pesquisar / Limpar)
    this.setupActionButtons();
  }

  /**
   * Configura listeners para os botões de ação.
   */
  setupActionButtons() {
    // Listener para o botão Limpar
    const btnClear = document.getElementById("btnClearSearch");
    if (btnClear) {
      btnClear.addEventListener("click", () => this.clearSearch());
    }

    // Listener para o botão Pesquisar
    const btnPesquisar = document.getElementById("btnPesquisar");
    if (btnPesquisar) {
      btnPesquisar.addEventListener("click", () => {
        const artigoNum = this.artigoSelect?.value;
        if (this.selectedLaw && artigoNum) {
          this.validateSelection(artigoNum);
        } else {
          // Feedback visual se tentar pesquisar sem selecionar
          if (!this.selectedLaw && this.leiSelect) {
            this.leiSelect.classList.add("ring-2", "ring-red-500");
            setTimeout(
              () => this.leiSelect.classList.remove("ring-2", "ring-red-500"),
              1000,
            );
          } else if (!artigoNum && this.artigoSelect) {
            this.artigoSelect.classList.add("ring-2", "ring-red-500");
            setTimeout(
              () =>
                this.artigoSelect.classList.remove("ring-2", "ring-red-500"),
              1000,
            );
          }
        }
      });
    }
  }

  /**
   * Reseta todos os campos de busca e resultados
   */
  clearSearch() {
    // Reset Selects
    if (this.leiSelect) this.leiSelect.value = "";
    if (this.artigoSelect) {
      this.artigoSelect.innerHTML =
        '<option value="" selected>Selecione primeiro a lei...</option>';
      this.artigoSelect.disabled = true;
    }

    // Reset Inputs de Refinamento
    ["paragrafoInput", "incisoInput", "alineaInput"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    });

    const checkUnico = document.getElementById("paragrafoUnicoCheck");
    if (checkUnico) checkUnico.checked = false;

    // Reset Estado Interno
    this.selectedLaw = null;
    this.selectedLawName = null;

    // Esconder resultados
    this.hideResult();

    // Mostrar seta indicadora novamente
    const arrowIndicator = document.getElementById("leiArrowIndicator");
    if (arrowIndicator) arrowIndicator.classList.add("show");

    console.log("[ValidatorUI] Busca limpa com sucesso");
  }

  /**
   * Manipula a seleção de uma lei.
   * @param {string} codigo Código interno da lei
   * @param {string} nome Nome de exibição
   */
  async selectLaw(codigo, nome) {
    this.selectedLaw = codigo;
    this.selectedLawName = nome;
    await this.populateArtigoSelect(codigo);
    this.hideResult();
  }

  /**
   * Preenche o select de artigos baseado na lei escolhida.
   * @param {string} lawCode
   */
  async populateArtigoSelect(lawCode) {
    if (!this.artigoSelect) return;

    // Mostrar loading
    this.artigoSelect.innerHTML =
      '<option value="">Carregando artigos...</option>';
    this.artigoSelect.disabled = true;

    // Buscar artigos (agora é async)
    const articles = await validatorService.getArticlesByLaw(lawCode);

    if (articles.length === 0) {
      this.artigoSelect.innerHTML =
        '<option value="" disabled selected>Lei sem artigos restritivos mapeados</option>';
      this.artigoSelect.disabled = true;
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

    // Feedback visual
    this.artigoSelect.classList.add("ring-2", "ring-primary-200");
    setTimeout(
      () => this.artigoSelect.classList.remove("ring-2", "ring-primary-200"),
      1000,
    );
  }

  /**
   * Configura o listener do select de artigos.
   */
  setupArtigoSelect() {
    if (!this.artigoSelect) return;

    this.artigoSelect.addEventListener("change", async (e) => {
      // Apenas esconde resultado anterior se houver mudança, mas não dispara busca
      this.hideResult();
    });
  }

  /**
   * Busca os detalhes do artigo e renderiza o card de resultado.
   * @param {string} artigoNum Número do artigo selecionado
   */
  async validateSelection(artigoNum) {
    // Coletar complementos
    const paragrafoUnico = document.getElementById(
      "paragrafoUnicoCheck",
    )?.checked;
    const paragrafo = paragrafoUnico
      ? "unico"
      : document.getElementById("paragrafoInput")?.value || null;
    const inciso = document.getElementById("incisoInput")?.value || null;
    const alinea = document.getElementById("alineaInput")?.value || null;

    // Mostrar loading no resultado
    if (this.resultContainer) {
      this.resultContainer.innerHTML = ""; // Limpar qualquer resquício fixo
      this.resultContainer.classList.add("hidden");
    }

    // Feedback visual opcional (silencioso) se necessário, mas removemos o texto fixo "Verificando..."
    // Chamar o serviço
    try {
      const result = await validatorService.verifyEligibility(
        this.selectedLaw,
        artigoNum,
        paragrafo,
        inciso,
        alinea,
      );

      this.renderResult(result, artigoNum, paragrafo, inciso, alinea);
    } catch (error) {
      console.error("[ValidatorUI] Erro ao validar:", error);
    }
  }

  /**
   * Renderiza o resultado da verificação
   * @param {object} result Resultado da verificação
   * @param {string} artigoNum Número do artigo
   * @param {string} p Parágrafo
   * @param {string} i Inciso
   * @param {string} a Alínea
   */
  renderResult(result, artigoNum, p, i, a) {
    const isInelegivel = result.resultado === "INELEGIVEL";
    const isElegivel = result.resultado === "ELEGIVEL";
    const naoConsta = result.resultado === "NAO_CONSTA";

    // Coletar tipo de comunicação para ASE
    const tipoComunicacao = document.querySelector(
      'input[name="tipoComunicacao"]:checked',
    )?.value;

    // Configurações visuais baseadas no resultado
    let statusClass = "";
    let statusText = "";
    let statusIcon = "";
    let iconBgClass = "";
    let iconColorClass = "";

    if (isInelegivel) {
      statusClass = "ineligible";
      statusText = "INELEGÍVEL";
      iconBgClass = "legend-icon-ineligible";
      iconColorClass = "text-danger";
      statusIcon = `<svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>`;
    } else if (isElegivel) {
      statusClass = "eligible";
      statusText = "ELEGÍVEL";
      iconBgClass = "legend-icon-eligible";
      iconColorClass = "text-success";
      statusIcon = `<svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>`;
    } else {
      statusClass = "not-found";
      statusText = "NÃO ENCONTRADO";
      iconBgClass = "legend-icon-not-found";
      iconColorClass = "text-warning";
      statusIcon = `<svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>`;
    }

    // Formatar incidência
    let incidencia = `Art. ${artigoNum}`;
    if (p) incidencia += `, § ${p}`;
    if (i) incidencia += `, Inc. ${i}`;
    if (a) incidencia += `, Alínea ${a}`;

    // Construir Conteúdo do Modal
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
            <p class="info-value">${result.tipo_crime || "Não consta crime impeditivo"}${result.item_alinea_e ? ` (${result.item_alinea_e})` : ""}</p>
          </div>
          <div class="info-card info-card-compact">
            <span class="info-label">NORMA/INCIDÊNCIA</span>
            <p class="info-value">${incidencia}</p>
            <p class="info-subtext">${this.selectedLawName}</p>
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
          <span class="ase-value">${tipoComunicacao === "condenacao"
        ? `ASE 337 - Motivo ${isInelegivel ? "7" : "2"}: Condenação criminal`
        : "Consulte o manual para este tipo de comunicação"
      }</span>
        </div>

        <!-- Disclaimer de Exceções -->
        ${result.excecoes_detalhes
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
                ${result.excecoes_detalhes}
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
      // Atualizar subtítulo do modal com a lei
      const subtitle = document.getElementById("modalSubtitle");
      if (subtitle) subtitle.textContent = this.selectedLawName;

      const title = document.getElementById("modalTitle");
      if (title) title.textContent = "Resultado da Consulta";

      window.ModalManager.open(statusClass, statusText, bodyHTML);
    }
  }

  /** Oculta o container de resultados */
  hideResult() {
    if (this.resultContainer) {
      this.resultContainer.classList.add("hidden");
      this.resultContainer.innerHTML = "";
    }
  }
}
