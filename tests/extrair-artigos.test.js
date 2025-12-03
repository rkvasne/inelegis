const fs = require('fs');
const path = require('path');
const vm = require('vm');

const assert = {
  equal: (a, b, m) => { if (a !== b) throw new Error(`${m}\nEsperado: ${b}\nRecebido: ${a}`); },
  deepEqual: (a, b, m) => { const ja = JSON.stringify(a), jb = JSON.stringify(b); if (ja !== jb) throw new Error(`${m}\nEsperado: ${jb}\nRecebido: ${ja}`); },
  ok: (v, m) => { if (!v) throw new Error(m); }
};

const code = fs.readFileSync(path.join(__dirname, '../src/js/script.js'), 'utf8');

const sandbox = {
  window: {},
  document: { getElementById: () => null, addEventListener: () => {} },
  navigator: {},
  console
};
vm.createContext(sandbox);

vm.runInContext(code, sandbox);

let passed = 0, failed = 0;
function test(name, fn) {
  try { fn(); console.log(`✅ ${name}`); passed++; }
  catch (e) { console.error(`❌ ${name}`); console.error(`   ${e.message}`); failed++; }
}

console.log('\n🧪 Executando testes de extração de artigos...\n');

test('Extrai único artigo simples', () => {
  const r = sandbox.extrairArtigosDoNorma('Art. 121');
  assert.deepEqual(r, ['121'], 'Deve extrair 121');
});

test('Extrai múltiplos artigos e ignora sufixo letra', () => {
  const r = sandbox.extrairArtigosDoNorma('Arts. 120, 121-A, 123');
  assert.deepEqual(r, ['120', '121', '123'], 'Deve extrair 120, 121, 123');
});

test('Extrai com parágrafo e inciso presentes', () => {
  const r = sandbox.extrairArtigosDoNorma('Art. 5º, inciso I');
  assert.deepEqual(r, ['5'], 'Deve extrair 5');
});

test('Extrai em range com hífen simples', () => {
  const r = sandbox.extrairArtigosDoNorma('Arts. 120-122');
  assert.deepEqual(r, ['120', '122'], 'Range deve capturar extremos quando presentes');
});

test('Extrai em range com en dash (captura primeiro extremo)', () => {
  const r = sandbox.extrairArtigosDoNorma('Arts. 120–122');
  assert.deepEqual(r, ['120'], 'Com en dash atual, captura primeiro número');
});

test('Extrai com conectivo "a" em range', () => {
  const r = sandbox.extrairArtigosDoNorma('Arts. 120 a 122');
  assert.deepEqual(r, ['120', '122'], 'Conectivo "a" deve capturar extremos');
});

test('Extrai artigo com sufixo letra minúscula', () => {
  const r = sandbox.extrairArtigosDoNorma('Art. 121-b');
  assert.deepEqual(r, ['121'], 'Deve ignorar letra minúscula');
});

test('Retorna lista única sem duplicatas', () => {
  const r = sandbox.extrairArtigosDoNorma('Arts. 10, 10, 10-A');
  assert.deepEqual(r, ['10'], 'Deve remover duplicatas');
});

test('Entrada vazia retorna array vazio', () => {
  const r = sandbox.extrairArtigosDoNorma('');
  assert.deepEqual(r, [], 'Vazio deve retornar []');
});

console.log('\n' + '='.repeat(50));
console.log(`📊 Resultados: ${passed} passou, ${failed} falhou`);
console.log('='.repeat(50) + '\n');
process.exit(failed > 0 ? 1 : 0);