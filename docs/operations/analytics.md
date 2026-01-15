---
docStatus: reference
docScope: operations
lastReviewed: 14/01/2026
---
# 📊 Sistema de Analytics

---

**Versão:** 0.2.0  
**Data:** 02/12/2025

---

## 🎯 Objetivo

Coleta dados anônimos de uso para:
- Validar resultados de buscas
- Identificar artigos mais consultados
- Detectar erros
- Melhorar a experiência

---

## 🔒 Privacidade

Para detalhes consolidados (cookies, armazenamento local, retenção e controles), veja a [Política de Privacidade](../../PRIVACY.md).

### Dados Coletados (Anônimos)
- Lei e artigo consultados
- Resultado (inelegível/elegível)
- Tempo de resposta
- Navegador e idioma

### Dados NÃO Coletados
- Nome, email, IP
- Localização precisa
- Dados pessoais
- Identificadores persistentes sensíveis. Usamos apenas o cookie anônimo `inelegis_uid` (expira em 12 meses) para correlacionar eventos/histórico sem gravar nada no `localStorage`.

---

## 🏗️ Arquitetura

```
Frontend (`public/assets/js/modules/analytics.js`)
    ↓
Coleta eventos em batch
    ↓
POST /api/analytics
    ↓
Backend salva no Redis (ioredis)
    ↓
Dashboard consulta via API
```

---

## 📡 APIs

### POST /api/analytics

Recebe eventos do frontend.

```json
{
  "events": [{
    "type": "search",
    "userId": "user_123",
    "timestamp": "2025-12-02T10:00:00Z",
    "data": {
      "lei": "CP",
      "artigo": "155",
      "resultado": "inelegivel"
    }
  }]
}
```

### GET /api/dashboard

Retorna estatísticas (requer token).

```bash
curl -H "Authorization: Bearer TOKEN" \
  https://inelegis.vercel.app/api/dashboard?type=all
```

**Tipos:** `general`, `top-searches`, `distribution`, `errors`, `timeline`, `all`

### POST /api/search-history

Salva histórico de busca do usuário.

```json
{
  "userId": "user_123",
  "search": {
    "lei": "CP",
    "artigo": "155",
    "resultado": "inelegivel"
  }
}
```

### GET /api/search-history

Obtém histórico do usuário.

```
/api/search-history?userId=user_123&limit=50
/api/search-history?userId=user_123&stats=true
```

---

## 💻 Frontend

### Métodos Disponíveis

```javascript
// Inicializar
Analytics.init();

// Rastrear busca
Analytics.trackSearch({
  lei: 'CP',
  artigo: '155',
  resultado: 'inelegivel'
});

// Rastrear erro
Analytics.trackError({ message: 'Erro', stack: '...' });

// Rastrear ação
Analytics.trackAction('export_history', { count: 25 });

// Desabilitar/Habilitar (LGPD)
Analytics.disable();
Analytics.enable();
```

### Histórico de Buscas

```javascript
// Adicionar (cache em memória + Redis)
SearchHistory.add({ lei: 'CP', artigo: '155', resultado: 'inelegivel' });

// Obter local
SearchHistory.getAll();
SearchHistory.getRecent(10);

// Obter do Redis (async)
await SearchHistory.getAllAsync();
await SearchHistory.getStatsAsync();
```

---

## 💾 Banco de Dados

### Redis (via ioredis)

```javascript
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

// Salvar evento
await redis.setex(key, TTL, JSON.stringify(event));

// Incrementar contador
await redis.incr('analytics:total');

// Top leis
await redis.zincrby('analytics:top:leis', 1, lei);
```

**Configuração:** Ver [setup-redis.md](../guides/setup-redis.md)

---

## 📈 Métricas

- Total de buscas e usuários
- Top leis e artigos consultados
- Distribuição inelegível/elegível
- Timeline por dia
- Erros recentes

---

## 🔐 Segurança

- CORS restrito a origens permitidas (analytics, dashboard, search-history)
- Dashboard protegido por token
- Dados anônimos (sem PII)
- TTL de 90 dias nos eventos
- Sugestões no frontend são sanitizadas via `Sanitizer.safeInnerHTML`

---

## 📚 Referências

- [setup-redis.md](../guides/setup-redis.md) - Configuração do Redis
- [variaveis-ambiente.md](../guides/variaveis-ambiente.md) - Variáveis necessárias
