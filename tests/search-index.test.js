const fs = require('fs');
const path = require('path');
const vm = require('vm');

const assert = {
  equal: (a, b, m) => { if (a !== b) throw new Error(`${m}\nEsperado: ${b}\nRecebido: ${a}`); },
  ok: (v, m) => { if (!v) throw new Error(m); }
};

const code = fs.readFileSync(path.join(__dirname, '../src/js/modules/search-index.js'), 'utf8');

const sandbox = { window: {}, console };
vm.createContext(sandbox);

sandbox.window.ArtigoFormatter = {
  processar: (n) => ({ artigo: String(n).trim() }),
  extrairArtigos: (norma) => {
    if (norma.includes('121') && !norma.includes('120')) return ['121'];
    if (norma.includes('120') && norma.includes('121')) return ['120', '121'];
    return (norma.match(/\d+/g) || []);
  }
};

sandbox.window.ExceptionValidator = {
  verificar: (item, artigo) => {
    if (item.excecoes && item.excecoes.includes(`Art. ${artigo.artigo}`)) return 'caput';
    return null;
  },
  filtrarPorArtigo: (excecoes, artigo) => (excecoes || []).filter(e => e.includes(`Art. ${artigo.artigo}`))
};

vm.runInContext(code, sandbox);
const SearchIndex = sandbox.window.SearchIndex;

let passed = 0, failed = 0;
function test(name, fn) {
  try { fn(); console.log(`✅ ${name}`); passed++; }
  catch (e) { console.error(`❌ ${name}`); console.error(`   ${e.message}`); failed++; }
}

console.log('\n🧪 Executando testes do SearchIndex...\n');

const leisDisponiveis = [{ value: 'CP' }, { value: 'CLT' }];

test('Busca exata sem exceção resulta em inelegível', () => {
  SearchIndex.clearCache();
  const tabela = [{ codigo: 'CP', norma: 'Art. 121', excecoes: [], crime: 'Teste' }];
  const r = SearchIndex.buscar('CP', '121', leisDisponiveis, tabela);
  assert.ok(r, 'Deve encontrar resultado');
  assert.equal(r.inelegivel, true, 'Sem exceção é inelegível');
  assert.equal(r.artigoProcessado.artigo, '121', 'Artigo processado correto');
});

test('Busca exata com exceção resulta em elegível', () => {
  SearchIndex.clearCache();
  const tabela = [{ codigo: 'CP', norma: 'Art. 121', excecoes: ['Art. 121'], crime: 'Teste' }];
  const r = SearchIndex.buscar('CP', '121', leisDisponiveis, tabela);
  assert.ok(r, 'Deve encontrar resultado');
  assert.equal(r.inelegivel, false, 'Com exceção é elegível');
});

test('Restringe por lei correta quando há múltiplas leis', () => {
  SearchIndex.clearCache();
  const tabela = [
    { codigo: 'CP', norma: 'Art. 121', excecoes: [], crime: 'Teste CP' },
    { codigo: 'CLT', norma: 'Art. 121', excecoes: [], crime: 'Teste CLT' }
  ];
  const rCP = SearchIndex.buscar('CP', '121', leisDisponiveis, tabela);
  assert.ok(rCP, 'Deve encontrar para CP');
  assert.equal(rCP.codigo, 'CP', 'Resultado deve ser da lei CP');
  const rCLT = SearchIndex.buscar('CLT', '121', leisDisponiveis, tabela);
  assert.ok(rCLT, 'Deve encontrar para CLT');
  assert.equal(rCLT.codigo, 'CLT', 'Resultado deve ser da lei CLT');
});

test('Não retorna para correspondência parcial curta (<2 dígitos)', () => {
  SearchIndex.clearCache();
  const tabela = [{ codigo: 'CP', norma: 'Art. 121', excecoes: [], crime: 'Teste' }];
  const r = SearchIndex.buscar('CP', '1', leisDisponiveis, tabela);
  assert.equal(r, null, 'Artigo muito curto não deve retornar');
});

test('Não retorna para parcial não listada ("12") quando artigos são 120 e 121', () => {
  SearchIndex.clearCache();
  const tabela = [{ codigo: 'CP', norma: 'Art. 120 e 121', excecoes: [], crime: 'Teste' }];
  const r = SearchIndex.buscar('CP', '12', leisDisponiveis, tabela);
  assert.equal(r, null, 'Parcial não deve retornar');
});

console.log('\n' + '='.repeat(50));
console.log(`📊 Resultados: ${passed} passou, ${failed} falhou`);
console.log('='.repeat(50) + '\n');
process.exit(failed > 0 ? 1 : 0);