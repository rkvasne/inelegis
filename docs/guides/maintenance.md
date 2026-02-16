# Manutenção e Validação de Dados

Este guia descreve como manter os dados jurídicos e validar a integridade do sistema Inelegis utilizando a infraestrutura do Supabase.

---

## 📊 Estrutura de Dados (Single Source of Truth)

Diferente das versões anteriores, o Inelegis não utiliza arquivos JSON ou JS estáticos para os dados. Toda a base jurídica reside no Supabase:

1.  **Tabela `normas`**: Cadastro de leis e códigos.
2.  **Tabela `artigos_inelegiveis`**: Base de artigos que geram inelegibilidade.
3.  **Tabela `artigos_excecoes`**: Regras de exceção (Ex: crimes culposos).

---

## 🔍 Como Atualizar a Base Jurídica

### Via SQL Migrations (Recomendado)

As atualizações devem ser versionadas em `supabase/migrations/`.

1.  Crie um novo arquivo `.sql` (Ex: `009_update_law_X.sql`).
2.  Utilize o `INSERT INTO ... ON CONFLICT DO NOTHING` para garantir idempotência.
3.  Execute o script no **SQL Editor** do Supabase Dashboard ou via CLI.

### Via Supabase Dashboard

Para correções emergenciais ou in-line:

1.  Acesse o **Table Editor** no Dashboard do Supabase.
2.  Selecione a tabela `artigos_inelegiveis` ou `artigos_excecoes`.
3.  Edite os registros diretamente na interface.

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

_Última atualização: 15/02/2026 • v0.3.19 (Hub v0.5.8)_
_Editado via: Antigravity | Modelo: claude-3.5-sonnet | OS: Windows 11_
