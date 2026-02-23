# 🛠️ Keepalive no Inelegis (Hub Keepalive Pattern)

Guia unificado de configuração do monitoramento externo para **reduzir o risco** de o Supabase suspender o banco por inatividade.

> **Importante:** O Hub define o **Cloudflare Worker com Cron Trigger** como o único pinger oficial.
>
> **Limitação Crítica:** Nenhum pinger consegue acordar um banco **já suspenso**. O objetivo é gerar tráfego regular para evitar a suspensão. Reativação é manual via Dashboard do Supabase.

---

## 🏗️ Arquitetura

O Inelegis usa a variante **Decoupled** do padrão Hub:

1. **Pinger:** Cloudflare Worker (a cada 30 min).
2. **Receptor:** Supabase Edge Function (`keepalive`).
3. **Persistência:** Tabelas `keepalive` e `keepalive_events` no Supabase.

```
Frontend:  Vanilla JS/HTML estático (Vercel)
Backend:   API Routes serverless (Vercel /api/*)
Keepalive: Edge Function (Supabase)
Database:  PostgreSQL (Supabase)
```

**Por que Edge Function e não API Route?** O Inelegis é site estático sem SSR. Projetos sem Next.js/SSR devem usar Supabase Edge Function — independência do hosting e resiliência mesmo com site fora do ar.

**Referência:** `.agent/hub/docs/guides/guide-keepalive-monitoring.md` e `.agent/hub/system/scaffolding/keepalive/ARCHITECTURE.md`

---

## ✅ Checklist de Configuração

### 1. Cloudflare Worker

| Variável          | Valor                                                             |
| ----------------- | ----------------------------------------------------------------- |
| `KEEPALIVE_URL`   | `https://btdbfspuazgerdbmurza.supabase.co/functions/v1/keepalive` |
| `KEEPALIVE_TOKEN` | Mesmo segredo configurado no Supabase (ex.: `c8810...`)           |

**Cron Trigger:** `*/30 * * * *` (a cada 30 minutos).

**Código:** `scripts/keepalive-worker.js`

---

### 2. Supabase Edge Function (Receptor)

**Arquivo:** `supabase/functions/keepalive/index.ts`

| Secret                      | Descrição                 |
| --------------------------- | ------------------------- |
| `KEEPALIVE_TOKEN`           | Mesmo valor do Cloudflare |
| `SUPABASE_URL`              | URL do projeto            |
| `SUPABASE_ANON_KEY`         | Chave anon                |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave service role        |

**Dashboard:** `https://supabase.com/dashboard/project/btdbfspuazgerdbmurza/settings/functions`

---

### 3. Vercel — O que configurar

| Variável                        | Necessário para                                            |
| ------------------------------- | ---------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Frontend (RPC `verificar_elegibilidade`)                   |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Frontend autenticar chamadas                               |
| `SUPABASE_SERVICE_ROLE_KEY`     | API Routes (`/api/analytics`, `/api/dashboard`) bypass RLS |
| `HISTORY_RETENTION_DAYS`        | Limpeza de histórico                                       |
| `CRON_SECRET`                   | Endpoints de manutenção                                    |
| `ANALYTICS_ADMIN_TOKEN`         | Dashboard admin                                            |

### ❌ NÃO configurar na Vercel

- `KEEPALIVE_TOKEN` — receptor está no Supabase
- `KEEPALIVE_PROJECT_SLUG`
- `KEEPALIVE_ENVIRONMENT`

---

### 4. `.env.local` (Desenvolvimento)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://btdbfspuazgerdbmurza.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Keepalive (opcional para dev)
KEEPALIVE_TOKEN=...
KEEPALIVE_PROJECT_SLUG=inelegis
KEEPALIVE_ENVIRONMENT=dev
KEEPALIVE_EVENTS_ENABLED=true

# Sistema
HISTORY_RETENTION_DAYS=90
CRON_SECRET=...
ANALYTICS_ADMIN_TOKEN=...
```

---

## ✅ Validação

1. **Ping manual:** `curl -X POST https://btdbfspuazgerdbmurza.supabase.co/functions/v1/keepalive -H "Authorization: Bearer [TOKEN]"`
2. **Logs:** Verifique a Edge Function no Supabase para confirmar pings do Cloudflare.
3. **Dashboard:** `/admin/sistema.html` — status de Uptime em tempo real.

---

## 🚨 Troubleshooting

| Problema                           | Solução                                                                        |
| ---------------------------------- | ------------------------------------------------------------------------------ |
| **Keepalive 401**                  | Tokens diferentes. Cloudflare e Supabase devem ter `KEEPALIVE_TOKEN` idêntico. |
| **Build: ANON_KEY não encontrada** | Adicione `NEXT_PUBLIC_SUPABASE_ANON_KEY` na Vercel e redeploy.                 |
| **API Routes 500**                 | Verifique `SUPABASE_SERVICE_ROLE_KEY` na Vercel.                               |
| **Frontend não carrega**           | Adicione ambas as variáveis `NEXT_PUBLIC_*` na Vercel.                         |

Ver também: [troubleshooting-vercel-deploy.md](troubleshooting-vercel-deploy.md)

---

## 🔗 Links

- [Vercel Dashboard](https://vercel.com/rkvasne/inelegis-app/settings/environment-variables)
- [Supabase Dashboard](https://supabase.com/dashboard/project/btdbfspuazgerdbmurza)
- [variaveis-ambiente.md](variaveis-ambiente.md)
- [auditoria-e-monitoramento.md](../operations/auditoria-e-monitoramento.md)

---

_Última atualização: 21/02/2026 • v0.3.27 (Hub v0.6.1)_
_Editado via: Cursor | Modelo: claude-4.6-opus | OS: Windows 11_
