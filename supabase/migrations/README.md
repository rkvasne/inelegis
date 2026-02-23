# Migrations do Inelegis

Execute **todas** as migrations nesta pasta, na ordem dos timestamps dos arquivos.

## Replicar do zero

```bash
supabase db push
```

Ou, manualmente: execute os 6 arquivos `.sql` em ordem conforme [docs/guides/migrations-status.md](../../docs/guides/migrations-status.md):

1. `20260225000000_crimes_inelegibilidade.sql`
2. `20260225000100_historico_consultas.sql`
3. `20260225000150_grant_rpc_anon.sql`
4. `20260225000200_analytics.sql`
5. `20260225000300_keepalive.sql`
6. `20260225000400_cleanup_extras_nao_cre.sql`

Ver [interpretacao-tabela-oficial.md](../../docs/references/interpretacao-tabela-oficial.md) para regras da RPC `verificar_elegibilidade`.
