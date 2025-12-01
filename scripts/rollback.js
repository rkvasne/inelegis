#!/usr/bin/env node

/**
 * Script de Rollback
 * Reverte mudanças da migração em caso de problemas
 */

const fs = require('fs');
const path = require('path');

class Rollback {
  constructor() {
    this.projectRoot = path.join(__dirname, '..');
    this.configPath = path.join(this.projectRoot, 'inelegis.config.json');
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

  async execute() {
    this.log('Iniciando rollback...', 'warning');

    try {
      // 1. Ler configuração
      const config = this.readConfig();

      // 2. Verificar backup
      if (!config || !config.migration || !config.migration.backupDir) {
        throw new Error('Configuração de backup não encontrada');
      }

      const backupDir = config.migration.backupDir;

      if (!fs.existsSync(backupDir)) {
        throw new Error(`Diretório de backup não encontrado: ${backupDir}`);
      }

      // 3. Restaurar arquivos
      await this.restoreFiles(backupDir);

      // 4. Limpar
      await this.cleanup(backupDir);

      // 5. Relatório
      this.generateReport();

    } catch (error) {
      this.log(`Rollback falhou: ${error.message}`, 'error');
      process.exit(1);
    }
  }

  readConfig() {
    try {
      if (!fs.existsSync(this.configPath)) {
        return null;
      }
      const content = fs.readFileSync(this.configPath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      this.log(`Erro ao ler configuração: ${error.message}`, 'error');
      return null;
    }
  }

  async restoreFiles(backupDir) {
    this.log('Restaurando arquivos do backup...', 'info');

    const files = fs.readdirSync(backupDir);
    let restored = 0;

    for (const file of files) {
      const src = path.join(backupDir, file);
      const dest = path.join(this.projectRoot, file);

      try {
        fs.copyFileSync(src, dest);
        this.log(`Restaurado: ${file}`, 'success');
        restored++;
      } catch (error) {
        this.log(`Erro ao restaurar ${file}: ${error.message}`, 'error');
      }
    }

    this.log(`${restored} arquivo(s) restaurado(s)`, 'success');
  }

  async cleanup(backupDir) {
    this.log('Limpando arquivos temporários...', 'info');

    try {
      // Remover configuração
      if (fs.existsSync(this.configPath)) {
        fs.unlinkSync(this.configPath);
        this.log('Removido: inelegis.config.json', 'success');
      }

      // Manter backup por segurança (não remover automaticamente)
      this.log(`Backup mantido em: ${backupDir}`, 'info');
      this.log('Você pode removê-lo manualmente se desejar', 'info');

    } catch (error) {
      this.log(`Erro na limpeza: ${error.message}`, 'warning');
    }
  }

  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('🔄 RELATÓRIO DE ROLLBACK');
    console.log('='.repeat(60));
    console.log(`Data: ${new Date().toLocaleString('pt-BR')}`);
    console.log('\n✅ Rollback concluído com sucesso!');
    console.log('\nArquivos restaurados para o estado anterior à migração.');
    console.log('\n' + '='.repeat(60) + '\n');
  }
}

// Executar rollback
if (require.main === module) {
  const rollback = new Rollback();
  rollback.execute().catch(error => {
    console.error('❌ Erro fatal no rollback:', error);
    process.exit(1);
  });
}

module.exports = Rollback;
