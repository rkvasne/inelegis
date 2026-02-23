/**
 * Testes unitários para ValidatorService
 * Cobre:
 * - enum RESULTS
 * - verifyEligibility sem init e entradas inválidas
 * - uso de RPC base e RPC v2 (c.c./contexto)
 * - fallback v2 -> base em ambientes sem migration
 * - mapeamento de retorno e wrapper getArticleDetails
 *
 * Execute com: node tests/validator-service.test.js
 */

import {
  RESULTS,
  ValidatorService,
} from "../src/js/services/validator-service.js";

const assert = {
  equal: (actual, expected, message) => {
    if (actual !== expected) {
      throw new Error(`${message}\nEsperado: ${expected}\nRecebido: ${actual}`);
    }
  },
  ok: (value, message) => {
    if (!value) throw new Error(message);
  },
  deepEqual: (actual, expected, message) => {
    const a = JSON.stringify(actual);
    const b = JSON.stringify(expected);
    if (a !== b) {
      throw new Error(`${message}\nEsperado: ${b}\nRecebido: ${a}`);
    }
  },
};

let passed = 0;
let failed = 0;
const tests = [];

function test(name, fn) {
  tests.push({ name, fn });
}

async function runTests() {
  for (const { name, fn } of tests) {
    try {
      await fn();
      console.log(`✅ ${name}`);
      passed++;
    } catch (error) {
      console.error(`❌ ${name}`);
      console.error(`   ${error.message}`);
      failed++;
    }
  }
}

console.log("\n🧪 Executando testes do ValidatorService...\n");

// --- RESULTS enum ---

test("RESULTS deve ter ELIGIBLE, INELIGIBLE, NOT_FOUND, PENDING_ANALYSIS, ERROR", () => {
  assert.equal(RESULTS.ELIGIBLE, "ELEGIVEL");
  assert.equal(RESULTS.INELIGIBLE, "INELEGIVEL");
  assert.equal(RESULTS.NOT_FOUND, "NAO_CONSTA");
  assert.equal(RESULTS.PENDING_ANALYSIS, "PENDENTE_ANALISE");
  assert.equal(RESULTS.ERROR, "ERRO");
});

// --- ValidatorService sem init ---

test("verifyEligibility deve retornar ERROR quando serviço não inicializado", async () => {
  const svc = new ValidatorService();
  const result = await svc.verifyEligibility("CP", "121");
  assert.equal(result.resultado, RESULTS.ERROR);
  assert.ok(result.motivo?.includes("not initialized"));
});

test("getLaws deve retornar [] quando não inicializado", async () => {
  const svc = new ValidatorService();
  const laws = await svc.getLaws();
  assert.deepEqual(laws, []);
});

test("getArticlesByLaw deve retornar [] quando não inicializado", async () => {
  const svc = new ValidatorService();
  const articles = await svc.getArticlesByLaw("CP");
  assert.deepEqual(articles, []);
});

test("init deve retornar false quando Supabase não configurado", async () => {
  const svc = new ValidatorService();
  const supabase = await import("../src/js/services/supabase-client.js");
  const originalIsConfigured = supabase.supabaseClient.isConfigured;
  supabase.supabaseClient.isConfigured = () => false;

  try {
    const ok = await svc.init();
    assert.equal(ok, false);
  } finally {
    supabase.supabaseClient.isConfigured = originalIsConfigured;
  }
});

test("verifyEligibility deve propagar result[0] quando RPC retorna array", async () => {
  const svc = new ValidatorService();
  svc.initialized = true;

  const originalRpc = (await import("../src/js/services/supabase-client.js"))
    .supabaseClient.rpc;
  const mockRpc = async () => [
    {
      resultado: "INELEGIVEL",
      tipo_crime: "Homicídio",
      observacoes: "",
    },
  ];

  const supabase = await import("../src/js/services/supabase-client.js");
  supabase.supabaseClient.rpc = mockRpc;

  try {
    const result = await svc.verifyEligibility("CP", "121");
    assert.equal(result.resultado, "INELEGIVEL");
    assert.equal(result.tipo_crime, "Homicídio");
  } finally {
    supabase.supabaseClient.rpc = originalRpc;
  }
});

test("verifyEligibility deve retornar NAO_CONSTA quando RPC retorna array vazio", async () => {
  const svc = new ValidatorService();
  svc.initialized = true;

  const supabase = await import("../src/js/services/supabase-client.js");
  const originalRpc = supabase.supabaseClient.rpc;
  supabase.supabaseClient.rpc = async () => [];

  try {
    const result = await svc.verifyEligibility("CP", "121");
    assert.equal(result.resultado, RESULTS.NOT_FOUND);
  } finally {
    supabase.supabaseClient.rpc = originalRpc;
  }
});

test("verifyEligibility deve retornar ERROR para entrada inválida (lei vazia)", async () => {
  const svc = new ValidatorService();
  svc.initialized = true;

  const result = await svc.verifyEligibility("", "121");
  assert.equal(result.resultado, RESULTS.ERROR);
  assert.ok(result.motivo?.includes("Invalid"));
});

test("verifyEligibility deve retornar ERROR para entrada inválida (artigo vazio)", async () => {
  const svc = new ValidatorService();
  svc.initialized = true;

  const result = await svc.verifyEligibility("CP", "");
  assert.equal(result.resultado, RESULTS.ERROR);
  assert.ok(result.motivo?.includes("Invalid"));
});

test("getArticleDetails deve retornar array com crime quando INELIGIBLE", async () => {
  const svc = new ValidatorService();
  svc.initialized = true;

  const supabase = await import("../src/js/services/supabase-client.js");
  const originalRpc = supabase.supabaseClient.rpc;
  supabase.supabaseClient.rpc = async () => [
    {
      resultado: "INELEGIVEL",
      tipo_crime: "Homicídio simples",
      observacoes: "Art. 121 CP",
    },
  ];

  try {
    const details = await svc.getArticleDetails("CP", "121");
    assert.ok(Array.isArray(details));
    assert.equal(details.length, 1);
    assert.equal(details[0].crime, "Homicídio simples");
    assert.ok(details[0].norma_completa?.includes("121"));
  } finally {
    supabase.supabaseClient.rpc = originalRpc;
  }
});

test("getArticleDetails deve retornar [] quando não INELIGIBLE", async () => {
  const svc = new ValidatorService();
  svc.initialized = true;

  const supabase = await import("../src/js/services/supabase-client.js");
  const originalRpc = supabase.supabaseClient.rpc;
  supabase.supabaseClient.rpc = async () => [{ resultado: "ELEGIVEL" }];

  try {
    const details = await svc.getArticleDetails("CP", "121");
    assert.deepEqual(details, []);
  } finally {
    supabase.supabaseClient.rpc = originalRpc;
  }
});

test("verifyEligibility deve usar RPC v2 quando há relacionados/contexto", async () => {
  const svc = new ValidatorService();
  svc.initialized = true;

  const supabase = await import("../src/js/services/supabase-client.js");
  const originalRpc = supabase.supabaseClient.rpc;
  const calls = [];

  supabase.supabaseClient.rpc = async (fn, payload) => {
    calls.push({ fn, payload });
    return [{ resultado: "PENDENTE_ANALISE", regra_aplicada: "TEST_RULE" }];
  };

  try {
    const result = await svc.verifyEligibility(
      "cp",
      "149-a",
      "1",
      "ii",
      null,
      [{ artigo: "149-a", paragrafo: "", inciso: "i a v" }],
      { cp129_cc12: true },
    );

    assert.equal(result.resultado, "PENDENTE_ANALISE");
    assert.equal(calls.length, 1, "Deve chamar apenas uma RPC");
    assert.equal(
      calls[0].fn,
      "verificar_elegibilidade_v2",
      "Com input composto deve chamar v2",
    );
    assert.equal(calls[0].payload.p_codigo_norma, "CP");
    assert.equal(calls[0].payload.p_artigo, "149-A");
    assert.equal(calls[0].payload.p_inciso, "II");
    assert.equal(
      Array.isArray(calls[0].payload.p_relacionados),
      true,
      "p_relacionados deve ser array",
    );
    assert.equal(calls[0].payload.p_contexto.cp129_cc12, true);
  } finally {
    supabase.supabaseClient.rpc = originalRpc;
  }
});

test("verifyEligibility deve fazer fallback para RPC base quando v2 falha", async () => {
  const svc = new ValidatorService();
  svc.initialized = true;

  const supabase = await import("../src/js/services/supabase-client.js");
  const originalRpc = supabase.supabaseClient.rpc;
  const calls = [];

  supabase.supabaseClient.rpc = async (fn) => {
    calls.push(fn);
    if (fn === "verificar_elegibilidade_v2") {
      throw new Error("function verificar_elegibilidade_v2 does not exist");
    }
    return [{ resultado: "INELEGIVEL" }];
  };

  try {
    const result = await svc.verifyEligibility(
      "CP",
      "149-A",
      "1",
      "II",
      null,
      [{ artigo: "149-A", inciso: "I" }],
      {},
    );
    assert.equal(result.resultado, "INELEGIVEL");
    assert.deepEqual(calls, [
      "verificar_elegibilidade_v2",
      "verificar_elegibilidade",
    ]);
  } finally {
    supabase.supabaseClient.rpc = originalRpc;
  }
});

test("verifyEligibility deve normalizar parágrafo relacionado 'caput' para null", async () => {
  const svc = new ValidatorService();
  svc.initialized = true;

  const supabase = await import("../src/js/services/supabase-client.js");
  const originalRpc = supabase.supabaseClient.rpc;
  let payloadCaptured = null;

  supabase.supabaseClient.rpc = async (_fn, payload) => {
    payloadCaptured = payload;
    return [{ resultado: "PENDENTE_ANALISE" }];
  };

  try {
    await svc.verifyEligibility(
      "CP",
      "149-A",
      "1",
      "II",
      null,
      [{ artigo: "149-A", paragrafo: "caput", inciso: "I" }],
      {},
    );
    assert.equal(payloadCaptured.p_relacionados[0].paragrafo, null);
  } finally {
    supabase.supabaseClient.rpc = originalRpc;
  }
});

test("verifyEligibility deve usar RPC base quando não há input composto", async () => {
  const svc = new ValidatorService();
  svc.initialized = true;

  const supabase = await import("../src/js/services/supabase-client.js");
  const originalRpc = supabase.supabaseClient.rpc;
  const calls = [];

  supabase.supabaseClient.rpc = async (fn) => {
    calls.push(fn);
    return [{ resultado: "ELEGIVEL" }];
  };

  try {
    const result = await svc.verifyEligibility("CP", "122", "8");
    assert.equal(result.resultado, "ELEGIVEL");
    assert.deepEqual(calls, ["verificar_elegibilidade"]);
  } finally {
    supabase.supabaseClient.rpc = originalRpc;
  }
});

await runTests();

console.log("\n" + "=".repeat(50));
console.log(
  `📊 Resultados ValidatorService: ${passed} passou, ${failed} falhou`,
);
console.log("=".repeat(50) + "\n");

process.exit(failed > 0 ? 1 : 0);
