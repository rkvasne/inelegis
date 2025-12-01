# 🔌 API Endpoints

Serverless Functions do Inelegis (Vercel)

---

## 📡 Endpoints Disponíveis

### 1. POST /api/analytics

**Descrição:** Recebe eventos de analytics do frontend

**Autenticação:** Nenhuma (público)

**Request:**
```json
{
  "events": [
    {
      "type": "search",
      "userId": "user_123_abc",
      "timestamp": "2025-12-01T19:00:00Z",
      "data": {
        "lei": "CP",
        "artigo": "155",
        "resultado": "inelegivel"
      }
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "received": 10,
  "processed": 10,
  "saved": 10
}
```

**Banco de Dados:** Vercel KV (Redis)

---

### 2. GET /api/dashboard

**Descrição:** Retorna estatísticas de uso

**Autenticação:** Bearer Token (obrigatório)

**Headers:**
```
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**Query Parameters:**
- `type` - Tipo de dados (required)
  - `general` - Estatísticas gerais
  - `top-searches` - Buscas mais frequentes
  - `distribution` - Distribuição de resultados
  - `errors` - Erros recentes
  - `timeline` - Timeline de buscas
  - `all` - Todos os dados
- `days` - Número de dias (opcional, padrão: 7)

**Exemplos:**

```bash
# Estatísticas gerais
curl -H "Authorization: Bearer TOKEN" \
  https://inelegis.vercel.app/api/dashboard?type=general

# Top buscas
curl -H "Authorization: Bearer TOKEN" \
  https://inelegis.vercel.app/api/dashboard?type=top-searches

# Todos os dados
curl -H "Authorization: Bearer TOKEN" \
  https://inelegis.vercel.app/api/dashboard?type=all
```

**Response:**
```json
{
  "success": true,
  "data": {
    "general": {
      "totalSearches": 150,
      "totalUsers": 25,
      "totalErrors": 2
    },
    "topSearches": [...],
    "distribution": {...}
  }
}
```

---

## 🔒 Segurança

### CORS
Apenas origens permitidas:
- `https://inelegis.vercel.app`
- `http://localhost:3000`
- `http://localhost:8080`

### Rate Limiting
- Analytics: Sem limite (público)
- Dashboard: 100 requests/minuto

### Autenticação
- Analytics: Público (dados anônimos)
- Dashboard: Token obrigatório

---

## 🗄️ Banco de Dados

### Vercel KV (Redis)

**Keys:**
```
analytics:total                    # Total de eventos
analytics:count:search             # Total de buscas
analytics:top:leis                 # Sorted Set: Top leis
analytics:top:artigos              # Sorted Set: Top artigos
analytics:timeline                 # Hash: Buscas por dia
analytics:list:search              # List: Últimas buscas
```

**Configuração:** Ver [../docs/SETUP-REDIS.md](../docs/SETUP-REDIS.md)

---

## 🚀 Deploy

### Automático (Vercel)
```bash
git push origin main
```

### Manual
```bash
vercel --prod
```

---

## 🧪 Testes Locais

### 1. Instalar Vercel CLI
```bash
npm i -g vercel
```

### 2. Configurar .env.local
```bash
cp .env.example .env.local
# Adicionar tokens do Vercel
```

### 3. Executar Localmente
```bash
vercel dev
```

### 4. Testar Endpoints
```bash
# Analytics
curl -X POST http://localhost:3000/api/analytics \
  -H "Content-Type: application/json" \
  -d '{"events":[{"type":"search","userId":"test","timestamp":"2025-12-01T19:00:00Z","data":{"lei":"CP","artigo":"155","resultado":"inelegivel"}}]}'

# Dashboard
curl http://localhost:3000/api/dashboard?type=general \
  -H "Authorization: Bearer dev_token_change_me"
```

---

## 📊 Monitoramento

### Vercel Dashboard
- Logs: https://vercel.com/dashboard/logs
- Analytics: https://vercel.com/dashboard/analytics
- Storage: https://vercel.com/dashboard/stores

### Métricas
- Invocações por função
- Tempo de execução
- Taxa de erro
- Uso de banda

---

## 🐛 Troubleshooting

### Erro 500: Internal Server Error
- Verificar logs no Vercel
- Verificar variáveis de ambiente
- Verificar conexão com Redis

### Erro 401: Unauthorized
- Verificar token do dashboard
- Verificar header Authorization

### Erro 429: Too Many Requests
- Aguardar 1 minuto
- Considerar upgrade do plano

---

## 📚 Documentação

- [Analytics](../docs/ANALYTICS.md)
- [Setup Redis](../docs/SETUP-REDIS.md)
- [Vercel Functions](https://vercel.com/docs/functions)

---

**APIs prontas para uso!** 🚀
