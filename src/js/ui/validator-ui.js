import { validatorService } from '../services/validator-service.js';

/**
 * Controller da Interface de Validação.
 * Gerencia os Dropdowns (Leis e Artigos) e a exibição de resultados.
 * @version 2.0.0 - Supabase Edition
 */
export class ValidatorUI {
    constructor() {
        /** @type {HTMLSelectElement} */
        this.leiSelect = document.querySelector('#leiSelect');
        /** @type {HTMLSelectElement} */
        this.artigoSelect = document.querySelector('#artigoSelect');
        /** @type {HTMLElement} */
        this.resultContainer = document.querySelector('#validator-result');

        /** @type {string|null} Código da lei selecionada */
        this.selectedLaw = null;

        console.log('[ValidatorUI] Constructor - leiSelect:', !!this.leiSelect, 'artigoSelect:', !!this.artigoSelect);
    }

    /**
     * Inicializa o componente.
     * Aguarda inicialização do serviço (agora async para Supabase).
     */
    async init() {
        console.log('[ValidatorUI] init() chamado');

        // Mostrar loading
        if (this.leiSelect) {
            this.leiSelect.innerHTML = '<option value="">Carregando leis...</option>';
            this.leiSelect.disabled = true;
        }

        // Inicializar serviço (agora é async)
        const serviceReady = await validatorService.init();

        if (!serviceReady) {
            console.error('[ValidatorUI] ERRO: validatorService.init() retornou false');
            if (this.leiSelect) {
                this.leiSelect.innerHTML = '<option value="">Erro: Dados indisponíveis</option>';
            }
            return;
        }

        console.log('[ValidatorUI] Service OK. Carregando leis...');

        await this.setupLeiSelect();
        this.setupArtigoSelect();

        console.log('[ValidatorUI] Inicialização COMPLETA');
    }

    /**
     * Configura o Dropdown de Leis com os dados do serviço.
     */
    async setupLeiSelect() {
        if (!this.leiSelect) {
            console.error('[ValidatorUI] ERRO: #leiSelect não encontrado no DOM!');
            return;
        }

        // Buscar leis (agora é async)
        const laws = await validatorService.getLaws();
        console.log('[ValidatorUI] setupLeiSelect - laws encontradas:', laws.length);

        // Limpa opções
        this.leiSelect.innerHTML = '<option value="" selected>Selecione a lei ou código...</option>';
        this.leiSelect.disabled = false;

        // Renderizar opções
        laws.forEach(law => {
            const option = document.createElement('option');
            option.value = law.codigo;
            option.textContent = law.nome;
            this.leiSelect.appendChild(option);
        });

        console.log('[ValidatorUI] Opções adicionadas ao select:', this.leiSelect.options.length);

        // Evento de Mudança
        this.leiSelect.addEventListener('change', async (e) => {
            const codigo = e.target.value;
            const nome = e.target.options[e.target.selectedIndex].text;

            if (codigo) {
                await this.selectLaw(codigo, nome);
                // Esconder a setinha indicadora após primeira seleção
                const arrowIndicator = document.getElementById('leiArrowIndicator');
                if (arrowIndicator) {
                    arrowIndicator.classList.remove('show');
                }
            } else {
                // Reset se selecionar "Selecione..."
                this.artigoSelect.innerHTML = '<option value="" selected>Selecione primeiro a lei...</option>';
                this.artigoSelect.disabled = true;
                this.hideResult();
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
        this.artigoSelect.innerHTML = '<option value="">Carregando artigos...</option>';
        this.artigoSelect.disabled = true;

        // Buscar artigos (agora é async)
        const articles = await validatorService.getArticlesByLaw(lawCode);

        this.artigoSelect.innerHTML = '<option value="" selected>Selecione o artigo...</option>';

        articles.forEach(art => {
            const option = document.createElement('option');
            option.value = art;
            option.textContent = `Art. ${art}`;
            this.artigoSelect.appendChild(option);
        });

        this.artigoSelect.disabled = false;

        // Feedback visual
        this.artigoSelect.classList.add('ring-2', 'ring-primary-200');
        setTimeout(() => this.artigoSelect.classList.remove('ring-2', 'ring-primary-200'), 1000);
    }

    /**
     * Configura o listener do select de artigos.
     */
    setupArtigoSelect() {
        if (!this.artigoSelect) return;

        this.artigoSelect.addEventListener('change', async (e) => {
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
        // Mostrar loading no resultado
        if (this.resultContainer) {
            this.resultContainer.innerHTML = `
                <div class="p-6 text-center text-neutral-500">
                    <div class="animate-spin inline-block w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full mb-2"></div>
                    <p>Verificando elegibilidade...</p>
                </div>
            `;
            this.resultContainer.classList.remove('hidden');
        }

        // Buscar resultado (agora via Supabase RPC)
        const result = await validatorService.verifyEligibility(this.selectedLaw, artigoNum);

        this.renderResult(result, artigoNum);
    }

    /**
     * Renderiza o resultado da verificação
     * @param {object} result Resultado da verificação
     * @param {string} artigoNum Número do artigo
     */
    renderResult(result, artigoNum) {
        if (!this.resultContainer) return;

        const isInelegivel = result.resultado === 'INELEGIVEL';
        const isElegivel = result.resultado === 'ELEGIVEL';
        const naoConsta = result.resultado === 'NAO_CONSTA';

        let cardClass, iconPath, statusText, statusClass;

        if (isInelegivel) {
            cardClass = 'border-danger-500 bg-red-50';
            statusClass = 'bg-danger-200 text-danger-800';
            statusText = 'GERA INELEGIBILIDADE';
            iconPath = 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z';
        } else if (isElegivel) {
            cardClass = 'border-success-500 bg-green-50';
            statusClass = 'bg-success-200 text-success-800';
            statusText = 'NÃO GERA INELEGIBILIDADE';
            iconPath = 'M5 13l4 4L19 7';
        } else {
            cardClass = 'border-warning-500 bg-yellow-50';
            statusClass = 'bg-warning-200 text-warning-800';
            statusText = 'NÃO CONSTA NA TABELA';
            iconPath = 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
        }

        const html = `
            <div class="validator-card border-l-4 ${cardClass} p-6 rounded-lg shadow-sm animate-fade-in">
                <div class="flex items-start gap-4">
                    <div class="flex-shrink-0 mt-1">
                        <div class="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm ${isInelegivel ? 'text-danger-600' : isElegivel ? 'text-success-600' : 'text-warning-600'}">
                            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${iconPath}"></path>
                            </svg>
                        </div>
                    </div>
                    <div class="flex-1">
                        <span class="inline-block px-3 py-1 text-xs font-bold tracking-wider uppercase rounded-full mb-2 ${statusClass}">
                            ${statusText}
                        </span>
                        <h3 class="text-xl font-bold ${isInelegivel ? 'text-danger-900' : isElegivel ? 'text-success-900' : 'text-warning-900'} mb-2">
                            ${this.selectedLaw} - Art. ${artigoNum}
                        </h3>
                        <div class="space-y-3">
                            ${result.tipo_crime ? `
                            <div>
                                <span class="text-xs font-semibold text-neutral-500 uppercase">Tipo de Crime</span>
                                <p class="text-neutral-800 font-medium">${result.tipo_crime}</p>
                            </div>
                            ` : ''}
                            <div>
                                <span class="text-xs font-semibold text-neutral-500 uppercase">Fundamentação</span>
                                <p class="text-neutral-700 text-sm">${result.motivo || 'Consulte a tabela oficial para mais detalhes.'}</p>
                            </div>
                            ${result.observacoes ? `
                            <div class="mt-3 p-3 bg-white/50 rounded border border-neutral-200">
                                <span class="text-xs font-semibold text-neutral-500 uppercase">Observações</span>
                                <p class="text-neutral-600 text-sm">${result.observacoes}</p>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
                <div class="mt-4 pt-4 border-t border-dashed ${isInelegivel ? 'border-danger-200' : isElegivel ? 'border-success-200' : 'border-warning-200'} text-xs text-neutral-500 text-right">
                    Fonte: Tabela CRE-RO/TRE-SP via Supabase
                </div>
            </div>
        `;

        this.resultContainer.innerHTML = html;
        this.resultContainer.classList.remove('hidden');
        this.resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    /** Oculta o container de resultados */
    hideResult() {
        if (this.resultContainer) {
            this.resultContainer.classList.add('hidden');
            this.resultContainer.innerHTML = '';
        }
    }
}
