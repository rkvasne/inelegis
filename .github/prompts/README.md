# 🎯 Prompt Files

> Navigation: [Project README](../../README.md) • [PROMPTS.md](../../PROMPTS.md)

---

## 🚨 CRITICAL DISTINCTION: Prompts vs Commands

- **Prompt Files (`.prompt.md`)**: TECHNICAL CONFIG. Defines **WHO** the AI is. You do NOT copy these. You use them by typing `/` in VS Code.
- **Commands (`PROMPTS.md`)**: USER TASKS. Defines **WHAT** the AI should do. You COPY these and paste them into the chat.

---

## What are Prompt Files?

Prompt Files (`.prompt.md`) automatically load specialized context into VS Code Copilot Chat. By typing `/` in the chat, you can access available modes.

---

## 🚀 How to Use

### VS Code Copilot

```text
/architect          ← Type this in chat
```

### Cursor / Windsurf

```text
@.github/prompts/architect.prompt.md
```

---

## 📂 Available Modes

### Core Modes

| File                  | Purpose                            | When to Use                           |
| --------------------- | ---------------------------------- | ------------------------------------- |
| `architect.prompt.md` | Technical planning, system design  | Project start, architecture decisions |
| `backend.prompt.md`   | APIs, Node.js, Python, databases   | Endpoints, schemas, migrations        |
| `frontend.prompt.md`  | React, UI/UX, components           | Interfaces, CSS, responsiveness       |
| `quality.prompt.md`   | Tests, QA, performance             | Testing, code review, optimization    |
| `security.prompt.md`  | OWASP, vulnerabilities, pentesting | Security audit, hardening             |

### Support Modes

| File                      | Purpose                         | When to Use                     |
| ------------------------- | ------------------------------- | ------------------------------- |
| `code-review.prompt.md`   | PR Review                       | Before merge, code analysis     |
| `debugger.prompt.md`      | Methodical Debugging            | Errors, stack traces            |
| `devops.prompt.md`        | CI/CD, Docker, infra            | Pipelines, deploy, containers   |
| `documentation.prompt.md` | Technical Docs, README          | API docs, process documentation |
| `git.prompt.md`           | Conventional Commits, branching | Commits, PRs, version control   |

### Specialized Modes

| File                     | Purpose                      | When to Use                        |
| ------------------------ | ---------------------------- | ---------------------------------- |
| `mobile.prompt.md`       | React Native, Flutter        | Mobile apps, native responsiveness |
| `orchestrator.prompt.md` | Multi-agent coordination     | Complex tasks, multiple domains    |
| `planner.prompt.md`      | Roadmap, sprints, management | Estimates, planning                |

---

## 🔄 Difference: Prompts vs Identities vs Personas

| Layer            | Location            | Defines                | Example                             |
| ---------------- | ------------------- | ---------------------- | ----------------------------------- |
| **Prompt Files** | `.github/prompts/`  | **Full IDE Context**   | `/architect` loads rules + workflow |
| **Identities**   | `brain/identities/` | **Tone & Personality** | "Senior Architect with 20y exp."    |
| **Personas**     | `brain/personas/`   | **Workflow & Rules**   | Mode Backend with API rules         |

**Summary:**

- **Prompt Files** = Identity + Persona + Global Rules merged for IDE usage
- **Identities** = "Who" the agent is (personality)
- **Personas** = "What" the agent does (workflow)

---

## 🛠️ Automatic Generation

Prompt Files are generated from `brain/personas/`:

```powershell
# Regenerate all prompt files
npm run build:prompts

# Or directly
.\system\generators\generator-ai-prompt-files.ps1
```

**Flow:**

```
brain/personas/mode-systems-architect.md → .github/prompts/systems-architect.prompt.md
```

---

## 📚 References

- [PROMPTS.md](../../PROMPTS.md) - Copy/paste prompt library
- [brain/identities/](../../brain/identities/) - Identity layer
- [brain/personas/](../../brain/personas/) - Persona layer (source)
