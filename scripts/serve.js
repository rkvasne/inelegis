#!/usr/bin/env node

/**
 * Servidor de desenvolvimento para Ineleg-App
 * Servidor HTTP simples com live reload e hot reload
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const paths = require('./project-paths');
const { copyDirectory } = require('./sync-js');

class DevServer {
  constructor() {
    this.port = process.env.PORT || 3000;
    this.projectRoot = paths.root;
    this.publicRoot = paths.publicDir;
    this.jsSrcDir = paths.js.src;
    this.jsPublicDir = paths.js.public;
    this.mimeTypes = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon',
      '.woff': 'font/woff',
      '.woff2': 'font/woff2',
      '.ttf': 'font/ttf',
      '.eot': 'application/vnd.ms-fontobject'
    };
    this.watchers = new Map();
    this.lastModified = Date.now();
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      info: '🌐',
      success: '✅',
      warning: '⚠️',
      error: '❌',
      reload: '🔄'
    }[type] || 'ℹ️';

    console.log(`${prefix} [${timestamp.split('T')[1].split('.')[0]}] ${message}`);
  }

  async start() {
    this.log('Iniciando servidor de desenvolvimento...', 'info');

    // Garantir que os arquivos JS estão sincronizados antes de subir o servidor
    this.syncJsAssets();

    const server = http.createServer((req, res) => {
      this.handleRequest(req, res);
    });

    server.listen(this.port, () => {
      this.log(`Servidor rodando em http://localhost:${this.port}`, 'success');
      this.log('Pressione Ctrl+C para parar o servidor', 'info');

      // Abrir navegador automaticamente
      this.openBrowser();

      // Configurar watchers para live reload
      this.setupWatchers();
    });

    // Graceful shutdown
    process.on('SIGINT', () => {
      this.log('Parando servidor...', 'info');
      this.cleanup();
      process.exit(0);
    });
  }

  handleRequest(req, res) {
    let filePath = req.url === '/' ? '/index.html' : req.url;

    // Remover query parameters
    filePath = filePath.split('?')[0];

    // Prevenir directory traversal
    if (filePath.includes('..')) {
      this.sendError(res, 403, 'Forbidden');
      return;
    }

    const normalized = filePath.replace(/^\/+/, '');
    const fullPath = path.join(this.publicRoot, normalized);

    // Verificar se arquivo existe
    if (!fs.existsSync(fullPath)) {
      // Tentar adicionar .html se não tiver extensão (Clean URLs)
      if (path.extname(filePath) === '') {
        const htmlPath = fullPath + '.html';
        if (fs.existsSync(htmlPath)) {
          this.serveFile(res, htmlPath, '.html');
          return;
        }
      }

      // Para SPAs, redirecionar para index.html (fallback)
      if (path.extname(filePath) === '') {
        this.serveFile(res, paths.pages.index, '.html');
        return;
      }

      this.sendError(res, 404, 'Not Found');
      return;
    }

    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Servir index.html se for diretório
      const indexPath = path.join(fullPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        this.serveFile(res, indexPath, '.html');
      } else {
        this.sendDirectoryListing(res, fullPath, filePath);
      }
      return;
    }

    // Servir arquivo
    const ext = path.extname(filePath);
    this.serveFile(res, fullPath, ext);
  }

  serveFile(res, filePath, ext) {
    try {
      let content = fs.readFileSync(filePath);
      const mimeType = this.mimeTypes[ext] || 'application/octet-stream';

      // Injetar live reload script em HTML
      if (ext === '.html') {
        const htmlContent = content.toString();
        const liveReloadScript = this.getLiveReloadScript();
        content = htmlContent.replace('</body>', `${liveReloadScript}</body>`);
      }

      res.writeHead(200, {
        'Content-Type': mimeType,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });

      res.end(content);

      this.log(`${this.getStatusIcon(200)} ${filePath}`, 'info');

    } catch (error) {
      this.log(`Erro ao servir ${filePath}: ${error.message}`, 'error');
      this.sendError(res, 500, 'Internal Server Error');
    }
  }

  sendError(res, statusCode, message) {
    const errorPage = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Erro ${statusCode} - Ineleg-App</title>
        <style>
          body { 
            font-family: 'Inter', sans-serif; 
            margin: 0; 
            padding: 40px; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .error-container {
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            text-align: center;
            max-width: 500px;
          }
          .error-code { 
            font-size: 72px; 
            font-weight: bold; 
            color: #ef4444;
            margin-bottom: 20px;
          }
          .error-message { 
            font-size: 24px; 
            margin-bottom: 30px;
            color: #666;
          }
          .back-link {
            display: inline-block;
            padding: 12px 24px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            text-decoration: none;
            border-radius: 10px;
            font-weight: 600;
            transition: transform 0.2s;
          }
          .back-link:hover {
            transform: translateY(-2px);
          }
        </style>
      </head>
      <body>
        <div class="error-container">
          <div class="error-code">${statusCode}</div>
          <div class="error-message">${message}</div>
          <a href="/" class="back-link">← Voltar ao Início</a>
        </div>
      </body>
      </html>
    `;

    res.writeHead(statusCode, { 'Content-Type': 'text/html' });
    res.end(errorPage);

    this.log(`${this.getStatusIcon(statusCode)} ${statusCode} ${message}`, 'error');
  }

  sendDirectoryListing(res, dirPath, urlPath) {
    try {
      const files = fs.readdirSync(dirPath);

      const listing = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Diretório ${urlPath} - Ineleg-App</title>
          <style>
            body { 
              font-family: 'Inter', sans-serif; 
              margin: 0; 
              padding: 40px; 
              background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            }
            .container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
              padding: 40px;
              border-radius: 20px;
              box-shadow: 0 10px 40px rgba(0,0,0,0.1);
            }
            h1 { color: #333; margin-bottom: 30px; }
            .file-list { list-style: none; padding: 0; }
            .file-item { 
              padding: 12px; 
              border-bottom: 1px solid #eee; 
              display: flex;
              align-items: center;
              gap: 12px;
            }
            .file-item:hover { background: #f8f9fa; }
            .file-link { 
              text-decoration: none; 
              color: #667eea; 
              font-weight: 500;
              flex: 1;
            }
            .file-link:hover { color: #5a67d8; }
            .file-icon { font-size: 18px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>📁 Diretório: ${urlPath}</h1>
            <ul class="file-list">
              ${urlPath !== '/' ? '<li class="file-item"><span class="file-icon">📁</span><a href="../" class="file-link">.. (voltar)</a></li>' : ''}
              ${files.map(file => {
        const filePath = path.join(dirPath, file);
        const isDir = fs.statSync(filePath).isDirectory();
        const icon = isDir ? '📁' : this.getFileIcon(file);
        const href = path.posix.join(urlPath, file);
        return `<li class="file-item"><span class="file-icon">${icon}</span><a href="${href}" class="file-link">${file}</a></li>`;
      }).join('')}
            </ul>
          </div>
        </body>
        </html>
      `;

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(listing);

    } catch (error) {
      this.sendError(res, 500, 'Erro ao listar diretório');
    }
  }

  getLiveReloadScript() {
    return `
      <script>
        // Live Reload para desenvolvimento
        (function() {
          let lastModified = {};
          
          function checkForChanges() {
            fetch('/api/changes', { method: 'HEAD' })
              .then(response => {
                const modified = response.headers.get('last-modified');
                if (lastModified.value && modified !== lastModified.value) {
                  console.log('🔄 Arquivos modificados, recarregando...');
                  window.location.reload();
                }
                lastModified.value = modified;
              })
              .catch(() => {
                // Ignorar erros de rede
              });
          }
          
          // Verificar mudanças a cada 1 segundo
          setInterval(checkForChanges, 1000);
          
          console.log('🌐 Live reload ativo - arquivos serão recarregados automaticamente');
        })();
      </script>
    `;
  }

  setupWatchers() {
    const publicWatcher = fs.watch(this.publicRoot, { recursive: true }, (_, filename) => {
      if (filename) {
        this.log(`Arquivo modificado (public): ${filename}`, 'reload');
        this.lastModified = Date.now();
      }
    });
    this.watchers.set('public', publicWatcher);
    this.log(`Monitorando: ${path.relative(this.projectRoot, this.publicRoot)}`, 'info');

    const jsWatcher = fs.watch(this.jsSrcDir, { recursive: true }, (_, filename) => {
      if (filename) {
        this.log(`Atualizando assets JS: ${filename}`, 'reload');
        try {
          this.syncJsAssets();
        } catch (error) {
          this.log(`Falha ao sincronizar JS: ${error.message}`, 'error');
        }
        this.lastModified = Date.now();
      }
    });
    this.watchers.set('src/js', jsWatcher);
    this.log(`Monitorando: ${path.relative(this.projectRoot, this.jsSrcDir)}`, 'info');
  }

  syncJsAssets() {
    copyDirectory(this.jsSrcDir, this.jsPublicDir);
    this.log('JS sincronizado com public/assets/js', 'success');
  }

  cleanup() {
    for (const [path, watcher] of this.watchers) {
      watcher.close();
      this.log(`Parou de monitorar: ${path}`, 'info');
    }
    this.watchers.clear();
  }

  openBrowser() {
    const url = `http://localhost:${this.port}`;

    try {
      const platform = process.platform;
      let command;

      if (platform === 'win32') {
        command = `start ${url}`;
      } else if (platform === 'darwin') {
        command = `open ${url}`;
      } else {
        command = `xdg-open ${url}`;
      }

      execSync(command);
      this.log('Navegador aberto automaticamente', 'success');

    } catch (error) {
      this.log(`Não foi possível abrir o navegador automaticamente. Acesse: ${url}`, 'warning');
    }
  }

  getStatusIcon(statusCode) {
    if (statusCode >= 200 && statusCode < 300) return '✅';
    if (statusCode >= 300 && statusCode < 400) return '🔄';
    if (statusCode >= 400 && statusCode < 500) return '⚠️';
    return '❌';
  }

  getFileIcon(filename) {
    const ext = path.extname(filename).toLowerCase();
    const icons = {
      '.html': '🌐',
      '.css': '🎨',
      '.js': '⚡',
      '.json': '📋',
      '.md': '📝',
      '.png': '🖼️',
      '.jpg': '🖼️',
      '.jpeg': '🖼️',
      '.gif': '🖼️',
      '.svg': '🎯',
      '.ico': '🔷',
      '.pdf': '📄',
      '.txt': '📄'
    };

    return icons[ext] || '📄';
  }
}

// Executar servidor se chamado diretamente
if (require.main === module) {
  const server = new DevServer();
  server.start().catch(error => {
    console.error('❌ Erro fatal no servidor:', error);
    process.exit(1);
  });
}

module.exports = DevServer;
