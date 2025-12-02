'use strict';

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
