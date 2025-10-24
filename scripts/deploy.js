#!/usr/bin/env node

/**
 * Script de deploy automatizado para Ineleg-App
 * Prepara e valida arquivos para deploy em produção
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class Deployer {
  constructor() {
    this.projectRoot = path.join(__dirname, '..');
    this.deployDir = path.join(this.projectRoot, 'deploy');
    this.environment = process.env.NODE_ENV || 'production';
    this.version = this.getVersion();
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      info: '🚀',
      success: '✅',
      warning: '⚠️',
      error: '❌',
      deploy: '📦'
    }[type] || 'ℹ️';
    
    console.log(`${prefix} [${timestamp.split('T')[1].split('.')[0]}] ${message}`);
  }

  async deploy() {
    this.log(`Iniciando deploy para ${this.environment}...`, 'info');
    
    try {
      // 1. Validações pré-deploy
      await this.preDeployValidation();
      
      // 2. Executar build completo
      await this.runBuild();
      
      // 3. Executar otimização
      await this.runOptimization();
      
      // 4. Preparar arquivos de deploy
      await this.prepareDeployFiles();
      
      // 5. Validações pós-build
      await this.postBuildValidation();
      
      // 6. Gerar manifesto de deploy
      await this.generateDeployManifest();
      
      // 7. Criar pacote de deploy
      await this.createDeployPackage();
      
      // 8. Relatório final
      this.generateDeployReport();
      
    } catch (error) {
      this.log(`Deploy falhou: ${error.message}`, 'error');
      process.exit(1);
    }
  }

  async preDeployValidation() {
    this.log('Executando validações pré-deploy...', 'info');
    
    // Verificar se está em branch main/master
    try {
      const branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
      if (!['main', 'master', 'production'].includes(branch)) {
        this.log(`Aviso: Deploy sendo feito da branch '${branch}'`, 'warning');
      }
    } catch (error) {
      this.log('Não foi possível verificar branch Git', 'warning');
    }
    
    // Verificar se há mudanças não commitadas
    try {
      const status = execSync('git status --porcelain', { encoding: 'utf8' });
      if (status.trim()) {
        this.log('Aviso: Há mudanças não commitadas', 'warning');
      }
    } catch (error) {
      this.log('Não foi possível verificar status Git', 'warning');
    }
    
    // Verificar arquivos obrigatórios
    const requiredFiles = [
      'index.html',
      'styles.css',
      'script.js',
      'data.js',
      'manifest.json'
    ];
    
    for (const file of requiredFiles) {
      const filePath = path.join(this.projectRoot, file);
      if (!fs.existsSync(filePath)) {
        throw new Error(`Arquivo obrigatório não encontrado: ${file}`);
      }
    }
    
    this.log('Validações pré-deploy concluídas ✓', 'success');
  }

  async runBuild() {
    this.log('Executando build...', 'info');
    
    try {
      execSync('npm run build', { 
        cwd: this.projectRoot,
        stdio: 'pipe'
      });
      this.log('Build executado com sucesso ✓', 'success');
    } catch (error) {
      throw new Error(`Build falhou: ${error.message}`);
    }
  }

  async runOptimization() {
    this.log('Executando otimização...', 'info');
    
    try {
      execSync('node scripts/optimize.js', { 
        cwd: this.projectRoot,
        stdio: 'pipe'
      });
      this.log('Otimização executada com sucesso ✓', 'success');
    } catch (error) {
      this.log(`Otimização falhou: ${error.message}`, 'warning');
      // Continuar sem otimização se falhar
    }
  }

  async prepareDeployFiles() {
    this.log('Preparando arquivos de deploy...', 'info');
    
    // Criar diretório de deploy
    if (fs.existsSync(this.deployDir)) {
      fs.rmSync(this.deployDir, { recursive: true });
    }
    fs.mkdirSync(this.deployDir, { recursive: true });
    
    // Determinar fonte (otimizada ou normal)
    const optimizedDir = path.join(this.projectRoot, 'dist-optimized');
    const distDir = path.join(this.projectRoot, 'dist');
    const sourceDir = fs.existsSync(optimizedDir) ? optimizedDir : distDir;
    
    if (!fs.existsSync(sourceDir)) {
      throw new Error('Diretório de build não encontrado');
    }
    
    // Copiar arquivos
    this.copyDirectory(sourceDir, this.deployDir);
    
    // Adicionar arquivos específicos de produção
    await this.addProductionFiles();
    
    this.log(`Arquivos preparados de: ${path.basename(sourceDir)}`, 'success');
  }

  async addProductionFiles() {
    // Criar .htaccess para Apache
    const htaccess = `
# Ineleg-App - Configuração Apache
RewriteEngine On

# Redirecionar para HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# SPA - Redirecionar tudo para index.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Cache de arquivos estáticos
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>

# Compressão Gzip
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Segurança
<IfModule mod_headers.c>
    Header always set X-Frame-Options DENY
    Header always set X-Content-Type-Options nosniff
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set Permissions-Policy "geolocation=(), microphone=(), camera=()"
</IfModule>
    `.trim();
    
    fs.writeFileSync(path.join(this.deployDir, '.htaccess'), htaccess);
    
    // Criar robots.txt
    const robots = `
User-agent: *
Allow: /

Sitemap: https://seu-dominio.com/sitemap.xml
    `.trim();
    
    fs.writeFileSync(path.join(this.deployDir, 'robots.txt'), robots);
    
    // Criar sitemap.xml básico
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://seu-dominio.com/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
    
    fs.writeFileSync(path.join(this.deployDir, 'sitemap.xml'), sitemap);
    
    this.log('Arquivos de produção adicionados', 'success');
  }

  async postBuildValidation() {
    this.log('Executando validações pós-build...', 'info');
    
    // Verificar se arquivos essenciais existem
    const essentialFiles = [
      'index.html',
      'manifest.json'
    ];
    
    for (const file of essentialFiles) {
      const filePath = path.join(this.deployDir, file);
      if (!fs.existsSync(filePath)) {
        throw new Error(`Arquivo essencial não encontrado no deploy: ${file}`);
      }
    }
    
    // Verificar tamanho dos arquivos
    const maxSizes = {
      'index.html': 100 * 1024, // 100KB
      'styles.css': 200 * 1024,  // 200KB
      'styles.min.css': 200 * 1024,
      'script.js': 500 * 1024,   // 500KB
      'script.min.js': 500 * 1024,
      'data.js': 300 * 1024,     // 300KB
      'data.min.js': 300 * 1024
    };
    
    for (const [file, maxSize] of Object.entries(maxSizes)) {
      const filePath = path.join(this.deployDir, file);
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        if (stats.size > maxSize) {
          this.log(`Aviso: ${file} é maior que o esperado (${this.formatBytes(stats.size)})`, 'warning');
        }
      }
    }
    
    this.log('Validações pós-build concluídas ✓', 'success');
  }

  async generateDeployManifest() {
    this.log('Gerando manifesto de deploy...', 'info');
    
    const files = this.getFileList(this.deployDir);
    const manifest = {
      version: this.version,
      environment: this.environment,
      deployDate: new Date().toISOString(),
      buildNumber: Date.now(),
      files: files.map(file => ({
        path: path.relative(this.deployDir, file),
        size: fs.statSync(file).size,
        hash: this.getFileHash(file)
      })),
      totalSize: files.reduce((sum, file) => sum + fs.statSync(file).size, 0),
      fileCount: files.length
    };
    
    fs.writeFileSync(
      path.join(this.deployDir, 'deploy-manifest.json'),
      JSON.stringify(manifest, null, 2)
    );
    
    this.log('Manifesto de deploy gerado ✓', 'success');
    return manifest;
  }

  async createDeployPackage() {
    this.log('Criando pacote de deploy...', 'info');
    
    const packageName = `ineleg-app-${this.version}-${Date.now()}.tar.gz`;
    const packagePath = path.join(this.projectRoot, packageName);
    
    try {
      // Criar arquivo tar.gz
      execSync(`tar -czf "${packagePath}" -C "${this.deployDir}" .`, {
        cwd: this.projectRoot
      });
      
      const stats = fs.statSync(packagePath);
      this.log(`Pacote criado: ${packageName} (${this.formatBytes(stats.size)})`, 'success');
      
      return packagePath;
    } catch (error) {
      this.log('Não foi possível criar pacote tar.gz (tar não disponível)', 'warning');
      return null;
    }
  }

  getFileList(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        this.getFileList(filePath, fileList);
      } else {
        fileList.push(filePath);
      }
    }
    
    return fileList;
  }

  getFileHash(filePath) {
    const crypto = require('crypto');
    const content = fs.readFileSync(filePath);
    return crypto.createHash('md5').update(content).digest('hex').substring(0, 8);
  }

  copyDirectory(src, dest) {
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      
      if (entry.isDirectory()) {
        fs.mkdirSync(destPath, { recursive: true });
        this.copyDirectory(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }

  getVersion() {
    try {
      const packageJson = JSON.parse(fs.readFileSync(path.join(this.projectRoot, 'package.json'), 'utf8'));
      return packageJson.version;
    } catch {
      return '0.0.2';
    }
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  generateDeployReport() {
    const files = this.getFileList(this.deployDir);
    const totalSize = files.reduce((sum, file) => sum + fs.statSync(file).size, 0);
    
    console.log('\n' + '='.repeat(60));
    console.log('🚀 RELATÓRIO DE DEPLOY - INELEG-APP v0.0.2');
    console.log('='.repeat(60));
    console.log(`Versão: ${this.version}`);
    console.log(`Ambiente: ${this.environment}`);
    console.log(`Arquivos: ${files.length}`);
    console.log(`Tamanho total: ${this.formatBytes(totalSize)}`);
    console.log(`Diretório: ${this.deployDir}`);
    console.log('='.repeat(60));
    
    this.log('Deploy preparado com sucesso! 🚀', 'success');
    console.log(`\n📦 Arquivos prontos para deploy em: ${this.deployDir}`);
    
    // Instruções de deploy
    console.log('\n📋 PRÓXIMOS PASSOS:');
    console.log('1. Faça upload dos arquivos do diretório deploy/ para seu servidor');
    console.log('2. Configure seu servidor web (Apache/Nginx) conforme .htaccess');
    console.log('3. Verifique se o SSL está configurado corretamente');
    console.log('4. Teste a aplicação em produção');
  }
}

// Executar deploy se chamado diretamente
if (require.main === module) {
  const deployer = new Deployer();
  deployer.deploy().catch(error => {
    console.error('❌ Erro fatal no deploy:', error);
    process.exit(1);
  });
}

module.exports = Deployer;