# Status das migrations – Inelegis

Referência para conferir se o que está no repositório já foi aplicado no Supabase.

---

## Para replicar o sistema do zero

Para quem está montando um Supabase novo (clone do projeto, ambiente de teste, etc.):

### Opção recomendada: Supabase CLI

```bash
# Na raiz do projeto, com Supabase CLI instalado e linkado ao projeto
supabase db push
```

Isso executa **todas as 13 migrations** na ordem correta (cronológica pelo timestamp do arquivo).

### Opção manual: SQL Editor

Se não usar o CLI, execute os arquivos do diretório `supabase/migrations/` **nesta ordem** (1 a 13):

| Ordem | Arquivo                                                              |
| :---: | -------------------------------------------------------------------- |
|   1   | `20260115000000_remodelagem_completa.sql`                            |
|   2   | `20260120000000_create_historico_consultas.sql`                      |
|   3   | `20260121000000_tabela_oficial_completa.sql`                         |
|   4   | `20260122000000_create_analytics.sql`                                |
|   5   | `20260211164500_create_keepalive_system.sql`                         |
|   6   | `20260211195000_enhance_audit_history.sql`                           |
|   7   | `20260212233000_admin_access_setup.sql`                              |
|   8   | `20260214221500_secure_keepalive_rls.sql`                            |
|   9   | `20260214223000_secure_history_functions.sql`                        |
|  10   | `20260215000000_verificar_elegibilidade_fallback_hierarquico.sql`    |
|  11   | `20260215100000_verificar_elegibilidade_match_estrito.sql`           |
|  12   | `20260220000000_verificar_elegibilidade_dispositivo_inexistente.sql` |
|  13   | `20260220100000_verificar_elegibilidade_fallback_interpretacao.sql`  |

A migration **13** é a que define o comportamento atual da consulta (interpretação da tabela CRE). As anteriores preparam tabelas, RLS e a função que a 13 substitui.

---

## Migrations no repositório (ordem cronológica)

| #   | Arquivo                                                              | Conteúdo principal                                                                                    |
| --- | -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| 1   | `20260115000000_remodelagem_completa.sql`                            | Remodelagem inicial, tabela crimes                                                                    |
| 2   | `20260120000000_create_historico_consultas.sql`                      | Tabela historico_consultas                                                                            |
| 3   | `20260121000000_tabela_oficial_completa.sql`                         | Tabela oficial (crimes_inelegibilidade)                                                               |
| 4   | `20260122000000_create_analytics.sql`                                | Analytics (tabelas/views)                                                                             |
| 5   | `20260211164500_create_keepalive_system.sql`                         | Tabelas keepalive                                                                                     |
| 6   | `20260211195000_enhance_audit_history.sql`                           | Melhorias no histórico/auditoria                                                                      |
| 7   | `20260212233000_admin_access_setup.sql`                              | Setup de acesso admin                                                                                 |
| 8   | `20260214221500_secure_keepalive_rls.sql`                            | RLS keepalive (service_role)                                                                          |
| 9   | `20260214223000_secure_history_functions.sql`                        | Funções de histórico (SECURITY INVOKER, set_app_user_id)                                              |
| 10  | `20260215000000_verificar_elegibilidade_fallback_hierarquico.sql`    | RPC verificar_elegibilidade (fallback hierárquico)                                                    |
| 11  | `20260215100000_verificar_elegibilidade_match_estrito.sql`           | RPC verificar_elegibilidade (match estrito §/inciso/alínea)                                           |
| 12  | `20260220000000_verificar_elegibilidade_dispositivo_inexistente.sql` | RPC: dispositivo inexistente → NAO_CONSTA (sobrescrito pela 13)                                       |
| 13  | `20260220100000_verificar_elegibilidade_fallback_interpretacao.sql`  | RPC: fallback conforme interpretação da tabela CRE (Art. 121 §8 → INELEGIVEL; Art. 122 §8 → ELEGIVEL) |

---

## Migrations registradas no Supabase (projeto inelegis-app)

O Supabase guarda apenas as migrations aplicadas **pelo CLI** ou pelo **fluxo de migrations** do Dashboard. Rodar SQL no SQL Editor **não** cria registro aqui.

**Lista atual (API Supabase):**

| Versão         | Nome                                           |
| -------------- | ---------------------------------------------- |
| 20260215003628 | fix_keepalive_rls                              |
| 20260215035025 | fix_verificar_elegibilidade_fallback           |
| 20260215035640 | sync_with_official_table_oct2024               |
| 20260215044244 | full_sync_oct2024_ssot                         |
| 20260215045615 | cleanup_and_refactor_functions                 |
| 20260216222846 | verificar_elegibilidade_fallback_hierarquico   |
| 20260217024119 | verificar_elegibilidade_observacao_hierarquica |
| 20260217024827 | verificar_elegibilidade_elegivel_com_aviso     |
| 20260217025234 | verificar_elegibilidade_order_by_nulls_last    |
| 20260217030955 | verificar_elegibilidade_formatar_excecoes      |

Os nomes/versões não batem 1:1 com os arquivos do repo porque o histórico do projeto foi aplicado em outro formato (outros nomes ou SQL Editor).

---

## Como conferir se está tudo aplicado

1. **Tabelas**  
   Dashboard → Table Editor: deve existir  
   `crimes_inelegibilidade`, `historico_consultas`, `analytics_events`, `keepalive`, `keepalive_events`, etc.

2. **Função `verificar_elegibilidade`**
   - Dashboard → SQL Editor → rodar:  
     `SELECT pg_get_functiondef(oid) FROM pg_proc WHERE proname = 'verificar_elegibilidade';`
   - Ou confiar no `npm run db:extract`: o `extract-functions.json` é gerado a partir do banco.
   - Deve incluir match exato `(p_paragrafo IS NOT NULL AND t.paragrafo = p_paragrafo)` e lógica de fallback por interpretação CRE (migration 13).

3. **RLS**  
   Dashboard → Authentication → Policies: políticas em `historico_consultas`, `keepalive`, etc.

4. **Migrations “faltando” no registro**  
   Se você aplicou algo pelo SQL Editor (ex.: `20260215100000_verificar_elegibilidade_match_estrito.sql`), o comportamento já está no banco, mas essa migration **não** vai aparecer na lista do Supabase. Para passar a registrar tudo pelo CLI e alinhar com o repo:
   - Configurar Supabase CLI e linkar o projeto.
   - Daqui pra frente aplicar com `supabase db push` (ou `supabase migration up`), para que novas migrations apareçam na lista.

---

## Migrations logicamente obsoletas (documentação)

Algumas migrations criam ou alteram objetos que são **totalmente substituídos** por migrations posteriores. O estado final do banco vem apenas das últimas na cadeia. Mesmo assim, **não se devem excluir** – o Supabase CLI depende do histórico linear e da ordem de execução.

| Migration | O que faz                                                                 | Por que é obsoleta no estado final                                                                                            |
| --------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| 1         | Cria `crimes_inelegibilidade` (schema antigo) e `verificar_elegibilidade` | A migration 3 faz DROP e recria tabela e função com schema novo. A 1 ainda faz DROP de tabelas antigas (normas, artigos\_\*). |
| 10        | `CREATE OR REPLACE` em `verificar_elegibilidade` (fallback hierárquico)   | Substituída pela 11, 12 e 13. Só altera a função.                                                                             |
| 11        | `CREATE OR REPLACE` em `verificar_elegibilidade` (match estrito)          | Substituída pela 12 e 13. Só altera a função.                                                                                 |
| 12        | `CREATE OR REPLACE` em `verificar_elegibilidade` (NAO_CONSTA sem match)   | Substituída pela 13 (interpretação CRE). Só altera a função.                                                                  |

**Por que não excluir?** (1) Projetos existentes teriam histórico de migrations “órfão” e o CLI pode falhar. (2) A ordem de execução precisa ser mantida. (3) Excluir migrations quebra reprodutibilidade.

**Recomendação:** manter todas as 13 migrations e executá-las na ordem. A migration 13 define o comportamento atual da consulta.

---

## Conclusão

- **Repositório:** 13 arquivos de migration em `supabase/migrations/`.
- **Supabase:** 10 migrations registradas (nomes/versões diferentes do repo).
- **Função atual:** A migration `20260220100000` aplica a **interpretação da tabela CRE** usada pelos servidores do TRE: artigo inteiro impeditivo (ex.: Art. 121) → dispositivo não exceção retorna INELEGIVEL; dispositivos enumerados (ex.: Art. 122 §1–7) → fora do rol retorna ELEGIVEL. Ver [interpretacao-tabela-oficial.md](../references/interpretacao-tabela-oficial.md).

Se quiser que a lista do Supabase reflita exatamente o repo, use o CLI para aplicar as migrations a partir de agora e, se necessário, normalize o histórico (ex.: um único “baseline” e novas migrations em cima).

_Última atualização: 20/02/2026_
_Editado via: Cursor | Modelo: Auto | OS: Windows 11_
