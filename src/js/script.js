"use strict";

import { ValidatorUI } from "./ui/validator-ui.js";
import { AnalyzerUI } from "./ui/analyzer-ui.js";
import { setupRadioButtons } from "./ui/ui-events.js";

// Entrypoint Principal da Página de Consulta
document.addEventListener("DOMContentLoaded", () => {
  // 1. Verificação de Segurança (Gatekeeper)
  if (!verificarAcessoConsulta()) return;

  // 2. Inicializar Serviços Core
  if (typeof Analytics !== "undefined") Analytics.init();
  if (typeof SearchHistory !== "undefined") SearchHistory.init();

  // 3. Inicializar a Nova UI de Validação Estruturada
  const validatorUI = new ValidatorUI();
  validatorUI.init();

  // 4. Inicializar Analisador de Sentença
  const analyzerUI = new AnalyzerUI();
  analyzerUI.init();

  // 3. Configurar Elementos Auxiliares (Estado Civil da Consulta)
  const radioCondenacao = document.getElementById("condenacao");
  const radioExtincao = document.getElementById("extincao");

  // Elementos de data podem não existir nessa versão simplificada, mas mantemos a chamada segura
  const dataCondenacao = document.getElementById("dataOcorrenciaCondenacao");
  const dataExtincao = document.getElementById("dataOcorrenciaExtincao");

  if (radioCondenacao && radioExtincao) {
    setupRadioButtons(
      radioCondenacao,
      radioExtincao,
      dataCondenacao,
      dataExtincao,
    );
  }
});

/**
 * Verifica se o usuário aceitou os termos de uso.
 * Redireciona para home se não autenticado.
 */
function verificarAcessoConsulta() {
  // Apenas executa na página de consulta
  if (
    window.location.pathname.includes("consulta") ||
    window.location.href.includes("consulta")
  ) {
    let aceitos = false;
    try {
      aceitos =
        typeof localStorage !== "undefined" &&
        localStorage.getItem("ineleg_termos_aceitos") === "true";
    } catch (e) {
      console.error("Erro ao verificar storage:", e);
      aceitos = false;
    }

    if (!aceitos) {
      window.location.href = "./";
      return false;
    }
  }
  return true;
}
