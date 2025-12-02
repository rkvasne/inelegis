const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Iniciando Pipeline de Atualização de Dados (Data Refresh)...');

try {
    // 1. ETL Unificado (Extração + Transformação + Publicação)
    console.log('\n[1/2] Executando ETL Unificado...');
    execSync(`node ${path.join(__dirname, 'etl-complete.js')}`, { stdio: 'inherit' });

    // 2. Redis Sync (Opcional)
    console.log('\n[2/2] Sincronizando Cache Redis...');
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
