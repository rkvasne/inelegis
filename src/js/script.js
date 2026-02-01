'use strict';

import { LEIS_DISPONIVEIS } from './modules/constants.js';
import { debugLog } from './modules/core-utils.js';
import { buscarInelegibilidadePorLeiEArtigo } from './modules/search-logic.js';
import { mostrarToast, abrirModal, esconderSugestoes, fecharModal } from './modules/dom-manipulation.js'; // fecharModal imported to be used in UI events
import { setupRadioButtons, setupShortcuts } from './modules/ui-events.js';
import { ArticleBuilder } from './modules/article-builder.js';

// Global State
const state = {
    leiSelect: null,
    artigoInput: null,
    buscarBtn: null,
    resultadoDiv: null,
    sugestoesDiv: null,
    leiDropdownButton: null,
    leiListbox: null,
    leiArrowIndicator: null,
    articleBuilder: null
};

// --- DOM Initialization ---

document.addEventListener('DOMContentLoaded', () => {
    // Initialize References
    state.leiSelect = document.getElementById('leiSelect');
    state.artigoInput = document.getElementById('artigoInput');
    state.buscarBtn = document.getElementById('searchBtn');
    state.resultadoDiv = document.getElementById('resultado');
    state.sugestoesDiv = document.getElementById('suggestions');
    state.leiDropdownButton = document.getElementById('leiDropdownButton');
    state.leiListbox = document.getElementById('leiListbox');
    state.leiArrowIndicator = document.getElementById('leiArrowIndicator');

    // Verify Access
    if (!verificarAcessoConsulta()) return;
    if (!state.leiSelect || !state.artigoInput || !state.buscarBtn) return;

    // Initialize Builder
    state.articleBuilder = new ArticleBuilder(state);

    // Setup
    popularSelectLeis();
    setupCoreEvents();

    // Setup Modules
    const radioCondenacao = document.getElementById('condenacao');
    const radioExtincao = document.getElementById('extincao');
    setupRadioButtons(
        radioCondenacao,
        radioExtincao,
        document.getElementById('dataOcorrenciaCondenacao'),
        document.getElementById('dataOcorrenciaExtincao')
    );

    setupShortcuts({
        leiSelect: state.leiSelect,
        artigoInput: state.artigoInput,
        buscarBtn: state.buscarBtn,
        radioCondenacao,
        radioExtincao,
        realizarBuscaCallback: realizarBusca
    });

    // Initial State
    state.artigoInput.disabled = true;
    state.buscarBtn.disabled = true;
    if (state.articleBuilder) state.articleBuilder.disable();

    if (state.leiArrowIndicator) {
        if (!state.leiSelect.value) state.leiArrowIndicator.classList.add('show');
        else state.leiArrowIndicator.classList.remove('show');
    }
});

// --- Core Application Logic ---

function verificarAcessoConsulta() {
    if (window.location.pathname.includes('consulta') || window.location.href.includes('consulta')) {
        let aceitos = false;
        try {
            aceitos = (typeof window !== 'undefined' && window.SecureStorage && window.SecureStorage.getItem('termos_aceitos') === true) || (typeof localStorage !== 'undefined' && localStorage.getItem('ineleg_termos_aceitos') === 'true');
        } catch (e) { aceitos = false; }

        if (!aceitos) {
            window.location.href = './';
            return false;
        }
    }
    return true;
}

function popularSelectLeis() {
    // Combine constants with dynamic data if available
    let leis = [];
    const lawMap = new Map(LEIS_DISPONIVEIS.map(l => [l.value, l.text]));

    if (typeof window.DataNormalizer !== 'undefined' && window.DataNormalizer.getLeis) {
        const rawLeis = window.DataNormalizer.getLeis();
        leis = rawLeis.map(lei => ({
            value: lei.value,
            text: lawMap.get(lei.value) || lei.text
        }));
    } else {
        leis = LEIS_DISPONIVEIS;
    }

    leis.sort((a, b) => a.text.localeCompare(b.text));

    if (!state.leiListbox) return;
    state.leiListbox.innerHTML = '';

    setupDropdownSearch(leis);

    leis.forEach(lei => {
        const li = document.createElement('li');
        li.className = 'dropdown-item';
        li.setAttribute('role', 'option');
        li.setAttribute('data-value', lei.value);
        li.textContent = lei.text;
        li.tabIndex = 0;

        li.addEventListener('click', function () {
            state.leiSelect.value = this.getAttribute('data-value');
            if (state.leiDropdownButton) {
                state.leiDropdownButton.textContent = lei.text;
                state.leiDropdownButton.setAttribute('aria-expanded', 'false');
            }
            state.leiListbox.classList.add('hidden');
            state.leiSelect.dispatchEvent(new Event('change'));
        });

        // Keyboard support for list items
        li.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') li.click();
        });

        state.leiListbox.appendChild(li);
    });
}

function setupDropdownSearch(leis) {
    // Basic search setup (simplified for brevity, logic preserved)
    const searchContainer = document.createElement('div');
    searchContainer.className = 'dropdown-search-container';
    searchContainer.addEventListener('click', e => e.stopPropagation());

    const searchInput = document.createElement('input');
    searchInput.className = 'dropdown-search-input';
    searchInput.placeholder = 'Pesquisar lei...';
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const items = state.leiListbox.querySelectorAll('.dropdown-item');
        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(term) ? '' : 'none';
        });
    });

    // Prevent dropdown close on input click
    searchInput.addEventListener('click', e => e.stopPropagation());

    searchContainer.appendChild(searchInput);
    state.leiListbox.appendChild(searchContainer);
}

function setupCoreEvents() {
    // Dropdown Toggle
    if (state.leiDropdownButton) {
        state.leiDropdownButton.addEventListener('click', () => {
            const expanded = state.leiDropdownButton.getAttribute('aria-expanded') === 'true';
            state.leiDropdownButton.setAttribute('aria-expanded', !expanded);
            state.leiListbox.classList.toggle('hidden', expanded);
            if (!expanded) { // If opening
                const input = state.leiListbox.querySelector('input');
                if (input) input.focus();
            }
        });
    }

    // Outside Click
    document.addEventListener('click', (e) => {
        if (state.leiDropdownButton && !state.leiDropdownButton.contains(e.target) && !state.leiListbox.contains(e.target)) {
            state.leiListbox.classList.add('hidden');
            state.leiDropdownButton.setAttribute('aria-expanded', 'false');
        }
    });

    // Select Change
    state.leiSelect.addEventListener('change', () => {
        if (state.leiSelect.value) {
            state.artigoInput.disabled = false;
            state.buscarBtn.disabled = false; // Simplified enablement
            if (state.articleBuilder) {
                state.articleBuilder.enable();
                state.articleBuilder.updatePreview();
            }
            if (state.leiArrowIndicator) state.leiArrowIndicator.classList.remove('show');
            state.artigoInput.focus();
        } else {
            limparBusca();
        }
    });

    // Busca
    state.buscarBtn.addEventListener('click', realizarBusca);
    document.getElementById('limparBtn')?.addEventListener('click', limparBusca);
}

// --- Business Logic Integration ---

function realizarBusca() {
    const lei = state.leiSelect.value.trim();
    const artigo = state.artigoInput.value.trim();

    if (!lei || !artigo) {
        alert('Selecione uma lei e digite o artigo.');
        return;
    }

    esconderSugestoes(state.sugestoesDiv);

    const resultado = buscarInelegibilidadePorLeiEArtigo(lei, artigo);

    if (resultado) {
        exibirResultado(resultado, lei, artigo);
    } else {
        exibirNaoEncontrado(lei, artigo);
    }
}

function exibirResultado(resultado, codLei, artigoOriginal) {
    const nomeLei = LEIS_DISPONIVEIS.find(l => l.value === codLei)?.text || codLei;
    const status = resultado.inelegivel ? 'INELEGÍVEL' : 'ELEGÍVEL';
    const cssClass = resultado.inelegivel ? 'inelegivel' : 'elegivel';

    const modalContent = `
        <div class="modal-status-card ${cssClass}">
            <div class="status-text-wrapper">
                <span class="status-label">Resultado</span>
                <span class="status-value">${status}</span>
            </div>
        </div>
        <div class="modal-info-grid">
            <div class="info-item"><span class="info-label">Norma</span><span class="info-value">Art. ${resultado.artigoProcessado?.formatado || artigoOriginal}</span></div>
            <div class="info-item"><span class="info-label">Crime</span><span class="info-value">${resultado.crime || 'N/A'}</span></div>
        </div>
        ${resultado.observacao ? `<div class="modal-section modal-note"><p>${resultado.observacao}</p></div>` : ''}
    `;

    // Update Modal Header Texts (Legacy DOM manipulation for header)
    const titleEl = document.getElementById('modalTitle');
    const subtEl = document.getElementById('modalSubtitle');
    if (titleEl) titleEl.textContent = 'Resultado da Consulta';
    if (subtEl) subtEl.textContent = `${nomeLei} • ${artigoOriginal}`;

    abrirModal(cssClass, status, modalContent);
}

function exibirNaoEncontrado(codLei, artigo) {
    const nomeLei = LEIS_DISPONIVEIS.find(l => l.value === codLei)?.text || codLei;
    const titleEl = document.getElementById('modalTitle');
    const subtEl = document.getElementById('modalSubtitle');
    if (titleEl) titleEl.textContent = 'Não Encontrado';
    if (subtEl) subtEl.textContent = `${nomeLei} • ${artigo}`;

    abrirModal('inelegivel', 'NÃO ENCONTRADO', `
        <div class="modal-status-card inelegivel">
            <span class="status-value">ARTIGO NÃO ENCONTRADO</span>
        </div>
        <div class="modal-info-grid">
             <div class="modal-section modal-info"><p>Este artigo não consta na tabela oficial de inelegibilidade.</p></div>
        </div>
     `);
}

function limparBusca() {
    state.leiSelect.value = '';
    state.artigoInput.value = '';
    state.artigoInput.disabled = true;
    state.buscarBtn.disabled = true;
    if (state.articleBuilder) state.articleBuilder.disable();
    if (state.leiDropdownButton) {
        state.leiDropdownButton.textContent = 'Selecione a lei ou código...';
        state.leiListbox.classList.add('hidden');
    }
    if (state.leiArrowIndicator) state.leiArrowIndicator.classList.add('show');
}

// Make functions available globally if needed
window.limparBusca = limparBusca;
window.copiarResultado = () => {
    const content = document.getElementById('modalBody')?.textContent;
    if (content) navigator.clipboard.writeText(content);
};
