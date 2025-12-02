import { buscarInelegibilidadePorLeiEArtigo, filtrarExcecoesDoMesmoArtigo } from '../src/js/services/search-logic.js';

// Setup Mock Environment
global.window = {};
global.debugLog = () => { }; // Mock core-utils debugLog if it ends up global, but it is imported. 
// Wait, search-logic imports debugLog. The import will work.

// Setup Mocks
const mockDataNormalizer = {
    query: () => [],
    getSugestoesPorLei: () => []
};

const mockArtigoFormatter = {
    processar: (art) => ({ artigo: art, formatado: art }),
    formatar: (art) => art
};

const mockExceptionValidator = {
    verificar: () => false
};

// Inject Mocks into Window (as expected by search-logic dynamic checks)
global.window.DataNormalizer = mockDataNormalizer;
global.window.ArtigoFormatter = mockArtigoFormatter;
global.window.ExceptionValidator = mockExceptionValidator;

// Test Runner
let passed = 0;
let failed = 0;

function test(name, fn) {
    try {
        fn();
        console.log(`✅ ${name}`);
        passed++;
    } catch (e) {
        console.error(`❌ ${name}`);
        console.error(`   ${e.message}`);
        failed++;
    }
}

function assert(cond, msg) {
    if (!cond) throw new Error(msg || 'Assertion failed');
}

console.log('\n🧪 Executando testes do Search Logic (ESM)...\n');

// --- Tests ---

test('filtrarExcecoesDoMesmoArtigo - Deve filtrar corretamente', () => {
    const excecoes = ['Art. 155 - Furto', 'Art. 121 - Homicídio'];
    const proc = { artigo: '155' };
    const res = filtrarExcecoesDoMesmoArtigo(excecoes, proc);
    assert(res.length === 1, 'Deve retornar 1 exceção');
    assert(res[0].includes('155'), 'Deve ser a exceção do art. 155');
});

test('buscarInelegibilidade - Deve retornar nulo para artigo curto', () => {
    const res = buscarInelegibilidadePorLeiEArtigo('CP', '1');
    assert(res === null, 'Deve ser null');
});

test('buscarInelegibilidade - Deve buscar e retornar resultado', () => {
    // Setup specific mock return
    mockDataNormalizer.query = () => [{ codigo: 'CP', crime: 'Teste', excecoes: [] }];
    mockArtigoFormatter.processar = (art) => ({ artigo: art, formatado: art });
    mockExceptionValidator.verificar = () => false;

    const res = buscarInelegibilidadePorLeiEArtigo('CP', '155');
    assert(res !== null, 'Não deve ser null');
    assert(res.inelegivel === true, 'Deve ser inelegível');
});

test('buscarInelegibilidade - Deve respeitar exceção (Real Validator)', () => {
    // Provide data that creates a real exception match
    mockDataNormalizer.query = () => [{
        codigo: 'CP',
        crime: 'Teste',
        excecoes: ['Art. 155, caput']
    }];

    // Using real ExceptionValidator, '155' should match 'Art. 155, caput'
    const res = buscarInelegibilidadePorLeiEArtigo('CP', '155');
    assert(res.inelegivel === false, 'Deve ser elegível por exceção');
    assert(res.temExcecao, 'Deve conter a exceção encontrada');
    assert(typeof res.temExcecao === 'string', 'Exceção deve ser string');
});

// Summary
console.log('\n' + '='.repeat(50));
console.log(`📊 Resultados: ${passed} passou, ${failed} falhou`);
console.log('='.repeat(50) + '\n');

if (failed > 0) process.exit(1);
