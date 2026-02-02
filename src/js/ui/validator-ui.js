import { validatorService } from '../services/validator-service.js';

export class ValidatorUI {
    constructor() {
        // Elementos da UI
        this.leiArrow = document.querySelector('#leiArrowIndicator');
        this.leiDropdown = document.querySelector('#leiListbox');
        this.leiButton = document.querySelector('#leiDropdownButton');
        this.leiSelectInput = document.querySelector('#leiSelect');

        this.artigoSelect = document.querySelector('#artigoSelect');
        this.resultContainer = document.querySelector('#validator-result');

        // Estado
        this.selectedLaw = null;
    }

    init() {
        if (!validatorService.init()) return;

        this.setupLeiDropdown();
        this.setupArtigoSelect();

        // Fechar dropdown ao clicar fora
        document.addEventListener('click', (e) => {
            if (this.leiButton && !this.leiButton.contains(e.target) && !this.leiDropdown.contains(e.target)) {
                this.toggleLeiDropdown(false);
            }
        });
    }

    // Configura o dropdown customizado de Leis
    setupLeiDropdown() {
        const laws = validatorService.getLaws();

        if (!this.leiDropdown) return;

        // Renderizar opções
        this.leiDropdown.innerHTML = laws.map(law => `
            <li role="option" data-value="${law.codigo}" class="dropdown-item cursor-pointer px-4 py-2 hover:bg-neutral-100 text-neutral-800 text-sm">
                ${law.nome}
            </li>
        `).join('');

        // Eventos do Dropdown Customizado
        if (this.leiButton) {
            this.leiButton.addEventListener('click', (e) => {
                e.stopPropagation();
                const expandido = this.leiButton.getAttribute('aria-expanded') === 'true';
                this.toggleLeiDropdown(!expandido);
            });
        }

        // Seleção de Lei
        this.leiDropdown.querySelectorAll('li').forEach(item => {
            item.addEventListener('click', (e) => {
                const codigo = e.target.dataset.value;
                const nome = e.target.innerText;

                this.selectLaw(codigo, nome);
                this.toggleLeiDropdown(false);
            });
        });
    }

    toggleLeiDropdown(show) {
        if (!this.leiButton || !this.leiDropdown) return;

        this.leiButton.setAttribute('aria-expanded', show);
        this.leiDropdown.classList.toggle('hidden', !show);
        if (this.leiArrow) {
            this.leiArrow.style.transform = show ? 'rotate(180deg)' : 'rotate(0deg)';
            this.leiArrow.style.transition = 'transform 0.2s ease';
        }
    }

    selectLaw(codigo, nome) {
        this.selectedLaw = codigo;
        if (this.leiButton) this.leiButton.innerText = nome;
        if (this.leiSelectInput) this.leiSelectInput.value = codigo;

        // Resetar e Popular Artigos
        this.populateArtigoSelect(codigo);
        this.hideResult();
    }

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

        // Animation classes
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        `;
        if (!document.querySelector('#validator-styles')) {
            style.id = 'validator-styles';
            document.head.appendChild(style);
        }

        if (this.resultContainer) {
            this.resultContainer.innerHTML = html;
            this.resultContainer.classList.remove('hidden');
            this.resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    hideResult() {
        if (this.resultContainer) {
            this.resultContainer.classList.add('hidden');
            this.resultContainer.innerHTML = '';
        }
    }
}
