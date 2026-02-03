/**
 * Teste de Integração: Pipeline de Dados -> UI
 * Valida que o fluxo DOCX -> JSON -> JS está funcionando corretamente.
 *
 * Execução: node tests/integration-data-pipeline.test.js
 */

const fs = require("fs");
const path = require("path");

const DATA_NORMALIZADO_PATH = path.join(
  __dirname,
  "../public/assets/js/data-normalizado.js",
);

console.log("🧪 Teste de Integração: Pipeline de Dados\n");

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (e) {
    console.log(`  ❌ ${name}`);
    console.log(`     Erro: ${e.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

// ============================================
// TESTES
// ============================================

console.log("📦 1. Verificação de Arquivos\n");

test("data-normalizado.js existe", () => {
  assert(fs.existsSync(DATA_NORMALIZADO_PATH), "Arquivo não encontrado");
});

test("data-normalizado.js não está vazio", () => {
  const content = fs.readFileSync(DATA_NORMALIZADO_PATH, "utf8");
  assert(
    content.length > 100,
    `Arquivo muito pequeno: ${content.length} bytes`,
  );
});

console.log("\n📊 2. Validação de Estrutura de Dados\n");

// Simular o ambiente do navegador para testar o JS
let dataNormalizado = null;

test("data-normalizado.js é JavaScript válido", () => {
  const content = fs.readFileSync(DATA_NORMALIZADO_PATH, "utf8");

  // Extrair o JSON do wrapper IIFE
  const jsonMatch = content.match(
    /window\.__INELEG_NORMALIZADO__\s*=\s*(\[[\s\S]*?\]);/,
  );
  assert(jsonMatch, "Padrão window.__INELEG_NORMALIZADO__ não encontrado");

  dataNormalizado = JSON.parse(jsonMatch[1]);
  assert(Array.isArray(dataNormalizado), "Dados não são um array");
});

test("Array contém registros", () => {
  assert(dataNormalizado.length > 0, "Array está vazio");
  console.log(`     → ${dataNormalizado.length} registros encontrados`);
});

test("Registros têm estrutura esperada", () => {
  const sample = dataNormalizado[0];
  assert(sample.codigo, 'Campo "codigo" ausente');
  assert(sample.estruturado, 'Campo "estruturado" ausente');
  assert(
    Array.isArray(sample.estruturado.artigos),
    'Campo "estruturado.artigos" não é array',
  );
});

console.log("\n🔍 3. Validação de Leis Conhecidas\n");

test("Código Penal (CP) existe", () => {
  const cpRecords = dataNormalizado.filter((r) => r.codigo === "CP");
  assert(cpRecords.length > 0, 'Nenhum registro com codigo="CP"');
  console.log(`     → ${cpRecords.length} registros do CP`);
});

test("Código Penal Militar (CPM) existe", () => {
  const cpmRecords = dataNormalizado.filter((r) => r.codigo === "CPM");
  assert(cpmRecords.length > 0, 'Nenhum registro com codigo="CPM"');
  console.log(`     → ${cpmRecords.length} registros do CPM`);
});

test("Art. 121 do CP está nos artigos estruturados", () => {
  const cpRecords = dataNormalizado.filter((r) => r.codigo === "CP");
  const has121 = cpRecords.some((r) => r.estruturado.artigos.includes("121"));
  assert(has121, "Art. 121 não encontrado em nenhum registro do CP");
});

console.log("\n📋 4. Simulação de getLaws()\n");

test("Extração de leis únicas funciona", () => {
  const lawsMap = new Map();
  dataNormalizado.forEach((item) => {
    if (item.codigo && !lawsMap.has(item.codigo)) {
      lawsMap.set(item.codigo, item.lei_nome || item.codigo);
    }
  });

  assert(lawsMap.size > 0, "Nenhuma lei extraída");
  console.log(`     → ${lawsMap.size} leis únicas:`);
  lawsMap.forEach((nome, codigo) => {
    console.log(`        - ${codigo}: ${nome.substring(0, 40)}...`);
  });
});

// ============================================
// RESULTADO
// ============================================

console.log("\n" + "=".repeat(50));
console.log(`\n📊 Resultado: ${passed} passaram, ${failed} falharam\n`);

if (failed > 0) {
  console.log("❌ FALHA: O pipeline de dados tem problemas.\n");
  process.exit(1);
} else {
  console.log("✅ SUCESSO: O pipeline de dados está íntegro.\n");
  process.exit(0);
}
