# JS (assets)

Este diretório contém os arquivos JavaScript usados em tempo de execução no front-end. Há uma separação explícita entre dados normalizados e a API de consulta.

## Por que existem dois arquivos

- `data-normalizado.js`
  - Arquivo de dados pré-processados (base normalizada) gerado a partir do XML oficial.
  - Expõe apenas o payload estruturado via `window.__INELEG_NORMALIZADO__`.
  - Não contém lógica de consulta.

- `consulta-normalizado.js`
  - API/ponte de consulta que lê a base normalizada e fornece métodos: `getItens`, `getLeis`, `getLeiDescricao`, `getItensPorLei`, `getSugestoesPorLei`, `query`.
  - Mantém o padrão de “fonte única de verdade” usando exclusivamente a base normalizada.
  - Este split separa dado de lógica, reduz acoplamento e evita reprocessamento a cada consulta.

## Ordem de carregamento recomendada

1. `data-normalizado.js` (dados)
2. `consulta-normalizado.js` (API de consulta)
3. Demais scripts de aplicação (`script.js`, módulos de UI, etc.)

## Como usar

- Para popular selects e exibir descrições de leis, use `DataNormalizer.getLeis()` e `DataNormalizer.getLeiDescricao(codigo)`.
- Para filtrar itens por lei ou por texto, use `DataNormalizer.getItensPorLei(codigo)` e `DataNormalizer.query({ lei, artigoTexto })`.

## Manutenção

- A geração do arquivo de dados é feita por `scripts/extrair_normalizado_xml.js`.
- Não há fallback para dados brutos; toda consulta deve usar a base pré-normalizada.
