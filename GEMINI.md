---
trigger: always_on
---

# GEMINI.md - Inelegis

> **Hub Link:** .agent/hub/
> **Priority:** P0 (GEMINI.md) > P1 (Persona) > P2 (Skill)

Este projeto consome inteligência centralizada do Solo Dev Hub através de Junctions.

---

## 📥 REQUEST CLASSIFIER

Classifique antes de agir:

- **SIMPLE:** Fix/Change pontual -> Edição Direta.
- **COMPLEX:** Build/Feature/Refactor -> Exige Plano (`task-slug.md`).

## 🛑 SOCRATIC GATE (Obrigatório)

Pare e pergunte antes de codar:

- **New Feature:** Mínimo 3 perguntas estratégicas.
- **Bug Fix:** Confirme impacto e causa raiz.

---

## 🏗️ AGENT PROTOCOL (Hub-First)

1. **Personas:** Sempre carregue a persona adequada de `.agent/hub/brain/personas/mode-[especialista].md`.
2. **Skills:** Utilize as ferramentas em `.agent/hub/capabilities/` conforme demanda.
3. **Architecture:** Siga as regras globais em `.agent/hub/brain/constitution/rule-universal-principles.md`.

---

## 🧹 Clean Code & Standards

- **Code:** Conciso, direto, sem over-engineering.
- **Testing:** AAA Pattern (Arrange, Act, Assert).
- **Git:** Commits em Português (pt-BR) seguindo Conventional Commits.
- **Encoding:** UTF-8 BOM em todos os arquivos Markdown.

---

_Configurado via Solo Dev Hub Layout (v0.4.7)_
