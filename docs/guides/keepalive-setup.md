# 🛠️ Guia de Configuração: Keepalive (Hub Keepalive Pattern)

Este guia detalha como configurar o sistema de monitoramento externo (Hub Keepalive Pattern) no Inelegis para **reduzir o risco** de o Supabase suspender seu banco de dados por inatividade.

> **Importante:** O Hub define o **Cloudflare Worker com Cron Trigger** como o único pinger oficial.
>
> **Limitação Crítica:** Nenhum pinger (inclusive o Cloudflare) é capaz de acordar um banco de dados que **já foi suspenso**. O objetivo deste sistema é gerar tráfego externo regular para evitar que a suspensão ocorra. Caso o projeto seja suspenso, a reativação deve ser manual via Dashboard do Supabase.

---

## 🏗️ Arquitetura no Inelegis

O Inelegis utiliza a variante **Decoupled** do padrão Hub:

1.  **Pinger**: Cloudflare Worker (Executa a cada 30min).
2.  **Receptor**: Supabase Edge Function (`keepalive`).
3.  **Persistência**: Tabelas `keepalive` e `keepalive_events` no Supabase.

> **Por que Edge Function e não API Route?** O Inelegis é um site estático (Vanilla JS/HTML) sem framework SSR. Pela Árvore de Decisão do Hub, projetos sem Next.js/SSR devem usar Supabase Edge Function — isso garante independência do hosting e resiliência mesmo se o site estiver fora do ar.
>
> **Referência Completa:** Para entender o padrão completo, consulte `.agent/hub/docs/guides/guide-keepalive-monitoring.md`.
> Para a configuração de variáveis por componente, consulte `.agent/hub/system/scaffolding/keepalive/ARCHITECTURE.md`.

---

## 1. Supabase Edge Function (O Receptor)

O receptor centraliza a lógica de "sinal de vida" e validação do token.

### Variáveis no Supabase (Secrets)

Configure estas variáveis no Dashboard do Supabase (Settings -> API -> Edge Functions) ou via CLI:

- `KEEPALIVE_TOKEN`: Segredo compartilhado (Mesmo do Cloudflare).
- `SUPABASE_URL`: URL do projeto.
- `SUPABASE_SERVICE_ROLE_KEY`: Chave de serviço.

### Localização do Código

O código da função está em `supabase/functions/keepalive/index.ts`.

---

## 2. Pinger: Cloudflare Worker

O Cloudflare Worker atua como o **despertador externo**.

### Configuração

1. Use o código em `scripts/keepalive-worker.js`.
2. Adicione um **Cron Trigger** no Cloudflare: `*/30 * * * *` (Padrão Hub).

### Variáveis no Cloudflare

- `KEEPALIVE_URL`: `https://[seu-projeto].supabase.co/functions/v1/keepalive`
- `KEEPALIVE_TOKEN`: O mesmo segredo configurado no Supabase.

---

## 3. Variáveis na Vercel (O que NÃO configurar)

**🛑 ATENÇÃO:** Devido à arquitetura adotada, **NÃO** é necessário (e nem recomendado) configurar a variável `KEEPALIVE_TOKEN` na Vercel.

A Vercel para o Inelegis deve conter apenas:

- Conexão base (`SUPABASE_URL`, `SERVICE_ROLE_KEY`)
- Senha do Painel Admin (`ANALYTICS_ADMIN_TOKEN`)
- Segredo da Faxina (`CRON_SECRET`)

---

## ✅ Checklist de Validação

1. **Ping manual**: `curl -X POST https://[projeto].supabase.co/functions/v1/keepalive -H "Authorization: Bearer [TOKEN]"`
2. **Logs**: Verifique os logs da Edge Function no Supabase para confirmar pings do Cloudflare.
3. **Dashboard**: Acesse `/admin/sistema.html` para ver o status do Uptime em tempo real.

---

_Última atualização: 20/02/2026 • v0.3.24 (Hub v0.5.8)_
_Editado via: Antigravity | Modelo: claude-3.5-sonnet | OS: Windows 11_
