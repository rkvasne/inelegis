---
docStatus: reference
docScope: api
lastReviewed: 15/02/2026
---

# 🔌 API Endpoints

Serverless Functions do Inelegis (Vercel) para operações de retaguarda, manutenção e integração.

> **Referência completa:** [docs/api-reference.md](../docs/api-reference.md) — payloads, respostas, RPCs Supabase e Quick Start.

---

## 📡 Endpoints

### POST /api/analytics (Legacy/Bridge)

Recebe eventos de telemetria básica. Atualmente em fase de transição para o sistema de Auditoria e Keepalive nativo do Supabase.

```bash
curl -X POST https://inelegis.vercel.app/api/analytics \
  -H "Content-Type: application/json" \
  -d '{"events":[{"type":"search","userId":"test","timestamp":"2026-02-12T10:00:00Z","data":{"lei":"CP","artigo":"155","resultado":"inelegivel"}}]}'
```

### GET /api/dashboard

Retorna estatísticas consolidadas para uso administrativo (requer token).

```bash
curl -H "Authorization: Bearer TOKEN" \
  https://inelegis.vercel.app/api/dashboard?type=all
```

**Parâmetros:**

- `type`: `general`, `top-searches`, `distribution`, `errors`, `timeline`, `all`
- `days`: Número de dias para timeline (padrão: 7)

### GET /api/search-history

Obtém histórico do usuário sincronizado.

```bash
# Lista de consultas
curl "https://inelegis.vercel.app/api/search-history?userId=user_123&limit=50"

# Estatísticas do usuário
curl "https://inelegis.vercel.app/api/search-history?userId=user_123&stats=true"
```

### POST /api/maintenance

Endpoint de zeladoria (protegido por `CRON_SECRET`). Realiza a limpeza de registros antigos com base na política de retenção.

```bash
curl -X POST https://inelegis.vercel.app/api/maintenance \
  -H "Authorization: Bearer seu_cron_secret"
```

---

## 🔒 Segurança

### CORS

Origens permitidas para consumo via SPA:

- `https://inelegis.vercel.app`
- `http://localhost:3000` (Dev)
- `http://localhost:8080` (Dev)

### Autenticação

- **Endpoints Públicos**: `/api/search-history` (via userId).
- **Endpoints Protegidos**: `/api/dashboard`, `/api/maintenance` (via Bearer Token).

---

## 🗄️ Banco de Dados

O backend consome diretamente o **Supabase (PostgreSQL)**.

**Tabelas operacionais:**

- `crimes_inelegibilidade`: SSoT — base jurídica (LC 64/90). Consulta via RPC `verificar_elegibilidade`.
- `historico_consultas`: Registro de consultas por usuário com fundamentação (12 campos via RPC `add_to_history`).
- `keepalive_events`: Logs de monitoramento de uptime.

---

## 🧪 Desenvolvimento Local

Para rodar as funções localmente via Vercel CLI:

```bash
# Instalar CLI
npm i -g vercel

# Executar ambiente de funções
vercel dev
```

---

## 📚 Documentação Relacionada

- [auditoria-e-monitoramento.md](../docs/operations/auditoria-e-monitoramento.md)
- [setup-supabase.md](../docs/guides/setup-supabase.md)
- [variaveis-ambiente.md](../docs/guides/variaveis-ambiente.md)

---

_Última atualização: 15/02/2026 • v0.3.25_
_Editado via: Cursor | Modelo: claude-4.6-opus | OS: Windows 11_
