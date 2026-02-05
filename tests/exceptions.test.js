/**
 * Testes unitários para ExceptionValidator
 * Execute com: node tests/exceptions.test.js
 */

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
  isNull: (value, message) => {
    if (value !== null) {
      throw new Error(`${message}\nEsperado: null\nRecebido: ${value}`);
    }
  },
};

// Carregar módulo
import fs from "fs";
import path from "path";
import vm from "vm";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let exceptionCode = fs.readFileSync(
  path.join(__dirname, "../src/js/utils/exceptions.js"),
  "utf8",
);
// Remove ES6 export for VM execution
exceptionCode = exceptionCode.replace(/export\s+\{.*?\};?/g, "");

const sandbox = { window: {}, console };
vm.createContext(sandbox);
vm.runInContext(exceptionCode, sandbox);
const ExceptionValidator = sandbox.window.ExceptionValidator;

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

console.log("\n🧪 Executando testes do ExceptionValidator...\n");

// Teste 1: Sem exceções
test("Deve retornar null quando não há exceções", () => {
  const item = { excecoes: [] };
  const artigo = { artigo: "121" };
  const result = ExceptionValidator.verificar(item, artigo);
  assert.isNull(result, "Deve retornar null");
});

// Teste 2: Exceção com parágrafo
test("Deve identificar exceção com parágrafo", () => {
  const item = {
    excecoes: ["Art. 121, §3º"],
  };
  const artigo = { artigo: "121", paragrafo: "3" };
  const result = ExceptionValidator.verificar(item, artigo);
  assert.ok(result !== null, "Deve encontrar exceção");
});

// Teste 3: Exceção com inciso
test("Deve identificar exceção com inciso", () => {
  const item = {
    excecoes: ["Art. 121, I"],
  };
  const artigo = { artigo: "121", inciso: "I" };
  const result = ExceptionValidator.verificar(item, artigo);
  assert.ok(result !== null, "Deve encontrar exceção");
});

// Teste 4: Exceção com alínea
test("Deve identificar exceção com alínea", () => {
  const item = {
    excecoes: ['Art. 121, "a"'],
  };
  const artigo = { artigo: "121", alinea: "a" };
  const result = ExceptionValidator.verificar(item, artigo);
  assert.ok(result !== null, "Deve encontrar exceção");
});

// Teste 5: Exceção caput
test("Deve identificar exceção caput", () => {
  const item = {
    excecoes: ["Art. 121, caput"],
  };
  const artigo = { artigo: "121" };
  const result = ExceptionValidator.verificar(item, artigo);
  assert.ok(result !== null, "Deve encontrar exceção caput");
});

// Teste 6: Não deve aplicar exceção de parágrafo ao caput
test("Não deve aplicar exceção de parágrafo ao caput", () => {
  const item = {
    excecoes: ["Art. 121, §1º"],
  };
  const artigo = { artigo: "121" }; // Sem parágrafo (caput)
  const result = ExceptionValidator.verificar(item, artigo);
  assert.isNull(result, "Não deve aplicar exceção de parágrafo ao caput");
});

// Teste 7: Filtrar exceções por artigo
test("Deve filtrar exceções do mesmo artigo", () => {
  const excecoes = ["Art. 121, §1º", "Art. 122, caput", "Art. 121, §2º"];
  const artigo = { artigo: "121" };
  const result = ExceptionValidator.filtrarPorArtigo(excecoes, artigo);
  assert.equal(result.length, 2, "Deve retornar 2 exceções do Art. 121");
});

// Teste 8: Normalização
test("Deve normalizar texto corretamente", () => {
  const input = "Artigo 121, §1º";
  const result = ExceptionValidator.normalizar(input);
  assert.ok(result.includes("artigo"), "Deve estar em minúsculas");
});

// Teste 9: Entrada inválida
test("Deve lidar com entrada inválida", () => {
  const item = { excecoes: null };
  const artigo = { artigo: "121" };
  const result = ExceptionValidator.verificar(item, artigo);
  assert.isNull(result, "Deve retornar null para exceções null");
});

// Teste 10: Array vazio de exceções
test("Deve retornar array vazio ao filtrar sem artigo", () => {
  const excecoes = ["Art. 121, §1º"];
  const artigo = { artigo: "" };
  const result = ExceptionValidator.filtrarPorArtigo(excecoes, artigo);
  assert.equal(result.length, 0, "Deve retornar array vazio");
});

// Resumo
console.log("\n" + "=".repeat(50));
console.log(`📊 Resultados: ${passed} passou, ${failed} falhou`);
console.log("=".repeat(50) + "\n");

process.exit(failed > 0 ? 1 : 0);
