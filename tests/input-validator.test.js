/**
 * Testes unitários para InputValidator
 * Cobre: validateLawCode, validateArticle, normalizeDetail, validateText
 * Execute com: node tests/input-validator.test.js
 */

import { InputValidator } from "../src/js/utils/input-validator.js";

const assert = {
  equal: (actual, expected, message) => {
    if (actual !== expected) {
      throw new Error(`${message}\nEsperado: ${expected}\nRecebido: ${actual}`);
    }
  },
  ok: (value, message) => {
    if (!value) throw new Error(message);
  },
  strictEqual: (actual, expected, message) => {
    if (actual !== expected) {
      throw new Error(`${message}\nEsperado: ${expected}\nRecebido: ${actual}`);
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

console.log("\n🧪 Executando testes do InputValidator...\n");

// --- validateLawCode ---

test("validateLawCode deve aceitar CP", () => {
  assert.equal(InputValidator.validateLawCode("CP"), "CP");
});

test("validateLawCode deve aceitar cp e retornar maiúsculo", () => {
  assert.equal(InputValidator.validateLawCode("cp"), "CP");
});

test("validateLawCode deve aceitar LEI_64", () => {
  assert.equal(InputValidator.validateLawCode("LEI_64"), "LEI_64");
});

test("validateLawCode deve aceitar CE com espaços (trim)", () => {
  assert.equal(InputValidator.validateLawCode("  CE  "), "CE");
});

test("validateLawCode deve rejeitar null", () => {
  assert.equal(InputValidator.validateLawCode(null), null);
});

test("validateLawCode deve rejeitar string vazia", () => {
  assert.equal(InputValidator.validateLawCode(""), null);
  assert.equal(InputValidator.validateLawCode("   "), null);
});

test("validateLawCode deve rejeitar caracteres inválidos", () => {
  assert.equal(InputValidator.validateLawCode("CP-123"), null);
  assert.equal(InputValidator.validateLawCode("Código"), null);
});

test("validateLawCode deve rejeitar quando não é string", () => {
  assert.equal(InputValidator.validateLawCode(123), null);
  assert.equal(InputValidator.validateLawCode(undefined), null);
});

// --- validateArticle ---

test("validateArticle deve aceitar 121", () => {
  assert.equal(InputValidator.validateArticle("121"), "121");
});

test("validateArticle deve aceitar 1-A", () => {
  assert.equal(InputValidator.validateArticle("1-A"), "1-A");
});

test("validateArticle deve aceitar número como input", () => {
  assert.equal(InputValidator.validateArticle(121), "121");
});

test("validateArticle deve rejeitar null e undefined", () => {
  assert.equal(InputValidator.validateArticle(null), null);
  assert.equal(InputValidator.validateArticle(undefined), null);
});

test("validateArticle deve rejeitar string vazia", () => {
  assert.equal(InputValidator.validateArticle(""), null);
  assert.equal(InputValidator.validateArticle("   "), null);
});

test("validateArticle deve rejeitar caracteres inválidos", () => {
  assert.equal(InputValidator.validateArticle("121, §1º"), null);
  assert.equal(InputValidator.validateArticle("121.1"), null);
});

// --- normalizeDetail ---

test("normalizeDetail deve retornar unico para parágrafo único", () => {
  assert.equal(InputValidator.normalizeDetail("parágrafo único"), "unico");
});

test("normalizeDetail deve retornar unico para p. único", () => {
  assert.equal(InputValidator.normalizeDetail("p. único"), "unico");
});

test("normalizeDetail deve retornar unico para p.u", () => {
  assert.equal(InputValidator.normalizeDetail("p.u"), "unico");
});

test("normalizeDetail deve remover §º°ª", () => {
  assert.equal(InputValidator.normalizeDetail("§2º"), "2");
  assert.equal(InputValidator.normalizeDetail("2º"), "2");
});

test("normalizeDetail deve retornar null para entrada vazia", () => {
  assert.equal(InputValidator.normalizeDetail(""), null);
  assert.equal(InputValidator.normalizeDetail(null), null);
  assert.equal(InputValidator.normalizeDetail("   "), null);
});

test("normalizeDetail deve retornar null quando não é string", () => {
  assert.equal(InputValidator.normalizeDetail(123), null);
});

// --- validateText ---

test("validateText deve aceitar texto dentro do limite", () => {
  assert.equal(InputValidator.validateText("busca"), "busca");
  assert.equal(InputValidator.validateText("a".repeat(100)), "a".repeat(100));
});

test("validateText deve rejeitar texto excedendo maxLength", () => {
  assert.equal(InputValidator.validateText("a".repeat(101)), null);
  assert.equal(InputValidator.validateText("x", 5), "x");
  assert.equal(InputValidator.validateText("123456", 5), null);
});

test("validateText deve rejeitar entrada vazia", () => {
  assert.equal(InputValidator.validateText(""), null);
  assert.equal(InputValidator.validateText(null), null);
  assert.equal(InputValidator.validateText("   "), null);
});

console.log("\n" + "=".repeat(50));
console.log(`📊 Resultados InputValidator: ${passed} passou, ${failed} falhou`);
console.log("=".repeat(50) + "\n");

process.exit(failed > 0 ? 1 : 0);
