'use strict';

import { fecharModal } from './dom-manipulation.js';

/**
 * Setup Radio Buttons behavior
 * @param {HTMLElement} radioCondenacao 
 * @param {HTMLElement} radioExtincao 
 * @param {HTMLElement} dataOcorrenciaCondenacao 
 * @param {HTMLElement} dataOcorrenciaExtincao 
 */
export function setupRadioButtons(radioCondenacao, radioExtincao, dataOcorrenciaCondenacao, dataOcorrenciaExtincao) {
    if (radioCondenacao) {
        radioCondenacao.addEventListener('change', function () {
            if (this.checked) {
                if (dataOcorrenciaCondenacao) dataOcorrenciaCondenacao.style.display = 'block';
                if (dataOcorrenciaExtincao) dataOcorrenciaExtincao.style.display = 'none';
            }
        });
    }

    if (radioExtincao) {
        radioExtincao.addEventListener('change', function () {
            if (this.checked) {
                if (dataOcorrenciaCondenacao) dataOcorrenciaCondenacao.style.display = 'none';
                if (dataOcorrenciaExtincao) dataOcorrenciaExtincao.style.display = 'block';
            }
        });
    }
}

/**
 * Setup Keyboard Shortcuts
 * @param {Object} elements Map of elements needed for shortcuts
 */
export function setupShortcuts({
    leiSelect,
    artigoInput,
    buscarBtn,
    radioCondenacao,
    radioExtincao,
    realizarBuscaCallback
}) {
    document.addEventListener('keydown', function (e) {
        // Ctrl+L: Focar Lei
        if (e.ctrlKey && e.key === 'l') {
            e.preventDefault();
            if (leiSelect) leiSelect.focus();
        }
        // Ctrl+A: Focar Artigo
        if (e.ctrlKey && e.key === 'a') {
            e.preventDefault();
            if (artigoInput && !artigoInput.disabled) {
                artigoInput.focus();
            }
        }
        // Ctrl+Enter: Buscar
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            if (buscarBtn && !buscarBtn.disabled && realizarBuscaCallback) {
                realizarBuscaCallback();
            }
        }
        // F1: Alternar Radios
        if (e.key === 'F1') {
            e.preventDefault();
            if (radioCondenacao && radioCondenacao.checked) {
                if (radioExtincao) {
                    radioExtincao.checked = true;
                    radioExtincao.dispatchEvent(new Event('change'));
                }
            } else {
                if (radioCondenacao) {
                    radioCondenacao.checked = true;
                    radioCondenacao.dispatchEvent(new Event('change'));
                }
            }
        }
        // Esc: Fechar Modal
        if (e.key === 'Escape') {
            const modal = document.getElementById('modalResultado'); // Hardcoded ID from script.js logic
            if (modal && modal.classList.contains('show')) {
                fecharModal();
            }
        }
    });
}
