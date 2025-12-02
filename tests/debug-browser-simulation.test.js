/**
 * Teste de Debug: Simula o ambiente do navegador
 * 
 * Este teste simula EXATAMENTE o que acontece quando o navegador carrega os scripts.
 * Execução: node tests/debug-browser-simulation.test.js
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('🔬 Teste de Simulação do Navegador\n');
console.log('='.repeat(50));

// 1. Simular o objeto window
const window = {};
global.window = window;

// 2. Carregar data-normalizado.js (como faria o navegador)
console.log('\n📦 Passo 1: Carregando data-normalizado.js...');
const dataScript = fs.readFileSync(
    path.join(__dirname, '../public/assets/js/data-normalizado.js'),
    'utf8'
);

try {
    // Executar o script no contexto global
    vm.runInThisContext(dataScript);

    if (window.__INELEG_NORMALIZADO__) {
        console.log(`   ✅ window.__INELEG_NORMALIZADO__ definido`);
        console.log(`   ✅ ${window.__INELEG_NORMALIZADO__.length} registros carregados`);
    } else {
        console.log(`   ❌ window.__INELEG_NORMALIZADO__ NÃO foi definido!`);
        process.exit(1);
    }
} catch (e) {
    console.log(`   ❌ ERRO ao executar data-normalizado.js:`);
    console.log(`      ${e.message}`);
    process.exit(1);
}

// 3. Simular ValidatorService.init()
console.log('\n🔧 Passo 2: Simulando ValidatorService.init()...');

// Replicar a lógica do init()
let dataNormalizer = null;

if (typeof window !== 'undefined') {
    if (window.DataNormalizer) {
        dataNormalizer = window.DataNormalizer;
        console.log('   → Usando window.DataNormalizer (legado)');
    }
    if (window.__INELEG_NORMALIZADO__) {
        dataNormalizer = {
            getAll: () => window.__INELEG_NORMALIZADO__
        };
        console.log('   → Usando window.__INELEG_NORMALIZADO__ (novo)');
    }
}

if (dataNormalizer) {
    console.log('   ✅ dataNormalizer inicializado com sucesso');
} else {
    console.log('   ❌ dataNormalizer NÃO foi inicializado!');
    process.exit(1);
}

// 4. Simular getLaws()
console.log('\n📋 Passo 3: Simulando getLaws()...');

const lawsMap = new Map();

dataNormalizer.getAll().forEach(item => {
    if (item.codigo && !lawsMap.has(item.codigo)) {
        let nome = item.codigo;
        if (item.codigo === 'CP') nome = 'Código Penal (Decreto-Lei 2.848/40)';
        else if (item.codigo === 'CPM') nome = 'Código Penal Militar';
        else if (item.codigo === 'CE' || item.codigo === 'CODIGO_ELEITORAL') nome = 'Código Eleitoral (Lei 4.737/65)';
        else if (item.lei_nome) nome = item.lei_nome;

        lawsMap.set(item.codigo, nome);
    }
});

const laws = Array.from(lawsMap.entries())
    .map(([codigo, nome]) => ({ codigo, nome }))
    .sort((a, b) => a.nome.localeCompare(b.nome));

console.log(`   ✅ ${laws.length} leis encontradas:`);
laws.forEach(law => {
    console.log(`      - [${law.codigo}] ${law.nome.substring(0, 50)}...`);
});

// 5. Resultado
console.log('\n' + '='.repeat(50));
console.log('\n📊 DIAGNÓSTICO:');

if (laws.length > 0) {
    console.log('   ✅ O PIPELINE DE DADOS ESTÁ FUNCIONAL.');
    console.log('   ⚠️  O problema deve estar na ORDEM DE CARREGAMENTO ou no NAVEGADOR.');
    console.log('\n   Sugestões:');
    console.log('   1. Limpe o cache do navegador (Ctrl+Shift+Del)');
    console.log('   2. Recarregue com Ctrl+F5');
    console.log('   3. Verifique erros no Console do navegador (F12)');
} else {
    console.log('   ❌ O PIPELINE DE DADOS ESTÁ COM PROBLEMA.');
    console.log('   Execute: npm run data:refresh');
}

console.log('\n');
