/**
 * Testes unitários para ArtigoFormatter
 * Execute com: node tests/formatters.test.js
 */

// Simular ambiente de testes
const assert = {
  equal: (actual, expected, message) => {
    if (actual !== expected) {
      throw new Error(`${message}\nEsperado: ${expected}\nRecebido: ${actual}`);
    }
  },
  deepEqual: (actual, expected, message) => {
    const actualStr = JSON.stringify(actual);
    const expectedStr = JSON.stringify(expected);
    if (actualStr !== expectedStr) {
      throw new Error(
        `${message}\nEsperado: ${expectedStr}\nRecebido: ${actualStr}`,
      );
    }
  },
  ok: (value, message) => {
    if (!value) {
      throw new Error(message);
    }
  },
};

// Carregar módulo
import fs from "fs";
import path from "path";
import vm from "vm";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let formatterCode = fs.readFileSync(
  path.join(__dirname, "../src/js/utils/formatters.js"),
  "utf8",
);
// Remove ES6 export for VM execution (just in case, though file doesn't seem to have it)
formatterCode = formatterCode.replace(/export\s+\{.*?\};?/g, "");

const sandbox = { window: {}, console };
vm.createContext(sandbox);
vm.runInContext(formatterCode, sandbox);
const ArtigoFormatter = sandbox.window.ArtigoFormatter;

// Testes
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

console.log("\n🧪 Executando testes do ArtigoFormatter...\n");

// Teste 1: Formatação de parágrafo
test("Deve formatar parágrafo corretamente", () => {
  const input = "121, §1";
  const expected = "121, §1º";
  const result = ArtigoFormatter.formatar(input);
  assert.equal(result, expected, "Formatação de parágrafo");
});

// Teste 2: Normalização de espaços
test("Deve normalizar espaços", () => {
  const input = "121,    §1";
  const result = ArtigoFormatter.formatar(input);
  assert.ok(result.includes("121, §1º"), "Deve normalizar espaços e formatar");
});

// Teste 3: Formatação de alínea
test("Deve formatar alínea com aspas", () => {
  const input = "121, a";
  const result = ArtigoFormatter.formatar(input);
  assert.ok(result.includes('"a"'), "Alínea deve ter aspas");
});

// Teste 4: Processamento de artigo simples
test("Deve processar artigo simples", () => {
  const input = "121";
  const result = ArtigoFormatter.processar(input);
  assert.equal(result.artigo, "121", "Número do artigo");
  assert.equal(result.paragrafo, "", "Sem parágrafo");
});

// Teste 5: Processamento de artigo completo
test("Deve processar artigo completo", () => {
  const input = '121, §2º, I, "a"';
  const result = ArtigoFormatter.processar(input);
  assert.equal(result.artigo, "121", "Número do artigo");
  assert.equal(result.paragrafo, "2", "Parágrafo");
  assert.equal(result.inciso, "I", "Inciso");
  assert.equal(result.alinea, "a", "Alínea");
});

// Teste 6: Processamento com concomitante
test("Deve processar artigo com c/c", () => {
  const input = "121 c/c 122";
  const result = ArtigoFormatter.processar(input);
  assert.equal(result.artigo, "121", "Artigo principal");
  assert.equal(result.concomitante.length, 1, "Deve ter 1 concomitante");
  assert.equal(result.concomitante[0].artigo, "122", "Artigo concomitante");
});

// Teste 7: Extração de artigos
test("Deve extrair artigos de string", () => {
  const input = "Arts. 121, 122, 123 a 127";
  const result = ArtigoFormatter.extrairArtigos(input);
  assert.ok(result.includes("121"), "Deve incluir 121");
  assert.ok(result.includes("122"), "Deve incluir 122");
  assert.ok(result.includes("123"), "Deve incluir 123");
});

// Teste 8: Normalização
test("Deve normalizar texto", () => {
  const input = "Artigo 121, §1º";
  const result = ArtigoFormatter.normalizar(input);
  assert.equal(result, "artigo 121, §1º", "Deve estar em minúsculas");
});

// Teste 9: Formatação completa
test("Deve formatar artigo completo", () => {
  const artigo = {
    artigo: "121",
    paragrafo: "2",
    inciso: "I",
    alinea: "a",
    concomitante: [],
  };
  const result = ArtigoFormatter.formatarCompleto(artigo);
  assert.equal(result, '121, §2º, I, "a"', "Formatação completa");
});

// Teste 10: Entrada inválida
test("Deve lidar com entrada inválida", () => {
  const result1 = ArtigoFormatter.formatar(null);
  const result2 = ArtigoFormatter.formatar("");
  const result3 = ArtigoFormatter.processar(undefined);

  assert.ok(result1 === null || result1 === "", "Null deve retornar vazio");
  assert.ok(result2 === "", "String vazia deve retornar vazia");
  assert.ok(result3.artigo === "", "Undefined deve retornar objeto vazio");
});

// Teste 11: Extração de caput
test("Deve extrair caput como parágrafo", () => {
  const result = ArtigoFormatter.processarParte("122, caput");
  assert.equal(result.artigo, "122", "Deve extrair artigo 122");
  assert.equal(
    result.paragrafo,
    "caput",
    "Deve extrair parágrafo como 'caput'",
  );
});

// Teste 12: Caput com artigo complexo
test("Deve extrair caput mesmo com espaços e variações", () => {
  const result1 = ArtigoFormatter.processarParte("122 caput");
  const result2 = ArtigoFormatter.processarParte("122, Caput");
  const result3 = ArtigoFormatter.processarParte("122,caput");

  assert.equal(result1.paragrafo, "caput", "Deve extrair caput sem vírgula");
  assert.equal(result2.paragrafo, "caput", "Deve extrair Caput maiúsculo");
  assert.equal(
    result3.paragrafo,
    "caput",
    "Deve extrair caput colado à vírgula",
  );
});

// Teste 13: Formatação amigável do dispositivo legal (v0.3.12)
test("Deve formatar dispositivo legal de forma amigável", () => {
  const log = {
    artigo: "121",
    paragrafo: "3",
    inciso: "I",
    alinea: "a",
  };
  const result = ArtigoFormatter.formatLegalDevice(log);
  assert.equal(
    result,
    'Art. 121, § 3º, inc. I, al. a',
    "Formatação amigável completa",
  );
});

test("Deve tratar 'caput' e 'parágrafo único' amigavelmente", () => {
  const resultCaput = ArtigoFormatter.formatLegalDevice({
    artigo: "1",
    paragrafo: "caput",
  });
  const resultUnico = ArtigoFormatter.formatLegalDevice({
    artigo: "1",
    paragrafo: "unico",
  });

  assert.equal(resultCaput, "Art. 1, caput", "Caput deve ser exibido explicitamente");
  assert.equal(resultUnico, "Art. 1, parágrafo único", "Parágrafo único deve ser formatado por extenso");
});

test("Deve lidar com campos nulos no dispositivo legal", () => {
  const result = ArtigoFormatter.formatLegalDevice({ artigo: "121" });
  assert.equal(result, "Art. 121", "Deve exibir apenas o artigo");
});

// Resumo
console.log("\n" + "=".repeat(50));
console.log(`📊 Resultados: ${passed} passou, ${failed} falhou`);
console.log("=".repeat(50) + "\n");

process.exit(failed > 0 ? 1 : 0);
