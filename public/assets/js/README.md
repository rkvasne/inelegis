# JavaScript Core (src/js)

Este diretório contém o código fonte da aplicação Inelegis. A arquitetura segue o padrão modular com separação de responsabilidades.

## 🏗️ Estrutura

- **`script.js`**: Ponto de entrada (Main) e orquestrador da aplicação.
- **`services/`**: Lógica de negócios pura e persistência.
  - Ex: `search-logic.js`, `storage.js`.
- **`utils/`**: Funções auxiliares, formatadores e constantes.
  - Ex: `formatters.js`, `constants.js`.
- **`components/`**: Lógica encapsulada de componentes de UI.
  - Ex: `article-builder.js`, `modal-manager.js`.
- **`ui/`**: Views, manipulação de DOM e eventos de página.
  - Ex: `dom-manipulation.js`, `history-page.js`.

## 🔄 Build & Sync

Este diretório é a **Fonte da Verdade**.
O runtime (navegador) utiliza os arquivos em `public/assets/js`, que são mantidos em sincronia com esta pasta através dos scripts:

- `npm run sync:js`: Copia `src/js` para `public/assets/js`.
- `npm run dev`: Mantém a sincronia em tempo real.
