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
require('dotenv').config();

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

    // Garantir que os arquivos JS estão sincronizados
    this.syncJsAssets();

    const server = http.createServer((req, res) => {
      this.handleRequest(req, res);
    });

    server.listen(this.port, () => {
      this.log(`Servidor rodando em http://localhost:${this.port}`, 'success');
      this.log('Pressione Ctrl+C para parar o servidor', 'info');
      this.openBrowser();
      this.setupWatchers();
    });

    process.on('SIGINT', () => {
      this.log('Parando servidor...', 'info');
      this.cleanup();
      process.exit(0);
    });
  }

  handleRequest(req, res) {
    let filePath = req.url === '/' ? '/index.html' : req.url;

    // Tratamento para API (Mocks ou Proxy se necessário)
    // Com Supabase migration, APIs são externas
    if (req.url.startsWith('/api/')) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'API migrated to Supabase' }));
      return;
    }

    // Remover query string da URL para encontrar o arquivo
    filePath = filePath.split('?')[0];

    // Tratamento para live reload
    if (filePath === '/__live_reload') {
      this.handleLiveReload(req, res);
      return;
    }

    // Tratamento para SPA (fallback para index.html se não encontrar)
    // Mas como é multi-page, vamos tentar encontrar o arquivo
    const extname = path.extname(filePath);
    let contentType = this.mimeTypes[extname] || 'application/octet-stream';
    let fullPath = path.join(this.publicRoot, filePath);

    // Se é diretório ou sem extensão, tenta adicionar .html
    if (!extname || extname === '') {
      if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
        fullPath = path.join(fullPath, 'index.html');
        contentType = 'text/html';
      } else if (fs.existsSync(fullPath + '.html')) {
        fullPath = fullPath + '.html';
        contentType = 'text/html';
      }
    }

    fs.readFile(fullPath, (err, content) => {
      if (err) {
        if (err.code === 'ENOENT') {
          // Arquivo não encontrado
          res.writeHead(404);
          res.end('<h1>404 Not Found</h1>');
        } else {
          // Erro de servidor
          res.writeHead(500);
          res.end(`Server Error: ${err.code}`);
        }
      } else {
        // Sucesso
        res.writeHead(200, { 'Content-Type': contentType });

        // Injetar script de live reload em arquivos HTML
        if (contentType === 'text/html') {
          const liveReloadScript = `
            <script>
              (function() {
                const check = () => {
                  fetch('/__live_reload')
                    .then(res => res.json())
                    .then(data => {
                      if (data.reload) window.location.reload();
                      else setTimeout(check, 1000);
                    })
                    .catch(() => setTimeout(check, 1000));
                };
                setTimeout(check, 1000);
              })();
            </script>
          `;
          res.end(content + liveReloadScript, 'utf-8');
        } else {
          res.end(content, 'utf-8');
        }
      }
    });
  }

  handleLiveReload(req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    const needsReload = this.lastModified > (req.headers['last-modified'] || 0);
    // Na verdade, o cliente faz polling.
    // Vamos simplificar: retorna se deve recarregar baseado no tempo
    // O cliente vai apenas perguntar "devo recarregar?".
    // Implementação simples de polling:

    // O cliente deve enviar o timestamp da ultima verificação?
    // Vamos usar um SSE (Server Sent Events) seria melhor, mas polling serve.
    // Para simplificar: apenas retorna false, e quando eu mudo lastModified o cliente recarrega.

    // Implementação correta: Long Polling ou apenas retornar status
    const clientTime = parseInt(req.url.split('t=')[1] || '0');

    if (this.lastModified > clientTime) {
      res.end(JSON.stringify({ reload: true, timestamp: this.lastModified }));
    } else {
      res.end(JSON.stringify({ reload: false }));
    }
  }

  openBrowser() {
    const startCmd = process.platform === 'win32' ? 'start' : 'open';
    try {
      execSync(`${startCmd} http://localhost:${this.port}`);
    } catch (e) {
      this.log('Não foi possível abrir o navegador automaticamente', 'warning');
    }
  }

  setupWatchers() {
    const watchDir = (dir) => {
      if (!fs.existsSync(dir)) return;

      this.log(`Monitorando diretório: ${path.relative(this.projectRoot, dir)}`, 'info');

      fs.watch(dir, { recursive: true }, (eventType, filename) => {
        if (filename && !filename.includes('node_modules') && !filename.includes('.git')) {
          this.log(`Alteração detectada em ${filename}`, 'reload');

          // Se for JS em src, sincronizar
          if (dir.startsWith(this.jsSrcDir)) {
            this.syncJsAssets();
          }

          this.lastModified = Date.now();
        }
      });
    };

    watchDir(this.publicRoot);
    watchDir(this.jsSrcDir);
  }

  syncJsAssets() {
    try {
      copyDirectory(this.jsSrcDir, this.jsPublicDir, []);
      this.log('Assets JS sincronizados', 'success');
    } catch (err) {
      this.log('Erro ao sincronizar JS: ' + err.message, 'error');
    }
  }

  cleanup() {
    // Fechar conexões se houver
  }
}

const server = new DevServer();
server.start();
