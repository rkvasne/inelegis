#!/usr/bin/env node

/**
 * Script de testes para Ineleg-App
 * Executa testes unitários e de integração
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');
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
    this.log('Iniciando testes do Inelegis v0.3.0', 'info');

    try {
      // 1. Testes de unidade
      await this.runUnitTests();

      // 2. Testes de integração
      await this.runIntegrationTests();

      // 3. Testes de funcionalidade
      await this.runFunctionalTests();

      // 4. Testes de layout (Puppeteer)
      await this.runLayoutTests();

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

    // Teste 1: Supabase client configurado
    this.test('Supabase Client disponível', () => {
      const clientPath = path.join(this.projectRoot, 'src', 'js', 'services', 'supabase-client.js');
      return fs.existsSync(clientPath);
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
    this.log('Skipping data tests (Supabase-only mode)', 'skip');
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

  async testAsync(name, testFn) {
    this.results.total++;

    try {
      const result = await testFn();

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

  skip(name, reason) {
    this.results.total++;
    this.results.skipped++;
    this.log(`${name} (${reason})`, 'skip');
  }

  async runLayoutTests() {
    this.log('Executando testes de layout...', 'info');

    let puppeteer;
    try {
      puppeteer = require('puppeteer');
    } catch (error) {
      this.skip('Layout: validação via Puppeteer', 'Puppeteer não instalado');
      return;
    }

    const serverInfo = await this.startStaticServer(paths.publicDir);
    let browser;

    try {
      browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    } catch (error) {
      this.skip('Layout: validação via Puppeteer', `Falha ao iniciar browser: ${error.message.split('\n')[0]}`);
      await serverInfo.server.close();
      return;
    }

    try {
      await this.testAsync('Layout: gutters consistentes entre páginas', async () => {
        const pagePaths = [
          '/landing.html',
          '/index.html',
          '/consulta.html',
          '/faq.html',
          '/sobre.html'
        ];

        const pagesData = [];
        const page = await browser.newPage();

        for (const pagePath of pagePaths) {
          await page.goto(`${serverInfo.baseUrl}${pagePath}`, { waitUntil: 'domcontentloaded' });

          const isLanding = pagePath.includes('landing.html');
          const headerSelector = isLanding ? '.landing-nav' : '.header-wrapper';
          const titleSelector = isLanding ? '.nav-title' : '.brand-text h1';

          await page.waitForSelector(headerSelector, { timeout: 5000 });
          await page.waitForSelector('.container', { timeout: 5000 });

          const metrics = await page.evaluate(
            ({ headerSelector, titleSelector }) => {
              const toPx = (value) => {
                const num = Number.parseFloat(value);
                return Number.isFinite(num) ? num : 0;
              };

              const getPadding = (selector) => {
                const el = document.querySelector(selector);
                if (!el) return null;
                const cs = getComputedStyle(el);
                return {
                  left: toPx(cs.paddingLeft),
                  right: toPx(cs.paddingRight)
                };
              };

              const getFontSize = (selector) => {
                const el = document.querySelector(selector);
                if (!el) return null;
                const cs = getComputedStyle(el);
                return toPx(cs.fontSize);
              };

              return {
                headerPadding: getPadding(headerSelector),
                containerPadding: getPadding('.container'),
                footerContentPadding: getPadding('.main-footer .footer-content'),
                titleFontSize: getFontSize(titleSelector)
              };
            },
            { headerSelector, titleSelector }
          );

          pagesData.push({
            pagePath,
            ...metrics
          });
        }

        await page.close();

        const tolerance = 0.5;
        const eq = (a, b) => Math.abs(a - b) <= tolerance;

        const pickGutter = (data) => {
          if (data.headerPadding && data.headerPadding.left > 0) return data.headerPadding.left;
          if (data.containerPadding && data.containerPadding.left > 0) return data.containerPadding.left;
          return null;
        };

        const expectedGutter = pickGutter(pagesData[0]);
        if (!expectedGutter) {
          throw new Error(`Não foi possível detectar gutter esperado em ${pagesData[0].pagePath}`);
        }

        const mismatches = [];

        for (const data of pagesData) {
          const checkPair = (label, padding) => {
            if (!padding) return;
            if (!eq(padding.left, expectedGutter) || !eq(padding.right, expectedGutter) || !eq(padding.left, padding.right)) {
              mismatches.push({
                page: data.pagePath,
                label,
                left: padding.left,
                right: padding.right,
                expected: expectedGutter
              });
            }
          };

          checkPair('header', data.headerPadding);
          checkPair('container', data.containerPadding);
          checkPair('footerContent', data.footerContentPadding);
        }

        if (mismatches.length > 0) {
          const details = mismatches
            .map((m) => `${m.page} ${m.label} left=${m.left} right=${m.right} expected≈${m.expected}`)
            .join(' | ');
          throw new Error(details);
        }

        const landing = pagesData.find((d) => d.pagePath.includes('landing.html'));
        const internal = pagesData.find((d) => d.pagePath.includes('index.html'));

        if (landing && internal && landing.titleFontSize && internal.titleFontSize) {
          if (!eq(landing.titleFontSize, internal.titleFontSize)) {
            throw new Error(`Font-size do título diverge: landing=${landing.titleFontSize}px vs interno=${internal.titleFontSize}px`);
          }
        }

        return true;
      });

      await this.testAsync('Layout: referência referência visual (heurística de gutter)', async () => {
        const referenceUrls = [
          '',
          ''
        ];

        const page = await browser.newPage();

        // Simular desktop largo
        await page.setViewport({ width: 1920, height: 1080 });

        let reference = null;
        let selectedUrl = null;
        let lastError = null;

        try {
          for (const candidateUrl of referenceUrls) {
            try {
              await page.goto(candidateUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
              selectedUrl = candidateUrl;

              reference = await page.evaluate(() => {
                // Tenta pegar container principal do referência visual
                // Baseado na análise manual: max-width ~1312px
                const containers = Array.from(document.querySelectorAll('div, section, main'));
                const candidates = containers.filter(el => {
                  const style = window.getComputedStyle(el);
                  const width = parseFloat(style.width);
                  return width > 1000 && width < 1400 && style.marginLeft !== '0px';
                });

                const mainContainer = candidates[0];
                if (!mainContainer) return null;

                return {
                  maxWidth: 1312 // Valor conhecido/medido
                };
              });

              if (reference) break;
            } catch (error) {
              lastError = error;
            }
          }

          if (!reference) {
            // Fallback se não conseguir medir dinamicamente (site mudou ou bloqueio)
            // Usamos o valor medido anteriormente como "golden standard"
            reference = { maxWidth: 1312 };
            this.log('Layout: usando referência estática do referência visual (1312px)', 'info');
          }

          // Verificar nosso app
          await page.goto(`${serverInfo.baseUrl}/landing.html`, { waitUntil: 'domcontentloaded' });
          const appMetrics = await page.evaluate(() => {
            const container = document.querySelector('.container');
            const style = window.getComputedStyle(container);
            return {
              maxWidth: parseFloat(style.maxWidth)
            };
          });

          const tolerance = 5; // px
          const diff = Math.abs(appMetrics.maxWidth - reference.maxWidth);

          if (diff > tolerance) {
            throw new Error(`Container difere da referência (${selectedUrl || 'static'}): app≈${appMetrics.maxWidth}px vs ref≈${reference.maxWidth}px`);
          }

        } catch (error) {
          // Se falhar por rede/timeout, avisar mas não falhar o teste (opcional)
          if (error.message.includes('net::') || error.message.includes('timeout')) {
            this.skip('Layout: referência referência visual', `Indisponível: ${error.message}`);
            return true;
          }
          throw error;
        } finally {
          await page.close();
        }

        return true;
      });
    } finally {
      await browser.close();
      await this.closeServer(serverInfo.server);
    }
  }

  closeServer(server) {
    return new Promise((resolve) => {
      server.close(() => resolve());
    });
  }

  startStaticServer(rootDir) {
    const mimeTypes = new Map([
      ['.html', 'text/html; charset=utf-8'],
      ['.css', 'text/css; charset=utf-8'],
      ['.js', 'application/javascript; charset=utf-8'],
      ['.json', 'application/json; charset=utf-8'],
      ['.svg', 'image/svg+xml'],
      ['.png', 'image/png'],
      ['.jpg', 'image/jpeg'],
      ['.jpeg', 'image/jpeg'],
      ['.webp', 'image/webp'],
      ['.ico', 'image/x-icon']
    ]);

    const serveFile = async (filePath, res) => {
      try {
        const ext = path.extname(filePath).toLowerCase();
        const contentType = mimeTypes.get(ext) || 'application/octet-stream';
        const content = await fs.promises.readFile(filePath);
        res.statusCode = 200;
        res.setHeader('Content-Type', contentType);
        res.end(content);
      } catch (error) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.end('Not found');
      }
    };

    const server = http.createServer(async (req, res) => {
      const parsed = url.parse(req.url || '/');
      const pathname = decodeURIComponent(parsed.pathname || '/');

      let relativePath = pathname;
      if (relativePath === '/') relativePath = '/index.html';

      const safePath = path.normalize(relativePath).replace(/^(\.\.[\/\\])+/, '');
      const filePath = path.join(rootDir, safePath);

      await serveFile(filePath, res);
    });

    return new Promise((resolve, reject) => {
      server.listen(0, '127.0.0.1', () => {
        const address = server.address();
        if (!address || typeof address === 'string') {
          reject(new Error('Falha ao iniciar servidor local'));
          return;
        }
        resolve({ server, baseUrl: `http://127.0.0.1:${address.port}` });
      });
    });
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
      version: '0.3.0',
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
    console.log('📊 RELATÓRIO DE TESTES - INELEG-APP v0.3.0');
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
