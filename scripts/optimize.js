#!/usr/bin/env node

/**
 * Script de Otimização (Legado)
 *
 * Este arquivo agora delega o processo de build/otimização para o
 * novo pipeline centralizado em scripts/build.js para garantir que
 * toda a estrutura pública/src seja respeitada.
 */

const path = require('path');
const Builder = require('./build');

async function run() {
  const buildScript = path.relative(process.cwd(), path.join(__dirname, 'build.js'));
  console.log('⚙️  scripts/optimize.js foi migrado para o novo pipeline.');
  console.log(`   Encaminhando execução para ${buildScript} ...\n`);

  const builder = new Builder();
  await builder.build();

  console.log('\n✨ Otimização finalizada pelo pipeline principal.');
  console.log('   Se precisar de minificação adicional, execute npm run build e aplique pós-processadores específicos.');
}

run().catch(error => {
  console.error('❌ Erro durante a otimização:', error);
  process.exit(1);
});
  minifyCSS,
  optimizeHTML,
  copyAssets,
  optimizeImages,
  createManifest,
  createServiceWorker
};