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

### Estrutura de Pastas (v0.3.22)

- `public/assets/js/`: Código distribuído (runtime).
- `src/js/`: Código fonte original organizado por camadas:
  - `services/`: Comunicação com APIs (Supabase, Analytics).
  - `ui/`: Gerenciamento de interface e eventos.
  - `utils/`: Formatadores, sanitizadores e lógica de exceções.
  - `components/`: Componentes reutilizáveis (Header, Footer, Modais).

### Módulos Principais

**[services/validator-service.js](../../src/js/services/validator-service.js)**

- `init()`: Inicializa o cliente Supabase.
- `verifyEligibility()`: Chama a RPC `verificar_elegibilidade` no banco. Lógica conforme [interpretação da tabela](../references/interpretacao-tabela-oficial.md): match exato; sem match → artigo inexistente NAO_CONSTA; artigo inteiro impeditivo (ex.: Art. 121) e dispositivo fora das exceções → INELEGIVEL; dispositivos enumerados (ex.: Art. 122 §1–7) e fora do rol → ELEGIVEL.
- `getLaws()` / `getArticlesByLaw()`: Consome a tabela `crimes_inelegibilidade`.

**[services/search-history.js](../../src/js/services/search-history.js)**

- Gerencia o histórico do usuário sincronizado com Supabase.
- Calcula estatísticas locais para performance (Top Leis/Artigos).

**Keepalive (externo)**

- O heartbeat é feito por **Cloudflare Worker** → Supabase Edge Function (não há serviço client-side no `src/js/`).
- Referências: [scripts/keepalive-worker.js](../../scripts/keepalive-worker.js), [keepalive-setup.md](./keepalive-setup.md).

**[utils/sanitizer.js](../../src/js/utils/sanitizer.js)** e **[utils/escape-html.js](../../src/js/utils/escape-html.js)**

- **Sanitizer:** Carregado como classic script; `escapeHtml()` e `safeInnerHTML()` para proteção XSS.
- **escape-html.js:** Módulo ES que exporta `escapeHtml()`; usado por `analyzer-ui`, `result-renderer` e `dashboard-ui` em toda interpolação de dados do banco/usuário em HTML.

**[ui/validator-ui.js](../../src/js/ui/validator-ui.js)**

- Controla o fluxo "Lei -> Artigo" com selects em cascata.

**[ui/analyzer-ui.js](../../src/js/ui/analyzer-ui.js)**

- Motor de extração de artigos de textos brutos (Sentenças).
- **Validação de Sanidade**: Camada de proteção que descarta capturas inconclusivas e fornece feedback instrutivo (v0.3.8).
- **Extração Múltipla (v0.3.9)**: O analisador suporta pluralidade (ex: "§§ 1, 2 e 3") e multiplica as combinações de Artigo+Parágrafo+Inciso automaticamente.
- **Isolamento de Contexto**: O texto é segmentado por cláusulas (split por `;` ou `\n`) para garantir que os complementos pertençam exclusivamente ao artigo do mesmo fragmento.

### 🛡️ Segurança e UX (v0.3.8+)

- **Sinalização de Exceções**: Quando o banco de dados retorna `eh_excecao: true`, a UI exibe "ELEGÍVEL (EXCEÇÃO)" para diferenciar de artigos que não constam na base.
- **Alerta de Exceções**: O card "Atenção: Exceções Existentes" aparece sempre que houver `excecoes_artigo`, até a tabela estar 100% validada por testes.
- **ASE conforme Manual**: O ASE exibido no modal e na tabela segue o [Manual ASE](../references/manual-ase.md) conforme o **Tipo de Comunicação** (Condenação/Extinção) selecionado e o resultado (inelegível/elegível). Não depende de exceção.
- **Filtro de Extração (Analyzer)**: O sistema utiliza o método `validarExtracao()` para descartar fragmentos capturados por regex que não contenham números reais ou que incluam termos técnicos como "agrafo".
- **Guia de Formatos**: A interface de análise avançada contém um box de ajuda visual com exemplos explícitos para guiar o input do usuário.

---

## 📏 Padrões de Código

- **Clean Code**: Funções pequenas e responsabilidade única.
- **Sanitização**: Para dados do banco ou entrada do usuário inseridos em HTML, use `Sanitizer.escapeHtml()` ao interpolar em templates, ou `textContent` para texto puro. `Sanitizer.safeInnerHTML()` para conteúdo HTML controlado (ex.: modal de fundamentação).
- **Async/Await**: Padrão para todas as operações de rede e inicialização.

---

| Script                    | Descrição                                                                                                                     |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `npm run dev`             | Inicia servidor local com sync de assets.                                                                                     |
| `npm run check`           | Valida Lint, Testes e integridade do Build.                                                                                   |
| `npm run supabase:config` | Sincroniza chaves do `.env.local` con o frontend.                                                                             |
| `npm run test:unit`       | Executa testes de lógica (formatters, exceptions, result-renderer, input-validator, validator-service, toast, theme-manager). |
| `npm run verify`          | Executa a auditoria completa de integridade do Hub.                                                                           |

### 🛡️ Blindagem de Commits (Husky)

O projeto está configurado com **Git Hooks (Husky)** para impedir commits que violem padrões de qualidade. Toda tentativa de `git commit` dispara automaticamente:

1. `npm run format`: Garante que o código segue o padrão do Prettier.
2. `npm run validate:theme`: Bloqueia cores hardcoded ou estilos inline inapropriados.
3. `npm run check`: Valida sintaxe (Lint), roda a suíte de testes e simula o Build.
4. `npm run verify`: Executa a auditoria final de integridade e links do Solo Dev Hub.

**Não é possível realizar commits se qualquer uma dessas validações falhar.** Caso precise pular em uma emergência técnica (não recomendado), use `--no-verify`.

### 📦 Estratégia de Arquivamento (Maintenance)

Para garantir a eficiência de leitura por agentes de IA e conformidade com o **Doc Auditor** (limite de 600 linhas):

- **Changelog**: Ao atingir 550+ linhas, as versões mais antigas (Major/Minor anteriores) devem ser movidas para `docs/archive/CHANGELOG_VX.md`.
- **Logs de Auditoria**: Documentos históricos de auditoria não operacional devem ser movidos para a pasta `docs/archive/` trimestralmente.
- **SSoT**: O `CHANGELOG.md` principal deve sempre manter um link para os arquivos de arquivo para preservação da rastreabilidade.

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

_Última atualização: 20/02/2026 • v0.3.23 (Hub v0.5.8)_
_Editado via: Cursor | Modelo: Auto | OS: Windows 11_
