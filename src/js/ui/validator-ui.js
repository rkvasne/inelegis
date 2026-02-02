import { validatorService } from '../services/validator-service.js';

/**
 * Controller da Interface de Validação.
 * Gerencia os Dropdowns (Leis e Artigos) e a exibição de resultados.
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
     * Aguarda o carregamento dos dados e configura os listeners.
     */
    async init() {
        console.log('[ValidatorUI] init() chamado');
        console.log('[ValidatorUI] Estado inicial - __INELEG_NORMALIZADO__:', !!window.__INELEG_NORMALIZADO__);

        // Mecanismo de Retry para aguardar carregamento dos dados (corrige Race Condition)
        let attempts = 0;
        const maxAttempts = 20; // 20 * 100ms = 2 segundos

        while (!window.__INELEG_NORMALIZADO__ && !window.DataNormalizer && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }

        console.log('[ValidatorUI] Após espera - attempts:', attempts, 'dados:', {
            hasNormalizado: !!window.__INELEG_NORMALIZADO__,
            hasDataNormalizer: !!window.DataNormalizer,
            length: window.__INELEG_NORMALIZADO__?.length || 0
        });

        if (!validatorService.init()) {
            console.error('[ValidatorUI] ERRO: validatorService.init() retornou false');
            if (this.leiSelect) {
                this.leiSelect.innerHTML = '<option value="">Erro: Dados indisponíveis</option>';
                this.leiSelect.disabled = true;
            }
            return;
        }

        console.log('[ValidatorUI] Service OK. Chamando setupLeiSelect()...');

        this.setupLeiSelect();
        this.setupArtigoSelect();

        console.log('[ValidatorUI] Inicialização COMPLETA');
    }

    /**
     * Configura o Dropdown de Leis com os dados do serviço.
     */
    setupLeiSelect() {
        const laws = validatorService.getLaws();
        console.log('[ValidatorUI] setupLeiSelect - laws encontradas:', laws.length, laws);

        if (!this.leiSelect) {
            console.error('[ValidatorUI] ERRO: #leiSelect não encontrado no DOM!');
            return;
        }

        // Limpa opções (mantendo a primeira)
        this.leiSelect.innerHTML = '<option value="" selected>Selecione a lei ou código...</option>';

        // Renderizar opções
        laws.forEach(law => {
            const option = document.createElement('option');
            option.value = law.codigo;
            option.textContent = law.nome;
            this.leiSelect.appendChild(option);
        });

        console.log('[ValidatorUI] Opções adicionadas ao select:', this.leiSelect.options.length);

        // Evento de Mudança Simplificado
        this.leiSelect.addEventListener('change', (e) => {
            const codigo = e.target.value;
            const nome = e.target.options[e.target.selectedIndex].text;

            if (codigo) {
                this.selectLaw(codigo, nome);
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
     * @param {string} nome Nome de exibição (não usado logicamente, mas útil para debug)
     */
    selectLaw(codigo, nome) {
        this.selectedLaw = codigo;
        // Resetar e Popular Artigos
        this.populateArtigoSelect(codigo);
        this.hideResult();
    }

    /**
     * Preenche o select de artigos baseado na lei escolhida.
     * @param {string} lawCode 
     */
    populateArtigoSelect(lawCode) {
        if (!this.artigoSelect) return;

        const articles = validatorService.getArticlesByLaw(lawCode);

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

        this.artigoSelect.addEventListener('change', (e) => {
            const artigoNum = e.target.value;
            if (artigoNum) {
                this.validateSelection(artigoNum);
            } else {
                this.hideResult();
            }
        });
    }

    /**
     * Busca os detalhes do artigo e renderiza o card de resultado.
     * @param {string} artigoNum Número do artigo selecionado
     */
    validateSelection(artigoNum) {
        const detailsList = validatorService.getArticleDetails(this.selectedLaw, artigoNum);

        if (!detailsList || detailsList.length === 0) {
            return;
        }

        const detail = detailsList[0];
        const isInelegivel = true; // Por definição, estar na lista implica potencial inelegibilidade

        const html = `
            <div class="validator-card border-l-4 ${isInelegivel ? 'border-danger-500 bg-red-50' : 'border-success-500 bg-green-50'} p-6 rounded-lg shadow-sm animate-fade-in">
                <div class="flex items-start gap-4">
                    <div class="flex-shrink-0 mt-1">
                        <div class="w-12 h-12 rounded-full ${isInelegivel ? 'bg-white text-danger-600' : 'bg-white text-success-600'} flex items-center justify-center shadow-sm">
                            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${isInelegivel ? 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' : 'M5 13l4 4L19 7'}"></path>
                            </svg>
                        </div>
                    </div>
                    <div class="flex-1">
                        <span class="inline-block px-3 py-1 text-xs font-bold tracking-wider uppercase rounded-full mb-2 ${isInelegivel ? 'bg-danger-200 text-danger-800' : 'bg-success-200 text-success-800'}">
                            ${isInelegivel ? 'Atenção' : 'Info'}
                        </span>
                        <h3 class="text-xl font-bold ${isInelegivel ? 'text-danger-900' : 'text-success-900'} mb-2">
                            GERA INELEGIBILIDADE (ASE 337)
                        </h3>
                        <div class="space-y-3">
                            <div>
                                <span class="text-xs font-semibold text-neutral-500 uppercase">Natureza do Crime</span>
                                <p class="text-neutral-800 font-medium">${detail.crime}</p>
                            </div>
                            <div>
                                <span class="text-xs font-semibold text-neutral-500 uppercase">Base Legal</span>
                                <p class="text-neutral-700 font-mono text-sm bg-white/50 p-1 rounded">${detail.norma_completa}</p>
                            </div>
                        </div>

                        ${detail.excecoes && detail.excecoes.length > 0 ? `
                            <div class="mt-4 p-4 bg-white rounded-md border border-neutral-200 shadow-sm">
                                <div class="flex items-center gap-2 mb-2 text-warning-700">
                                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    <span class="font-bold text-sm">VERIFICAR EXCEÇÕES</span>
                                </div>
                                <p class="text-sm text-neutral-600 mb-2">Este artigo NÃO gerará inelegibilidade se enquadrar em:</p>
                                <ul class="list-disc list-inside text-sm text-neutral-800 space-y-1 ml-1">
                                    ${detail.excecoes.map(ex => `<li>${ex}</li>`).join('')}
                                </ul>
                            </div>
                        ` : ''}
                    </div>
                </div>
                <div class="mt-4 pt-4 border-t border-dashed ${isInelegivel ? 'border-danger-200' : 'border-success-200'} text-xs text-neutral-500 text-right">
                    Fonte: Tabela CRE-RO/TRE-SP (Out/2024 - Jun/2025)
                </div>
            </div>
        `;

        if (this.resultContainer) {
            this.resultContainer.innerHTML = html;
            this.resultContainer.classList.remove('hidden');
            this.resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    /** Oculta o container de resultados */
    hideResult() {
        if (this.resultContainer) {
            this.resultContainer.classList.add('hidden');
            this.resultContainer.innerHTML = '';
        }
    }
}
