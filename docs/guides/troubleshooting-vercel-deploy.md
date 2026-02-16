# ⚠️ Troubleshooting: Deploy na Vercel

> **Última atualização:** 15/02/2026  
> **Versão do Projeto:** v0.3.19

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

### Keepalive (Opcional, mas recomendado)

| Variável                 | Obrigatória? | Onde usar                 |
| ------------------------ | ------------ | ------------------------- |
| `KEEPALIVE_TOKEN`        | ⚙️ Opcional  | `/api/keepalive` route    |
| `KEEPALIVE_PROJECT_SLUG` | ⚙️ Opcional  | Metadados do ping         |
| `KEEPALIVE_ENVIRONMENT`  | ⚙️ Opcional  | Identificação do ambiente |

---

## 🔍 Como Verificar no Vercel

1. Settings → Environment Variables
2. Procure por cada variável na lista acima
3. Se alguma estiver **missing**, adicione conforme instruções

---

## 📚 Documentação Relacionada

- [Setup Supabase](./setup-supabase.md)
- [Hub Keepalive Pattern](../../.agent/hub/system/scaffolding/keepalive/README.md)
- [Guia de Keepalive (setup)](./keepalive-setup.md)

---

## 🆘 Ainda com Problemas?

1. Verifique os logs de build no Vercel Dashboard
2. Confirme que o `.env.local` local tem todas as variáveis
3. Execute `npm run build` localmente para reproduzir o erro
4. Consulte o [CHANGELOG.md](../../CHANGELOG.md) para incidentes similares

---

_Criado em: 15/02/2026 • Contexto: Incidente de deploy v0.3.16_
