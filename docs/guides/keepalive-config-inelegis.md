# ✅ Inelegis: Configuração de Variáveis (Checklist)

> **Baseado na configuração ATUAL e CORRETA** mostrada nas screenshots

---

## 📊 Arquitetura do Inelegis

```
Frontend:  Vanilla JS/HTML estático (Vercel)
Backend:   API Routes serverless (Vercel /api/*)
Keepalive: Edge Function (Supabase)
Database:  PostgreSQL (Supabase)
```

**Por que essa combinação?**

- Frontend estático = mais rápido
- API Routes = features admin sem complexidade de framework
- Edge Function Keepalive = menor latência, 1 menos componente na Vercel

---

## ✅ Configuração Correta (Como Está Agora)

### 1. Cloudflare Worker

```env
KEEPALIVE_URL=https://lnjzhfykfzrvfbggrdzp.supabase.co/functions/v1/keepalive
KEEPALIVE_TOKEN=c8810...  # (guarde o hash completo)
```

**Cron Trigger**: `*/30 * * * *` (a cada 30 minutos)

---

### 2. Vercel Environment Variables

| Variável                        | Por Que Precisa                                                   | Valor Atual            |
| ------------------------------- | ----------------------------------------------------------------- | ---------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Frontend faz RPC calls (`verificar_elegibilidade`)                | `https://lnjzhf...` ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Frontend precisa autenticar chamadas                              | `ca772e...` ✅         |
| `SUPABASE_SERVICE_ROLE_KEY`     | **API Routes** (`/api/analytics`, `/api/dashboard`) byppassam RLS | `3f04607...` ✅        |
| `HISTORY_RETENTION_DAYS`        | Limpeza automática de histórico                                   | `90` ✅                |
| `CRON_SECRET`                   | Proteger endpoints de manutenção                                  | (configurado) ✅       |
| `ANALYTICS_ADMIN_TOKEN`         | Acesso ao dashboard admin                                         | (configurado) ✅       |

**❌ NÃO configurar:**

- `KEEPALIVE_TOKEN` - Receptor está no Supabase, não aqui
- `KEEPALIVE_PROJECT_SLUG` - Idem
- `KEEPALIVE_ENVIRONMENT` - Idem

---

### 3. Supabase Edge Function Secrets

Acesse: `https://supabase.com/dashboard/project/[id]/settings/functions`

| Variável                    | Valor                                   |
| --------------------------- | --------------------------------------- |
| `KEEPALIVE_TOKEN`           | `c8810...` (**MESMO** do Cloudflare) ✅ |
| `SUPABASE_URL`              | `b8e0e3a...` ✅                         |
| `SUPABASE_ANON_KEY`         | `ca772e...` ✅                          |
| `SUPABASE_SERVICE_ROLE_KEY` | `3f04607...` ✅                         |
| `SUPABASE_DB_URL`           | `ead99fe...` ✅                         |

---

### 4. `.env.local` (Desenvolvimento)

```env
# ========================================
# Supabase (App Principal)
# ========================================
NEXT_PUBLIC_SUPABASE_URL=https://lnjzhfykfzrvfbggrdzp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ca772e...
SUPABASE_SERVICE_ROLE_KEY=3f04607...

# ========================================
# Keepalive (Desenvolvimento)
# ========================================
KEEPALIVE_TOKEN=c8810...
KEEPALIVE_PROJECT_SLUG=inelegis
KEEPALIVE_ENVIRONMENT=dev
KEEPALIVE_EVENTS_ENABLED=true

# ========================================
# Sistema
# ========================================
HISTORY_RETENTION_DAYS=90
CRON_SECRET=...
ANALYTICS_ADMIN_TOKEN=...
```

---

## 🧠 Por Que Essa Configuração?

### Por que `SERVICE_ROLE_KEY` na Vercel?

**As API Routes precisam!**

Quando alguém acessa `/api/analytics`, o código roda na Vercel serverless. Esse código precisa:

- Buscar analytics de TODOS os usuários (sem filtro RLS)
- Fazer manutenção do banco (ex: limpar histórico antigo)
- Acessar dados com permissões elevadas

### Por que `KEEPALIVE_TOKEN` NO Supabase, não na Vercel?

**O receptor do ping está lá!**

```
Fluxo do Keepalive:
Cloudflare Worker → POST → Supabase Edge Function → Update Database
                                    ↑
                            Receptor está aqui
```

A Vercel nem sabe que o Keepalive existe! Zero participação no fluxo.

---

## 🚨 Se Algo Der Errado

### Build falha: "ANON_KEY não encontrada"

```
Problema: Variável foi removida da Vercel
Solução:
1. Vercel Dashboard → Settings → Environment Variables
2. Add: NEXT_PUBLIC_SUPABASE_ANON_KEY
3. Value: ca772e0c...  (copie do .env.local)
4. Envs: ✅ Production, ✅ Preview, ✅ Development
5. Redeploy
```

### API Routes retornam 500

```
Problema: SERVICE_ROLE_KEY faltando ou errada
Solução:
1. Vercel Dashboard → Settings → Environment Variables
2. Verifique: SUPABASE_SERVICE_ROLE_KEY
3. Compare valor com Supabase Dashboard → Settings → API
4. Se diferente ou ausente, corrija
5. Redeploy
```

### Keepalive retorna 401

```
Problema: Tokens diferentes
Solução:
1. Cloudflare Worker: KEEPALIVE_TOKEN = c8810...
2. Supabase Secrets: KEEPALIVE_TOKEN = c8810...
3. Devem ser IDÊNTICOS
4. Se diferentes, corrija um dos lados
```

### Frontend não carrega dados

```
Problema: NEXT_PUBLIC_* faltando
Solução: Adicione AMBAS as variáveis NEXT_PUBLIC_* na Vercel
```

---

## 📋 Validação Rápida

Execute localmente:

```powershell
# Verifica se todas as variáveis essenciais estão presentes
node -e "console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅' : '❌')"
node -e "console.log('ANON:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅' : '❌')"
node -e "console.log('SERVICE:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅' : '❌')"
```

Esperado: Todos ✅

---

## 🔗 Links Úteis

- **Vercel Dashboard**: https://vercel.com/rkvasne/inelegis-app/settings/environment-variables
- **Supabase Dashboard**: https://supabase.com/dashboard/project/lnjzhfykfzrvfbggrdzp
- **Supabase Functions Secrets**: https://supabase.com/dashboard/project/lnjzhfykfzrvfbggrdzp/settings/functions
- **Cloudflare Workers**: https://dash.cloudflare.com (busque por "inelegis keepalive")

---

## 📚 Documentação Relacionada

- [Guia Geral de Arquitetura Keepalive](../../.agent/hub/system/scaffolding/keepalive/ARCHITECTURE.md)
- [Troubleshooting Deploy Vercel](./troubleshooting-vercel-deploy.md)
- [API Routes do Projeto](../../api/README.md)

---

_Última atualização: 20/02/2026 • v0.3.22 (Hub v0.5.8)_  
_Validado com: Screenshots Vercel + Supabase (15/02/2026 01:30)_
