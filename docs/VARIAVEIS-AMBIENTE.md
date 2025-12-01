# 🔐 Variáveis de Ambiente

---

**Versão:** 0.0.6  
**Data:** 01 de dezembro de 2025

---

## 📋 Visão Geral

O Inelegis usa variáveis de ambiente para configuração sensível e específica de cada ambiente.

---

## 🗂️ Arquivos

### `.env.example` ✅
- **Propósito:** Template e documentação
- **Conteúdo:** Nomes de variáveis (sem valores reais)
- **Git:** ✅ Commitado
- **Uso:** Referência para desenvolvedores

### `.env.local` ⚠️
- **Propósito:** Desenvolvimento local
- **Conteúdo:** Valores reais para desenvolvimento
- **Git:** ❌ Ignorado (.gitignore)
- **Uso:** Apenas na sua máquina

### `.env` ❌
- **Status:** NÃO USAR
- **Motivo:** Pode ser commitado acidentalmente
- **Alternativa:** Use `.env.local`

---

## 🔑 Variáveis Necessárias

### 1. Vercel KV (Redis)

#### `KV_REST_API_URL`
- **Descrição:** URL do Redis
- **Exemplo:** `https://abc-123.kv.vercel-storage.com`
- **Obter:** Vercel Dashboard → Storage → KV
- **Obrigatório:** Sim (para analytics)

#### `KV_REST_API_TOKEN`
- **Descrição:** Token de leitura/escrita
- **Exemplo:** `AYAg...xyz`
- **Obter:** Vercel Dashboard → Storage → KV
- **Obrigatório:** Sim (para analytics)

#### `KV_REST_API_READ_ONLY_TOKEN`
- **Descrição:** Token apenas leitura
- **Exemplo:** `AYAg...abc`
- **Obter:** Vercel Dashboard → Storage → KV
- **Obrigatório:** Não (opcional)

### 2. Analytics Dashboard

#### `ANALYTICS_ADMIN_TOKEN`
- **Descrição:** Token para acessar dashboard
- **Exemplo:** `inelegis_admin_2025_abc123xyz`
- **Gerar:** `openssl rand -hex 32`
- **Obrigatório:** Sim (para dashboard)

### 3. Environment

#### `NODE_ENV`
- **Descrição:** Ambiente de execução
- **Valores:** `development`, `production`, `test`
- **Padrão:** `production`
- **Obrigatório:** Não

---

## 🚀 Setup

### Desenvolvimento Local

**1. Copiar template:**
```bash
cp .env.example .env.local
```

**2. Obter valores do Vercel:**
1. Acesse: https://vercel.com/dashboard
2. Selecione o projeto
3. Vá em **Storage** → **inelegis-analytics**
4. Clique na aba **.env.local**
5. Copie todas as variáveis

**3. Adicionar ao .env.local:**
```bash
KV_REST_API_URL=https://abc-123.kv.vercel-storage.com
KV_REST_API_TOKEN=AYAg...xyz
KV_REST_API_READ_ONLY_TOKEN=AYAg...abc
ANALYTICS_ADMIN_TOKEN=seu_token_aqui
NODE_ENV=development
```

**4. Testar:**
```bash
npm run dev
```

### Produção (Vercel)

**1. Acessar Dashboard:**
https://vercel.com/dashboard → Projeto → Settings → Environment Variables

**2. Adicionar variáveis:**

| Name | Value | Environment |
|------|-------|-------------|
| `KV_REST_API_URL` | (auto) | Production, Preview, Development |
| `KV_REST_API_TOKEN` | (auto) | Production, Preview, Development |
| `ANALYTICS_ADMIN_TOKEN` | (gerar) | Production, Preview, Development |

**3. Deploy:**
```bash
git push origin main
```

---

## 🔒 Segurança

### ✅ Boas Práticas

1. **Nunca commitar** `.env` ou `.env.local`
2. **Usar .env.example** apenas como template
3. **Rotacionar tokens** periodicamente
4. **Limitar acesso** ao Vercel Dashboard
5. **Usar tokens diferentes** para dev/prod

### ❌ Evitar

1. ❌ Commitar valores reais
2. ❌ Compartilhar tokens por email/chat
3. ❌ Usar mesmos tokens em múltiplos projetos
4. ❌ Deixar tokens em logs
5. ❌ Hardcoded tokens no código

### 🚨 Se Token Vazar

**1. Revogar imediatamente:**
- Vercel Dashboard → Storage → Regenerate Token

**2. Atualizar em todos os lugares:**
- Vercel Environment Variables
- `.env.local` local
- CI/CD (se houver)

**3. Investigar:**
- Verificar commits recentes
- Verificar logs de acesso
- Verificar uso anormal

---

## 🧪 Verificar Configuração

### Teste Local

```bash
# Verificar se variáveis estão carregadas
node -e "console.log(process.env.KV_REST_API_URL ? '✅ KV configurado' : '❌ KV não configurado')"
```

### Teste no Vercel

```bash
# Fazer deploy e verificar logs
vercel logs
```

---

## 🔍 Troubleshooting

### Erro: "KV_REST_API_URL is not defined"

**Causa:** Variáveis não configuradas

**Solução:**
1. Verificar `.env.local` existe
2. Verificar valores estão corretos
3. Reiniciar servidor de desenvolvimento

### Erro: "Unauthorized"

**Causa:** Token inválido ou expirado

**Solução:**
1. Regenerar token no Vercel
2. Atualizar `.env.local`
3. Atualizar Vercel Environment Variables

### Variáveis não carregam

**Causa:** Arquivo não está sendo lido

**Solução:**
1. Verificar nome do arquivo: `.env.local` (não `.env`)
2. Verificar localização: raiz do projeto
3. Reiniciar servidor

---

## 📚 Referências

- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
- [Vercel KV](https://vercel.com/docs/storage/vercel-kv)
- [dotenv](https://www.npmjs.com/package/dotenv)

---

## 📝 Checklist

### Desenvolvimento Local
- [ ] Copiei `.env.example` para `.env.local`
- [ ] Obtive tokens do Vercel Dashboard
- [ ] Adicionei todos os valores
- [ ] Testei localmente
- [ ] `.env.local` está no `.gitignore`

### Produção
- [ ] Configurei variáveis no Vercel
- [ ] Testei deploy
- [ ] Verifiquei logs
- [ ] Analytics funcionando
- [ ] Dashboard acessível

---

**Variáveis de ambiente configuradas corretamente!** 🔐✨
