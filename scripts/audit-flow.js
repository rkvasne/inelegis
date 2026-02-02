const fs = require('fs');
const path = require('path');

// Caminhos
const paths = {
    docx: path.join(__dirname, '../docs/references/tabela-oficial.docx'),
    jsonRaw: path.join(__dirname, '../src/data/legal-database-docx.json'),
    jsonApp: path.join(__dirname, '../src/data/legal-database.json'),
    jsFrontend: path.join(__dirname, '../public/assets/js/data-normalizado.js')
};

console.log('🔍 AUDITORIA DE FLUXO DE DADOS: DOCX -> UI\n');

// 1. Verificar Existência dos Arquivos
console.log('1️⃣  Verificação de Arquivos Gerados:');
for (const [key, p] of Object.entries(paths)) {
    if (fs.existsSync(p)) {
        const stats = fs.statSync(p);
        console.log(`   ✅ [${key}] Existe (${(stats.size / 1024).toFixed(2)} KB)`);
    } else {
        console.error(`   ❌ [${key}] FALHANDO! Arquivo não encontrado: ${p}`);
        process.exit(1);
    }
}

// 2. Verificar Conteúdo Lógico (JSON App)
console.log('\n2️⃣  Verificação Lógica (Normalização):');
const db = require(paths.jsonApp);
const data = db.data;

// Estatísticas
const totalRegistros = data.length;
const cpRegistros = data.filter(d => d.codigo === 'CP');
const leisUnicas = [...new Set(data.map(d => d.codigo))];

console.log(`   - Total de Registros Normativos: ${totalRegistros}`);
console.log(`   - Leis Identificadas: ${leisUnicas.length} (${leisUnicas.slice(0, 5).join(', ')}...)`);
console.log(`   - Registros do Código Penal (CP): ${cpRegistros.length}`);

// Validar Extração de Artigos
const artigoExemplo = cpRegistros.find(d => d.estruturado.artigos.includes('121'));
if (artigoExemplo) {
    console.log(`   ✅ Sucesso: Artigo 121 do CP encontrado.`);
    console.log(`       -> Fonte DOCX: "${artigoExemplo.norma}"`);
    console.log(`       -> Estruturado: [${artigoExemplo.estruturado.artigos.join(', ')}]`);
} else {
    console.error(`   ❌ ALERTA: Artigo 121 do CP NÃO encontrado no JSON processado! A Regex de extração pode estar falhando.`);
}

// 3. Simular ValidatorService (Busca)
console.log('\n3️⃣  Simulação de Busca (Service Layer):');
function mockGetArticleDetails(lawCode, articleNum) {
    return data.filter(item =>
        item.codigo === lawCode &&
        item.estruturado.artigos.includes(articleNum)
    ).map(r => ({
        crime: r.crime,
        norma: r.norma
    }));
}

const resultadoBusca = mockGetArticleDetails('CP', '121');
if (resultadoBusca.length > 0) {
    console.log(`   ✅ Service consegue achar CP 121:`);
    console.log(JSON.stringify(resultadoBusca[0], null, 2));
} else {
    console.error('   ❌ Service falhou em encontrar dados que existem no JSON.');
}

// 4. Verificar Integridade do JS Frontend
console.log('\n4️⃣  Verificação do Asset Frontend (data-normalizado.js):');
const jsContent = fs.readFileSync(paths.jsFrontend, 'utf8');
if (jsContent.includes('window.__INELEG_NORMALIZADO__') && jsContent.includes('"CP"')) {
    console.log('   ✅ O arquivo JS contém a definição global e dados do CP.');
} else {
    console.error('   ❌ O arquivo JS parece vazio ou mal formatado.');
}

console.log('\n🏁 CONCLUSÃO:');
console.log('Se todos os passos acima passaram, o pipeline está ÍNTEGRO.');
