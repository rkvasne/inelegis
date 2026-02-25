# Manutenção e Validação de Dados

Este guia descreve como manter os dados jurídicos e validar a integridade do sistema Inelegis utilizando a infraestrutura do Supabase.

---

## 📊 Estrutura de Dados (Single Source of Truth)

Toda a base jurídica reside no Supabase. O schema atual usa:

1.  **Tabela `crimes_inelegibilidade`**: Base única com leis, artigos, exceções e tipos de crime. A coluna `eh_excecao` distingue dispositivos impeditivos das exceções legais (ex.: crimes culposos, art. 163 § único inciso IV).
2.  **Tabela `historico_consultas`**: Histórico de consultas do usuário (RPC `add_to_history` via API Vercel).
3.  **Tabelas auxiliares**: `analytics_events`, `keepalive`, `keepalive_events` — ver [migrations-status.md](./migrations-status.md).

---

## 🔍 Como Atualizar a Base Jurídica

### Via SQL Migrations (Recomendado)

As atualizações devem ser versionadas em `supabase/migrations/`.

1.  Crie um novo arquivo `.sql` seguindo o padrão `YYYYMMDDHHMMSS_descricao.sql` (ex.: `20260301000000_ajuste_lei_X.sql`).
2.  Para `crimes_inelegibilidade`, use `INSERT INTO` — a migration principal usa `DROP TABLE` + `CREATE` ao replicar do zero; para correções incrementais, crie migrations que alterem apenas o necessário.
3.  Execute via `supabase db push` ou no **SQL Editor** do Supabase Dashboard.

### Via Supabase Dashboard

Para correções emergenciais ou in-line:

1.  Acesse o **Table Editor** no Dashboard do Supabase.
2.  Selecione a tabela `crimes_inelegibilidade`.
3.  Edite os registros diretamente na interface (cuidado com a coluna `eh_excecao` e `artigo_inteiro_impeditivo`).

---

## 📋 Checklist de Manutenção Trimestral

- [ ] **Sincronização**: Verificar se houve nova publicação da "Tabela de Inelegibilidade" pelo TRE-SP ou TSE.
- [ ] **Integridade**: Executar `npm run check` para garantir que o build e os testes de formatação estão OK.
- [ ] **Analytics/Audit**: Revisar a tabela `historico_consultas` no Supabase para identificar termos de busca não encontrados ou erros de fundamentação.
- [ ] **Monitoramento**: Verificar no Dashboard do Supabase o status do **Hub Keepalive Pattern** (tabela `keepalive`).
- [ ] **Segurança**: Auditar as chaves API e permissões RLS no painel do Supabase.

---

O histórico de consultas é persistido na tabela `historico_consultas`. A limpeza e retenção de dados são protegidas pelo `CRON_SECRET`.

- **Retenção Padrão**: 90 dias (configurável via `HISTORY_RETENTION_DAYS`).
- **Monitoramento**: O sistema de **Keepalive** (padrão do Hub) garante que o banco permaneça ativo através de disparos externos do Cloudflare a cada 30 minutos.

---

## 📞 Referência de Scripts

- `npm run check`: Sanity check geral.
- `scripts/build-supabase-config.js`: Atualiza as credenciais do cliente frontend.

---

_Última atualização: 21/02/2026 • v0.3.28 (Hub v0.6.1)_
_Editado via: Antigravity | Modelo: claude-3.5-sonnet | OS: Windows 11_
