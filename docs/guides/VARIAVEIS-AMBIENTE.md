# 🔐 Variáveis de Ambiente

---

**Versão:** 0.1.0  
**Data:** 02 de dezembro de 2025

---

## 🗂️ Arquivos

| Arquivo | Propósito | Git |
|---------|-----------|-----|
| `.env.example` | Template | ✅ Commitado |
| `.env.local` | Desenvolvimento | ❌ Ignorado |

---

## 🔑 Variáveis

### REDIS_URL (obrigatório)

URL de conexão com o Redis.

```bash
REDIS_URL="redis://default:senha@host:porta"
```

**Obter:** Vercel Dashboard → Storage → seu database → Show secret

### ANALYTICS_ADMIN_TOKEN (obrigatório)

Token para acessar a API de dashboard.

```bash
ANALYTICS_ADMIN_TOKEN="seu_token_aqui"
```

**Gerar:** `openssl rand -hex 32`

### NODE_ENV (opcional)

Ambiente de execução.

```bash
NODE_ENV=development  # ou production
```

### CRON_SECRET (recomendado em produção)

Protege o endpoint `/api/redis-maintenance`. Obrigatório se a rotina for exposta publicamente.

```bash
CRON_SECRET="token_super_secreto"
```

### REDIS_RETENTION_DAYS (opcional)

Número de dias mantidos em cada lista `history:*`. Usado pela rotina automática (`scripts/redis-maintenance.js`).

```bash
REDIS_RETENTION_DAYS=30
```

### REDIS_MAX_HISTORY (opcional)

Limite de entradas por usuário tanto na API quanto no job de limpeza.

```bash
REDIS_MAX_HISTORY=100
```

### REDIS_HISTORY_TTL (opcional)

TTL aplicado às listas (segundos). Padrão: 31.536.000s (~365 dias).

```bash
REDIS_HISTORY_TTL=31536000
```

### REDIS_METRICS_TTL_DAYS (opcional)

Tempo (em dias) que o hash `history:metrics:weekly` permanece no Redis.

```bash
REDIS_METRICS_TTL_DAYS=120
```

### REDIS_WEEKLY_METRICS_KEY (opcional)

Nome do hash onde os snapshots semanais são registrados.

```bash
REDIS_WEEKLY_METRICS_KEY="history:metrics:weekly"
```

---

## 🚀 Setup

### Desenvolvimento Local

```bash
# 1. Copiar template
cp .env.example .env.local

# 2. Editar com seus valores
# REDIS_URL=...
# ANALYTICS_ADMIN_TOKEN=...

# 3. Executar
npm run dev
```

### Produção (Vercel)

1. Vercel Dashboard → Settings → Environment Variables
2. Adicionar `REDIS_URL` (do Storage)
3. Adicionar `ANALYTICS_ADMIN_TOKEN`

---

## 🔒 Segurança

### ✅ Fazer

- Usar `.env.local` para desenvolvimento
- Rotacionar tokens periodicamente
- Manter `.env.local` no `.gitignore`

### ❌ Evitar

- Commitar valores reais
- Compartilhar tokens
- Hardcoded tokens no código

---

## 🐛 Troubleshooting

| Erro | Solução |
|------|---------|
| `REDIS_URL is not defined` | Verificar `.env.local` existe |
| `Unauthorized` | Verificar token está correto |
| Variáveis não carregam | Reiniciar servidor |
