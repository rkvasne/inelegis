# 🔌 API Endpoints

Serverless Functions do Inelegis (Vercel)

---

## 📡 Endpoints

### POST /api/analytics

Recebe eventos de analytics.

```bash
curl -X POST https://inelegis.vercel.app/api/analytics \
  -H "Content-Type: application/json" \
  -d '{"events":[{"type":"search","userId":"test","timestamp":"2025-12-02T10:00:00Z","data":{"lei":"CP","artigo":"155","resultado":"inelegivel"}}]}'
```

### GET /api/dashboard

Retorna estatísticas (requer token).

```bash
curl -H "Authorization: Bearer TOKEN" \
  https://inelegis.vercel.app/api/dashboard?type=all
```

**Parâmetros:**
- `type`: `general`, `top-searches`, `distribution`, `errors`, `timeline`, `all`
- `days`: Número de dias para timeline (padrão: 7)

### POST /api/search-history

Salva busca no histórico do usuário.

```bash
curl -X POST https://inelegis.vercel.app/api/search-history \
  -H "Content-Type: application/json" \
  -d '{"userId":"user_123","search":{"lei":"CP","artigo":"155","resultado":"inelegivel"}}'
```

### GET /api/search-history

Obtém histórico do usuário.

```bash
# Histórico
curl "https://inelegis.vercel.app/api/search-history?userId=user_123&limit=50"

# Estatísticas
curl "https://inelegis.vercel.app/api/search-history?userId=user_123&stats=true"
```

---

## 🔒 Segurança

### CORS
Origens permitidas:
- `https://inelegis.vercel.app`
- `http://localhost:3000`
- `http://localhost:8080`

### Autenticação
- Analytics e Search History: Público
- Dashboard: Token obrigatório

---

## 🗄️ Banco de Dados

Redis via `ioredis`.

**Keys principais:**
```
analytics:total
analytics:count:search
analytics:top:leis
analytics:top:artigos
analytics:timeline
history:{userId}
```

---

## 🧪 Testes Locais

```bash
# Instalar Vercel CLI
npm i -g vercel

# Configurar .env.local
cp .env.example .env.local

# Executar
vercel dev
```

---

## 📚 Documentação

- [ANALYTICS.md](../docs/ANALYTICS.md)
- [SETUP-REDIS.md](../docs/SETUP-REDIS.md)
- [VARIAVEIS-AMBIENTE.md](../docs/VARIAVEIS-AMBIENTE.md)
