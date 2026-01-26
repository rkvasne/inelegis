---
docStatus: active
docScope: source
lastReviewed: 14/01/2026
---
# JS (runtime)

Esta pasta contém o JavaScript carregado pelas páginas públicas. O runtime carrega `public/assets/js/**`.

> Regras gerais de documentação, commits, lint e testes: consulte [AGENTS.md](../../AGENTS.md).

## Papel desta pasta

- Fonte de verdade do runtime.
- Scripts carregados diretamente pelas páginas públicas.
- Desenvolvimento local: `src/js` mantém espelhos históricos e pode ser sincronizado quando aplicável.

## Onde está o código ativo (runtime)

- Dados normalizados: `public/assets/js/data-normalizado.js` (gera `window.__INELEG_NORMALIZADO__`).
- API de consulta: `public/assets/js/consulta-normalizado.js` (expõe `DataNormalizer`).
- Lógica da página: `public/assets/js/script.js` e módulos em `public/assets/js/modules/`.

> **Nota:** O arquivo `src/js/data.js` (antigo espelho dos dados brutos do PDF) foi removido na versão 0.1.9 para evitar confusão. A única fonte de verdade para dados agora é `public/assets/js/data-normalizado.js`.

## Ordem de carregamento (referência)

1. Módulos base de UI e utilitários (`public/assets/js/modules/*`).
2. Dados (`public/assets/js/data-normalizado.js`).
3. API de consulta (`public/assets/js/consulta-normalizado.js`).
4. Scripts de página (`public/assets/js/script.js`).

## Convenções e nomes

- Dados vs API: manter nomes distintos e claros.
  - Dados: `data-normalizado.js`.
  - API: `consulta-normalizado.js`.
- Módulos: `nome-modulo.js` (hífen), alinhados aos arquivos em `public/assets/js/modules`.

## Manutenção dos dados

- Extrator: `node scripts/extrair_normalizado_xml.js`.
- Saída: `public/assets/js/data-normalizado.js`.
- Fonte: `docs/references/tabela-oficial.xml`.

## Status
