#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const paths = require('./project-paths');

// Arquivos que NÃO devem ser copiados para public/assets/js
const EXCLUDE_FILES = new Set(['data.js']);

function copyDirectory(src, dest) {
  if (!fs.existsSync(src)) {
    throw new Error(`Diretório fonte inexistente: ${src}`);
  }

  // Preservar destino para não apagar arquivos gerados (ex.: normalizados)
  fs.mkdirSync(dest, { recursive: true });

  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      if (EXCLUDE_FILES.has(entry.name)) {
        continue;
      }
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function main() {
  copyDirectory(paths.js.src, paths.js.public);
  console.log(`📦 Sincronizado src/js → ${path.relative(paths.root, paths.js.public)} (preservando destino, excluindo: ${Array.from(EXCLUDE_FILES).join(', ')})`);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error('❌ Falha ao sincronizar JS:', error.message);
    process.exit(1);
  }
}

module.exports = { copyDirectory };
