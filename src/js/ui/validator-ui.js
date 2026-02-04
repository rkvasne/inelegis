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
      // Melhoria: Mostrar Código + Nome Completo
      const displayName =
        law.nome === law.nome_completo
          ? law.nome
          : `${law.nome} - ${law.nome_completo}`;
      option.textContent = displayName;
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

    // Setup dos campos complementares (Parágrafo, Inciso, Alínea)
    this.setupComplementaryFields();
  }

  /**
   * Configura listeners para os campos complementares (se existirem)
   */
  setupComplementaryFields() {
    const fields = ["paragrafoInput", "incisoInput", "alineaInput"];
    fields.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("input", () => {
          // Debounce para não validar a cada tecla loucamente
          if (this._debounceTimer) clearTimeout(this._debounceTimer);
          this._debounceTimer = setTimeout(() => {
            const artigoNum = this.artigoSelect.value;
            if (artigoNum && this.selectedLaw) {
              this.validateSelection(artigoNum);
            }
          }, 500);
        });
      }
    });
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
      const artigoNum = e.target.value;
      if (artigoNum) {
        await this.validateSelection(artigoNum);
      } else {
        this.hideResult();
      }
    });
  }

  /**
   * Busca os detalhes do artigo e renderiza o card de resultado.
   * @param {string} artigoNum Número do artigo selecionado
   */
  async validateSelection(artigoNum) {
    // Coletar complementos
    const paragrafo = document.getElementById("paragrafoInput")?.value || null;
    const inciso = document.getElementById("incisoInput")?.value || null;
    const alinea = document.getElementById("alineaInput")?.value || null;

    // Mostrar loading no resultado
    if (this.resultContainer) {
      const filters = [];
      if (paragrafo) filters.push(`Parágrafo ${paragrafo}`);
      if (inciso) filters.push(`Inciso ${inciso}`);
      if (alinea) filters.push(`Alínea ${alinea}`);
      const filterText =
        filters.length > 0 ? `Filtrando por: ${filters.join(", ")}` : "";

      this.resultContainer.innerHTML = `
                <div class="p-6 text-center text-neutral-500">
                    <div class="animate-spin inline-block w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full mb-2"></div>
                    <p>Verificando elegibilidade...</p>
                    ${filterText ? `<p class="text-xs text-neutral-400 mt-1">${filterText}</p>` : ""}
                </div>
            `;
      this.resultContainer.classList.remove("hidden");
    }

    // Buscar resultado (agora via Supabase RPC incluindo todos os complementos)
    const result = await validatorService.verifyEligibility(
      this.selectedLaw,
      artigoNum,
      paragrafo,
      inciso,
      alinea,
    );

    // Registrar no Histórico e Analytics
    if (typeof SearchHistory !== "undefined") {
      SearchHistory.add({
        lei: this.selectedLaw,
        artigo: artigoNum,
        resultado: result.resultado.toLowerCase(),
        tipoCrime: result.tipo_crime,
        observacoes: result.observacoes || result.motivo,
      });
    }

    if (typeof Analytics !== "undefined") {
      Analytics.trackSearch({
        lei: this.selectedLaw,
        artigo: artigoNum,
        resultado: result.resultado.toLowerCase(),
        temExcecao: result.resultado === "ELEGIVEL",
      });
    }

    this.renderResult(result, artigoNum, paragrafo, inciso, alinea);
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
    if (!this.resultContainer) return;

    const isInelegivel = result.resultado === "INELEGIVEL";
    const isElegivel = result.resultado === "ELEGIVEL";
    const naoConsta = result.resultado === "NAO_CONSTA";

    let cardClass, statusText, statusClass, iconColor;

    if (isInelegivel) {
      cardClass = "border-danger-500 bg-white";
      statusClass = "bg-danger-600 text-white";
      statusText = "INELEGÍVEL";
      iconColor = "text-danger-600";
    } else if (isElegivel) {
      cardClass = "border-success-500 bg-white";
      statusClass = "bg-success-600 text-white";
      statusText = "ELEGÍVEL (EXCEÇÃO)";
      iconColor = "text-success-600";
    } else {
      cardClass = "border-warning-500 bg-white";
      statusClass = "bg-warning-500 text-white";
      statusText = "NÃO CONSTA";
      iconColor = "text-warning-600";
    }

    // Formatar incidência
    let incidencia = `Art. ${artigoNum}`;
    if (p) incidencia += `, § ${p}`;
    if (i) incidencia += `, Inc. ${i}`;
    if (a) incidencia += `, Alínea ${a}`;

    const html = `
            <div class="validator-card border-t-8 ${cardClass} p-0 rounded-xl shadow-lg animate-fade-in overflow-hidden">
                <div class="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
                    <span class="inline-block px-4 py-1.5 text-xs font-bold tracking-widest uppercase rounded-lg ${statusClass} shadow-sm">
                        ${statusText}
                    </span>
                    <span class="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Resultado da Análise Digital</span>
                </div>
                
                <div class="p-0">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-neutral-100/80">
                                <th class="p-4 text-[10px] font-black text-neutral-600 uppercase tracking-tighter border-r border-neutral-200 w-1/3">NORMA / INCIDÊNCIA</th>
                                <th class="p-4 text-[10px] font-black text-neutral-600 uppercase tracking-tighter border-r border-neutral-200 w-1/3">EXCEÇÕES</th>
                                <th class="p-4 text-[10px] font-black text-neutral-600 uppercase tracking-tighter w-1/3">CRIMES (LC 64/90, 1º, I, "e")</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="p-5 align-top border-r border-neutral-100">
                                    <h4 class="text-sm font-bold text-neutral-900 mb-1">${this.selectedLawName}</h4>
                                    <p class="text-lg font-black text-primary-700 leading-tight">${incidencia}</p>
                                </td>
                                <td class="p-5 align-top border-r border-neutral-100">
                                    ${isElegivel
        ? `<div class="flex items-start gap-2 text-success-700 bg-success-50 p-2 rounded border border-success-100">
                                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="mt-0.5">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                            <div>
                                                <p class="text-xs font-bold uppercase tracking-tight">Consta como Exceção</p>
                                                <p class="text-[11px] leading-tight mt-1">${result.observacoes || "Este dispositivo é uma exceção à regra de inelegibilidade."}</p>
                                            </div>
                                           </div>`
        : `<p class="text-xs text-neutral-400 italic">Nenhuma exceção aplicada para este dispositivo.</p>`
      }
                                </td>
                                <td class="p-5 align-top">
                                    <p class="text-sm font-bold text-neutral-800 leading-snug">${result.tipo_crime || "---"}</p>
                                    ${result.motivo ? `<p class="text-[10px] text-neutral-500 mt-2 leading-tight bg-neutral-50 p-2 rounded">${result.motivo}</p>` : ""}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                ${result.observacoes && !isElegivel
        ? `
                    <div class="px-6 py-4 bg-neutral-50/50 border-t border-neutral-100">
                        <span class="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Notas Adicionais / Jurisprudência</span>
                        <p class="text-xs text-neutral-600 leading-relaxed">${result.observacoes}</p>
                    </div>
                    `
        : ""
      }

                <div class="px-6 py-3 border-t border-neutral-100 bg-white flex justify-between items-center">
                    <div class="flex items-center gap-2">
                        <div class="w-1.5 h-1.5 rounded-full ${isInelegivel ? "bg-danger-500" : isElegivel ? "bg-success-500" : "bg-warning-500"} animate-pulse"></div>
                        <span class="text-[10px] text-neutral-400 font-medium">Fonte Corregedoria-Geral Eleitoral • Base Supabase</span>
                    </div>
                    <button class="text-xs font-bold text-primary-600 hover:text-primary-800 transition-colors uppercase tracking-widest" 
                            onclick="document.getElementById('artigoSelect').value=''; document.getElementById('validator-result').classList.add('hidden'); window.scrollTo({top: 0, behavior: 'smooth'});">
                        Refazer Consulta
                    </button>
                </div>
            </div>
        `;

    this.resultContainer.innerHTML = html;
    this.resultContainer.classList.remove("hidden");
    this.resultContainer.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }

  /** Oculta o container de resultados */
  hideResult() {
    if (this.resultContainer) {
      this.resultContainer.classList.add("hidden");
      this.resultContainer.innerHTML = "";
    }
  }
}
