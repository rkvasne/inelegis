#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pathsConfig from "./project-paths.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Arquivos que NÃO devem ser copiados para public/assets/js
const EXCLUDE_FILES = new Set(["README.md"]);

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
  copyDirectory(pathsConfig.js.src, pathsConfig.js.public);
  console.log(
    `📦 Sincronizado src/js → ${path.relative(pathsConfig.root, pathsConfig.js.public)} (preservando destino, excluindo: ${Array.from(EXCLUDE_FILES).join(", ")})`,
  );
}

// ES Module compatibility
if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    main();
  } catch (error) {
    console.error("❌ Falha ao sincronizar JS:", error.message);
    process.exit(1);
  }
}

export { copyDirectory };
