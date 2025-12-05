# JS (src)

Esta pasta contém o código-fonte histórico e/ou de desenvolvimento. O runtime atual da aplicação usa exclusivamente `public/assets/js`.

## Papel desta pasta

- Espelho histórico: mantém versões anteriores e bases de referência para desenvolvimentos.
- Desenvolvimento local: pode ser usada como origem em pipelines de build, quando configurados.
- Não participar do runtime: páginas públicas carregam scripts de `public/assets/js`.

## Onde está o código ativo

- Dados normalizados: `public/assets/js/data-normalizado.js` (gera `window.__INELEG_NORMALIZADO__`).
- API de consulta: `public/assets/js/consulta-normalizado.js` (expõe `DataNormalizer`).
- Lógica da página: `public/assets/js/script.js` e módulos em `public/assets/js/modules/`.

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

- **Última atualização:** 05 de dezembro de 2025  
- **Versão:** 0.1.9
