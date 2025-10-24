#!/usr/bin/env node

/**
 * Script de otimização para Ineleg-App
 * Minifica CSS, JS e otimiza imagens para produção
 */

const fs = require('fs');
const path = require('path');

class Optimizer {
  constructor() {
    this.projectRoot = path.join(__dirname, '..');
    this.distDir = path.join(this.projectRoot, 'dist');
    this.optimizedDir = path.join(this.projectRoot, 'dist-optimized');
    this.stats = {
      originalSize: 0,
      optimizedSize: 0,
      savings: 0
    };
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      info: '⚡',
      success: '✅',
      warning: '⚠️',
      error: '❌'
    }[type] || 'ℹ️';
    
    console.log(`${prefix} [${timestamp.split('T')[1].split('.')[0]}] ${message}`);
  }

  async optimize() {
    this.log('Iniciando otimização para produção...', 'info');
    
    try {
      // 1. Criar diretório otimizado
      await this.createOptimizedDir();
      
      // 2. Otimizar CSS
      await this.optimizeCSS();
      
      // 3. Otimizar JavaScript
      await this.optimizeJS();
      
      // 4. Otimizar HTML
      await this.optimizeHTML();
      
      // 5. Copiar outros arquivos
      await this.copyOtherFiles();
      
      // 6. Gerar relatório
      this.generateReport();
      
    } catch (error) {
      this.log(`Otimização falhou: ${error.message}`, 'error');
      process.exit(1);
    }
  }

  async createOptimizedDir() {
    if (fs.existsSync(this.optimizedDir)) {
      fs.rmSync(this.optimizedDir, { recursive: true });
    }
    fs.mkdirSync(this.optimizedDir, { recursive: true });
    
    this.log('Diretório otimizado criado', 'success');
  }

  async optimizeCSS() {
    this.log('Otimizando CSS...', 'info');
    
    const cssPath = path.join(this.distDir, 'styles.css');
    const optimizedCssPath = path.join(this.optimizedDir, 'styles.min.css');
    
    if (!fs.existsSync(cssPath)) {
      this.log('Arquivo CSS não encontrado', 'warning');
      return;
    }
    
    let css = fs.readFileSync(cssPath, 'utf8');
    const originalSize = Buffer.byteLength(css, 'utf8');
    
    // Minificação básica de CSS
    css = this.minifyCSS(css);
    
    fs.writeFileSync(optimizedCssPath, css);
    
    const optimizedSize = Buffer.byteLength(css, 'utf8');
    const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
    
    this.stats.originalSize += originalSize;
    this.stats.optimizedSize += optimizedSize;
    
    this.log(`CSS otimizado: ${this.formatBytes(originalSize)} → ${this.formatBytes(optimizedSize)} (${savings}% menor)`, 'success');
  }

  minifyCSS(css) {
    return css
      // Remover comentários
      .replace(/\/\*[\s\S]*?\*\//g, '')
      // Remover espaços extras
      .replace(/\s+/g, ' ')
      // Remover espaços ao redor de caracteres especiais
      .replace(/\s*([{}:;,>+~])\s*/g, '$1')
      // Remover último ponto e vírgula antes de }
      .replace(/;}/g, '}')
      // Remover espaços no início e fim
      .trim();
  }

  async optimizeJS() {
    this.log('Otimizando JavaScript...', 'info');
    
    const jsFiles = ['script.js', 'data.js'];
    
    for (const file of jsFiles) {
      const jsPath = path.join(this.distDir, file);
      const optimizedJsPath = path.join(this.optimizedDir, file.replace('.js', '.min.js'));
      
      if (!fs.existsSync(jsPath)) {
        this.log(`Arquivo ${file} não encontrado`, 'warning');
        continue;
      }
      
      let js = fs.readFileSync(jsPath, 'utf8');
      const originalSize = Buffer.byteLength(js, 'utf8');
      
      // Minificação básica de JavaScript
      js = this.minifyJS(js);
      
      fs.writeFileSync(optimizedJsPath, js);
      
      const optimizedSize = Buffer.byteLength(js, 'utf8');
      const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
      
      this.stats.originalSize += originalSize;
      this.stats.optimizedSize += optimizedSize;
      
      this.log(`${file} otimizado: ${this.formatBytes(originalSize)} → ${this.formatBytes(optimizedSize)} (${savings}% menor)`, 'success');
    }
    
    // Copiar módulos JS
    const jsDir = path.join(this.distDir, 'js');
    const optimizedJsDir = path.join(this.optimizedDir, 'js');
    
    if (fs.existsSync(jsDir)) {
      fs.mkdirSync(optimizedJsDir, { recursive: true });
      this.copyDirectory(jsDir, optimizedJsDir);
      this.log('Módulos JS copiados', 'success');
    }
  }

  minifyJS(js) {
    return js
      // Remover comentários de linha
      .replace(/\/\/.*$/gm, '')
      // Remover comentários de bloco
      .replace(/\/\*[\s\S]*?\*\//g, '')
      // Remover espaços extras
      .replace(/\s+/g, ' ')
      // Remover espaços ao redor de operadores
      .replace(/\s*([=+\-*/%<>!&|{}();,])\s*/g, '$1')
      // Remover espaços no início e fim
      .trim();
  }

  async optimizeHTML() {
    this.log('Otimizando HTML...', 'info');
    
    const htmlPath = path.join(this.distDir, 'index.html');
    const optimizedHtmlPath = path.join(this.optimizedDir, 'index.html');
    
    if (!fs.existsSync(htmlPath)) {
      this.log('Arquivo HTML não encontrado', 'warning');
      return;
    }
    
    let html = fs.readFileSync(htmlPath, 'utf8');
    const originalSize = Buffer.byteLength(html, 'utf8');
    
    // Atualizar referências para arquivos minificados
    html = html
      .replace('styles.css', 'styles.min.css')
      .replace('script.js', 'script.min.js')
      .replace('data.js', 'data.min.js');
    
    // Minificação básica de HTML
    html = this.minifyHTML(html);
    
    fs.writeFileSync(optimizedHtmlPath, html);
    
    const optimizedSize = Buffer.byteLength(html, 'utf8');
    const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
    
    this.stats.originalSize += originalSize;
    this.stats.optimizedSize += optimizedSize;
    
    this.log(`HTML otimizado: ${this.formatBytes(originalSize)} → ${this.formatBytes(optimizedSize)} (${savings}% menor)`, 'success');
  }

  minifyHTML(html) {
    return html
      // Remover comentários HTML
      .replace(/<!--[\s\S]*?-->/g, '')
      // Remover espaços extras entre tags
      .replace(/>\s+</g, '><')
      // Remover espaços no início e fim de linhas
      .replace(/^\s+|\s+$/gm, '')
      // Remover linhas vazias
      .replace(/\n\s*\n/g, '\n')
      .trim();
  }

  async copyOtherFiles() {
    this.log('Copiando outros arquivos...', 'info');
    
    const filesToCopy = [
      'manifest.json',
      'sw.js',
      'build-info.json'
    ];
    
    for (const file of filesToCopy) {
      const srcPath = path.join(this.distDir, file);
      const destPath = path.join(this.optimizedDir, file);
      
      if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        this.log(`Copiado: ${file}`, 'info');
      }
    }
    
    // Copiar diretório de ícones
    const iconsDir = path.join(this.distDir, 'icons');
    const optimizedIconsDir = path.join(this.optimizedDir, 'icons');
    
    if (fs.existsSync(iconsDir)) {
      fs.mkdirSync(optimizedIconsDir, { recursive: true });
      this.copyDirectory(iconsDir, optimizedIconsDir);
      this.log('Ícones copiados', 'success');
    }
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

  formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  generateReport() {
    const totalSavings = this.stats.originalSize > 0 
      ? ((this.stats.originalSize - this.stats.optimizedSize) / this.stats.originalSize * 100).toFixed(1)
      : 0;
    
    const report = {
      timestamp: new Date().toISOString(),
      version: '0.0.2',
      optimization: {
        originalSize: this.stats.originalSize,
        optimizedSize: this.stats.optimizedSize,
        savings: totalSavings,
        outputDir: this.optimizedDir
      }
    };
    
    // Salvar relatório
    fs.writeFileSync(
      path.join(this.optimizedDir, 'optimization-report.json'),
      JSON.stringify(report, null, 2)
    );
    
    // Exibir resumo
    console.log('\n' + '='.repeat(60));
    console.log('⚡ RELATÓRIO DE OTIMIZAÇÃO - INELEG-APP v0.0.2');
    console.log('='.repeat(60));
    console.log(`Tamanho original: ${this.formatBytes(this.stats.originalSize)}`);
    console.log(`Tamanho otimizado: ${this.formatBytes(this.stats.optimizedSize)}`);
    console.log(`Economia: ${totalSavings}%`);
    console.log(`Diretório: ${this.optimizedDir}`);
    console.log('='.repeat(60));
    
    this.log('Otimização concluída com sucesso! ⚡', 'success');
    console.log(`\n📦 Arquivos otimizados disponíveis em: ${this.optimizedDir}`);
  }
}

// Executar otimização se chamado diretamente
if (require.main === module) {
  const optimizer = new Optimizer();
  optimizer.optimize().catch(error => {
    console.error('❌ Erro fatal na otimização:', error);
    process.exit(1);
  });
}

module.exports = Optimizer;