---
trigger: always_on
---

# 🤖 GEMINI.md - Inelegis

> **Hub Link:** `.agent/hub/` (READ-ONLY)
> **Priority:** P0 (GEMINI.md) > P1 (Persona) > P2 (Skill)
> **Hub Version:** v0.5.5
> **Isolamento:** Hub ↔ Satélite (Governança Bidirecional)

Este projeto consome inteligência centralizada do Solo Dev Hub através de Junctions.

**⚠️ AUTONOMIA:** Este projeto é INDEPENDENTE. O Hub apenas fornece regras para LEITURA.
O Hub NÃO gerencia este projeto. Este projeto NÃO altera o Hub.

---

## 🚨 STOP GATES (VERIFICAÇÃO OBRIGATÓRIA)

**⚠️ ANTES de QUALQUER ação, você DEVE verificar:**

### Gate 1: Proteção do Hub (READ-ONLY)

```
PERGUNTA: O arquivo que vou editar está em `.agent/hub/`?
├─ SIM → 🛑 PARE IMEDIATAMENTE. VIOLAÇÃO DE MEMÓRIA.
│        Informe: "Este arquivo está na zona READ-ONLY do Hub."
│        Ação: Alterações devem ser feitas no repositório original.
└─ NÃO → ✅ Continue para o próximo Gate.
```

### Gate 2: Comandos Destrutivos

```
PERGUNTA: O comando que vou sugerir é destrutivo?
├─ DESTRUTIVOS (REQUEREM AUTORIZAÇÃO EXPLÍCITA):
│   • git checkout -- / git restore / git reset --hard
│   • git clean -fd / git clean -fx
│   • rm -rf / rimraf / del /s /q
│   • Qualquer comando que apaga dados não versionados
├─ SIM → 🛑 PEÇA AUTORIZAÇÃO antes de sugerir.
│        Liste exatamente o que será perdido.
└─ NÃO → ✅ Continue para o próximo Gate.
```

### Gate 3: Identificação Correta

```
PERGUNTA: Estou identificando meu modelo corretamente?
├─ Use EXATAMENTE o valor da sua identidade real.
├─ NÃO invente (ex: não diga "Gemini" se você é "Claude").
└─ ✅ Prossiga com a ação.
```

---

## 🔐 AUTO-DETECÇÃO DE CAMINHO (Obrigatório)

**ANTES de editar QUALQUER arquivo:**

1. **Verifique** se o caminho contém `.agent/hub/`
2. **SE CONTÉM** → RECUSE a edição imediatamente
3. **INFORME** ao usuário: "Este arquivo está na zona READ-ONLY do Hub."

**Caminhos PROIBIDOS para edição:**

- `.agent/hub/*` (TODO o conteúdo)
- Qualquer caminho que resolva para `E:\Agents` via Junction

**Caminhos PERMITIDOS:**

- `.agent/memory/*` (memória local do projeto)
- Qualquer outro arquivo do projeto

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
3. **Architecture:** Siga as regras globais em `.agent/hub/brain/constitution/rule-universal-principles.md` e `AGENTS.md`.

---

## 🧹 Clean Code & Standards

- **Code:** Conciso, direto, sem over-engineering.
- **Testing:** AAA Pattern (Arrange, Act, Assert).
- **Git:** Commits em Português (pt-BR) seguindo Conventional Commits.
- **Encoding:** UTF-8 BOM em todos os arquivos Markdown.

---

## 🧭 Navegação Proativa

Ao finalizar uma tarefa:

1. **Consulte** `.agent/hub/brain/prompts-library/README.md`.
2. **Sugira** o próximo prompt lógico para avançar o projeto.

> **Exemplo:** "Código criado. 👉 **Próximo Passo:** Rode `11-testing-strategy.md` para validar."

---

_Configurado via Solo Dev Hub Layout (v0.5.5)_
_Última atualização: 12/02/2026_
_Editado via: Antigravity | Modelo: claude-3.5-sonnet | OS: Windows 11_
