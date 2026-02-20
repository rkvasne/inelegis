/**
 * Testes unitários para ResultRenderer (Modal unificado de resultados)
 * Cobre: exceção explícita, ASE, incidência, escape XSS
 * Execute com: node tests/result-renderer.test.js
 */

import { ResultRenderer } from "../src/js/ui/result-renderer.js";
import { RESULTS } from "../src/js/services/validator-service.js";

const assert = {
  equal: (actual, expected, message) => {
    if (actual !== expected) {
      throw new Error(`${message}\nEsperado: ${expected}\nRecebido: ${actual}`);
    }
  },
  ok: (value, message) => {
    if (!value) {
      throw new Error(message);
    }
  },
  includes: (str, substring, message) => {
    if (!str || !str.includes(substring)) {
      throw new Error(
        `${message}\nEsperado conter: "${substring}"\nRecebido: ${str}`,
      );
    }
  },
  notIncludes: (str, substring, message) => {
    if (str && str.includes(substring)) {
      throw new Error(
        `${message}\nNÃO deveria conter: "${substring}"\nRecebido: ${str}`,
      );
    }
  },
};

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (error) {
    console.error(`❌ ${name}`);
    console.error(`   ${error.message}`);
    failed++;
  }
}

const baseContext = {
  artigo: "121",
  paragrafo: null,
  inciso: null,
  alinea: null,
  leiNome: "CP",
  tipoComunicacao: "condenacao",
};

console.log("\n🧪 Executando testes do ResultRenderer...\n");

// --- Status e Exceção ---

test("Deve retornar INELEGÍVEL quando resultado é INELIGIBLE", () => {
  const result = {
    resultado: RESULTS.INELIGIBLE,
    tipo_crime: "Homicídio simples",
    observacoes: "",
    item_alinea_e: "",
    excecoes_artigo: null,
  };
  const { html, statusClass, statusText } = ResultRenderer.render(
    result,
    baseContext,
  );
  assert.equal(statusClass, "ineligible", "statusClass");
  assert.equal(statusText, "INELEGÍVEL", "statusText");
  assert.includes(html, "INELEGÍVEL", "HTML deve conter status");
});

test("Deve retornar ELEGÍVEL quando resultado é ELIGIBLE sem exceção", () => {
  const result = {
    resultado: RESULTS.ELIGIBLE,
    tipo_crime: null,
    observacoes: "",
    item_alinea_e: "",
    excecoes_artigo: null,
  };
  const { statusClass, statusText } = ResultRenderer.render(
    result,
    baseContext,
  );
  assert.equal(statusClass, "eligible", "statusClass");
  assert.equal(statusText, "ELEGÍVEL", "statusText");
});

test("Deve retornar ELEGÍVEL (EXCEÇÃO) quando eh_excecao é true", () => {
  const result = {
    resultado: RESULTS.ELIGIBLE,
    eh_excecao: true,
    tipo_crime: "Crime X",
    observacoes: "",
    item_alinea_e: "",
    excecoes_artigo: null,
  };
  const { html, statusClass, statusText } = ResultRenderer.render(
    result,
    baseContext,
  );
  assert.equal(statusClass, "warning", "statusClass");
  assert.equal(statusText, "ELEGÍVEL (EXCEÇÃO)", "statusText");
  assert.includes(html, "exceção legal se aplica", "Mensagem de exceção");
});

test("Deve inferir exceção quando ELIGIBLE + tipo_crime presente", () => {
  const result = {
    resultado: RESULTS.ELIGIBLE,
    tipo_crime: "Crime com exceção",
    observacoes: "",
    item_alinea_e: "",
    excecoes_artigo: null,
  };
  const { statusText } = ResultRenderer.render(result, baseContext);
  assert.equal(
    statusText,
    "ELEGÍVEL (EXCEÇÃO)",
    "Deve inferir exceção via tipo_crime",
  );
});

test("Deve inferir exceção quando ELIGIBLE + excecoes_artigo presente", () => {
  const result = {
    resultado: RESULTS.ELIGIBLE,
    tipo_crime: null,
    observacoes: "",
    item_alinea_e: "",
    excecoes_artigo: "Art. 121, §3º",
  };
  const { statusText } = ResultRenderer.render(result, baseContext);
  assert.equal(
    statusText,
    "ELEGÍVEL (EXCEÇÃO)",
    "Deve inferir exceção via excecoes_artigo",
  );
});

test("Deve retornar NÃO ENCONTRADO quando resultado é NOT_FOUND", () => {
  const result = {
    resultado: RESULTS.NOT_FOUND,
    tipo_crime: null,
    observacoes: "",
    item_alinea_e: "",
    excecoes_artigo: null,
  };
  const { statusClass, statusText } = ResultRenderer.render(
    result,
    baseContext,
  );
  assert.equal(statusClass, "not-found", "statusClass");
  assert.equal(statusText, "NÃO ENCONTRADO", "statusText");
});

test("NAO_CONSTA com mensagem (dispositivo inexistente) deve exibir mensagem no HTML", () => {
  const result = {
    resultado: RESULTS.NOT_FOUND,
    tipo_crime: null,
    observacoes: "",
    item_alinea_e: "",
    excecoes_artigo: null,
    mensagem: "Dispositivo não consta na tabela",
  };
  const { html, statusText } = ResultRenderer.render(result, baseContext);
  assert.equal(statusText, "NÃO ENCONTRADO", "statusText");
  assert.includes(
    html,
    "Dispositivo não consta na tabela",
    "Mensagem da migration deve aparecer no modal",
  );
});

// --- ASE ---

test("ASE: condenação elegível deve retornar ASE 337 Motivo 2 (independente de exceção)", () => {
  const result = {
    resultado: RESULTS.ELIGIBLE,
    eh_excecao: true,
    tipo_crime: "Crime",
    observacoes: "",
    item_alinea_e: "",
    excecoes_artigo: null,
  };
  const ctx = { ...baseContext, tipoComunicacao: "condenacao" };
  const { html } = ResultRenderer.render(result, ctx);
  assert.includes(html, "ASE 337", "ASE 337");
  assert.includes(html, "Motivo 2", "Motivo 2 condenação elegível");
});

test("ASE: condenação inelegível deve retornar ASE 337 Motivo 7", () => {
  const result = {
    resultado: RESULTS.INELIGIBLE,
    tipo_crime: "Homicídio",
    observacoes: "",
    item_alinea_e: "",
    excecoes_artigo: null,
  };
  const { html } = ResultRenderer.render(result, baseContext);
  assert.includes(html, "ASE 337", "ASE 337");
  assert.includes(html, "Motivo 7", "Motivo 7 condenação");
});

test("ASE: tipoComunicacao dispositivo/analise deve pedir para informar Condenação ou Extinção", () => {
  const result = {
    resultado: RESULTS.ELIGIBLE,
    tipo_crime: null,
    observacoes: "",
    item_alinea_e: "",
    excecoes_artigo: null,
  };
  const ctxDispositivo = { ...baseContext, tipoComunicacao: "dispositivo" };
  const ctxAnalise = { ...baseContext, tipoComunicacao: "analise" };
  const { html: htmlD } = ResultRenderer.render(result, ctxDispositivo);
  const { html: htmlA } = ResultRenderer.render(result, ctxAnalise);
  assert.includes(htmlD, "Consulte o manual", "dispositivo");
  assert.includes(htmlA, "Consulte o manual", "analise");
});

test("ASE: extinção inelegível deve retornar ASE 370 e ASE 540", () => {
  const result = {
    resultado: RESULTS.INELIGIBLE,
    tipo_crime: "Homicídio",
    observacoes: "",
    item_alinea_e: "",
    excecoes_artigo: null,
  };
  const ctx = { ...baseContext, tipoComunicacao: "extincao" };
  const { html } = ResultRenderer.render(result, ctx);
  assert.includes(html, "ASE 370", "ASE 370");
  assert.includes(html, "ASE 540", "ASE 540");
});

test("ASE: extinção elegível deve retornar ASE 370", () => {
  const result = {
    resultado: RESULTS.ELIGIBLE,
    tipo_crime: null,
    observacoes: "",
    item_alinea_e: "",
    excecoes_artigo: null,
  };
  const ctx = { ...baseContext, tipoComunicacao: "extincao" };
  const { html } = ResultRenderer.render(result, ctx);
  assert.includes(html, "ASE 370", "ASE 370");
  assert.includes(html, "Cessação", "Cessação do impedimento");
});

// --- Incidência e layout ---

test("Deve formatar incidência corretamente (artigo, parágrafo, inciso, alínea)", () => {
  const result = {
    resultado: RESULTS.ELIGIBLE,
    tipo_crime: null,
    observacoes: "",
    item_alinea_e: "",
    excecoes_artigo: null,
  };
  const ctx = {
    ...baseContext,
    artigo: "121",
    paragrafo: "2",
    inciso: "III",
    alinea: "a",
  };
  const { html } = ResultRenderer.render(result, ctx);
  assert.includes(html, "Art. 121", "artigo");
  assert.includes(html, "§ 2", "parágrafo");
  assert.includes(html, "Inc. III", "inciso");
  assert.includes(html, "Alínea a", "alínea");
});

test("Deve exibir alerta de exceções hierárquicas quando excecoes_artigo presente", () => {
  const result = {
    resultado: RESULTS.ELIGIBLE,
    eh_excecao: true,
    tipo_crime: "Crime",
    observacoes: "",
    item_alinea_e: "",
    excecoes_artigo: "Art. 121, §3º - Exceção aplicável",
  };
  const { html } = ResultRenderer.render(result, baseContext);
  assert.includes(html, "Exceções Existentes", "Título do alerta");
  assert.includes(
    html,
    "Art. 121, §3º - Exceção aplicável",
    "Conteúdo exceção",
  );
});

// --- Segurança (XSS) ---

test("Deve escapar HTML em tipo_crime para prevenir XSS", () => {
  const result = {
    resultado: RESULTS.INELIGIBLE,
    tipo_crime: '<script>alert("xss")</script>',
    observacoes: "",
    item_alinea_e: "",
    excecoes_artigo: null,
  };
  const { html } = ResultRenderer.render(result, baseContext);
  assert.notIncludes(html, "<script>", "Não deve conter tag script");
  assert.includes(html, "&lt;script&gt;", "Deve estar escapado");
});

test("Deve escapar HTML em item_alinea_e", () => {
  const result = {
    resultado: RESULTS.INELIGIBLE,
    tipo_crime: "Crime",
    observacoes: "",
    item_alinea_e: '"> <img onerror="alert(1)">',
    excecoes_artigo: null,
  };
  const { html } = ResultRenderer.render(result, baseContext);
  assert.notIncludes(html, "<img", "Não deve conter tag img");
});

// --- Estrutura do retorno ---

test("Deve retornar objeto com html, statusClass e statusText", () => {
  const result = {
    resultado: RESULTS.ELIGIBLE,
    tipo_crime: null,
    observacoes: "",
    item_alinea_e: "",
    excecoes_artigo: null,
  };
  const output = ResultRenderer.render(result, baseContext);
  assert.ok(typeof output.html === "string", "html é string");
  assert.ok(output.html.length > 50, "html tem conteúdo");
  assert.ok(typeof output.statusClass === "string", "statusClass é string");
  assert.ok(typeof output.statusText === "string", "statusText é string");
});

// --- Resumo ---

console.log("\n" + "=".repeat(50));
console.log(`📊 Resultados ResultRenderer: ${passed} passou, ${failed} falhou`);
console.log("=".repeat(50) + "\n");

process.exit(failed > 0 ? 1 : 0);
