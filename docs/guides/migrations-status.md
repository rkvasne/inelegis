# Status das migrations – Inelegis

Referência para conferir se o schema está aplicado no Supabase.

---

## Estrutura das migrations

Migrations separadas por domínio. Ordem de execução (cronológica pelo timestamp):

| Ordem | Arquivo                                     | Conteúdo                                                        |
| :---: | ------------------------------------------- | --------------------------------------------------------------- |
|   1   | `20260225000000_crimes_inelegibilidade.sql` | Tabela oficial CRE-SP + RPC `verificar_elegibilidade`           |
|   2   | `20260225000100_historico_consultas.sql`    | Histórico de consultas + RPC `add_to_history` (12 params) + RLS |
|   3   | `20260225000200_analytics.sql`              | Analytics (tabela, views, funções) + RLS                        |
|   4   | `20260225000300_keepalive.sql`              | Keepalive (status e eventos de heartbeat)                       |
|   5   | `20260225000150_grant_rpc_anon.sql`         | GRANT EXECUTE nas RPCs de histórico para anon (API Vercel)      |

---

## Comportamento por migration

| Migration              | Tabelas                         | Tratamento                              |
| ---------------------- | ------------------------------- | --------------------------------------- |
| crimes_inelegibilidade | `crimes_inelegibilidade`        | DROP + CREATE (sempre recria dados)     |
| historico_consultas    | `historico_consultas`           | `CREATE IF NOT EXISTS` (preserva dados) |
| analytics              | `analytics_events`              | `CREATE IF NOT EXISTS` (preserva dados) |
| keepalive              | `keepalive`, `keepalive_events` | `CREATE IF NOT EXISTS` (preserva dados) |

---

## Para replicar o sistema

### Via Supabase CLI

```bash
supabase db push
```

### Via SQL Editor

Execute os 5 arquivos em ordem (1 → 5).

---

## Como conferir se está tudo aplicado

1. **Tabelas:** `crimes_inelegibilidade`, `historico_consultas`, `analytics_events`, `keepalive`, `keepalive_events`
2. **Função:** `verificar_elegibilidade` (ver [interpretacao-tabela-oficial.md](../references/interpretacao-tabela-oficial.md))
3. **RLS:** políticas em `historico_consultas`, `analytics_events`, `keepalive`, `keepalive_events`

_Última atualização: 20/02/2026 • v0.3.25_
_Editado via: Cursor | Modelo: Auto | OS: Windows 11_
