---
docStatus: active
docScope: setup-guide
lastReviewed: 02/02/2026
---

# 🗄️ Setup Supabase

> Configuração do banco de dados Supabase para o Inelegis.

---

## 📋 Pré-requisitos

1. Conta no [Supabase](https://supabase.com)
2. Projeto criado no Supabase Dashboard

---

## 🔧 Configuração

### 1. Obter Credenciais

No Supabase Dashboard → Seu Projeto → **Settings** → **API**:

- **Project URL**: `https://xxxxxxxxxxxx.supabase.co`
- **anon public key**: chave pública (pode ir no frontend)
- **service_role key**: chave privada (APENAS backend)

### 2. Configurar Variáveis de Ambiente

Edite o arquivo `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

⚠️ **IMPORTANTE**: A `SUPABASE_SERVICE_ROLE_KEY` NUNCA deve ser exposta no frontend!

### 3. Executar Migrations

#### Via SQL Editor (Dashboard)

1. Acesse **SQL Editor** no Supabase Dashboard
2. Execute cada arquivo em ordem:
   - `supabase/migrations/001_create_inelegibilidade.sql`
   - `supabase/migrations/002_seed_normas.sql`
   - `supabase/migrations/003_seed_artigos_inelegiveis.sql`
   - `supabase/migrations/004_seed_artigos_excecoes.sql`
   - `supabase/migrations/005_insert_leis_especiais.sql`
   - `supabase/migrations/006_create_historico_consultas.sql`
   - `supabase/migrations/007_create_analytics.sql`
   - `supabase/migrations/008_insert_todos_artigos_tre.sql` (Carga massiva oficial)

#### Via CLI (Opcional)

```bash
npm install -g supabase
supabase login
supabase link --project-ref seu-project-id
supabase db push
```

### 4. Testar Conexão

```bash
node scripts/test-supabase.js
```

Resultado esperado:

```
✅ CONEXÃO SUPABASE OK!
📊 Normas encontradas: X
✅ Tabela historico_consultas existe!
✅ Função RPC funcionando!
🎉 TESTES CONCLUÍDOS!
```

---

## 📊 Estrutura do Banco

### Tabelas Principais

| Tabela                | Descrição                            |
| --------------------- | ------------------------------------ |
| `normas`              | Leis e códigos (CP, CPM, LE, etc)    |
| `artigos_inelegiveis` | Artigos que geram inelegibilidade    |
| `artigos_excecoes`    | Exceções que removem inelegibilidade |
| `historico_consultas` | Histórico de consultas dos usuários  |
| `analytics_events`    | Eventos de analytics                 |

### Views (para Dashboard)

| View                            | Descrição                  |
| ------------------------------- | -------------------------- |
| `analytics_stats`               | Estatísticas gerais        |
| `analytics_top_artigos`         | Artigos mais consultados   |
| `analytics_result_distribution` | Distribuição de resultados |
| `analytics_timeline`            | Timeline de consultas      |

### Funções RPC

| Função                      | Descrição                               |
| --------------------------- | --------------------------------------- |
| `verificar_elegibilidade()` | Verifica se artigo gera inelegibilidade |
| `get_user_history()`        | Obtém histórico do usuário              |
| `add_to_history()`          | Adiciona consulta ao histórico          |
| `get_user_stats()`          | Estatísticas do usuário                 |
| `get_dashboard_stats()`     | Estatísticas para dashboard             |

---

## 🔐 Segurança (RLS)

O Supabase usa Row Level Security (RLS) para proteger os dados:

- Tabela `historico_consultas` tem RLS ativado
- Usuários só podem ver seu próprio histórico
- A função `verificar_elegibilidade` é `SECURITY DEFINER` (acesso controlado)

---

## 🚀 Deploy (Vercel)

No Vercel Dashboard → Seu Projeto → **Settings** → **Environment Variables**:

| Variável                        | Ambiente            |
| ------------------------------- | ------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Production, Preview |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production, Preview |
| `SUPABASE_SERVICE_ROLE_KEY`     | Production, Preview |

---

## 🐛 Troubleshooting

### Erro: "Variáveis do Supabase não configuradas"

Verifique se o `.env.local` está preenchido corretamente.

### Erro: "relation does not exist"

Execute as migrations na ordem correta.

### Erro 401 (Unauthorized)

Verifique se a `anon key` está correta e se RLS das tabelas permite acesso.

---

## 📚 Links Úteis

- [Supabase Docs](https://supabase.com/docs)
- [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
