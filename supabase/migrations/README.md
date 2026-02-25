# Migrations do Inelegis

Execute **todas** as migrations nesta pasta, na ordem dos timestamps dos arquivos.

## Replicar do zero

```bash
supabase db push
```

Ou, manualmente: execute os 12 arquivos `.sql` em ordem conforme [docs/guides/migrations-status.md](../../docs/guides/migrations-status.md):

1. `20260225000000_crimes_inelegibilidade.sql`
2. `20260225000100_historico_consultas.sql`
3. `20260225000150_grant_rpc_anon.sql`
4. `20260225000200_analytics.sql`
5. `20260225000300_keepalive.sql`
6. `20260225000400_cleanup_extras_nao_cre.sql`
7. `20260225000500_verificar_elegibilidade_v2_compostas.sql`
8. `20260226000100_keepalive_hub_compat.sql`
9. `20260226000200_hotfix_verificar_elegibilidade_normalizacao_paragrafo.sql`
10. `20260226000300_hotfix_cp_177_180_184_base_impeditiva.sql`
11. `20260226000400_hotfix_verificar_elegibilidade_failsafe_lacuna_dados.sql`
12. `20260226000500_hotfix_artigo_inteiro_impeditivo_enumerados.sql`

Ver [interpretacao-tabela-oficial.md](../../docs/references/interpretacao-tabela-oficial.md) para regras da RPC `verificar_elegibilidade`.

---

_Última atualização: 26/02/2026 • v0.3.27 (Hub v0.6.1)_
_Editado via: Codex CLI | Modelo: GPT-5 | OS: Windows 11_
