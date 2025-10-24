#!/usr/bin/env node

/**
 * Script para backup e versionamento dos dados
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class DataBackup {
  constructor() {
    this.backupDir = path.join(__dirname, '..', 'backups');
    this.dataFile = path.join(__dirname, '..', 'data.js');
  }

  init() {
    // Criar diretório de backup se não existir
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  generateHash(content) {
    return crypto.createHash('sha256').update(content).digest('hex').substring(0, 8);
  }

  createBackup() {
    try {
      const content = fs.readFileSync(this.dataFile, 'utf8');
      const hash = this.generateHash(content);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFileName = `data-${timestamp}-${hash}.js`;
      const backupPath = path.join(this.backupDir, backupFileName);

      fs.writeFileSync(backupPath, content);

      // Criar metadata
      const metadata = {
        timestamp: new Date().toISOString(),
        hash,
        originalFile: 'data.js',
        backupFile: backupFileName,
        size: content.length
      };

      const metadataPath = path.join(this.backupDir, `${backupFileName}.meta.json`);
      fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

      console.log(`✅ Backup criado: ${backupFileName}`);
      console.log(`📊 Hash: ${hash}`);
      console.log(`📏 Tamanho: ${content.length} bytes`);

      return { backupPath, metadata };
    } catch (error) {
      console.error('❌ Erro ao criar backup:', error.message);
      throw error;
    }
  }

  listBackups() {
    try {
      const files = fs.readdirSync(this.backupDir)
        .filter(file => file.endsWith('.js'))
        .map(file => {
          const metaFile = path.join(this.backupDir, `${file}.meta.json`);
          let metadata = {};
          
          if (fs.existsSync(metaFile)) {
            metadata = JSON.parse(fs.readFileSync(metaFile, 'utf8'));
          }

          return {
            file,
            path: path.join(this.backupDir, file),
            metadata
          };
        })
        .sort((a, b) => new Date(b.metadata.timestamp) - new Date(a.metadata.timestamp));

      return files;
    } catch (error) {
      console.error('❌ Erro ao listar backups:', error.message);
      return [];
    }
  }

  restoreBackup(backupFile) {
    try {
      const backupPath = path.join(this.backupDir, backupFile);
      
      if (!fs.existsSync(backupPath)) {
        throw new Error(`Backup não encontrado: ${backupFile}`);
      }

      // Criar backup do arquivo atual antes de restaurar
      this.createBackup();

      const backupContent = fs.readFileSync(backupPath, 'utf8');
      fs.writeFileSync(this.dataFile, backupContent);

      console.log(`✅ Backup restaurado: ${backupFile}`);
      return true;
    } catch (error) {
      console.error('❌ Erro ao restaurar backup:', error.message);
      throw error;
    }
  }

  cleanOldBackups(keepCount = 10) {
    try {
      const backups = this.listBackups();
      
      if (backups.length <= keepCount) {
        console.log(`📦 ${backups.length} backups encontrados (limite: ${keepCount})`);
        return;
      }

      const toDelete = backups.slice(keepCount);
      let deletedCount = 0;

      toDelete.forEach(backup => {
        try {
          fs.unlinkSync(backup.path);
          
          const metaPath = `${backup.path}.meta.json`;
          if (fs.existsSync(metaPath)) {
            fs.unlinkSync(metaPath);
          }
          
          deletedCount++;
        } catch (error) {
          console.warn(`⚠️ Erro ao deletar ${backup.file}:`, error.message);
        }
      });

      console.log(`🗑️ ${deletedCount} backups antigos removidos`);
    } catch (error) {
      console.error('❌ Erro ao limpar backups:', error.message);
    }
  }

  validateData() {
    try {
      const content = fs.readFileSync(this.dataFile, 'utf8');
      
      // Verificar se é JavaScript válido
      eval(`(function() { ${content} })()`);
      
      // Verificar estrutura básica
      if (!content.includes('tabelaInelegibilidade') || !content.includes('leisDisponiveis')) {
        throw new Error('Estrutura de dados inválida');
      }

      console.log('✅ Dados validados com sucesso');
      return true;
    } catch (error) {
      console.error('❌ Dados inválidos:', error.message);
      return false;
    }
  }

  generateReport() {
    const backups = this.listBackups();
    const currentStats = this.getCurrentStats();

    const report = {
      timestamp: new Date().toISOString(),
      current_file: {
        path: this.dataFile,
        ...currentStats
      },
      backups: {
        count: backups.length,
        total_size: backups.reduce((sum, b) => sum + (b.metadata.size || 0), 0),
        oldest: backups.length > 0 ? backups[backups.length - 1].metadata.timestamp : null,
        newest: backups.length > 0 ? backups[0].metadata.timestamp : null
      },
      recommendations: []
    };

    // Adicionar recomendações
    if (backups.length === 0) {
      report.recommendations.push('Criar primeiro backup');
    } else if (backups.length > 20) {
      report.recommendations.push('Limpar backups antigos');
    }

    if (!currentStats.valid) {
      report.recommendations.push('Validar e corrigir dados atuais');
    }

    return report;
  }

  getCurrentStats() {
    try {
      const content = fs.readFileSync(this.dataFile, 'utf8');
      const stats = fs.statSync(this.dataFile);
      
      return {
        size: content.length,
        hash: this.generateHash(content),
        modified: stats.mtime.toISOString(),
        valid: this.validateData()
      };
    } catch (error) {
      return {
        size: 0,
        hash: null,
        modified: null,
        valid: false,
        error: error.message
      };
    }
  }
}

// CLI Interface
if (require.main === module) {
  const backup = new DataBackup();
  backup.init();

  const command = process.argv[2];

  switch (command) {
    case 'create':
      backup.createBackup();
      break;

    case 'list':
      const backups = backup.listBackups();
      console.log(`📦 ${backups.length} backups encontrados:\n`);
      backups.forEach((b, i) => {
        console.log(`${i + 1}. ${b.file}`);
        console.log(`   📅 ${b.metadata.timestamp || 'N/A'}`);
        console.log(`   🔍 ${b.metadata.hash || 'N/A'}`);
        console.log(`   📏 ${b.metadata.size || 0} bytes\n`);
      });
      break;

    case 'restore':
      const backupFile = process.argv[3];
      if (!backupFile) {
        console.error('❌ Especifique o arquivo de backup');
        process.exit(1);
      }
      backup.restoreBackup(backupFile);
      break;

    case 'clean':
      const keepCount = parseInt(process.argv[3]) || 10;
      backup.cleanOldBackups(keepCount);
      break;

    case 'validate':
      backup.validateData();
      break;

    case 'report':
      const report = backup.generateReport();
      console.log(JSON.stringify(report, null, 2));
      break;

    default:
      console.log(`
📦 Sistema de Backup de Dados - Ineleg-App

Uso: node backup-data.js <comando> [opções]

Comandos:
  create              Criar novo backup
  list                Listar backups existentes
  restore <arquivo>   Restaurar backup específico
  clean [quantidade]  Limpar backups antigos (padrão: manter 10)
  validate            Validar dados atuais
  report              Gerar relatório completo

Exemplos:
  node backup-data.js create
  node backup-data.js list
  node backup-data.js restore data-2025-10-23T10-30-00-abc12345.js
  node backup-data.js clean 5
      `);
      break;
  }
}

module.exports = DataBackup;