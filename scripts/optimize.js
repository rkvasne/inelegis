#!/usr/bin/env node

/**
 * Script de Otimização e Build - Ineleg-App
 * Sistema de Consulta de Inelegibilidade Eleitoral
 * 
 * Este script otimiza todos os arquivos para produção:
 * - Minifica CSS e HTML
 * - Otimiza imagens
 * - Remove comentários desnecessários
 * - Cria versão de produção
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configurações
const BUILD_DIR = 'dist';
const SOURCE_DIR = '.';

// Cores para console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function createBuildDir() {
  log('📁 Criando diretório de build...', 'blue');
  
  if (fs.existsSync(BUILD_DIR)) {
    fs.rmSync(BUILD_DIR, { recursive: true, force: true });
  }
  
  fs.mkdirSync(BUILD_DIR, { recursive: true });
  log('✅ Diretório de build criado', 'green');
}

function minifyCSS() {
  log('🎨 Minificando CSS...', 'blue');
  
const cssFiles = [
  'styles.css'
];
  
  cssFiles.forEach(file => {
    if (fs.existsSync(file)) {
      let content = fs.readFileSync(file, 'utf8');
      
      // Remover comentários CSS
      content = content.replace(/\/\*[\s\S]*?\*\//g, '');
      
      // Remover espaços extras
      content = content.replace(/\s+/g, ' ');
      content = content.replace(/;\s*}/g, '}');
      content = content.replace(/{\s*/g, '{');
      content = content.replace(/;\s*/g, ';');
      
      // Remover quebras de linha
      content = content.replace(/\n/g, '');
      
      fs.writeFileSync(path.join(BUILD_DIR, file), content);
      log(`✅ ${file} minificado`, 'green');
    }
  });
}

function optimizeHTML() {
  log('📄 Otimizando HTML...', 'blue');
  
  const htmlFiles = [
    'index.html',
    'consulta.html',
    'sobre.html'
  ];
  
  htmlFiles.forEach(file => {
    if (fs.existsSync(file)) {
      let content = fs.readFileSync(file, 'utf8');
      
      // Remover comentários HTML
      content = content.replace(/<!--[\s\S]*?-->/g, '');
      
      // Remover espaços extras entre tags
      content = content.replace(/>\s+</g, '><');
      
      // Remover quebras de linha desnecessárias
      content = content.replace(/\n\s*\n/g, '\n');
      
      // Minificar espaços em branco
      content = content.replace(/\s+/g, ' ');
      
      fs.writeFileSync(path.join(BUILD_DIR, file), content);
      log(`✅ ${file} otimizado`, 'green');
    }
  });
}

function copyAssets() {
  log('📦 Copiando assets...', 'blue');
  
  const assets = [
    'script.js',
    'data.js',
    'manifest.json',
    'sw.js',
    'favicon.ico'
  ];
  
  assets.forEach(asset => {
    if (fs.existsSync(asset)) {
      fs.copyFileSync(asset, path.join(BUILD_DIR, asset));
      log(`✅ ${asset} copiado`, 'green');
    }
  });
  
  // Copiar diretório de ícones se existir
  if (fs.existsSync('icons')) {
    fs.cpSync('icons', path.join(BUILD_DIR, 'icons'), { recursive: true });
    log('✅ Diretório icons copiado', 'green');
  }
}

function optimizeImages() {
  log('🖼️ Otimizando imagens...', 'blue');
  
  const iconsDir = path.join(BUILD_DIR, 'icons');
  if (fs.existsSync(iconsDir)) {
    try {
      // Verificar se imagemagick está disponível
      execSync('magick -version', { stdio: 'ignore' });
      
      const files = fs.readdirSync(iconsDir);
      files.forEach(file => {
        if (file.match(/\.(png|jpg|jpeg|gif)$/i)) {
          const inputPath = path.join(iconsDir, file);
          const outputPath = path.join(iconsDir, file.replace(/\.(png|jpg|jpeg|gif)$/i, '.webp'));
          
          try {
            execSync(`magick "${inputPath}" -quality 85 -define webp:lossless=false "${outputPath}"`, { stdio: 'ignore' });
            log(`✅ ${file} convertido para WebP`, 'green');
          } catch (error) {
            log(`⚠️ Erro ao converter ${file}: ${error.message}`, 'yellow');
          }
        }
      });
    } catch (error) {
      log('⚠️ ImageMagick não encontrado, pulando otimização de imagens', 'yellow');
    }
  }
}

function createManifest() {
  log('📋 Criando manifest otimizado...', 'blue');
  
  const manifest = {
    "name": "Ineleg-App - Sistema de Consulta de Inelegibilidade Eleitoral",
    "short_name": "Ineleg-App",
    "description": "Sistema oficial de consulta de inelegibilidade eleitoral baseado na tabela exemplificativa disponibilizada pelo TRE-SP - atualizada em outubro de 2024 - revisada pela CRE-RO em 02/06/2025",
    "version": "0.0.2",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#ffffff",
    "theme_color": "#0ea5e9",
    "orientation": "portrait-primary",
    "icons": [
      {
        "src": "icons/icon-192.png",
        "sizes": "192x192",
        "type": "image/png",
        "purpose": "any maskable"
      },
      {
        "src": "icons/icon-512.png",
        "sizes": "512x512",
        "type": "image/png",
        "purpose": "any maskable"
      }
    ],
    "categories": ["government", "utilities"],
    "lang": "pt-BR",
    "scope": "/",
    "prefer_related_applications": false
  };
  
  fs.writeFileSync(path.join(BUILD_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2));
  log('✅ Manifest otimizado criado', 'green');
}

function createServiceWorker() {
  log('⚙️ Criando Service Worker otimizado...', 'blue');
  
  const swContent = `
// Service Worker - Ineleg-App v0.0.2
// Sistema de Consulta de Inelegibilidade Eleitoral

const CACHE_NAME = 'ineleg-app-v0.0.2';
const urlsToCache = [
  '/',
  '/index.html',
  '/consulta.html',
  '/sobre.html',
  '/styles-compact.css',
  '/script.js',
  '/data.js',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
`;

  fs.writeFileSync(path.join(BUILD_DIR, 'sw.js'), swContent.trim());
  log('✅ Service Worker otimizado criado', 'green');
}

function createReadme() {
  log('📖 Criando README de produção...', 'blue');
  
  const readme = `# Ineleg-App v0.0.2 - Build de Produção

## Sistema de Consulta de Inelegibilidade Eleitoral

### Informações do Build
- **Versão**: 0.0.2
- **Data do Build**: ${new Date().toLocaleString('pt-BR')}
- **Base de Dados**: TRE-SP - Outubro 2024 - Revisada pela CRE-RO em 02/06/2025

### Arquivos Otimizados
- ✅ CSS minificado
- ✅ HTML otimizado
- ✅ JavaScript copiado
- ✅ Imagens otimizadas (WebP)
- ✅ Service Worker configurado
- ✅ Manifest PWA atualizado

### Instalação
1. Copie todos os arquivos para o servidor web
2. Configure HTTPS (obrigatório para PWA)
3. Configure headers de cache apropriados

### Cache Headers Recomendados
\`\`\`
# CSS e JS
*.css, *.js: Cache-Control: public, max-age=31536000

# HTML
*.html: Cache-Control: public, max-age=3600

# Imagens
*.png, *.jpg, *.webp: Cache-Control: public, max-age=31536000

# Manifest e SW
manifest.json, sw.js: Cache-Control: public, max-age=0
\`\`\`

### Suporte
- **Desenvolvido por**: Sistema Interno TRE-SP
- **Última atualização**: Janeiro 2025
- **Status**: Produção

---
*Build gerado automaticamente pelo sistema de otimização Ineleg-App*
`;

  fs.writeFileSync(path.join(BUILD_DIR, 'README.md'), readme);
  log('✅ README de produção criado', 'green');
}

function generateStats() {
  log('📊 Gerando estatísticas do build...', 'blue');
  
  const stats = {
    buildDate: new Date().toISOString(),
    version: '0.0.2',
    files: [],
    totalSize: 0
  };
  
  function getDirSize(dir) {
    let size = 0;
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        size += getDirSize(filePath);
      } else {
        size += stat.size;
        stats.files.push({
          name: path.relative(BUILD_DIR, filePath),
          size: stat.size,
          sizeFormatted: formatBytes(stat.size)
        });
      }
    });
    
    return size;
  }
  
  stats.totalSize = getDirSize(BUILD_DIR);
  stats.totalSizeFormatted = formatBytes(stats.totalSize);
  
  fs.writeFileSync(path.join(BUILD_DIR, 'build-stats.json'), JSON.stringify(stats, null, 2));
  
  log(`📈 Estatísticas do build:`, 'cyan');
  log(`   Total de arquivos: ${stats.files.length}`, 'cyan');
  log(`   Tamanho total: ${stats.totalSizeFormatted}`, 'cyan');
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
    const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Função principal
function main() {
  log('🚀 Iniciando build de produção do Ineleg-App...', 'bright');
  log('Sistema de Consulta de Inelegibilidade Eleitoral', 'cyan');
  log('Base de dados: TRE-SP - Outubro 2024 - CRE-RO 02/06/2025', 'cyan');
  log('', 'reset');
  
  try {
    createBuildDir();
    minifyCSS();
    optimizeHTML();
    copyAssets();
    optimizeImages();
    createManifest();
    createServiceWorker();
    createReadme();
    generateStats();
    
    log('', 'reset');
    log('🎉 Build de produção concluído com sucesso!', 'green');
    log(`📁 Arquivos disponíveis em: ${BUILD_DIR}/`, 'green');
    log('', 'reset');
    log('📋 Próximos passos:', 'yellow');
    log('   1. Teste os arquivos no diretório dist/', 'yellow');
    log('   2. Configure HTTPS no servidor', 'yellow');
    log('   3. Configure headers de cache', 'yellow');
    log('   4. Faça deploy para produção', 'yellow');
    
  } catch (error) {
    log(`❌ Erro durante o build: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = {
  main,
  createBuildDir,
  minifyCSS,
  optimizeHTML,
  copyAssets,
  optimizeImages,
  createManifest,
  createServiceWorker
};