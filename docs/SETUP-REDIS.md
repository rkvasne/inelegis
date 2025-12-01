# 🚀 Setup do Redis (Vercel KV)

---

**Versão:** 0.0.6  
**Data:** 01 de dezembro de 2025

---

## 📋 Pré-requisitos

- Conta no Vercel
- Projeto Inelegis deployado no Vercel
- Acesso ao dashboard do Vercel

---

## 🔧 Passo a Passo

### 1. Criar Vercel KV Store

1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto **inelegis-app**
3. Vá em **Storage** → **Create Database**
4. Escolha **KV (Redis)**
5. Dê um nome: `inelegis-analytics`
6. Selecione a região: **Washington, D.C., USA (iad1)** (mais próxima)
7. Clique em **Create**

### 2. Conectar ao Projeto

1. Na página do KV criado, clique em **Connect Project**
2. Selecione o projeto **inelegis-app**
3. Clique em **Connect**
4. As variáveis de ambiente serão adicionadas automaticamente:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - `KV_REST_API_READ_ONLY_TOKEN`

### 3. Adicionar Token do Dashboard

1. No dashboard do Vercel, vá em **Settings** → **Environment Variables**
2. Adicione uma nova variável:
   - **Name:** `ANALYTICS_ADMIN_TOKEN`
   - **Value:** Gere um token seguro (ex: `inelegis_admin_2025_abc123xyz`)
   - **Environment:** Production, Preview, Development
3. Clique em **Save**

### 4. Instalar Dependência

```bash
npm install @vercel/kv
```

### 5. Deploy

```bash
git add .
git commit -m "feat: integra Vercel KV (Redis) para analytics"
git push origin main
```

O Vercel fará deploy automático!

---

## 🧪 Testar Localmente

### 1. Criar .env.local

```bash
cp .env.example .env.local
```

### 2. Copiar Variáveis do Vercel

1. No dashboard do Vercel, vá em **Storage** → **inelegis-analytics**
2. Clique em **.env.local** tab
3. Copie todas as variáveis
4. Cole no seu arquivo `.env.local`

### 3. Executar Localmente

```bash
npm run dev
```

### 4. Testar Analytics

1. Abra: http://localhost:3000/consulta.html
2. Faça uma busca
3. Verifique no console: `✅ Analytics: X eventos enviados`

---

## 📊 Verificar Dados no Redis

### Opção 1: Vercel Dashboard

1. Vá em **Storage** → **inelegis-analytics**
2. Clique em **Data Browser**
3. Veja as keys criadas:
   - `analytics:total` - Total de eventos
   - `analytics:count:search` - Total de buscas
   - `analytics:top:leis` - Leis mais consultadas
   - `analytics:top:artigos` - Artigos mais consultados

### Opção 2: Redis CLI

```bash
# Instalar redis-cli
brew install redis  # macOS
apt-get install redis-tools  # Linux

# Conectar
redis-cli -u $KV_REST_API_URL --pass $KV_REST_API_TOKEN

# Comandos úteis
> GET analytics:total
> ZRANGE analytics:top:leis 0 -1 WITHSCORES
> LRANGE analytics:list:search 0 9
> HGETALL analytics:timeline
```

---

## 🔍 Acessar Dashboard

### 1. Obter Token

O token está em: **Vercel** → **Settings** → **Environment Variables** → `ANALYTICS_ADMIN_TOKEN`

### 2. Fazer Request

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://inelegis.vercel.app/api/dashboard?type=all
```

### 3. Resposta

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
    "distribution": {...},
    "errors": [...],
    "timeline": [...]
  }
}
```

---

## 📈 Estrutura de Dados no Redis

### Keys Principais

```
analytics:total                    # Counter: Total de eventos
analytics:count:search             # Counter: Total de buscas
analytics:count:error              # Counter: Total de erros
analytics:count:action             # Counter: Total de ações

analytics:resultado:inelegivel     # Counter: Buscas inelegíveis
analytics:resultado:elegivel       # Counter: Buscas elegíveis

analytics:top:leis                 # Sorted Set: Leis mais consultadas
analytics:top:artigos              # Sorted Set: Artigos mais consultados

analytics:timeline                 # Hash: Buscas por dia

analytics:list:search              # List: Últimas 10000 buscas
analytics:list:error               # List: Últimos 10000 erros
analytics:list:action              # List: Últimas 10000 ações

analytics:search:TIMESTAMP:ID      # Hash: Evento individual
```

### Exemplo de Evento

```json
{
  "type": "search",
  "userId": "user_1733097600000_abc123",
  "timestamp": "2025-12-01T19:00:00Z",
  "lei": "CP",
  "artigo": "155, §1º, I",
  "resultado": "inelegivel",
  "temExcecao": false,
  "browser": "Mozilla/5.0...",
  "version": "0.0.6"
}
```

---

## 🔒 Segurança

### Tokens

- ✅ `KV_REST_API_TOKEN` - Leitura e escrita (apenas backend)
- ✅ `KV_REST_API_READ_ONLY_TOKEN` - Apenas leitura
- ✅ `ANALYTICS_ADMIN_TOKEN` - Acesso ao dashboard

### Boas Práticas

1. **Nunca commitar** tokens no git
2. **Usar .env.local** para desenvolvimento
3. **Rotacionar tokens** periodicamente
4. **Limitar acesso** ao dashboard

---

## 💰 Custos

### Plano Gratuito (Hobby)

- ✅ 256 MB de armazenamento
- ✅ 100.000 comandos/dia
- ✅ Suficiente para ~50.000 buscas/mês

### Estimativa

- 1 busca = ~5 comandos Redis
- 100.000 comandos = ~20.000 buscas/dia
- Armazenamento: ~1KB por evento
- 256 MB = ~250.000 eventos

### Upgrade

Se precisar mais:
- **Pro:** $20/mês - 1GB, 1M comandos/dia
- **Enterprise:** Custom pricing

---

## 🐛 Troubleshooting

### Erro: "KV_REST_API_URL is not defined"

**Solução:** Conectar o KV ao projeto no Vercel

### Erro: "Unauthorized"

**Solução:** Verificar se o token está correto

### Erro: "Too many requests"

**Solução:** Você atingiu o limite do plano gratuito. Considere upgrade.

### Dados não aparecem

**Solução:** 
1. Verificar se analytics está habilitado
2. Verificar console do navegador
3. Verificar logs do Vercel

---

## 📚 Referências

- [Vercel KV Docs](https://vercel.com/docs/storage/vercel-kv)
- [Redis Commands](https://redis.io/commands/)
- [@vercel/kv Package](https://www.npmjs.com/package/@vercel/kv)

---

**Redis configurado e pronto para uso!** 🚀✨
