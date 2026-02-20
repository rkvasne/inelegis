# Migrations do Inelegis

Execute **todas** as migrations nesta pasta, na ordem dos timestamps dos arquivos.

## Replicar do zero

```bash
supabase db push
```

Ou, manualmente: execute os 13 arquivos `.sql` em ordem (1 a 13 conforme [docs/guides/migrations-status.md](../../docs/guides/migrations-status.md)).

A migration final (`20260220100000_verificar_elegibilidade_fallback_interpretacao.sql`) define o comportamento atual da consulta de elegibilidade.
