# ⚠️ Troubleshooting: Deploy na Vercel

> **Última atualização:** 21/02/2026  
> **Versão do Projeto:** v0.3.26

---

## 🚨 Erro: "NEXT_PUBLIC_SUPABASE_ANON_KEY não encontrada"

### Sintomas

```
❌ ERRO: Variáveis do Supabase não encontradas no .env.local ou no ambiente.
   Diagnóstico:
   - URL encontrada: SIM
   - Key encontrada: NÃO
```

### Causa Raiz

A variável `NEXT_PUBLIC_SUPABASE_ANON_KEY` foi removida das **Environment Variables** da Vercel por interpretação incorreta da documentação do Keepalive.

**Documentação ambígua (CORRIGIDA em 15/02/2026):**

> "Vercel: Somente se o endpoint estiver na Vercel. Ignore se usar Supabase Edge Functions."

**Isso se referia APENAS ao endpoint `/api/keepalive`, NÃO às credenciais gerais do Supabase!**

### ✅ Solução

#### Via Vercel Dashboard (Recomendado)

1. Acesse: https://vercel.com/[username]/inelegis/settings/environment-variables
2. Clique em **"Add New"**
3. Configure:
   - **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value**: (copie do arquivo `.env.local` local)
   - **Environments**: ✅ Production, ✅ Preview, ✅ Development
4. Clique em **"Save"**
5. **Redeploy** o projeto (Settings → Deployments → Latest → Redeploy)

#### Via Vercel CLI (Alternativa)

```powershell
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# Cole o valor quando solicitado
# Repita para preview e development
```

---

## 📋 Checklist de Variáveis Obrigatórias na Vercel

### Supabase (Core - SEMPRE necessário)

| Variável                        | Obrigatória? | Onde usar                        |
| ------------------------------- | ------------ | -------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | ✅ SIM       | Frontend + Backend               |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ SIM       | Frontend (RPC calls, auth)       |
| `SUPABASE_SERVICE_ROLE_KEY`     | ✅ SIM       | Backend (API routes, bypass RLS) |

### Keepalive (NÃO na Vercel)

O Inelegis usa **Supabase Edge Function** para Keepalive, não rota na Vercel. As variáveis `KEEPALIVE_TOKEN`, `KEEPALIVE_PROJECT_SLUG` e `KEEPALIVE_ENVIRONMENT` devem ser configuradas nos **Supabase Secrets** (Edge Functions), não nas Environment Variables da Vercel. Consulte [keepalive-inelegis.md](./keepalive-inelegis.md).

---

## 🔍 Como Verificar no Vercel

1. Settings → Environment Variables
2. Procure por cada variável na lista acima
3. Se alguma estiver **missing**, adicione conforme instruções

---

## 📚 Documentação Relacionada

- [Setup Supabase](./setup-supabase.md)
- [Hub Keepalive Pattern](../../.agent/hub/system/scaffolding/keepalive/README.md)
- [Guia de Keepalive (Inelegis)](./keepalive-inelegis.md)

---

## 🆘 Ainda com Problemas?

1. Verifique os logs de build no Vercel Dashboard
2. Confirme que o `.env.local` local tem todas as variáveis
3. Execute `npm run build` localmente para reproduzir o erro
4. Consulte o [CHANGELOG.md](../../CHANGELOG.md) para incidentes similares

---

_Última atualização: 21/02/2026 • v0.3.26 (Hub v0.6.1)_
