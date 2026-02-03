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
- [ ] **Analytics**: Revisar a View `analytics_top_artigos` no Supabase para identificar termos de busca não encontrados (indicativo de dados faltantes).
- [ ] **Segurança**: Auditar as chaves API e permissões RLS no painel do Supabase.

---

## ⚡ Rotina de Limpeza

O histórico de consultas é persistido na tabela `historico_consultas`. A limpeza e retenção de dados agora podem ser configuradas via **Supabase Edge Functions** ou **PG Cron** diretamente no banco de dados.

- **Retenção Padrão**: 90 dias.
- **Configuração**: Ver variável `HISTORY_RETENTION_DAYS` no `.env.local`.

---

## 📞 Referência de Scripts

- `npm run check`: Sanity check geral.
- `scripts/build-supabase-config.js`: Atualiza as credenciais do cliente frontend.

---

_Atualizado em: 03/02/2026_
