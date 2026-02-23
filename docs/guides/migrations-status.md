# Status das migrations – Inelegis

Referência para conferir se o schema está aplicado no Supabase.

---

## Estrutura das migrations

Migrations separadas por domínio. Ordem de execução (cronológica pelo timestamp):

| Ordem | Arquivo                                                   | Conteúdo                                                                  |
| :---: | --------------------------------------------------------- | ------------------------------------------------------------------------- |
|   1   | `20260225000000_crimes_inelegibilidade.sql`               | Tabela oficial CRE-SP + RPC `verificar_elegibilidade` (consolidada)       |
|   2   | `20260225000100_historico_consultas.sql`                  | Histórico de consultas + RPC `add_to_history` (12 params) + RLS           |
|   3   | `20260225000150_grant_rpc_anon.sql`                       | GRANT EXECUTE nas RPCs de histórico para anon (API Vercel)                |
|   4   | `20260225000200_analytics.sql`                            | Analytics (tabela, views, funções) + RLS                                  |
|   5   | `20260225000300_keepalive.sql`                            | Keepalive (status e eventos de heartbeat)                                 |
|   6   | `20260225000400_cleanup_extras_nao_cre.sql`               | Limpeza idempotente de registros fora da tabela CRE (CTB/Improbidade)     |
|   7   | `20260225000500_verificar_elegibilidade_v2_compostas.sql` | RPC `verificar_elegibilidade_v2` (suporte a c.c. e exceções condicionais) |
|   8   | `20260226000100_keepalive_hub_compat.sql`                 | Compatibilidade Hub no keepalive (`status_code`, `response_time_ms`)      |

---

## Comportamento por migration

| Migration              | Tabelas                         | Tratamento                              |
| ---------------------- | ------------------------------- | --------------------------------------- |
| crimes_inelegibilidade | `crimes_inelegibilidade`        | DROP + CREATE (sempre recria dados)     |
| historico_consultas    | `historico_consultas`           | `CREATE IF NOT EXISTS` (preserva dados) |
| analytics              | `analytics_events`              | `CREATE IF NOT EXISTS` (preserva dados) |
| keepalive              | `keepalive`, `keepalive_events` | `CREATE IF NOT EXISTS` (preserva dados) |
| keepalive_hub_compat   | `keepalive_events`              | `ALTER TABLE/UPDATE` (retrocompatível)  |

---

## Para replicar o sistema

### Via Supabase CLI

```bash
supabase db push
```

### Via SQL Editor

Execute os 8 arquivos em ordem (1 → 8).

---

## Como conferir se está tudo aplicado

1. **Tabelas:** `crimes_inelegibilidade`, `historico_consultas`, `analytics_events`, `keepalive`, `keepalive_events`
2. **Funções:** `verificar_elegibilidade` e `verificar_elegibilidade_v2` (ver [interpretacao-tabela-oficial.md](../references/interpretacao-tabela-oficial.md))
3. **RLS:** políticas em `historico_consultas`, `analytics_events`, `keepalive`, `keepalive_events`
4. **Conformidade CRE:** sem códigos fora da tabela oficial (`LEI_9503_97` e `LEI_8429_92` ausentes após cleanup)

_Última atualização: 23/02/2026 • v0.3.27_
_Editado via: Codex CLI | Modelo: GPT-5 | OS: Windows 11_
