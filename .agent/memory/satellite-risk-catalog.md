---
type: satellite_risk_catalog
project: Inelegis
last-updated: 2026-03-03
hub-version: v0.6.2
last-edited-via: Copilot (VS Code)
last-edited-model: GPT-5.3-Codex
last-edited-os: Windows 11
---

# 🛰️ Catálogo de Riscos de Compatibilidade - Inelegis

> Catálogo operacional para registrar riscos de compatibilidade entre este satélite e o Hub.
> Use este arquivo antes de adotar mudanças do Hub, atualizar a Junction ou alterar scripts compartilhados.

---

## ✅ Checklist Padrão de Compatibilidade por Satélite

Marque os itens antes de concluir uma adoção relevante do Hub (prompt, regra, validador, template ou script compartilhado).

- [ ] **Contexto validado:** `node .agent/hub/system/scripts/check-hub-version.js` executado e resultado registrado.
- [ ] **Jurisdição preservada:** nenhuma edição em `.agent/hub/`; mudanças feitas apenas na raiz local do satélite.
- [ ] **Contrato Hub ↔ Satélite revisado:** identifiquei scripts/prompts/templates compartilhados impactados.
- [ ] **Dependências locais compatíveis:** requisitos do satélite (Node, `pg`, envs, hooks, CI) atendem a mudança.
- [ ] **Scripts críticos testados:** rodei teste direcionado (ex.: `npm test`, script afetado, fluxo local).
- [ ] **Validação local executada:** `npm run verify` (quando disponível) ou equivalente do projeto.
- [ ] **Telemetria/monitoramento considerados:** a mudança não quebra fluxo de `telemetry`, hooks ou modo `readonly`.
- [ ] **Rollback definido:** descrevi como desfazer a adoção local com baixo risco.
- [ ] **Evidências registradas:** comandos, resultados e arquivos alterados anotados neste catálogo ou no checkpoint.

---

## 📋 Registro de Avaliações (por rodada de adoção)

> Crie uma entrada por adoção relevante (ex.: novo template do Hub, mudança de validador, atualização de regra global).

### [2026-03-03] Adoção Hub v0.6.2 + hardening Keepalive (Prompt 26/29)

- **Status:** aprovado
- **Mudança do Hub:** adoção de artefatos operacionais do Hub no satélite, com auditoria de compliance Keepalive.
- **Área impactada no satélite:** docs | db | runtime | governança
- **Risco principal:** divergência entre estado real do banco e documentação/local snapshots após migration.
- **Severidade:** alta
- **Sinais de quebra:** políticas RLS legadas em `keepalive_events`, recência de keepalive inconsistente, docs desatualizadas.
- **Mitigação aplicada:** migration `20260303000100_keepalive_events_rls_service_only.sql`, reextração de estrutura, sincronização de docs e validação local.
- **Rollback:** `git revert <commit-da-migration-e-docs>` + reexecução de `npm run db:extract:all` para restaurar snapshot consistente.
- **Checklist padrão:** 9/9 concluído
- **Evidências:**
  - `node .agent/hub/system/scripts/check-hub-version.js` -> satélite coeso com Hub v0.6.2.
  - `npm run verify` -> concluído sem falhas.
  - `npm run db:extract:all` -> extrações atualizadas com sucesso.
  - consulta REST em `keepalive`/`keepalive_events` -> heartbeat recente e sem erro.
- **Arquivos locais afetados:** `supabase/migrations/20260303000100_keepalive_events_rls_service_only.sql`, `docs/guides/migrations-status.md`, `docs/guides/setup-supabase.md`, `supabase/migrations/README.md`, `.env.example`, `.agent/memory/project-status.md`.

---

## 🚨 Itens Críticos do Satélite (Defina e Mantenha Atualizado)

Liste componentes locais que merecem atenção extra em qualquer adoção do Hub:

- `AGENTS.md` / `GEMINI.md` local (contratos operacionais e jurisdição)
- `.husky/` (hooks e uso de `HUB_TELEMETRY_MODE=readonly`)
- `package.json` scripts de verificação e build
- `.agent/memory/` (estado local, gotchas, status)
- Integrações de CI/CD (GitHub Actions, secrets, gates)
- Scripts com dependência local (`pg`, banco, variáveis de ambiente, certificados)

Adapte a lista conforme o stack do projeto.

---

## 🔁 Rollback Rápido (Template)

1. Reverter commit local da adoção (`git revert <hash>` ou remoção manual controlada).
2. Restaurar arquivos de governança/local templates a partir do estado anterior.
3. Reexecutar testes/validação local.
4. Registrar causa e decisão (manter revertido, corrigir localmente ou aguardar ajuste no Hub).

---

## 🧭 Como Usar com Outros Artefatos

- **`gotchas.md`:** registre problemas reais encontrados após a adoção.
- **`project-status.md`:** registre a decisão e o resultado da rodada.
- **Prompt 19:** use o checklist/evidências deste arquivo para compor o checkpoint.
- **Prompt 29:** use este catálogo para avaliar a adoção de novos artefatos do Hub.

---
