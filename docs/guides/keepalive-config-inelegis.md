# 🎯 Inelegis: Guia Rápido de Variáveis

> **Este projeto é Tipo A** (App Estático com Supabase Edge Functions)

---

## ✅ Configuração Correta

### 1. Cloudflare Worker

```env
KEEPALIVE_URL=https://lnjzhfykfzrvfbggrdzp.supabase.co/functions/v1/keepalive
KEEPALIVE_TOKEN=[seu-token-secreto]
```

### 2. Vercel (Painel de Environment Variables)

**Configurar APENAS estas 2:**

```env
NEXT_PUBLIC_SUPABASE_URL=https://lnjzhfykfzrvfbggrdzp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**❌ NÃO configurar:**

- `SUPABASE_SERVICE_ROLE_KEY` ← Não precisa (sem backend na Vercel)
- `KEEPALIVE_TOKEN` ← Não precisa (receptor está no Supabase)
- `KEEPALIVE_PROJECT_SLUG` ← Não precisa (receptor está no Supabase)

### 3. Supabase Edge Function Secrets

Acesse: https://supabase.com/dashboard/project/[project]/settings/functions

```env
KEEPALIVE_TOKEN=[mesmo-token-do-cloudflare]
SUPABASE_URL=https://lnjzhfykfzrvfbggrdzp.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. `.env.local` (Desenvolvimento Local)

```env
# ---------------------------
# 🗄️ Supabase (App Principal)
# ---------------------------
NEXT_PUBLIC_SUPABASE_URL=https://lnjzhfykfzrvfbggrdzp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# ---------------------------
# 🛰️ Keepalive (Metadados)
# ---------------------------
KEEPALIVE_TOKEN=seu-token-secreto
KEEPALIVE_PROJECT_SLUG=inelegis
KEEPALIVE_ENVIRONMENT=dev
KEEPALIVE_EVENTS_ENABLED=true
```

---

## 🧠 Por Que Assim?

### Por que `NEXT_PUBLIC_*` na Vercel?

**O navegador do usuário precisa.** Quando alguém acessa inelegis.com, o browser faz chamadas diretas ao Supabase para consultar artigos. Essas chamadas precisam de URL + anon key.

### Por que NÃO `SERVICE_ROLE_KEY` na Vercel?

**Este projeto não tem backend na Vercel.** A Vercel só serve HTML/CSS/JS estáticos. Não há Node.js rodando lá, então não tem como usar a service role key.

### Por que NÃO `KEEPALIVE_TOKEN` na Vercel?

**O receptor do Keepalive está no Supabase, não na Vercel.** O fluxo é:

```
Cloudflare Worker → Supabase Edge Function → Database
```

A Vercel nem participa! Então o token só precisa estar no Cloudflare (quem envia) e no Supabase (quem recebe).

---

## 🚨 Troubleshooting

### Build na Vercel falha: "ANON_KEY não encontrada"

**Problema**: Falta `NEXT_PUBLIC_SUPABASE_ANON_KEY` na Vercel

**Solução**:

1. Vercel Dashboard → Settings → Environment Variables
2. Add: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Value: (copie do `.env.local`)
4. Environments: ✅ Production, ✅ Preview, ✅ Development
5. Redeploy

### Keepalive retorna 401

**Problema**: Tokens diferentes entre Cloudflare e Supabase

**Solução**:

```bash
# Verifique se são IDÊNTICOS:
Cloudflare Worker → KEEPALIVE_TOKEN
Supabase Secrets → KEEPALIVE_TOKEN
```

### Frontend não consegue buscar dados

**Problema**: Falta `NEXT_PUBLIC_SUPABASE_URL` na Vercel

**Solução**: Adicione ambas variáveis `NEXT_PUBLIC_*` (ver seção 2)

---

## 📋 Checklist de Deploy

Antes de fazer deploy, confirme:

```
Vercel:
  [x] NEXT_PUBLIC_SUPABASE_URL
  [x] NEXT_PUBLIC_SUPABASE_ANON_KEY
  [ ] SUPABASE_SERVICE_ROLE_KEY (deve estar VAZIO ou ausente)
  [ ] KEEPALIVE_TOKEN (deve estar VAZIO ou ausente)

Cloudflare:
  [x] KEEPALIVE_URL aponta para *.supabase.co/functions/v1/keepalive
  [x] KEEPALIVE_TOKEN configurado
  [x] Cron Trigger ativo (*/30 * * * *)

Supabase Edge Function:
  [x] Arquivo index.ts deployado em supabase/functions/keepalive/
  [x] KEEPALIVE_TOKEN nos Secrets (mesmo do Cloudflare)
  [x] SUPABASE_URL e SERVICE_ROLE_KEY nos Secrets
```

---

## 🔗 Links Úteis

- [Guia Arquitetural Completo](./ARCHITECTURE.md) (compara Tipo A vs B)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Supabase Dashboard](https://supabase.com/dashboard)
- [Cloudflare Workers](https://dash.cloudflare.com)

---

_Última atualização: 15/02/2026 • Específico para Inelegis (Tipo A)_
