# 🤖 AI Agents - Inelegis

> **Link do Hub:** `.agent/hub/` (Obrigatório)
> **Modo:** Hub-First & SSoT (Single Source of Truth)

Este projeto integra o ecossistema Solo Dev Hub. O Agente de IA deve priorizar as definições centralizadas no Hub para comportamento e governança.

---

## 🖥️ Identidade & Ambiente Local

- **Objetivo:** Sistema de Consulta de Inelegibilidade Eleitoral para análise jurídica rápida e precisa.
- **Stack:** HTML/JS + CSS + Supabase.
- **OS Context:** Windows 11
- **Documentação Local:** `README.md`, `CHANGELOG.md` e `docs/`

---

## 🧠 Governança Local (Injeção de Contexto)

Para garantir a qualidade e o nível sênior de execução, siga as regras do Hub Central em tempo real:

1. **⚓ Âncora de Identidade (Anti-Alucinação):**
   - **MANTATÓRIO:** Antes de agir, valide sua **jurisdição**. Sua atuação é limitada estritamente ao repositório do projeto local.
   - Consulte: Mapeamento de Corpus (`user_information`), `.agent/memory/project-status.md` e o `GEMINI.md` local.
   - 📖 Siga o protocolo em: `.agent/hub/brain/constitution/rule-universal-principles.md` (Seção ⚓).

2. **🚫 Jurisdição de Atuação (Anti-Transgressão):**
   - **MANDATÓRIO:** Você deve agir EXCLUSIVAMENTE dentro da raiz deste projeto. É terminantemente PROIBIDO realizar diagnósticos, auditorias ou edições em outros diretórios visíveis no workspace. Sua única interface externa autorizada é a Junction `.agent/hub/`.
   - Se o usuário solicitar ações em outros projetos enquanto você estiver instanciado aqui, pare imediatamente e declare **Incompetência de Escopo por Limite de Jurisdição**.

3. **Princípios Universais (Comportamento/Comunicação):**
   - 📖 Leia: `.agent/hub/brain/constitution/rule-universal-principles.md`
   - Aplique: Honestidade, Anti-concordância, Regra de Commits (pt-BR) e protocolos de segurança.

4. **Personas & Brainstorming:**
   - 🎭 Use: `.agent/hub/brain/personas/` (ex: `@mode-architect.md`) para mudar de modo operacional.
   - Siga: Protocolo Socrático antes de qualquer implementação complexa.

5. **Capacidades (Skills):**
   - 🛠️ Use: `.agent/hub/capabilities/` para execução de tarefas técnicas (Engineering, Design, Ops).

---

## 🚫 READ-ONLY HUB ZONE (CRITICAL - VIOLAÇÃO GRAVE)

A pasta `.agent/hub/` é uma **Junction (Link)** do Hub Central `E:\Agents`.

### ⛔ PROIBIÇÕES ABSOLUTAS

| Ação                                       | Status      | Consequência                  |
| ------------------------------------------ | ----------- | ----------------------------- |
| Editar arquivos em `.agent/hub/`           | ❌ PROIBIDO | VIOLAÇÃO DE MEMÓRIA           |
| Criar arquivos em `.agent/hub/`            | ❌ PROIBIDO | VIOLAÇÃO DE MEMÓRIA           |
| Deletar arquivos em `.agent/hub/`          | ❌ PROIBIDO | VIOLAÇÃO DE MEMÓRIA           |
| Commitar `.agent/hub/`                     | ❌ PROIBIDO | Corrompe o submodule/junction |
| Sugerir `git checkout --` em `.agent/hub/` | ❌ PROIBIDO | Comando destrutivo            |

### ✅ AÇÕES PERMITIDAS

- **LER** arquivos do Hub para consulta de regras
- **USAR** personas e skills do Hub
- **REFERENCIAR** documentação do Hub

### 🔴 Exemplos de VIOLAÇÕES (NUNCA FAÇA ISSO)

```bash
# ❌ VIOLAÇÃO: Editar arquivo do Hub
edit .agent/hub/brain/personas/mode-backend.md

# ❌ VIOLAÇÃO: Commitar o Hub
git add .agent/hub/
git commit -m "atualizar hub"

# ❌ VIOLAÇÃO: Comandos destrutivos no Hub
git checkout -- .agent/hub/
git restore .agent/hub/
```

### ✅ Como Alterar Regras do Hub

1. **Navegue** até o repositório original: `E:\Agents`
2. **Faça** as alterações lá
3. **Commit e push** no repositório do Hub
4. **Sincronize** nos satélites (se necessário)

### 📁 Memória Local

Use `.agent/memory/` para armazenar informações **deste** projeto:

- `project-status.md` - Estado atual, fase e objetivos do projeto
- `gotchas.md` - Problemas conhecidos e workarounds descobertos (consulte no início de cada sessão)
- `tasks/` - Planejamento de tarefas complexas e roadmaps
- `templates/` — Via Junction: `.agent/hub/memory/templates/` (ADRs, preferências, gotchas)

---

## 🎭 Modos de Operação Disponíveis

Ative o modo especialista para a tarefa atual. Cole `@modo` no chat ou use `/comando` em IDEs com slash commands.

| Modo                 | Quando Usar                                     | Ativar (Cursor)       | Ativar (VSCode/TRAE) |
| -------------------- | ----------------------------------------------- | --------------------- | -------------------- |
| `mode-frontend`      | React, Next.js, CSS, componentes UI             | `@mode-frontend`      | `/frontend`          |
| `mode-backend`       | API, banco de dados, Node.js, Python            | `@mode-backend`       | `/backend`           |
| `mode-security`      | Auditoria de segurança, OWASP, vulnerabilidades | `@mode-security`      | `/security`          |
| `mode-debugger`      | Investigação de bugs, causa raiz                | `@mode-debugger`      | `/debugger`          |
| `mode-planner`       | Planejamento técnico, roadmap, ADRs             | `@mode-planner`       | `/planner`           |
| `mode-quality`       | Testes, cobertura, refatoração limpa            | `@mode-quality`       | `/quality`           |
| `mode-devops`        | CI/CD, deploy, infra, Docker                    | `@mode-devops`        | `/devops`            |
| `mode-orchestrator`  | Tarefas complexas multi-domínio                 | `@mode-orchestrator`  | `/orchestrate`       |
| `mode-architect`     | Design de sistema, decisões de arquitetura      | `@mode-architect`     | `/architect`         |
| `mode-git`           | Commits, branches, PR, histórico                | `@mode-git`           | `/git`               |
| `mode-documentation` | Docs técnicos, READMEs, guias                   | `@mode-documentation` | `/writer`            |
| `mode-mobile`        | React Native, Flutter, apps mobile              | `@mode-mobile`        | `/mobile`            |
| `mode-code-reviewer` | Code review, boas práticas, qualidade de PR     | `@mode-code-reviewer` | `/reviewer`          |

> Arquivos completos em `.agent/hub/brain/personas/` (via Junction — READ-ONLY).
> Em TRAE: arquivos gerados em `.trae/rules/` via `npm run build:ide:trae` no Hub.
> Em Claude Code CLI / Kiro: leia este `AGENTS.md` — a tabela acima dá contexto imediato.

---

## 🧭 Navegação Proativa

Ao finalizar uma tarefa:

1. **Consulte** `.agent/hub/brain/prompts/README.md`.
2. **Sugira** o próximo prompt lógico para avançar o projeto.

> **Exemplo:** "Código criado. 👉 **Próximo Passo:** Rode `11-testing-strategy.md` para validar."

---

## 🏷️ Assinatura de Edição (Doc Signature)

Ao alterar qualquer documento Markdown neste projeto, o agente DEVE adicionar/atualizar a assinatura no footer:

```markdown
_Última atualização: DD/MM/AAAA • vX.X.X_
_Editado via: [IDE] | Modelo: [LLM] | OS: [Sistema]_
```

Para docs com frontmatter YAML, usar campos no frontmatter (sem duplicar no footer):

```yaml
last-edited: DD/MM/AAAA
last-edited-via: [IDE]
last-edited-model: [LLM]
last-edited-os: [Sistema]
```

---

## 🚫 PUBLIC/ASSETS/JS/ É READ-ONLY (CRITICAL)

A pasta `public/assets/js/` é **gerada automaticamente** pelo script `sync-js.js` a partir de `src/js/`.

### ⛔ PROIBIÇÕES ABSOLUTAS

| Ação                                   | Status      | Consequência                                |
| -------------------------------------- | ----------- | ------------------------------------------- |
| Editar arquivos em `public/assets/js/` | ❌ PROIBIDO | Alteração será sobrescrita no próximo build |
| Criar arquivos em `public/assets/js/`  | ❌ PROIBIDO | Arquivo será sobrescrito ou ignorado        |

### ✅ O QUE FAZER

| Ação                            | Caminho Correto         |
| ------------------------------- | ----------------------- |
| Editar JavaScript               | `src/js/**/*.js`        |
| Editar HTML                     | `public/*.html`         |
| Editar CSS                      | `public/styles/*.css`   |
| Editar imagens/assets estáticos | `public/assets/images/` |

### 🔴 Fluxo SSoT (Single Source of Truth)

```
src/js/  ←── SSoT (EDITE AQUI)
   ↓ sync-js.js (copia automaticamente)
public/assets/js/  ←── DESTINO (NÃO EDITE)
   ↓ build.js (copia para produção)
dist/  ←── PRODUÇÃO (Vercel serve daqui)
```

### 🔴 Exemplos de VIOLAÇÕES (NUNCA FAÇA ISSO)

```bash
# ❌ VIOLAÇÃO: Editar JS no destino
edit public/assets/js/components/components.js

# ❌ VIOLAÇÃO: Editar admin JS no destino
edit public/assets/js/admin/auth-service.js
```

### ✅ Exemplos CORRETOS

```bash
# ✅ CORRETO: Editar JS na fonte
edit src/js/components/components.js

# ✅ CORRETO: Editar admin JS na fonte
edit src/js/admin/auth-service.js

# ✅ CORRETO: Editar HTML (estes NÃO têm SSoT em src/)
edit public/index.html
edit public/consulta.html
```

### ⚠️ LIÇÕES APRENDIDAS (HISTÓRICO DE VIOLAÇÕES)

> **2026-02-11:** Agente editou `public/assets/js/` ao invés de `src/js/`. O script `sync-js.js` sobrescreveu as mudanças. **Correção perdida.**

> **2026-02-13:** O MESMO erro aconteceu novamente em outra sessão. A IA editou `public/assets/js/components/components.js` múltiplas vezes, mas o build sempre sobrescrevia. A causa raiz (arquivo em `src/js/`) só foi identificada após perda significativa de tempo. **SEMPRE VERIFIQUE O FLUXO DE BUILD ANTES DE EDITAR QUALQUER JS.**

---

_Última atualização: 23/02/2026 • v0.3.26 (Hub v0.6.1)_
_Editado via: Codex CLI | Modelo: GPT-5 | OS: Windows 11_
