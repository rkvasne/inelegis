# 🎯 Inelegis: Configuração Real de Variáveis

> **ARQUITETURA HÍBRIDA**: Frontend Estático + API Routes Serverless + Keepalive Edge Function

---

## ⚠️ IMPORTANTE: O Que Este Projeto REALMENTE É

**Inelegis NÃO é apenas um app estático!**

### Componentes:

1. **Frontend**: Vanilla JS/HTML (estático) servido pela Vercel
2. **Backend Serverless**: API Routes (`/api/*`) rodando NA VERCEL:
   - `/api/analytics.js` - Dashboard de analytics
   - `/api/dashboard.js` - Métricas do sistema  
   - `/api/search-history.js` - Busca de histórico
   - `/api/maintenance.js` - Manutenção
3. **Keepalive Receptor**: Supabase Edge Function

**Por isso:**
- ✅ Frontend precisa de `NEXT_PUBLIC_*`
- ✅ **API Routes precisam de `SERVICE_ROLE_KEY`** ← CRUCIAL!
- ✅ Keepalive precisa de token no Supabase (não na Vercel)

---

## ✅ Configuração ATUAL e CORRETA

### 1. Cloudflare Worker (Pinger)

```env
KEEPALIVE_URL=https://lnjzhfykfzrvfbggrdzp.supabase.co/functions/v1/keepalive
KEEPALIVE_TOKEN=c8810...  # (hash completo nos secrets)
```

### 2. Vercel Environment Variables

**TODAS estas variáveis são NECESSÁRIAS:**

```env
# ========================================
# Supabase (Frontend + Backend API Routes)
# ========================================
NEXT_PUBLIC_SUPABASE_URL=https://lnjzhfykfzrvfbggrdzp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ca772e...  # Frontend precisa
SUPABASE_SERVICE_ROLE_KEY=3f04607...      # API Routes precisam!

# ========================================
# Sistema (Funcionalidades do App)
# ========================================
HISTORY_RETENTION_DAYS=90                 # Limpeza automática de histórico
CRON_SECRET=...                           # Segurança para cron jobs
ANALYTICS_ADMIN_TOKEN=...                  # Acesso ao dashboard admin
```

**❌ NÃO configurar na Vercel (são do Keepalive, que está no Supabase):**
- `KEEPALIVE_TOKEN`
- `KEEPALIVE_PROJECT_SLUG`
- `KEEPALIVE_ENVIRONMENT`

### 3. Supabase Edge Functions Secrets

```env
# ========================================
# Keepalive (Edge Function)
# ========================================
KEEPALIVE_TOKEN=c8810...  # MESMO token do Cloudflare Worker
SUPABASE_URL=b8e0e3a...
SUPABASE_ANON_KEY=ca772e...
SUPABASE_SERVICE_ROLE_KEY=3f04607...
SUPABASE_DB_URL=ead99fe...
```

### 4. `.env.local` (Desenvolvimento Local)

```env
# ---------------------------
# 🗄️ Supabase
# ---------------------------
NEXT_PUBLIC_SUPABASE_URL=https://lnjzhfykfzrvfbggrdzp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# ---------------------------
# 🛰️ Keepalive
# ---------------------------
KEEPALIVE_TOKEN=...
KEEPALIVE_PROJECT_SLUG=inelegis
KEEPALIVE_ENVIRONMENT=dev
KEEPALIVE_EVENTS_ENABLED=true

# ---------------------------
# 🔧 Sistema
# ---------------------------
HISTORY_RETENTION_DAYS=90
CRON_SECRET=...
ANALYTICS_ADMIN_TOKEN=...
```

---

## 🧠 Por Que Assim?

### Por que `SUPABASE_SERVICE_ROLE_KEY` NA VERCEL?

**As API Routes precisam!**

Quando você acessa `/api/analytics`, o código roda **na Vercel** (serverless function). Esse código precisa acessar o Supabase com permissões elevadas para:
- Buscar analytics sem RLS
- Fazer manutenção de dados
- Acessar histórico de todos os usuários

### Por que `KEEPALIVE_TOKEN` NÃO está na Vercel?

**O receptor está no Supabase, não na Vercel!**

Fluxo do Keepalive:
```
Cloudflare Worker → Supabase Edge Function → Database
                          ↑
                    Receptor aqui
```

A Vercel nem participa do fluxo de Keepalive! Então o token só precisa estar:
1. No Cloudflare (quem envia)
2. No Supabase (quem recebe)

---

## 🚨 Troubleshooting

### Build na Vercel falha: "SERVICE_ROLE_KEY não encontrada"

**Isso é ESPERADO se a variável foi removida!**

**Solução:**
1. Vercel Dashboard → Settings → Environment Variables
2. Add: `SUPABASE_SERVICE_ROLE_KEY` 
3. Value: (copie do Supabase Dashboard → Settings → API → service_role)
4. Environments: ✅ Production, ✅ Preview, ✅ Development
5. Redeploy

### API Routes retornam 500

**Problema**: Falta `SERVICE_ROLE_KEY` ou está incorreta

**Verificar**:
1. Vercel tem a variável?
2. Valor está correto? (compare com Supabase Dashboard)

### Keepalive retorna 401

**Problema**: Tokens diferentes entre Cloudflare e Supabase

**Solução**:
```bash
# Verifique se são IDÊNTICOS:
Cloudflare Worker → KEEPALIVE_TOKEN
Supabase Secrets → KEEPALIVE_TOKEN
```

---

## 📋 Checklist Pré-Deploy

```
Vercel Environment Variables:
  [x] NEXT_PUBLIC_SUPABASE_URL
  [x] NEXT_PUBLIC_SUPABASE_ANON_KEY
  [x] SUPABASE_SERVICE_ROLE_KEY  ← NECESSÁRIO (API Routes)
  [x] HISTORY_RETENTION_DAYS
  [x] CRON_SECRET
  [x] ANALYTICS_ADMIN_TOKEN
  [ ] KEEPALIVE_TOKEN (deve estar AUSENTE - está no Supabase)

Supabase Edge Function Secrets:
  [x] KEEPALIVE_TOKEN (mesmo do Cloudflare)
  [x] SUPABASE_URL
  [x] SUPABASE_ANON_KEY
  [x] SUPABASE_SERVICE_ROLE_KEY
  [x] SUPABASE_DB_URL

Cloudflare Worker:
  [x] KEEPALIVE_URL aponta para *.supabase.co/functions/v1/keepalive
  [x] KEEPALIVE_TOKEN (mesmo do Supabase)
  [x] Cron Trigger ativo (*/30 * * * *)
```

---

## 📚 Documentação Relacionada

- [Arquitetura Geral do Keepalive](../../.agent/hub/system/scaffolding/keepalive/ARCHITECTURE.md)
- [API Routes do Projeto](../../api/README.md)
- [Troubleshooting Vercel Deploy](./troubleshooting-vercel-deploy.md)

---

_Última atualização: 15/02/2026 • Corrigido após identificação de API Routes_
_Arquitetura: Híbrido (Frontend Estático + API Serverless + Edge Function)_
