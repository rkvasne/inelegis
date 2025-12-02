#!/usr/bin/env node

/**
 * Script de Migração Automatizada
 * Aplica as mudanças do plano de refatoração
 */

const fs = require('fs');
const path = require('path');

class Migrator {
  constructor() {
    this.projectRoot = path.join(__dirname, '..');
    this.backupDir = path.join(this.projectRoot, '.backup-' + Date.now());
    this.changes = [];
    this.errors = [];
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
        'consulta.html',
        'index.html',
        'script.js',
        'package.json'
      ];

      for (const file of filesToBackup) {
        const src = path.join(this.projectRoot, file);
        const dest = path.join(this.backupDir, file);

        if (fs.existsSync(src)) {
          fs.copyFileSync(src, dest);
          this.log(`Backup: ${file}`, 'success');
        }
      }

      this.log(`Backup criado em: ${this.backupDir}`, 'success');
    } catch (error) {
      throw new Error(`Falha ao criar backup: ${error.message}`);
    }
  }

  async updateHTML() {
    this.log('Atualizando arquivos HTML...', 'info');

    const htmlFiles = ['consulta.html', 'index.html', 'sobre.html', 'faq.html'];

    for (const file of htmlFiles) {
      const filePath = path.join(this.projectRoot, file);
      
      if (!fs.existsSync(filePath)) continue;

      let content = fs.readFileSync(filePath, 'utf8');

      // Verificar se já tem os novos scripts
      if (content.includes('js/sanitizer.js')) {
        this.log(`${file} já atualizado`, 'info');
        continue;
      }

      // Adicionar scripts antes de data.js
      const scriptInsert = `    <!-- Módulos de Segurança e Utilidades -->
    <script src="js/sanitizer.js"></script>
    <script src="js/storage.js"></script>
    <script src="js/formatters.js"></script>
    <script src="js/exceptions.js"></script>
    <script src="js/modal-manager.js"></script>
    <script src="js/search-index.js"></script>

    <!-- Scripts Principais -->
`;

      // Substituir linha do data.js
      content = content.replace(
        /<script src="data\.js"><\/script>/,
        scriptInsert + '<script src="data.js"></script>'
      );

      fs.writeFileSync(filePath, content, 'utf8');
      this.changes.push(`Atualizado: ${file}`);
      this.log(`Atualizado: ${file}`, 'success');
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
      version: '0.0.8',
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
