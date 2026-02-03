# Guia de Desenvolvimento

Este arquivo fornece orientações técnicas para desenvolvedores trabalhando neste repositório.

---

## 💻 Visão Geral do Projeto

**Inelegis** é uma aplicação web para Consulta de Inelegibilidade Eleitoral. Ela auxilia na determinação de inelegibilidade com base na Lei Complementar nº 64/1990.

- **Arquitetura**: Frontend Vanilla JavaScript (Módulos ES6) integrado ao Supabase.
- **Fonte de Dados**: Banco de Dados PostgreSQL (Supabase) com lógica via RPC.
- **Deploy**: Build com `npm run build` e deploy da pasta `public/` (Vercel).

---

## 🚀 Execução e Desenvolvimento

- **Configuração**:
  1. Copie `.env.example` para `.env.local`.
  2. Preencha as chaves do Supabase.
  3. Execute `npm run supabase:config` para gerar o arquivo de config do cliente.
- **Desenvolvimento**: Execute `npm run dev` para o servidor local com Live Reload.
- **Produção**: O projeto é otimizado via `scripts/build.js`.

---

## 🏗 Arquitetura do Código

### Estrutura de Pastas (v0.3.1)

- `public/assets/js/`: Código distribuído (runtime).
- `src/js/`: Código fonte original organizado por camadas:
  - `services/`: Comunicação com APIs (Supabase, Analytics).
  - `ui/`: Gerenciamento de interface e eventos.
  - `utils/`: Formatadores, sanitizadores e lógica de exceções.
  - `components/`: Componentes reutilizáveis (Header, Footer, Modais).

### Módulos Principais

**[services/validator-service.js](../../src/js/services/validator-service.js)**

- `init()`: Inicializa o cliente Supabase.
- `verifyEligibility()`: Chama a RPC `verificar_elegibilidade` no banco.
- `getLaws()` / `getArticlesByLaw()`: Consome as tabelas de normas.

**[services/search-history.js](../../src/js/services/search-history.js)**

- Gerencia o histórico do usuário sincronizado com Supabase.
- Calcula estatísticas locais para performance (Top Leis/Artigos).

**[utils/sanitizer.js](../../src/js/utils/sanitizer.js)**

- Proteção contra XSS e inserção segura de conteúdo dinâmico.

**[ui/validator-ui.js](../../src/js/ui/validator-ui.js)**

- Controla o fluxo "Lei -> Artigo" com selects em cascata.

---

## 📏 Padrões de Código

- **Clean Code**: Funções pequenas e responsabilidade única.
- **Sanitização**: Obrigatório o uso de `Sanitizer.safeInnerHTML()` em qualquer dado vindo do banco.
- **Async/Await**: Padrão para todas as operações de rede e inicialização.

---

## 🔧 Scripts Úteis

| Script                    | Descrição                                              |
| ------------------------- | ------------------------------------------------------ |
| `npm run dev`             | Inicia servidor local com sync de assets.              |
| `npm run check`           | Valida Lint, Testes e integridade do Build.            |
| `npm run supabase:config` | Sincroniza chaves do `.env.local` com o frontend.      |
| `npm run test:unit`       | Executa testes de lógica de negócio (formatters, etc). |

---

## 🔒 Segurança

- **CSP**: Configurada no `vercel.json`.
- **Secrets**: Chaves privadas (`SERVICE_ROLE`) nunca devem ser usadas em `src/js/`.
- **UID**: Identificação anônima via Cookies/LocalStorage para conformidade com LGPD.

---

## 🛠 Ferramentas Recomendadas

- **Node.js**: 22.x
- **Supabase CLI**: Para gerenciamento de migrations.
- **ESLint/Prettier**: Para padronização de código.

---

_Atualizado em: 03/02/2026_
