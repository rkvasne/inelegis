# 🔐 Variáveis de Ambiente

Este documento descreve as variáveis necessárias para a operação do Inelegis, organizadas por onde devem ser configuradas (Vercel, Supabase ou Cloudflare).

---

## 🏗️ 1. Hosting (Vercel)

Estas variáveis alimentam as **APIs do Painel Admin** e tarefas de **Zeladoria**. Configure no Dashboard da Vercel em *Settings -> Environment Variables*.

| Variável | Descrição | Importância |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL do seu projeto Supabase. | **Crítica** |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave secreta de serviço (Bypass RLS). | **Crítica** |
| `CRON_SECRET` | Token que protege a faxina automática (`/api/maintenance`). | **Zeladoria** |
| `HISTORY_RETENTION_DAYS` | Dias de retenção de logs (Ex: 90). | **Zeladoria** |
| `ANALYTICS_ADMIN_TOKEN` | Senha de acesso aos dados do Dashboard Admin. | **Segurança** |

---

## 💓 2. Banco e Receptor (Supabase)

Estas variáveis alimentam as **Edge Functions** (Keepalive). Configure no Dashboard do Supabase em *Settings -> API -> Edge Functions*.

| Variável | Descrição | Onde usar |
| :--- | :--- | :--- |
| `KEEPALIVE_TOKEN` | Segredo para validar o batimento cardíaco. | Edge Function |
| `SUPABASE_URL` | URL interna/externa do projeto. | Edge Function |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave de serviço para gravar o status. | Edge Function |

---

## ⏰ 3. Despertador (Cloudflare)

Configurações para o **Worker** que dispara o sinal de vida.

| Variável | Valor Recomendado | Observação |
| :--- | :--- | :--- |
| `KEEPALIVE_URL` | `https://[projeto].supabase.co/functions/v1/keepalive` | URL da Edge Function. |
| `KEEPALIVE_TOKEN` | O mesmo hash configurado no Supabase. | Deve ser idêntico. |

---

## 💻 4. Desenvolvimento Local (`.env.local`)

Para rodar o projeto localmente, você deve ter um espelho dessas variáveis no arquivo `.env.local`. 

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://xxxxxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGci..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGci..."

# Zeladoria
CRON_SECRET="token-de-limpeza"
HISTORY_RETENTION_DAYS=90

# Monitoramento (Local reference)
KEEPALIVE_TOKEN="mesmo-do-supabase"
KEEPALIVE_PROJECT_SLUG="inelegis"
KEEPALIVE_ENVIRONMENT="local"

# Admin Dashboard
ANALYTICS_ADMIN_TOKEN="sua-senha-do-admin"
```

---

## 🔒 Regras de Ouro

1.  **Vercel ≠ Keepalive**: No Inelegis, a Vercel **não** precisa de `KEEPALIVE_TOKEN`.
2.  **Segurança**: Nunca coloque `SERVICE_ROLE_KEY` em arquivos `.js` dentro da pasta `public/`.
3.  **Sincronia**: Se mudar o `KEEPALIVE_TOKEN`, deve atualizar no Cloudflare e no Supabase simultaneamente.

---

_Última atualização: 14/02/2026 • v0.3.13 (Hub v0.5.6)_
_Editado via: Antigravity | Modelo: claude-3.5-sonnet | OS: Windows 11_
