# Relatório Doc Janitor (Prompt 25) – Inelegis

> **Arquivado em 21/02/2026.** As correções recomendadas foram aplicadas. Estado atual dos docs em [docs/README.md](../README.md).

**Data:** 21/02/2026  
**Escopo:** `docs/` e `docs/guides/`  
**Projeto:** Inelegis (v0.3.25)

---

## 📋 Resumo Executivo

O Doc Janitor identificou **obsolescência crítica** em `maintenance.md`, **referências desatualizadas** em `auditoria-tabela-oficial.md` e **redundância parcial** entre documentos sobre a tabela CRE. Recomenda-se correção antes de exclusões.

---

## 🔴 [CORRIGIR] – Conteúdo Obsoleto

### 1. `docs/guides/maintenance.md` – **CRÍTICO**

**Problema:** Descreve um schema antigo que não existe mais.

| Atual no doc                 | Realidade atual                                                        |
| ---------------------------- | ---------------------------------------------------------------------- |
| Tabela `normas`              | Não existe. Leis vêm de `crimes_inelegibilidade`.                      |
| Tabela `artigos_inelegiveis` | Não existe.                                                            |
| Tabela `artigos_excecoes`    | Não existe. Exceções estão em `crimes_inelegibilidade` (`eh_excecao`). |
| `009_update_law_X.sql`       | Padrão de migrations é `20260225XXXXXX_*.sql`                          |

**Ação:** Reescrever a seção "Estrutura de Dados" para:

- Usar `crimes_inelegibilidade` (única tabela de base jurídica)
- Usar `historico_consultas` para histórico
- Citar migrations em `supabase/migrations/` conforme [migrations-status.md](../guides/migrations-status.md)

---

### 2. `docs/auditoria-tabela-oficial.md` – **Referência errada**

**Problema:** Indica a migration `20260121000000_tabela_oficial_completa.sql`, que **não existe** no projeto.

| No doc                                       | No repositório                              |
| -------------------------------------------- | ------------------------------------------- |
| `20260121000000_tabela_oficial_completa.sql` | ❌ Não existe                               |
| Migration atual                              | `20260225000000_crimes_inelegibilidade.sql` |

**Ação:** Atualizar todas as menções para `20260225000000_crimes_inelegibilidade.sql` e adicionar nota explicando que a migration foi reconsolidada em 25/02/2026.

---

### 3. `docs/guides/devops-manual.md` – **Stack incorreta**

**Problema:** Usa padrão Next.js e infraestrutura que não corresponde ao projeto.

| No doc                            | Realidade                                                      |
| --------------------------------- | -------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`        | Projeto usa `VITE_SUPABASE_URL` ou variáveis do `.env.example` |
| "Node.js serve.js para APIs"      | Projeto é HTML/JS estático; APIs são Vercel serverless         |
| Docker Compose como "Recomendado" | Deploy principal é Vercel                                      |

**Ação:** Alinhar com `devops.md` e `variaveis-ambiente.md`; corrigir variáveis e opções de deploy.

---

## 🟡 [CONSOLIDAR] – Documentos sobre tabela CRE

Existem **três** documentos sobre a tabela CRE-SP:

| Documento                                 | Propósito                                             | SSoT?                               |
| ----------------------------------------- | ----------------------------------------------------- | ----------------------------------- |
| `auditoria-tabela-oficial.md`             | Auditoria de conformidade CRE vs migration            | Conteúdo jurídico (itens da tabela) |
| `guides/revisao-tabela-15022026.md`       | Alterações na migration 20260225 (Padrão C, exceções) | Sim – descreve o que mudou          |
| `guides/conferencia-leis-cre-vs-banco.md` | Conferência de leis no banco vs CRE                   | Sim – lista leis presentes/ausentes |

**Recomendação:** Manter os três, com papéis claros:

- **auditoria-tabela-oficial:** Referência geral de conformidade CRE (atualizar migration citada).
- **revisao-tabela-15022026:** Changelog das alterações de 15/02.
- **conferencia-leis-cre-vs-banco:** Conferência de completude das leis.

**Gap:** `docs/README.md` não lista `conferencia-leis-cre-vs-banco.md`. Incluir em "Referências" ou "Guias".

---

## 🟠 [CORRIGIR] – Versões do Hub nos rodapés

Muitos docs têm `(Hub v0.5.8)` ou `(Hub v0.5.6)` nos rodapés; o Hub atual é **v0.6.1** (conforme Prompt 23).

---

## 🟢 [MANTER] – Docs em bom estado

- `guides/development.md` – Coerente com `src/js`, RPC e sanitização
- `guides/migrations-status.md` – Lista as 5 migrations atuais
- `guides/setup-supabase.md` – Alinhado ao fluxo atual
- `references/interpretacao-tabela-oficial.md` – Base da lógica da RPC
- `api-reference.md` – Refere RPC e endpoints corretos
- `guides/ci-variaveis-github.md`, `hub-access-token-ci.md` – Atualizados

---

## ✅ Checklist de Ações

| Prioridade | Ação                               | Status      |
| ---------- | ---------------------------------- | ----------- |
| Alta       | Reescrever "Estrutura de Dados"    | ✅ Aplicado |
| Alta       | Atualizar referência da migration  | ✅ Aplicado |
| Média      | Corrigir variáveis e deploy        | ✅ Aplicado |
| Média      | Incluir conferencia-leis no índice | ✅ Aplicado |
| Baixa      | Sincronizar Hub v0.6.1 nos rodapés | ✅ Aplicado |

---

_Arquivado em: 21/02/2026 • Original: docs/guides/relatorio-doc-janitor-2026.md_
