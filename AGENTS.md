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

1. **Princípios Universais (Comportamento/Comunicação):**
   - 📖 Leia: `.agent/hub/brain/constitution/rule-universal-principles.md`
   - Aplique: Honestidade, Anti-concordância, Regra de Commits (pt-BR) e protocolos de segurança.

2. **Personas & Brainstorming:**
   - 🎭 Use: `.agent/hub/brain/personas/` (ex: `@mode-architect.md`) para mudar de modo operacional.
   - Siga: Protocolo Socrático antes de qualquer implementação complexa.

3. **Capacidades (Skills):**
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

- `project-status.md` - Estado atual do projeto
- `tasks/` - Planejamento de tarefas

---

## 🧭 Navegação Proativa

Ao finalizar uma tarefa:

1. **Consulte** `.agent/hub/brain/prompts-library/README.md`.
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

_Última atualização: 13/02/2026 • v0.3.11 (Hub v0.5.6)_
_Editado via: Antigravity | Modelo: claude-3.5-sonnet | OS: Windows 11_
