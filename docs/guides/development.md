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

### Estrutura de Pastas (v0.3.11)

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

**[services/keepalive-service.js](../../src/js/services/keepalive-service.js)**

- Implementa o **Hub Keepalive Pattern**.
- Mantém o banco de dados ativo através de heartbeats periódicos (Client Heartbeat).

**[utils/sanitizer.js](../../src/js/utils/sanitizer.js)**

- Proteção contra XSS e inserção segura de conteúdo dinâmico.

**[ui/validator-ui.js](../../src/js/ui/validator-ui.js)**

- Controla o fluxo "Lei -> Artigo" com selects em cascata.

**[ui/analyzer-ui.js](../../src/js/ui/analyzer-ui.js)**

- Motor de extração de artigos de textos brutos (Sentenças).
- **Validação de Sanidade**: Camada de proteção que descarta capturas inconclusivas e fornece feedback instrutivo (v0.3.8).
- **Extração Múltipla (v0.3.9)**: O analisador suporta pluralidade (ex: "§§ 1, 2 e 3") e multiplica as combinações de Artigo+Parágrafo+Inciso automaticamente.
- **Isolamento de Contexto**: O texto é segmentado por cláusulas (split por `;` ou `\n`) para garantir que os complementos pertençam exclusivamente ao artigo do mesmo fragmento.

### 🛡️ Segurança e UX (v0.3.8+)

- **Sinalização de Exceções**: Quando o banco de dados retorna `eh_excecao: true`, a UI deve exibir "ELEGÍVEL (EXCEÇÃO)" para diferenciar de artigos que simplesmente não constam na base (mas são elegíveis).
- **Filtro de Extração (Analyzer)**: O sistema utiliza o método `validarExtracao()` para descartar fragmentos capturados por regex que não contenham números reais ou que incluam termos técnicos como "agrafo".
- **Guia de Formatos**: A interface de análise avançada contém um box de ajuda visual com exemplos explícitos para guiar o input do usuário.

---

## 📏 Padrões de Código

- **Clean Code**: Funções pequenas e responsabilidade única.
- **Sanitização**: Obrigatório o uso de `Sanitizer.safeInnerHTML()` em qualquer dado vindo do banco.
- **Async/Await**: Padrão para todas as operações de rede e inicialização.

---

| Script                    | Descrição                                              |
| ------------------------- | ------------------------------------------------------ |
| `npm run dev`             | Inicia servidor local com sync de assets.              |
| `npm run check`           | Valida Lint, Testes e integridade do Build.            |
| `npm run supabase:config` | Sincroniza chaves do `.env.local` con o frontend.      |
| `npm run test:unit`       | Executa testes de lógica de negócio (formatters, etc). |
| `npm run verify`          | Executa a auditoria completa de integridade do Hub.    |

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

_Última atualização: 12/02/2026 • v0.3.11 (Hub v0.5.5)_
_Editado via: Antigravity | Modelo: claude-3.5-sonnet | OS: Windows 11_
