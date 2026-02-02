const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Iniciando Pipeline de Atualização de Dados (Data Refresh)...');

try {
    // 1. ETL Unificado (Extração + Transformação + Publicação)
    console.log('\n[1/1] Executando ETL Unificado...');
    execSync(`node ${path.join(__dirname, 'etl-complete.js')}`, { stdio: 'inherit' });

    console.log('\n✅ Pipeline Concluído com Sucesso! O arquivo public/assets/js/data-normalizado.js foi regenerado.');
    console.log('📝 Para atualizar o Supabase, execute as migrations SQL manualmente se houver mudanças estruturais.');

} catch (e) {
    console.error('\n❌ Falha no Pipeline:', e.message);
    process.exit(1);
}
