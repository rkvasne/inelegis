#!/usr/bin/env node

/**
 * Script de Migração Automatizada
 * Aplica as mudanças do plano de refatoração
 */

const fs = require('fs');
const path = require('path');
const paths = require('./project-paths');

class Migrator {
  constructor() {
    this.projectRoot = paths.root;
    this.backupDir = path.join(this.projectRoot, '.backup-' + Date.now());
    this.changes = [];
    this.errors = [];
    this.htmlTargets = [
      { label: 'consulta.html', filePath: paths.pages.consulta },
      { label: 'index.html', filePath: paths.pages.index },
      { label: 'sobre.html', filePath: paths.pages.sobre },
      { label: 'faq.html', filePath: paths.pages.faq }
    ];
  }

  log(message, type = 'info') {
    const prefix = {
      info: '📝',
      success: '✅',
      warning: '⚠️',
      error: '❌'
    }[type] || 'ℹ️';
    console.log(`${prefix} ${message}`);
  }

  async migrate() {
    this.log('Iniciando migração para nova arquitetura...', 'info');

    try {
      // 1. Criar backup
      await this.createBackup();

      // 2. Adicionar scripts ao HTML
      await this.updateHTML();

      // 3. Atualizar package.json
      await this.updatePackageJson();

      // 4. Criar arquivo de configuração
      await this.createConfig();

      // 5. Relatório
      this.generateReport();

    } catch (error) {
      this.log(`Migração falhou: ${error.message}`, 'error');
      this.log('Restaurando backup...', 'warning');
      await this.restoreBackup();
      process.exit(1);
    }
  }

  async createBackup() {
    this.log('Criando backup...', 'info');

    try {
      fs.mkdirSync(this.backupDir, { recursive: true });

      const filesToBackup = [
        ...this.htmlTargets.map(target => target.filePath),
        paths.js.main,
        paths.js.data,
        path.join(this.projectRoot, 'package.json')
      ];

      for (const file of filesToBackup) {
        if (!fs.existsSync(file)) continue;
        const relative = path.relative(this.projectRoot, file);
        const dest = path.join(this.backupDir, relative);
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.copyFileSync(file, dest);
        this.log(`Backup: ${relative}`, 'success');
      }

      this.log(`Backup criado em: ${this.backupDir}`, 'success');
    } catch (error) {
      throw new Error(`Falha ao criar backup: ${error.message}`);
    }
  }

  async updateHTML() {
    this.log('Atualizando arquivos HTML...', 'info');

    for (const target of this.htmlTargets) {
      if (!fs.existsSync(target.filePath)) continue;

      let content = fs.readFileSync(target.filePath, 'utf8');

      // Verificar se já tem os novos scripts
      if (content.includes('/assets/js/modules/sanitizer.js')) {
        this.log(`${target.label} já atualizado`, 'info');
        continue;
      }

      // Adicionar scripts antes de data.js
      const scriptInsert = `    <!-- Módulos de Segurança e Utilidades -->
    <script src="/assets/js/modules/sanitizer.js"></script>
    <script src="/assets/js/modules/storage.js"></script>
    <script src="/assets/js/modules/formatters.js"></script>
    <script src="/assets/js/modules/exceptions.js"></script>
    <script src="/assets/js/modules/modal-manager.js"></script>
    <script src="/assets/js/modules/search-index.js"></script>

    <!-- Scripts Principais -->
`;

      const dataScriptPattern = /<script\s+src="[^"]*data\.js[^"]*"><\/script>/i;

      if (!dataScriptPattern.test(content)) {
        this.log(`Data.js não encontrado em ${target.label}`, 'warning');
        continue;
      }

      content = content.replace(
        dataScriptPattern,
        scriptInsert + '    <script src="/assets/js/data.js"></script>'
      );

      fs.writeFileSync(target.filePath, content, 'utf8');
      this.changes.push(`Atualizado: ${target.label}`);
      this.log(`Atualizado: ${target.label}`, 'success');
    }
  }

  async updatePackageJson() {
    this.log('Atualizando package.json...', 'info');

    const pkgPath = path.join(this.projectRoot, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

    // Adicionar novos scripts
    pkg.scripts = {
      ...pkg.scripts,
      'test:unit': 'node tests/formatters.test.js && node tests/exceptions.test.js',
      'test:all': 'npm run test:unit && npm run test',
      'migrate': 'node scripts/migrate.js',
      'rollback': 'node scripts/rollback.js'
    };

    // Adicionar devDependencies se necessário
    if (!pkg.devDependencies) {
      pkg.devDependencies = {};
    }

    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf8');
    this.changes.push('Atualizado: package.json');
    this.log('Atualizado: package.json', 'success');
  }

  async createConfig() {
    this.log('Criando arquivo de configuração...', 'info');

    const config = {
      version: '0.0.9',
      modules: {
        sanitizer: true,
        storage: true,
        formatters: true,
        exceptions: true,
        modalManager: true,
        searchIndex: true
      },
      features: {
        csp: true,
        secureStorage: true,
        optimizedSearch: true
      },
      migration: {
        date: new Date().toISOString(),
        backupDir: this.backupDir
      }
    };

    const configPath = path.join(this.projectRoot, 'inelegis.config.json');
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
    this.changes.push('Criado: inelegis.config.json');
    this.log('Criado: inelegis.config.json', 'success');
  }

  async restoreBackup() {
    this.log('Restaurando arquivos do backup...', 'warning');

    try {
      const files = fs.readdirSync(this.backupDir);

      for (const file of files) {
        const src = path.join(this.backupDir, file);
        const dest = path.join(this.projectRoot, file);
        fs.copyFileSync(src, dest);
        this.log(`Restaurado: ${file}`, 'success');
      }

      this.log('Backup restaurado com sucesso', 'success');
    } catch (error) {
      this.log(`Erro ao restaurar backup: ${error.message}`, 'error');
    }
  }

  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 RELATÓRIO DE MIGRAÇÃO');
    console.log('='.repeat(60));
    console.log(`Data: ${new Date().toLocaleString('pt-BR')}`);
    console.log(`Backup: ${this.backupDir}`);
    console.log(`\nMudanças aplicadas: ${this.changes.length}`);
    
    if (this.changes.length > 0) {
      console.log('\n✅ Mudanças:');
      this.changes.forEach((change, i) => {
        console.log(`  ${i + 1}. ${change}`);
      });
    }

    if (this.errors.length > 0) {
      console.log('\n❌ Erros:');
      this.errors.forEach((error, i) => {
        console.log(`  ${i + 1}. ${error}`);
      });
    }

    console.log('\n' + '='.repeat(60));
    console.log('\n📝 Próximos passos:');
    console.log('  1. Revisar mudanças nos arquivos HTML');
    console.log('  2. Executar testes: npm run test:unit');
    console.log('  3. Testar aplicação manualmente');
    console.log('  4. Se tudo OK, commit as mudanças');
    console.log('  5. Se houver problemas, execute: npm run rollback');
    console.log('\n' + '='.repeat(60) + '\n');

    if (this.errors.length === 0) {
      this.log('Migração concluída com sucesso! 🎉', 'success');
    } else {
      this.log('Migração concluída com avisos', 'warning');
    }
  }
}

// Executar migração
if (require.main === module) {
  const migrator = new Migrator();
  migrator.migrate().catch(error => {
    console.error('❌ Erro fatal na migração:', error);
    process.exit(1);
  });
}

module.exports = Migrator;
