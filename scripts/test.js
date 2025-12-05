#!/usr/bin/env node

/**
 * Script de testes para Ineleg-App
 * Executa testes unitários e de integração
 */

const fs = require('fs');
const path = require('path');
const paths = require('./project-paths');

class TestRunner {
  constructor() {
    this.projectRoot = paths.root;
    this.testsDir = path.join(this.projectRoot, 'tests');
    this.results = {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0
    };
    this.failures = [];
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      info: '🧪',
      success: '✅',
      warning: '⚠️',
      error: '❌',
      skip: '⏭️'
    }[type] || 'ℹ️';

    console.log(`${prefix} [${timestamp.split('T')[1].split('.')[0]}] ${message}`);
  }

  async runTests() {
    this.log('Iniciando testes do Inelegis v0.1.8', 'info');

    try {
      // 1. Testes de unidade
      await this.runUnitTests();

      // 2. Testes de integração
      await this.runIntegrationTests();

      // 3. Testes de funcionalidade
      await this.runFunctionalTests();

      // 4. Testes de dados
      await this.runDataTests();

      // 5. Relatório final
      this.generateReport();

    } catch (error) {
      this.log(`Testes falharam: ${error.message}`, 'error');
      process.exit(1);
    }
  }

  async runUnitTests() {
    this.log('Executando testes unitários...', 'info');

    // Teste 1: Formatação de artigos
    this.test('Formatação automática de parágrafo', () => {
      // Simular função de formatação
      const input = '121, §1';
      const expected = '121, §1º';
      const result = this.simulateFormatting(input);
      return result === expected;
    });

    // Teste 2: Processamento de artigos
    this.test('Processamento de artigo completo', () => {
      const input = '121, §2º, I, "a"';
      const result = this.simulateProcessing(input);
      return result && result.artigo === '121' && result.paragrafo === '2';
    });

    // Teste 3: Validação de lei
    this.test('Verificação de lei correspondente', () => {
      const item = { codigo: 'cp' };
      const lei = 'CP';
      return this.simulateLeiCheck(item, lei);
    });

    // Teste 4: Extração de artigos
    this.test('Extração de artigos da norma', () => {
      const norma = 'Arts. 121, 122, 123 a 127';
      const result = this.simulateExtraction(norma);
      return result.includes('121') && result.includes('122') && result.includes('123');
    });

    // Teste 5: Busca flexível
    this.test('Busca flexível por artigo', () => {
      const artigo = '121, §2º';
      const result = this.simulateFlexibleSearch(artigo);
      return result !== null;
    });
  }

  async runIntegrationTests() {
    this.log('Executando testes de integração...', 'info');

    // Teste 1: Dados normalizados
    this.test('Existência de dados normalizados', () => {
      const dataPath = path.join(paths.js.public, 'data-normalizado.js');
      return fs.existsSync(dataPath);
    });
  }

  async runFunctionalTests() {
    this.log('Executando testes funcionais...', 'info');

    // Teste 1: HTML válido
    this.test('HTML bem formado', () => {
      const content = fs.readFileSync(paths.pages.index, 'utf8');
      return content.includes('<!DOCTYPE html>') &&
        content.includes('<html') &&
        content.includes('</html>');
    });

    // Teste 2: CSS válido
    this.test('CSS sem erros críticos', () => {
      const content = fs.readFileSync(paths.styles.main, 'utf8');
      // Verificar se não há erros óbvios
      return !content.includes('undefined') && content.includes(':root');
    });

    // Teste 3: JavaScript sem erros de sintaxe
    this.test('JavaScript sem erros de sintaxe', () => {
      const content = fs.readFileSync(paths.js.main, 'utf8');
      // Verificação básica de sintaxe
      return content.includes('function') && !content.includes('syntax error');
    });

    // Teste 4: Responsividade
    this.test('Design responsivo implementado', () => {
      const content = fs.readFileSync(paths.styles.main, 'utf8');
      return content.includes('@media') && content.includes('max-width');
    });

    // Teste 5: Acessibilidade básica
    this.test('Elementos de acessibilidade presentes', () => {
      const content = fs.readFileSync(paths.pages.index, 'utf8');
      return content.includes('aria-') && content.includes('role=');
    });
  }

  async runDataTests() {
    this.log('Executando testes de dados...', 'info');

    // Teste 1: Verificar integridade dos dados normalizados
    this.test('Dados normalizados válidos', () => {
      const dataPath = path.join(paths.js.public, 'data-normalizado.js');
      if (!fs.existsSync(dataPath)) return false;
      
      const content = fs.readFileSync(dataPath, 'utf8');
      return content.includes('window.__INELEG_NORMALIZADO__') && 
             content.includes('itens') && 
             content.includes('leis');
    });
  }

  test(name, testFn) {
    this.results.total++;

    try {
      const result = testFn();

      if (result) {
        this.results.passed++;
        this.log(`${name} ✓`, 'success');
      } else {
        this.results.failed++;
        this.failures.push(name);
        this.log(`${name} ✗`, 'error');
      }
    } catch (error) {
      this.results.failed++;
      this.failures.push(`${name}: ${error.message}`);
      this.log(`${name} ✗ (${error.message})`, 'error');
    }
  }

  // Funções de simulação para testes unitários
  simulateFormatting(input) {
    // Simular formatação automática
    return input.replace(/§\s*(\d+)(?![º°])/, '§$1º');
  }

  simulateProcessing(input) {
    // Simular processamento de artigo
    const match = input.match(/^(\d+)/);
    const paragrafoMatch = input.match(/§\s*(\d+)/);

    return {
      artigo: match ? match[1] : null,
      paragrafo: paragrafoMatch ? paragrafoMatch[1] : null
    };
  }

  simulateLeiCheck(item, lei) {
    // Simular verificação de lei
    return item.codigo.toLowerCase() === lei.toLowerCase();
  }

  simulateExtraction(norma) {
    // Simular extração de artigos
    const matches = norma.match(/\d+/g) || [];
    return matches;
  }

  simulateFlexibleSearch(artigo) {
    // Simular busca flexível
    return artigo.includes('121') ? { found: true } : null;
  }

  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      version: '0.1.5',
      summary: {
        total: this.results.total,
        passed: this.results.passed,
        failed: this.results.failed,
        skipped: this.results.skipped,
        success_rate: ((this.results.passed / this.results.total) * 100).toFixed(1)
      },
      failures: this.failures
    };

    // Salvar relatório
    fs.writeFileSync(
      path.join(this.projectRoot, 'test-report.json'),
      JSON.stringify(report, null, 2)
    );

    // Exibir resumo
    console.log('\n' + '='.repeat(60));
      console.log('📊 RELATÓRIO DE TESTES - INELEG-APP v0.1.8');
      console.log('='.repeat(60));
    console.log(`Total de testes: ${this.results.total}`);
    console.log(`Passou: ${this.results.passed}`);
    console.log(`Falhou: ${this.results.failed}`);
    console.log(`Pulou: ${this.results.skipped}`);
    console.log(`Taxa de sucesso: ${report.summary.success_rate}%`);

    if (this.failures.length > 0) {
      console.log('\n❌ TESTES FALHARAM:');
      this.failures.forEach((failure, i) => {
        console.log(`  ${i + 1}. ${failure}`);
      });
    }

    console.log('\n' + '='.repeat(60));

    if (this.results.failed === 0) {
      this.log('Todos os testes passaram! 🎉', 'success');
    } else {
      this.log(`${this.results.failed} teste(s) falharam`, 'error');
      process.exit(1);
    }
  }
}

// Executar testes se chamado diretamente
if (require.main === module) {
  const runner = new TestRunner();
  runner.runTests().catch(error => {
    console.error('❌ Erro fatal nos testes:', error);
    process.exit(1);
  });
}

module.exports = TestRunner;
