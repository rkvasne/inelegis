---
category: operations
scope: audit-monitoring
status: active
version: 0.3.11
---

# 🛡️ Auditoria e Monitoramento

---

## 🎯 Objetivo

Toda a infraestrutura técnica e documental está agora operando no padrão **Solo Dev Hub v0.5.5**, garantindo longevidade e facilidade de manutenção para o ecossistema.
O sistema de Auditoria e Monitoramento do Inelegis garante a rastreabilidade técnica de todas as consultas jurídicas realizadas, permitindo:

- **Rastreabilidade**: Identificar qual fundamentação legal foi apresentada para cada consulta.
- **Validação Jurídica**: Verificar se a lógica do analisador está correta com base no histórico.
- **Monitoramento de Saúde**: Acompanhar a disponibilidade do sistema via Keepalive.
- **Detecção de Padrões**: Identificar as leis e artigos mais consultados para otimização da base.

---

## 🔒 Privacidade e Auditoria

Diferente do sistema de analytics legado (v0.3.7), o sistema de Auditoria foca em **fundamentação jurídica** e metadados técnicos, mantendo o anonimato do usuário.

### Dados Auditados

- **Consulta**: Lei, Artigo, Parágrafo, Inciso e Alínea selecionados.
- **Veredicto**: Resultado (Elegível/Inelegível), Motivo Detalhado e Exceções aplicadas.
- **Metadados**: Fonte da consulta (Manual/Analisador), Contexto original (se for análise de texto) e Timestamp.

### Retenção

Os logs de auditoria são mantidos por **90 dias** (configurável via `HISTORY_RETENTION_DAYS`) antes de serem limpos automaticamente via CRON jobs no Supabase.

---

## 🏗️ Arquitetura de Monitoramento

```
Fluxo de Auditoria e Visualização:
UI (Validator/Analyzer) → SearchHistory.add() → Supabase RPC (add_to_history)
                                              ↓
                                      Tabela historico_consultas
                                              ↓
                                      Painel Admin (/admin) ← Chart.js
```

```
Fluxo de Status (Keepalive):
Cloudflare Worker (External Pinger)
    ↓
    Supabase Edge Function (keepalive)
    ↓
    Tabela keepalive (Exibido no Dashboard Admin)
```

---

## 📡 Histórico e RPCs

### RPC `add_to_history`

A função central de auditoria recebe os seguintes parâmetros:

| Parâmetro            | Tipo        | Descrição                             |
| -------------------- | ----------- | ------------------------------------- |
| `p_user_id`          | UUID/String | Identificador anônimo do usuário      |
| `p_lei`              | String      | Nome curto da lei (ex: CP)            |
| `p_artigo`           | String      | Número do artigo                      |
| `p_resultado`        | String      | inelegivel, elegivel, nao_consta      |
| `p_motivo_detalhado` | Text        | Fundamentação técnica do veredicto    |
| `p_excecoes_citadas` | Text        | Detalhes das exceções aplicadas       |
| `p_metadata`         | JSONB       | Contexto original, source, user-agent |

---

## 🚥 Keepalive (Status)

O monitoramento de disponibilidade é feito via **Hub Keepalive Pattern**, utilizando obrigatoriamente um **Cloudflare Worker** externo como disparador (pinger). Este método gera tráfego externo regular para reduzir o risco de o projeto Supabase entrar em modo de suspensão por inatividade.

> **Limitação:** Nenhum pinger consegue acordar banco já suspenso — reativação é manual via Dashboard Supabase.

**Arquitetura no Inelegis:** Cloudflare Worker → Supabase Edge Function → Tabelas `keepalive`/`keepalive_events`. O Inelegis usa Edge Function (e não API Route) porque é um site estático sem framework SSR.

**Configuração necessária (Supabase Secrets):**

- `KEEPALIVE_TOKEN`: Segredo de autenticação (mesmo valor do Cloudflare Worker).
- `KEEPALIVE_PROJECT_SLUG`: Identificador do projeto (`inelegis`).

> **Detalhes completos:** Consulte [keepalive-setup.md](../guides/keepalive-setup.md) para checklist de variáveis e troubleshooting.

---

## 🧹 Manutenção (CRON)

A limpeza do histórico é protegida pelo `CRON_SECRET`.

```bash
# Exemplo de trigger manual de limpeza (se implementado via API route)
curl -X POST -H "Authorization: Bearer CRON_SECRET" \
  https://inelegis.vercel.app/api/maintenance/cleanup
```

---

## 📚 Referências

- [setup-supabase.md](../guides/setup-supabase.md) - Tabelas de auditoria.
- [variaveis-ambiente.md](../guides/variaveis-ambiente.md) - Configuração de segredos.
- [keepalive-setup.md](../guides/keepalive-setup.md) - Monitoramento de status.

---

_Nota: O antigo `analytics.js` foi decomissionado na v0.3.11 em favor deste sistema integrado ao Supabase._

---

_Última atualização: 20/02/2026 • v0.3.23 (Hub v0.5.8)_
_Editado via: Antigravity | Modelo: claude-3.5-sonnet | OS: Windows 11_
