/**
 * Testes unitários para funções críticas
 */
(function () {
  "use strict";

  // Mini framework de testes
  const TestRunner = {
    tests: [],
    results: { passed: 0, failed: 0, total: 0 },

    test(name, fn) {
      this.tests.push({ name, fn });
    },

    assert(condition, message) {
      if (!condition) {
        throw new Error(message || "Assertion failed");
      }
    },

    assertEqual(actual, expected, message) {
      if (actual !== expected) {
        throw new Error(message || `Expected ${expected}, got ${actual}`);
      }
    },

    run() {
      console.log("🧪 Executando testes unitários...\n");

      this.tests.forEach((test) => {
        try {
          test.fn();
          console.log(`✅ ${test.name}`);
          this.results.passed++;
        } catch (error) {
          console.error(`❌ ${test.name}: ${error.message}`);
          this.results.failed++;
        }
        this.results.total++;
      });

      console.log(
        `\n📊 Resultados: ${this.results.passed}/${this.results.total} testes passaram`,
      );

      if (this.results.failed > 0) {
        console.error(`⚠️ ${this.results.failed} teste(s) falharam`);
      } else {
        console.log("🎉 Todos os testes passaram!");
      }

      return this.results.failed === 0;
    },
  };

  // Testes de formatação
  TestRunner.test("Formatação de parágrafo simples", () => {
    if (typeof aplicarFormatacaoAutomatica2 === "function") {
      const result = aplicarFormatacaoAutomatica2("121, §1");
      TestRunner.assertEqual(
        result,
        "121, §1º",
        "Deve adicionar º ao parágrafo",
      );
    }
  });

  TestRunner.test("Formatação de c/c", () => {
    if (typeof aplicarFormatacaoAutomatica2 === "function") {
      const result = aplicarFormatacaoAutomatica2("121 cc 312");
      TestRunner.assertEqual(
        result,
        "121 c/c 312",
        "Deve formatar cc para c/c",
      );
    }
  });

  TestRunner.test("Formatação de alínea", () => {
    if (typeof aplicarFormatacaoAutomatica2 === "function") {
      const result = aplicarFormatacaoAutomatica2("121, a");
      TestRunner.assertEqual(
        result,
        '121, "a"',
        "Deve adicionar aspas à alínea",
      );
    }
  });

  // Testes de parsing
  TestRunner.test("Processamento de artigo simples", () => {
    if (typeof processarArtigoCompleto === "function") {
      const result = processarArtigoCompleto("121");
      TestRunner.assertEqual(
        result.artigo,
        "121",
        "Deve extrair artigo corretamente",
      );
      TestRunner.assertEqual(result.paragrafo, "", "Não deve ter parágrafo");
    }
  });

  TestRunner.test("Processamento de artigo com parágrafo", () => {
    if (typeof processarArtigoCompleto === "function") {
      const result = processarArtigoCompleto("121, §2º");
      TestRunner.assertEqual(result.artigo, "121", "Deve extrair artigo");
      TestRunner.assertEqual(result.paragrafo, "2", "Deve extrair parágrafo");
    }
  });

  // Testes de busca
  TestRunner.test("Verificação de lei correspondente - CP", () => {
    if (typeof verificarLeiCorresponde === "function") {
      const item = { codigo: "cp" };
      const result = verificarLeiCorresponde(item, "CP");
      TestRunner.assert(result, "Deve reconhecer CP");
    }
  });

  TestRunner.test("Extração de artigos da norma", () => {
    if (typeof extrairArtigosDoNorma === "function") {
      const result = extrairArtigosDoNorma("Arts. 121, 122, 123 a 127");
      TestRunner.assert(result.includes("121"), "Deve incluir artigo 121");
      TestRunner.assert(result.includes("122"), "Deve incluir artigo 122");
      TestRunner.assert(result.includes("123"), "Deve incluir artigo 123");
    }
  });

  // Testes de dados
  TestRunner.test("Validação de estrutura de dados", () => {
    if (typeof tabelaInelegibilidade !== "undefined") {
      TestRunner.assert(
        Array.isArray(tabelaInelegibilidade),
        "Tabela deve ser array",
      );
      TestRunner.assert(
        tabelaInelegibilidade.length > 0,
        "Tabela não deve estar vazia",
      );

      const item = tabelaInelegibilidade[0];
      TestRunner.assert(item.norma, "Item deve ter norma");
      TestRunner.assert(item.codigo, "Item deve ter código");
      TestRunner.assert(item.crime, "Item deve ter crime");
    }
  });

  TestRunner.test("Validação de leis disponíveis", () => {
    if (typeof leisDisponiveis !== "undefined") {
      TestRunner.assert(Array.isArray(leisDisponiveis), "Leis deve ser array");
      TestRunner.assert(
        leisDisponiveis.length > 0,
        "Leis não deve estar vazio",
      );

      const lei = leisDisponiveis[0];
      TestRunner.assert(lei.value, "Lei deve ter value");
      TestRunner.assert(lei.text, "Lei deve ter text");
      TestRunner.assert(lei.descricao, "Lei deve ter descrição");
    }
  });

  // Expor para uso global
  window.TestRunner = TestRunner;

  // Auto-executar se estiver na página de testes
  if (
    window.location.pathname.includes("test") ||
    window.location.search.includes("test=true")
  ) {
    document.addEventListener("DOMContentLoaded", () => {
      setTimeout(() => TestRunner.run(), 1000);
    });
  }
})();
