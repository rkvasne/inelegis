---
docStatus: reference
docScope: operations
lastReviewed: 02/02/2026
---

# 📊 Sistema de Analytics

---

**Versão:** 0.3.7 (Migrado para Supabase)  
**Data:** 02/02/2026

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
Frontend (`public/assets/js/services/analytics.js`)
    ↓
Coleta eventos em batch
    ↓
POST /api/analytics
    ↓
Backend salva no Supabase (PostgreSQL)
    ↓
Dashboard consulta via RPC/Views
```

---

## 📡 APIs

### POST /api/analytics

Recebe eventos do frontend e os persiste na tabela `analytics_events`.

```json
{
  "events": [
    {
      "type": "search",
      "userId": "user_123",
      "timestamp": "2025-12-02T10:00:00Z",
      "data": {
        "lei": "CP",
        "artigo": "155",
        "resultado": "inelegivel"
      }
    }
  ]
}
```

### GET /api/dashboard

Retorna estatísticas (requer token `ANALYTICS_ADMIN_TOKEN`).

```bash
curl -H "Authorization: Bearer TOKEN" \
  https://inelegis.vercel.app/api/dashboard?type=all
```

**Tipos:** `general`, `top-searches`, `distribution`, `errors`, `timeline`, `all`

### POST /api/search-history

Salva histórico de busca do usuário na tabela `historico_consultas` (protegida por RLS).

---

## 💻 Frontend

### Métodos Disponíveis (`services/analytics.js`)

```javascript
// Inicializar
Analytics.init();

// Rastrear busca
Analytics.trackSearch({
  lei: "CP",
  artigo: "155",
  resultado: "inelegivel",
});

// Rastrear erro
Analytics.trackError({ message: "Erro", stack: "..." });
```

### Histórico de Buscas (`services/search-history.js`)

```javascript
// Adicionar (Sincroniza com Supabase via RPC add_to_history)
SearchHistory.add({ lei: "CP", artigo: "155", resultado: "inelegivel" });

// Obter (Cache Local + Sync Supabase)
SearchHistory.getAll();
SearchHistory.getAllAsync(); // Busca remota
```

---

## 💾 Banco de Dados (Supabase)

### Tabelas Principais

1. **`analytics_events`**: Armazena eventos brutos.
2. **`historico_consultas`**: Armazena histórico do usuário com RLS (cada usuário vê apenas o seu).

### SQL Functions (RPC)

- `get_analytics_summary()`: Retorna totais agregados.
- `get_top_searches()`: Lista leis mais buscadas.
- `get_daily_activity()`: Timeline de uso.

**Configuração:** Ver [setup-supabase.md](../guides/setup-supabase.md)

---

## 🔐 Segurança

- **RLS (Row Level Security):** Ativado em todas as tabelas. Scripts server-side usam `SERVICE_ROLE_KEY` apenas quando necessário bypass (analytics agg).
- **CORS:** Restrito a origens permitidas.
- **Dashboard:** Protegido por token Bearer.
- **Dados Anônimos:** Validação de payload rigorosa antes da inserção.

---

## 📚 Referências

- [setup-supabase.md](../guides/setup-supabase.md) - Configuração do Supabase
- [variaveis-ambiente.md](../guides/variaveis-ambiente.md) - Variáveis necessárias
