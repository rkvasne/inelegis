# 🛠️ Guia de Configuração: Keepalive (Hub Keepalive Pattern)

Este guia detalha como configurar o sistema de monitoramento externo (Hub Keepalive Pattern) para **reduzir o risco** de o Supabase suspender seu banco de dados por inatividade.

> **Importante:** O Hub define o **Cloudflare Worker com Cron Trigger** como o único pinger oficial. 
> 
> **Limitação Crítica:** Nenhum pinger (inclusive o Cloudflare) é capaz de acordar um banco de dados que **já foi suspenso**. O objetivo deste sistema é gerar tráfego externo regular para evitar que a suspensão ocorra. Caso o projeto seja suspenso, a reativação deve ser manual via Dashboard do Supabase.

---

## 1. Supabase Edge Function (O Receptor)

O receptor centraliza a lógica de "sinal de vida" e autenticação.

### Variáveis no Supabase

Configure estas variáveis via CLI (`supabase secrets set`) ou no Dashboard do Supabase (Settings -> Edge Functions):

- `KEEPALIVE_TOKEN`: Um hash seguro gerado por você.
- `SUPABASE_URL`: URL do seu projeto.
- `SUPABASE_SERVICE_ROLE_KEY`: Chave de serviço (para bypass de RLS).

### Deploy

```bash
supabase functions deploy keepalive
```

---

## 2. Despertador: Cloudflare Worker (Padrão Obrigatório)

O Cloudflare Worker atua como o **pinger externo**. Ele é o único método aprovado pelo Hub para manter a uniformidade entre os projetos satélites.

**Por que somente Cloudflare?**
- **Supabase pg_cron:** É executado internamente; o Supabase não o considera "tráfego externo", portanto não evita a suspensão por inatividade.
- **Vercel Cron / GitHub Actions:** São descontinuados do padrão para garantir que todos os satélites usem a mesma infraestrutura atômica e independente (Cloudflare), facilitando a manutenção global do ecossistema.

### Configuração

1. Crie um novo **Worker** no Cloudflare.
2. Use o código em `scripts/keepalive-worker.js`.
3. Em **Triggers**, adicione um **Cron Trigger** (recomendado: `*/10 * * * *` - a cada 10 minutos).

### Variáveis no Cloudflare (Variables & Secrets)

- `KEEPALIVE_URL`: `https://[seu-projeto].supabase.co/functions/v1/keepalive`
- `KEEPALIVE_TOKEN`: O mesmo hash configurado no Supabase.

---

## 3. Heartbeat do Cliente (Nativo)

A aplicação já possui um serviço em `public/assets/js/services/keepalive-service.js` que dispara sinais enquanto o site está aberto. Este serviço usa a chave `anon` e RLS (conforme configurado na migration `004`).

---

## 4. Variáveis no Hosting (Vercel / Produção)

Para que o heartbeat do cliente (executado no navegador) funcione em produção, você deve configurar as seguintes variáveis no painel da **Vercel** (ou seu provedor de hosting):

| Variável | Valor Recomendado |
| :--- | :--- |
| `KEEPALIVE_TOKEN` | O mesmo segredo usado no Supabase/Cloudflare. |
| `KEEPALIVE_PROJECT_SLUG` | `inelegis` |
| `KEEPALIVE_ENVIRONMENT` | `production` |

---

## ✅ Fluxo de Validação

1. Verifique se a migration `20260211164500_create_keepalive_system.sql` foi aplicada.
2. Teste o Cloudflare Worker manualmente (botão "Run" ou via URL do worker).
3. Verifique se as variáveis de ambiente foram adicionadas ao **Vercel Dashboard**.
4. Verifique a tabela `public.keepalive` no Supabase: o campo `last_ping_at` deve estar atualizado.

---

_Última atualização: 12/02/2026 • v0.3.11 (Hub v0.5.5)_
_Editado via: Antigravity | Modelo: claude-3.5-sonnet | OS: Windows 11_
