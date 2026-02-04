---
trigger: always_on
---

# 🤖 GEMINI.md - Inelegis

> **Hub Link:** .agent/hub/
> **Priority:** P0 (GEMINI.md) > P1 (Persona) > P2 (Skill)

Este projeto consome inteligência centralizada do Solo Dev Hub através de Junctions.

---

## 📥 REQUEST CLASSIFIER

Classifique antes de agir:

- **SIMPLE:** Fix/Change pontual -> Edição Direta.
- **COMPLEX:** Build/Feature/Refactor -> Exige Plano ( ask-slug.md).

## 🛑 SOCRATIC GATE (Obrigatório)

Pare e pergunte antes de codar:

- **New Feature:** Mínimo 3 perguntas estratégicas.
- **Bug Fix:** Confirme impacto e causa raiz.

---

## 🏗️ AGENT PROTOCOL (Hub-First)

1. **Personas:** Sempre carregue a persona adequada de .agent/hub/brain/personas/mode-[especialista].md.
2. **Skills:** Utilize as ferramentas em .agent/hub/capabilities/ conforme demanda.
3. **Architecture:** Siga as regras globais em .agent/hub/brain/constitution/rule-universal-principles.md e AGENTS.md.

---

## 🧹 Clean Code & Standards

- **Code:** Conciso, direto, sem over-engineering.
- **Testing:** AAA Pattern (Arrange, Act, Assert).
- **Git:** Commits em Português (pt-BR) seguindo Conventional Commits.
- **Encoding:** UTF-8 BOM em todos os arquivos Markdown.

---

## 🧭 Navegação Proativa

Ao finalizar uma tarefa:

1. **Consulte** .agent/hub/brain/prompts-library/README.md.
2. **Sugira** o próximo prompt lógico para avançar o projeto.

> **Exemplo:** "Código criado. 👉 **Próximo Passo:** Rode 11-testing-strategy.md para validar."

---

_Configurado via Solo Dev Hub Layout (v0.4.8)_
