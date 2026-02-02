const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Iniciando Pipeline de Atualização de Dados (Data Refresh)...');

try {
    // 1. Extrair DOCX -> JSON RAW
    console.log('\n[1/3] Extraindo dados do DOCX...');
    execSync(`node ${path.join(__dirname, 'etl-docx.js')}`, { stdio: 'inherit' });

    // 2. Normalizar RAW -> JSON Canonical + JS Frontend
    console.log('\n[2/3] Normalizando dados para o App...');
    execSync(`node ${path.join(__dirname, 'etl-docx-to-app.js')}`, { stdio: 'inherit' });

    // 3. Atualizar Loader do Redis (opcional, mas bom manter sincronizado)
    console.log('\n[3/3] Atualizando Cache Redis (Sincronização)...');
    try {
        // Se o Redis não estiver rodando, isso pode falhar. Vamos ignorar erro mas tentar.
        // check if redis-loader exists
        execSync(`node ${path.join(__dirname, 'redis-loader.js')}`, { stdio: 'inherit' });
    } catch (e) {
        console.warn('⚠️  Redis Loader falhou ou Redis offline. Ignorando atualização de cache.');
    }

    console.log('\n✅ Pipeline Concluído com Sucesso! O arquivo public/assets/js/data-normalizado.js foi regenerado.');

} catch (e) {
    console.error('\n❌ Falha no Pipeline:', e.message);
    process.exit(1);
}
