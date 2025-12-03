const fs = require('fs');
const path = require('path');
const vm = require('vm');

const assert = {
  equal: (a, b, m) => { if (a !== b) throw new Error(`${m}\nEsperado: ${b}\nRecebido: ${a}`); },
  ok: (v, m) => { if (!v) throw new Error(m); }
};

const code = fs.readFileSync(path.join(__dirname, '../src/js/script.js'), 'utf8');

const sandbox = {
  window: {},
  document: {
    getElementById: () => null,
    addEventListener: () => {}
  },
  navigator: {},
  console,
  tabelaInelegibilidade: [
    { codigo: 'CP', norma: 'Art. 121', excecoes: [] },
    { codigo: 'CP', norma: 'Art. 120 e 121', excecoes: ['Art. 121'] }
  ],
  leisDisponiveis: [{ value: 'CP', text: 'Código Penal' }]
};
vm.createContext(sandbox);

sandbox.SearchIndex = sandbox.window.SearchIndex = { getItensPorLei: () => [] };
sandbox.ArtigoFormatter = sandbox.window.ArtigoFormatter = { processar: (v) => ({ artigo: String(v).trim() }) };
sandbox.ExceptionValidator = sandbox.window.ExceptionValidator = {
  verificar: (item, artigo) => {
    if (item.excecoes && item.excecoes.includes(`Art. ${artigo.artigo}`)) return 'caput';
    return null;
  }
};

vm.runInContext(code, sandbox);

let passed = 0, failed = 0;
function test(name, fn) {
  try { fn(); console.log(`✅ ${name}`); passed++; }
  catch (e) { console.error(`❌ ${name}`); console.error(`   ${e.message}`); failed++; }
}

console.log('\n🧪 Executando testes de fallback de busca...\n');

test('Fallback encontra resultado quando índice não retorna candidatos', () => {
  const r = sandbox.buscarInelegibilidadePorLeiEArtigo('CP', '121');
  assert.ok(r, 'Deve encontrar via fallback');
  assert.equal(r.inelegivel, true, 'Sem exceção é inelegível');
});

test('Fallback aplica exceção corretamente', () => {
  sandbox.tabelaInelegibilidade = [{ codigo: 'CP', norma: 'Art. 120 e 121', excecoes: ['Art. 121'] }];
  const r = sandbox.buscarInelegibilidadePorLeiEArtigo('CP', '121');
  assert.ok(r, 'Deve encontrar via fallback');
  assert.equal(r.inelegivel, false, 'Com exceção é elegível');
});

console.log('\n' + '='.repeat(50));
console.log(`📊 Resultados: ${passed} passou, ${failed} falhou`);
console.log('='.repeat(50) + '\n');
process.exit(failed > 0 ? 1 : 0);