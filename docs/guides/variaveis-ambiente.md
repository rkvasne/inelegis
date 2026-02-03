# 🔐 Variáveis de Ambiente

Este documento descreve as variáveis necessárias para a operação do Inelegis com o Supabase.

---

## 🗂️ Arquivos

| Arquivo        | Propósito                          | Git          |
| -------------- | ---------------------------------- | ------------ |
| `.env.example` | Template de exemplo                | ✅ Commitado |
| `.env.local`   | Variáveis locais (Desenvolvimento) | ❌ Ignorado  |

---

## 🔑 Variáveis Principais

### Supabase (Obrigatório)

Diferente do Redis, o Supabase utiliza três chaves fundamentais:

```env
# URL do Projeto (API Externa)
NEXT_PUBLIC_SUPABASE_URL="https://xxxxxxxx.supabase.co"

# Chave Pública (Usada no frontend pelo SDK)
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGci..."

# Chave Privada (APENAS para scripts de build/seed)
SUPABASE_SERVICE_ROLE_KEY="eyJhbGci..."
```

---

## 🔑 Segurança e Analytics

### ANALYTICS_ADMIN_TOKEN

Token para acessar o dashboard de estatísticas e auditoria.

```env
ANALYTICS_ADMIN_TOKEN="seo_token_gerado_via_script"
```

### CRON_SECRET

Token para proteger operações de manutenção programada (Limpeza de histórico).

```env
CRON_SECRET="token_para_jobs_de_limpeza"
```

---

## 🚀 Como Configurar

1.  Crie o arquivo `.env.local`.
2.  Preencha as variáveis do Supabase.
3.  Execute `npm run supabase:config`.
    - Este script injeta as variáveis de ambiente no arquivo `public/assets/js/supabase-config.js` para que o frontend possa ler em runtime.

---

## 🔒 Boas Práticas

- **NUNCA** commite o arquivo `.env.local`.
- **NUNCA** use a `SERVICE_ROLE_KEY` em arquivos de frontend (dentro de `src/js`).
- Utilize o Vercel Dashboard para configurar as variáveis em produção.

---

_Atualizado em: 03/02/2026_
