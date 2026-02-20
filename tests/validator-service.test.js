/**
 * Testes unitários para ValidatorService
 * Cobre: RESULTS enum, verifyEligibility sem init, getLaws/getArticlesByLaw sem init,
 *        mapeamento de retorno (com mock de RPC)
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

console.log("\n🧪 Executando testes do ValidatorService...\n");

// --- RESULTS enum ---

test("RESULTS deve ter ELIGIBLE, INELIGIBLE, NOT_FOUND, ERROR", () => {
  assert.equal(RESULTS.ELIGIBLE, "ELEGIVEL");
  assert.equal(RESULTS.INELIGIBLE, "INELEGIVEL");
  assert.equal(RESULTS.NOT_FOUND, "NAO_CONSTA");
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
  const ok = await svc.init();
  assert.equal(ok, false);
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

console.log("\n" + "=".repeat(50));
console.log(
  `📊 Resultados ValidatorService: ${passed} passou, ${failed} falhou`,
);
console.log("=".repeat(50) + "\n");

process.exit(failed > 0 ? 1 : 0);
