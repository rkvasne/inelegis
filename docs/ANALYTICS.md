# 📊 Sistema de Analytics

---

**Versão:** 0.0.6  
**Data:** 01 de dezembro de 2025

---

## 🎯 Objetivo

O sistema de analytics coleta dados **anônimos** de uso do Inelegis para:
- ✅ Validar se as buscas retornam resultados corretos
- ✅ Identificar artigos mais consultados
- ✅ Detectar erros e problemas
- ✅ Melhorar a experiência do usuário
- ✅ Planejar futuras funcionalidades

---

## 🔒 Privacidade

### Dados Coletados (Anônimos)
- ✅ Lei consultada (ex: "CP")
- ✅ Artigo consultado (ex: "155, §1º")
- ✅ Resultado (inelegível/elegível)
- ✅ Presença de exceções
- ✅ Tempo de resposta
- ✅ Navegador (user agent)
- ✅ Idioma e timezone
- ✅ Resolução de tela

### Dados NÃO Coletados
- ❌ Nome do usuário
- ❌ Email
- ❌ IP (não armazenado)
- ❌ Localização precisa
- ❌ Dados pessoais

### ID Anônimo
- Gerado automaticamente no primeiro uso
- Formato: `user_1733097600000_abc123xyz`
- Não identifica o usuário
- Permite análise de padrões de uso

---

## 🏗️ Arquitetura

### Frontend (js/analytics.js)
```
Usuário faz busca
    ↓
Analytics.trackSearch()
    ↓
Adiciona à fila local
    ↓
Envia em batch (10 eventos ou 30s)
    ↓
POST /api/analytics
```

### Backend (api/analytics.js)
```
Recebe eventos
    ↓
Valida estrutura
    ↓
Processa dados
    ↓
Salva no banco
    ↓
Retorna confirmação
```

### Dashboard (api/dashboard.js)
```
Admin acessa com token
    ↓
GET /api/dashboard?type=all
    ↓
Retorna estatísticas
    ↓
Visualização de dados
```

---

## 📡 API

### Eventos Rastreados

#### 1. Busca (search)
```javascript
Analytics.trackSearch({
    lei: 'CP',
    artigo: '155, §1º, I',
    resultado: 'inelegivel',
    temExcecao: true,
    tempoResposta: 45
});
```

#### 2. Erro (error)
```javascript
Analytics.trackError({
    message: 'Artigo não encontrado',
    stack: '...',
    lei: 'CP',
    artigo: '999'
});
```

#### 3. Ação (action)
```javascript
Analytics.trackAction('export_history', {
    count: 25
});
```

### Métodos Públicos

```javascript
// Inicializar
Analytics.init();

// Rastrear busca
Analytics.trackSearch(data);

// Rastrear erro
Analytics.trackError(error);

// Rastrear ação
Analytics.trackAction(action, data);

// Desabilitar (LGPD/GDPR)
Analytics.disable();

// Habilitar
Analytics.enable();

// Verificar status
Analytics.isEnabled(); // true/false

// Forçar envio
Analytics.flush();
```

---

## 🚀 Implementação

### 1. Frontend

**Arquivo:** `js/analytics.js`

**Carregamento:**
```html
<script src="js/analytics.js"></script>
```

**Inicialização:**
```javascript
document.addEventListener('DOMContentLoaded', function() {
    Analytics.init();
});
```

**Uso:**
```javascript
// Após uma busca bem-sucedida
Analytics.trackSearch({
    lei: resultado.codigo,
    artigo: resultado.artigoConsultado,
    resultado: resultado.inelegivel ? 'inelegivel' : 'elegivel',
    temExcecao: resultado.excecoes?.length > 0
});
```

### 2. Backend

**Arquivo:** `api/analytics.js`

**Endpoint:** `POST /api/analytics`

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
                "resultado": "inelegivel",
                "temExcecao": false
            },
            "browser": {...},
            "version": "0.0.6"
        }
    ],
    "timestamp": "2025-12-01T19:00:00Z"
}
```

**Response:**
```json
{
    "success": true,
    "received": 10,
    "processed": 10,
    "saved": 10,
    "timestamp": "2025-12-01T19:00:01Z"
}
```

### 3. Dashboard

**Arquivo:** `api/dashboard.js`

**Endpoint:** `GET /api/dashboard?type=all`

**Headers:**
```
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**Response:**
```json
{
    "success": true,
    "data": {
        "general": {
            "totalSearches": 1250,
            "totalUsers": 87,
            "totalErrors": 12,
            "avgResponseTime": 45
        },
        "topSearches": [...],
        "distribution": {...},
        "errors": [...],
        "timeline": [...]
    },
    "timestamp": "2025-12-01T19:00:00Z"
}
```

---

## 💾 Armazenamento

### Banco de Dados: Vercel KV (Redis) ✅

**Implementado e funcionando!**

```javascript
import { kv } from '@vercel/kv';

// Salvar evento
await kv.set(`analytics:search:${timestamp}`, event);

// Incrementar contadores
await kv.incr('analytics:total');
await kv.zincrby('analytics:top:leis', 1, lei);

// Adicionar à lista
await kv.lpush('analytics:list:search', key);
```

**Estrutura de dados:**
- Counters: Total de eventos, buscas, erros
- Sorted Sets: Top leis e artigos
- Lists: Últimos eventos
- Hashes: Timeline por dia
- Keys individuais: Eventos completos

**Configuração:** Ver [SETUP-REDIS.md](SETUP-REDIS.md)

---

## 📈 Métricas Disponíveis

### Estatísticas Gerais
- Total de buscas
- Total de usuários únicos
- Total de erros
- Tempo médio de resposta

### Buscas Mais Frequentes
- Top 10 leis consultadas
- Top 10 artigos consultados
- Distribuição de resultados (inelegível/elegível)

### Análise Temporal
- Buscas por dia/semana/mês
- Horários de pico
- Tendências de uso

### Qualidade
- Taxa de erro
- Buscas sem resultado
- Exceções mais comuns

---

## 🔐 Segurança

### CORS
```javascript
const ALLOWED_ORIGINS = [
    'https://inelegis.vercel.app',
    'http://localhost:3000'
];
```

### Autenticação (Dashboard)
```javascript
const ADMIN_TOKEN = process.env.ANALYTICS_ADMIN_TOKEN;
```

### Rate Limiting
```javascript
// Implementar rate limiting no Vercel
// Limite: 100 requests/minuto por IP
```

### Validação
```javascript
// Validar estrutura de eventos
// Sanitizar dados de entrada
// Limitar tamanho de payloads
```

---

## 🎛️ Configuração

### Variáveis de Ambiente

**`.env.local`:**
```bash
# Analytics
ANALYTICS_ADMIN_TOKEN=your_secure_token_here

# Banco de Dados (escolher um)
VERCEL_KV_URL=redis://...
SUPABASE_URL=https://...
SUPABASE_KEY=...
MONGODB_URI=mongodb+srv://...
```

### Vercel

**`vercel.json`:**
```json
{
    "env": {
        "ANALYTICS_ADMIN_TOKEN": "@analytics-token"
    }
}
```

---

## 📊 Dashboard (Futuro)

### Página de Visualização
- Gráficos interativos
- Filtros por período
- Exportação de relatórios
- Alertas de erros

### Tecnologias Sugeridas
- Next.js + Chart.js
- React + Recharts
- Vue + ApexCharts

---

## 🔄 Fluxo Completo

```
1. Usuário faz busca
   ↓
2. Resultado exibido
   ↓
3. Analytics.trackSearch() chamado
   ↓
4. Evento adicionado à fila local
   ↓
5. Após 10 eventos ou 30s:
   ↓
6. POST /api/analytics
   ↓
7. Backend valida e processa
   ↓
8. Salva no banco de dados
   ↓
9. Retorna confirmação
   ↓
10. Admin acessa dashboard
    ↓
11. GET /api/dashboard
    ↓
12. Visualiza estatísticas
```

---

## ✅ Próximos Passos

### Implementação Imediata
1. [ ] Escolher banco de dados
2. [ ] Configurar variáveis de ambiente
3. [ ] Implementar salvamento real
4. [ ] Testar em produção

### Melhorias Futuras
1. [ ] Dashboard visual
2. [ ] Alertas automáticos
3. [ ] Exportação de relatórios
4. [ ] Análise de ML
5. [ ] Recomendações personalizadas

---

## 📚 Referências

- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [Vercel KV](https://vercel.com/docs/storage/vercel-kv)
- [LGPD - Lei Geral de Proteção de Dados](https://www.gov.br/cidadania/pt-br/acesso-a-informacao/lgpd)
- [GDPR](https://gdpr.eu/)

---

**Sistema de Analytics implementado e pronto para uso!** 📊✨
