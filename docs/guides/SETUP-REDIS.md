# 🚀 Setup do Redis

---

**Versão:** 0.0.8  
**Data:** 02 de dezembro de 2025

---

## 🎯 Guia Rápido

### Variáveis Necessárias

| Variável | Descrição | Obrigatório |
|----------|-----------|-------------|
| `REDIS_URL` | URL de conexão Redis | Sim |
| `ANALYTICS_ADMIN_TOKEN` | Token para acessar dashboard | Sim |

### Setup em 4 Passos

1. **Criar Redis** → Vercel Dashboard → Storage → Create Database → KV
2. **Conectar ao Projeto** → Connect Project → `REDIS_URL` criada automaticamente
3. **Gerar Token** → `openssl rand -hex 32`
4. **Adicionar no Vercel** → Settings → Environment Variables → `ANALYTICS_ADMIN_TOKEN`

---

## 🔧 Passo a Passo

### 1. Criar Redis no Vercel

1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto
3. Vá em **Storage** → **Create Database** → **KV**
4. Nome: `inelegis-analytics`
5. Clique em **Create**

### 2. Conectar ao Projeto

1. Na página do KV, clique em **Connect Project**
2. Selecione o projeto
3. A variável `REDIS_URL` será criada automaticamente

### 3. Adicionar Token do Dashboard

1. Vá em **Settings** → **Environment Variables**
2. Adicione:
   - **Name:** `ANALYTICS_ADMIN_TOKEN`
   - **Value:** Token gerado com `openssl rand -hex 32`
3. Clique em **Save**

### 4. Deploy

```bash
git push origin main
```

---

## 🧪 Desenvolvimento Local

### 1. Criar .env.local

```bash
cp .env.example .env.local
```

### 2. Copiar REDIS_URL do Vercel

1. Vercel Dashboard → Storage → seu database
2. Clique em **Show secret** para ver a URL
3. Copie para `.env.local`

### 3. Executar

```bash
npm run dev
```

---

## 📊 Visualizar Dados

### Via Vercel Dashboard

1. Storage → seu database → **Open in Redis**
2. Clique em **Launch** no card "Redis Insight"

### Via Redis CLI

```bash
redis-cli -u "$REDIS_URL"

# Comandos úteis
KEYS *
GET analytics:total
ZRANGE analytics:top:leis 0 -1 WITHSCORES
LRANGE analytics:list:search 0 9
HGETALL analytics:timeline
```

---

## 📈 Estrutura de Dados

### Keys do Analytics

```
analytics:total                    # Counter: Total de eventos
analytics:count:search             # Counter: Total de buscas
analytics:count:error              # Counter: Total de erros
analytics:resultado:inelegivel     # Counter: Buscas inelegíveis
analytics:resultado:elegivel       # Counter: Buscas elegíveis
analytics:top:leis                 # Sorted Set: Leis mais consultadas
analytics:top:artigos              # Sorted Set: Artigos mais consultados
analytics:timeline                 # Hash: Buscas por dia
analytics:list:search              # List: Últimas 10000 buscas
```

### Keys do Histórico

```
history:{userId}                   # List: Histórico do usuário
history:total                      # Counter: Total de históricos
history:stats:leis                 # Hash: Contagem por lei
history:stats:resultados           # Hash: Contagem por resultado
```

---

## 🔍 Acessar Dashboard API

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://inelegis.vercel.app/api/dashboard?type=all
```

---

## 🐛 Troubleshooting

| Erro | Solução |
|------|---------|
| `REDIS_URL is not defined` | Conectar KV ao projeto no Vercel |
| `Unauthorized` | Verificar token do dashboard |
| Dados não aparecem | Verificar console do navegador por erros |

---

## 📚 Referências

- [Vercel Storage](https://vercel.com/docs/storage)
- [Redis Commands](https://redis.io/commands/)
- [ioredis](https://github.com/redis/ioredis)
