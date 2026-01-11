---
docStatus: active
docScope: runtime
lastReviewed: 2026-01-10
---
# JS (runtime)

Esta pasta contém os scripts carregados pelas páginas em produção.

## Fonte, build e sincronização

- O runtime carrega `public/assets/js/**`.
- Quando existir fonte equivalente em `src/js/**`, ela pode ser sincronizada para cá.
- Arquivos gerados (ex.: dados normalizados) também vivem em `public/assets/js/**`.

## Onde está o código ativo

- Dados normalizados: `data-normalizado.js` (gera `window.__INELEG_NORMALIZADO__`).
- API de consulta: `consulta-normalizado.js` (expõe `DataNormalizer`).
- Lógica de página: `script.js` e módulos em `modules/`.

## Fonte dos dados

- Fonte: `docs/references/tabela-oficial.xml`
- Gerador: `scripts/extrair_normalizado_xml.js`

## Ordem de carregamento (referência)

1. Módulos base de UI e utilitários (`modules/*`).
2. Dados (`data-normalizado.js`).
3. API de consulta (`consulta-normalizado.js`).
4. Scripts de página (`script.js`).

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

- **Última atualização:** 10 de janeiro de 2026
