"use strict";

/**
 * Configura o comportamento de exibição condicional dos campos de data
 * baseados na seleção dos Radio Buttons (Condenação vs Extinção).
 *
 * @param {HTMLElement} radioCondenacao - Elemento Input Radio para "Condenação"
 * @param {HTMLElement} radioExtincao - Elemento Input Radio para "Extinção da Punibilidade"
 * @param {HTMLElement} dataOcorrenciaCondenacao - Container do campo de data de condenação
 * @param {HTMLElement} dataOcorrenciaExtincao - Container do campo de data de extinção
 */
export function setupRadioButtons(
  radioCondenacao,
  radioExtincao,
  dataOcorrenciaCondenacao,
  dataOcorrenciaExtincao,
) {
  if (radioCondenacao) {
    radioCondenacao.addEventListener("change", function () {
      if (this.checked) {
        if (dataOcorrenciaCondenacao)
          dataOcorrenciaCondenacao.style.display = "block";
        if (dataOcorrenciaExtincao)
          dataOcorrenciaExtincao.style.display = "none";
      }
    });
  }

  if (radioExtincao) {
    radioExtincao.addEventListener("change", function () {
      if (this.checked) {
        if (dataOcorrenciaCondenacao)
          dataOcorrenciaCondenacao.style.display = "none";
        if (dataOcorrenciaExtincao)
          dataOcorrenciaExtincao.style.display = "block";
      }
    });
  }
}
