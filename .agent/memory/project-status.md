# 📊 Project Status & Context

> **Last Updated:** 2026-02-11
> **Current Phase:** Maintenance / Governance Integration
> **Status:** Stable / Hub-First
> **Hub Version:** v0.5.4 (CI Strategy v0.5.4 adopted)
> **App Version:** v0.3.6

## 🎯 Objetivos Concluídos (Sessão 09/02/2026)

- [x] **Solo Dev Hub CI Strategy:** Adotada estratégia oficial v0.5.4 com checkout via `HUB_ACCESS_TOKEN`.
- [x] **Eliminação de Redundância:** Scripts `doc-auditor.js` e `validator-web-standards.js` removidos em favor do Hub (SSoT).
- [x] **Relatório de Bug Upstream:** Documentado erro do `theme-linter` do Hub em `docs/HUB-BUG-REPORT-THEME-LINTER.md`.
- [x] **Tratamento de Erros Supabase:** Implementado try/catch e injeção de config dinâmica no `validator-service.js`.
- [x] **Correção Dropdown Leis:** Resolvida incompatibilidade do JS com o schema V2 da base de dados.
- [x] **Acessibilidade Visual:** Corrigido contraste do input de leis (texto invisível nas opções do select).

## 🏗️ Arquitetura Atual

- **Frontend:** HTML5, CSS3, Vanilla JavaScript (Módulos ES6 + Scripts Globais) + Toast Notification System.
- **Backend/Database:** Supabase (PostgreSQL + RPC Functions) - Schema V2.
- **Infra:** Vercel (Deployment) + Solo Dev Hub (Governance).
- **Segurança:** 0 Vulnerabilidades detectadas, CSP ativo, RLS habilitado.
- **Testes:** 27+ testes unitários e de integração, 100% de taxa de sucesso.

## 🔄 Tarefas em Aberto (Próximos Passos)

1. ~~Substituir os `alert()` restantes em `history-page.js`~~ ✅ **Concluído**
2. Investigar reativação de testes de layout via Puppeteer (resolvendo dependência de Chrome em CI).
3. Implementar Dashboard de Performance via Sentry (Backlog).

## ⚠️ Riscos e Bloqueios

- **Credenciais CI:** Dependência das Secret Keys no Vercel.
- **Conexão Hub:** Manter a integridade da Junction `.agent/hub` (ReadOnly).

---

**Log de Governança/Sessão:**

- 01-03/02/2026: Migração para Supabase, governança v0.4.7, conformidade total e limpeza de legado Redis.
- 05/02/2026: Auditoria de base de dados e reconstrução da tabela de crimes (Migration 002).
- 08/02/2026: **Upgrade para Hub v0.5.4.** Implementação de sistema de Toast, limpeza de raiz e auditoria Deep-Dive (Claude Opus). Sincronização de versões.
- 09-10/02/2026: **Refatoração v0.3.6 & Governança.** Correção CI/CD (GitHub Secrets), limpeza de SSoT (Scripts centralizados no Hub), tratamento de erros Supabase. Resolvido bug no linter upstream e removido fork local.
- 11/02/2026: **Unificação e Estabilização.** Sincronização global da versão 0.3.6 em docs, frontend e scripts. Ambiente local otimizado (PATH). Projeto 100% Hub-First.
