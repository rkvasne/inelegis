#!/usr/bin/env node

/**
 * Script de lint para Ineleg-App
 * Verifica qualidade de código, padrões e boas práticas
 */

const fs = require('fs');
const path = require('path');

class Linter {
  constructor() {
    this.projectRoot = path.join(__dirname, '..');
    this.errors = [];
    this.warnings = [];
    this.suggestions = [];
    this.fixMode = process.argv.includes('--fix');
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      info: '🔍',
      success: '✅',
      warning: '⚠️',
      error: '❌',
      fix: '🔧'
    }[type] || 'ℹ️';
    
    console.log(`${prefix} [${timestamp.split('T')[1].split('.')[0]}] ${message}`);
  }

  async lint() {
    this.log('Iniciando lint do Ineleg-App v0.0.2', 'info');
    
    try {
      // 1. Lint HTML
      await this.lintHTML();
      
      // 2. Lint CSS
      await this.lintCSS();
      
      // 3. Lint JavaScript
      await this.lintJavaScript();
      
      // 4. Lint JSON
      await this.lintJSON();
      
      // 5. Verificar estrutura de arquivos
      await this.lintFileStructure();
      
      // 6. Verificar acessibilidade
      await this.lintAccessibility();
      
      // 7. Verificar performance
      await this.lintPerformance();
      
      // 8. Gerar relatório
      this.generateReport();
      
    } catch (error) {
      this.log(`Lint falhou: ${error.message}`, 'error');
      process.exit(1);
    }
  }

  async lintHTML() {
    this.log('Verificando HTML...', 'info');
    
    const htmlPath = path.join(this.projectRoot, 'index.html');
    const content = fs.readFileSync(htmlPath, 'utf8');
    
    // Verificações de estrutura HTML
    const htmlChecks = [
      {
        test: () => content.includes('<!DOCTYPE html>'),
        message: 'DOCTYPE HTML5 presente',
        type: 'error',
        fix: () => '<!DOCTYPE html> deve estar no início do arquivo'
      },
      {
        test: () => content.includes('lang="pt-BR"'),
        message: 'Atributo lang definido corretamente',
        type: 'error'
      },
      {
        test: () => content.includes('charset="UTF-8"'),
        message: 'Charset UTF-8 definido',
        type: 'error'
      },
      {
        test: () => content.includes('viewport'),
        message: 'Meta viewport presente para responsividade',
        type: 'error'
      },
      {
        test: () => content.includes('manifest.json'),
        message: 'Manifest PWA linkado',
        type: 'warning'
      },
      {
        test: () => content.includes('apple-touch-icon'),
        message: 'Ícone Apple Touch definido',
        type: 'warning'
      },
      {
        test: () => !content.includes('style='),
        message: 'Sem estilos inline (boas práticas)',
        type: 'suggestion'
      },
      {
        test: () => content.includes('alt='),
        message: 'Atributos alt em imagens para acessibilidade',
        type: 'warning'
      },
      {
        test: () => content.includes('aria-'),
        message: 'Atributos ARIA para acessibilidade',
        type: 'suggestion'
      },
      {
        test: () => content.includes('role='),
        message: 'Atributos role para semântica',
        type: 'suggestion'
      }
    ];
    
    this.runChecks('HTML', htmlChecks);
  }

  async lintCSS() {
    this.log('Verificando CSS...', 'info');
    
    const cssPath = path.join(this.projectRoot, 'styles.css');
    const content = fs.readFileSync(cssPath, 'utf8');
    
    const cssChecks = [
      {
        test: () => content.includes(':root'),
        message: 'Variáveis CSS definidas em :root',
        type: 'suggestion'
      },
      {
        test: () => content.includes('--'),
        message: 'Custom properties utilizadas',
        type: 'suggestion'
      },
      {
        test: () => content.includes('@media'),
        message: 'Media queries para responsividade',
        type: 'warning'
      },
      {
        test: () => content.includes('transition'),
        message: 'Transições CSS para UX suave',
        type: 'suggestion'
      },
      {
        test: () => content.includes('@keyframes'),
        message: 'Animações CSS definidas',
        type: 'suggestion'
      },
      {
        test: () => content.includes('backdrop-filter'),
        message: 'Efeitos modernos (glassmorphism)',
        type: 'suggestion'
      },
      {
        test: () => !content.includes('!important'),
        message: 'Evitar !important (boas práticas)',
        type: 'warning'
      },
      {
        test: () => content.includes('box-sizing: border-box'),
        message: 'Box-sizing border-box definido',
        type: 'suggestion'
      },
      {
        test: () => content.includes('font-display'),
        message: 'Font-display para performance',
        type: 'suggestion'
      }
    ];
    
    this.runChecks('CSS', cssChecks);
    
    // Verificar tamanho do arquivo CSS
    const sizeKB = Buffer.byteLength(content, 'utf8') / 1024;
    if (sizeKB > 100) {
      this.warnings.push(`CSS: Arquivo grande (${sizeKB.toFixed(1)}KB) - considere otimização`);
    } else {
      this.log(`CSS: Tamanho otimizado (${sizeKB.toFixed(1)}KB)`, 'success');
    }
  }

  async lintJavaScript() {
    this.log('Verificando JavaScript...', 'info');
    
    const jsFiles = ['script.js', 'data.js'];
    
    for (const file of jsFiles) {
      const jsPath = path.join(this.projectRoot, file);
      if (!fs.existsSync(jsPath)) continue;
      
      const content = fs.readFileSync(jsPath, 'utf8');
      
      const jsChecks = [
        {
          test: () => content.includes('use strict') || content.includes("'use strict'"),
          message: `${file}: Modo strict habilitado`,
          type: 'suggestion'
        },
        {
          test: () => !content.includes('var '),
          message: `${file}: Usar let/const em vez de var`,
          type: 'warning'
        },
        {
          test: () => content.includes('const ') || content.includes('let '),
          message: `${file}: Declarações modernas (let/const)`,
          type: 'suggestion'
        },
        {
          test: () => content.includes('=>'),
          message: `${file}: Arrow functions utilizadas`,
          type: 'suggestion'
        },
        {
          test: () => !content.includes('eval('),
          message: `${file}: Evitar eval() (segurança)`,
          type: 'error'
        },
        {
          test: () => content.includes('addEventListener'),
          message: `${file}: Event listeners modernos`,
          type: 'suggestion'
        },
        {
          test: () => content.includes('try {') && content.includes('catch'),
          message: `${file}: Tratamento de erros implementado`,
          type: 'suggestion'
        },
        {
          test: () => content.includes('//') || content.includes('/*'),
          message: `${file}: Código comentado`,
          type: 'suggestion'
        }
      ];
      
      this.runChecks('JavaScript', jsChecks);
      
      // Verificar tamanho do arquivo JS
      const sizeKB = Buffer.byteLength(content, 'utf8') / 1024;
      if (sizeKB > 200) {
        this.warnings.push(`${file}: Arquivo grande (${sizeKB.toFixed(1)}KB) - considere modularização`);
      }
    }
    
    // Verificar módulos JS
    const jsDir = path.join(this.projectRoot, 'js');
    if (fs.existsSync(jsDir)) {
      const modules = fs.readdirSync(jsDir).filter(f => f.endsWith('.js'));
      this.log(`Módulos JS encontrados: ${modules.length}`, 'success');
      
      // Verificar cada módulo
      for (const module of modules) {
        const modulePath = path.join(jsDir, module);
        const content = fs.readFileSync(modulePath, 'utf8');
        
        if (content.includes('window.App')) {
          this.log(`${module}: Namespace global definido`, 'success');
        }
      }
    }
  }

  async lintJSON() {
    this.log('Verificando arquivos JSON...', 'info');
    
    const jsonFiles = ['manifest.json', 'package.json'];
    
    for (const file of jsonFiles) {
      const jsonPath = path.join(this.projectRoot, file);
      if (!fs.existsSync(jsonPath)) continue;
      
      try {
        const content = fs.readFileSync(jsonPath, 'utf8');
        const parsed = JSON.parse(content);
        
        this.log(`${file}: JSON válido ✓`, 'success');
        
        // Verificações específicas por arquivo
        if (file === 'manifest.json') {
          this.lintManifest(parsed);
        } else if (file === 'package.json') {
          this.lintPackageJson(parsed);
        }
        
      } catch (error) {
        this.errors.push(`${file}: JSON inválido - ${error.message}`);
      }
    }
  }

  lintManifest(manifest) {
    const manifestChecks = [
      {
        test: () => manifest.name && manifest.name.length > 0,
        message: 'Manifest: Nome da aplicação definido',
        type: 'error'
      },
      {
        test: () => manifest.short_name && manifest.short_name.length > 0,
        message: 'Manifest: Nome curto definido',
        type: 'warning'
      },
      {
        test: () => manifest.start_url,
        message: 'Manifest: URL de início definida',
        type: 'error'
      },
      {
        test: () => manifest.display === 'standalone',
        message: 'Manifest: Modo standalone para PWA',
        type: 'suggestion'
      },
      {
        test: () => manifest.theme_color,
        message: 'Manifest: Cor do tema definida',
        type: 'suggestion'
      },
      {
        test: () => manifest.background_color,
        message: 'Manifest: Cor de fundo definida',
        type: 'suggestion'
      },
      {
        test: () => manifest.icons && manifest.icons.length > 0,
        message: 'Manifest: Ícones definidos',
        type: 'warning'
      }
    ];
    
    this.runChecks('Manifest', manifestChecks);
  }

  lintPackageJson(pkg) {
    const packageChecks = [
      {
        test: () => pkg.name && pkg.name.length > 0,
        message: 'Package.json: Nome do projeto definido',
        type: 'error'
      },
      {
        test: () => pkg.version && /^\d+\.\d+\.\d+/.test(pkg.version),
        message: 'Package.json: Versão semântica válida',
        type: 'error'
      },
      {
        test: () => pkg.description && pkg.description.length > 0,
        message: 'Package.json: Descrição definida',
        type: 'suggestion'
      },
      {
        test: () => pkg.scripts && Object.keys(pkg.scripts).length > 0,
        message: 'Package.json: Scripts definidos',
        type: 'suggestion'
      },
      {
        test: () => pkg.keywords && pkg.keywords.length > 0,
        message: 'Package.json: Palavras-chave definidas',
        type: 'suggestion'
      }
    ];
    
    this.runChecks('Package.json', packageChecks);
  }

  async lintFileStructure() {
    this.log('Verificando estrutura de arquivos...', 'info');
    
    const expectedStructure = {
      'index.html': 'error',
      'styles.css': 'error',
      'script.js': 'error',
      'data.js': 'error',
      'manifest.json': 'warning',
      'sw.js': 'warning',
      'README.md': 'suggestion',
      'js/': 'suggestion',
      'scripts/': 'suggestion',
      'tests/': 'suggestion',
      'icons/': 'warning'
    };
    
    for (const [item, level] of Object.entries(expectedStructure)) {
      const itemPath = path.join(this.projectRoot, item);
      const exists = fs.existsSync(itemPath);
      
      if (!exists) {
        const message = `Estrutura: ${item} não encontrado`;
        if (level === 'error') {
          this.errors.push(message);
        } else if (level === 'warning') {
          this.warnings.push(message);
        } else {
          this.suggestions.push(message);
        }
      } else {
        this.log(`Estrutura: ${item} ✓`, 'success');
      }
    }
  }

  async lintAccessibility() {
    this.log('Verificando acessibilidade...', 'info');
    
    const htmlPath = path.join(this.projectRoot, 'index.html');
    const content = fs.readFileSync(htmlPath, 'utf8');
    
    const a11yChecks = [
      {
        test: () => content.includes('alt='),
        message: 'A11y: Atributos alt em imagens',
        type: 'warning'
      },
      {
        test: () => content.includes('aria-label'),
        message: 'A11y: Labels ARIA para elementos',
        type: 'suggestion'
      },
      {
        test: () => content.includes('role='),
        message: 'A11y: Roles semânticos definidos',
        type: 'suggestion'
      },
      {
        test: () => content.includes('tabindex'),
        message: 'A11y: Navegação por teclado configurada',
        type: 'suggestion'
      },
      {
        test: () => content.includes('aria-live'),
        message: 'A11y: Regiões dinâmicas anunciadas',
        type: 'suggestion'
      },
      {
        test: () => content.includes('focus:'),
        message: 'A11y: Estados de foco visíveis',
        type: 'suggestion'
      }
    ];
    
    this.runChecks('Acessibilidade', a11yChecks);
  }

  async lintPerformance() {
    this.log('Verificando performance...', 'info');
    
    const htmlPath = path.join(this.projectRoot, 'index.html');
    const content = fs.readFileSync(htmlPath, 'utf8');
    
    const perfChecks = [
      {
        test: () => content.includes('preconnect'),
        message: 'Performance: Preconnect para recursos externos',
        type: 'suggestion'
      },
      {
        test: () => content.includes('defer') || content.includes('async'),
        message: 'Performance: Scripts com defer/async',
        type: 'suggestion'
      },
      {
        test: () => content.includes('loading="lazy"'),
        message: 'Performance: Lazy loading de imagens',
        type: 'suggestion'
      },
      {
        test: () => content.includes('serviceWorker'),
        message: 'Performance: Service Worker para cache',
        type: 'suggestion'
      }
    ];
    
    this.runChecks('Performance', perfChecks);
    
    // Verificar tamanhos de arquivos
    const files = ['styles.css', 'script.js', 'data.js'];
    let totalSize = 0;
    
    for (const file of files) {
      const filePath = path.join(this.projectRoot, file);
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        const sizeKB = stats.size / 1024;
        totalSize += sizeKB;
        
        if (sizeKB > 100) {
          this.warnings.push(`Performance: ${file} é grande (${sizeKB.toFixed(1)}KB)`);
        }
      }
    }
    
    this.log(`Performance: Tamanho total dos arquivos principais: ${totalSize.toFixed(1)}KB`, 'info');
  }

  runChecks(category, checks) {
    let passed = 0;
    
    for (const check of checks) {
      const result = check.test();
      
      if (result) {
        passed++;
      } else {
        const message = `${category}: ${check.message}`;
        
        if (check.type === 'error') {
          this.errors.push(message);
        } else if (check.type === 'warning') {
          this.warnings.push(message);
        } else {
          this.suggestions.push(message);
        }
        
        // Aplicar fix se disponível e modo fix ativo
        if (this.fixMode && check.fix) {
          this.log(`Aplicando fix: ${check.fix()}`, 'fix');
        }
      }
    }
    
    this.log(`${category}: ${passed}/${checks.length} verificações passaram`, 'success');
  }

  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      version: '0.0.2',
      summary: {
        errors: this.errors.length,
        warnings: this.warnings.length,
        suggestions: this.suggestions.length,
        status: this.errors.length === 0 ? 'PASS' : 'FAIL'
      },
      details: {
        errors: this.errors,
        warnings: this.warnings,
        suggestions: this.suggestions
      }
    };
    
    // Salvar relatório
    fs.writeFileSync(
      path.join(this.projectRoot, 'lint-report.json'),
      JSON.stringify(report, null, 2)
    );
    
    // Exibir resumo
    console.log('\n' + '='.repeat(60));
    console.log('🔍 RELATÓRIO DE LINT - INELEG-APP v0.0.2');
    console.log('='.repeat(60));
    console.log(`Status: ${report.summary.status}`);
    console.log(`Erros: ${this.errors.length}`);
    console.log(`Avisos: ${this.warnings.length}`);
    console.log(`Sugestões: ${this.suggestions.length}`);
    
    if (this.errors.length > 0) {
      console.log('\n❌ ERROS (devem ser corrigidos):');
      this.errors.forEach((error, i) => {
        console.log(`  ${i + 1}. ${error}`);
      });
    }
    
    if (this.warnings.length > 0) {
      console.log('\n⚠️ AVISOS (recomendado corrigir):');
      this.warnings.forEach((warning, i) => {
        console.log(`  ${i + 1}. ${warning}`);
      });
    }
    
    if (this.suggestions.length > 0) {
      console.log('\n💡 SUGESTÕES (melhorias opcionais):');
      this.suggestions.forEach((suggestion, i) => {
        console.log(`  ${i + 1}. ${suggestion}`);
      });
    }
    
    console.log('\n' + '='.repeat(60));
    
    if (this.errors.length === 0) {
      this.log('Lint concluído com sucesso! 🎉', 'success');
      
      if (this.warnings.length === 0 && this.suggestions.length === 0) {
        console.log('\n🏆 Código perfeito! Nenhum problema encontrado.');
      }
    } else {
      this.log('Lint falhou devido a erros críticos', 'error');
      console.log('\n💡 Execute com --fix para tentar correções automáticas');
      process.exit(1);
    }
  }
}

// Executar lint se chamado diretamente
if (require.main === module) {
  const linter = new Linter();
  linter.lint().catch(error => {
    console.error('❌ Erro fatal no lint:', error);
    process.exit(1);
  });
}

module.exports = Linter;
