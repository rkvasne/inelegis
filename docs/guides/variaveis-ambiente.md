# 🔐 Variáveis de Ambiente

Este documento descreve as variáveis necessárias para a operação do Inelegis com o Supabase, organizadas por camadas de responsabilidade técnica.

---

## 🗂️ Arquivos

| Arquivo        | Propósito                          | Git          |
| -------------- | ---------------------------------- | ------------ |
| `.env.example` | Template de exemplo                | ✅ Commitado |
| `.env.local`   | Variáveis locais (Desenvolvimento) | ❌ Ignorado  |

---

## 🏗️ Camadas de Configuração

### 1. 🗄️ Supabase Core (Obrigatório)

Variáveis fundamentais para a conexão do frontend e backend com o banco de dados.

```env
# URL do Projeto (API Externa)
NEXT_PUBLIC_SUPABASE_URL="https://xxxxxxxx.supabase.co"

# Chave Pública (Usada no frontend pelo SDK)
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGci..."

# Chave Privada (APENAS para scripts de build/seed e rotas de servidor)
# NUNCA exponha esta chave no frontend
SUPABASE_SERVICE_ROLE_KEY="eyJhbGci..."
```

---

### 2. 🛰️ Monitoramento (Hub Keepalive Pattern)

Configurações para o sistema de "sinais de vida" que reduzem o risco de suspensão do projeto por inatividade.

```env
# Token de autenticação entre Pinger (Cloudflare) e Receptor (Supabase)
KEEPALIVE_TOKEN="seu_token_de_heartbeat"

# Identificação do projeto para telemetria
KEEPALIVE_PROJECT_SLUG="inelegis"
KEEPALIVE_ENVIRONMENT="prod"
```

---

### 3. 🧹 Zeladoria (Manutenção e Limpeza)

Variáveis que controlam as tarefas de "faxina" automática e retenção de dados históricos.

#### `CRON_SECRET`

Este é o "token da faxina". Ele protege o endpoint de manutenção (`/api/maintenance`) contra chamadas não autorizadas. Quando configurado um agendamento automático (Vercel Cron ou externo), este token deve ser enviado no cabeçalho de autorização.

#### `HISTORY_RETENTION_DAYS`

Define o limite de idade dos registros de histórico de consulta antes de serem deletados pelo script de manutenção (Padrão: 90 dias).

```env
CRON_SECRET="token_para_vincular_o_disparo_automatico"
HISTORY_RETENTION_DAYS=90
```

---

### 4. 🔐 Governança e Hub (Scripts)

#### `HUB_ACCESS_TOKEN`

O "crachá de acesso" ao Hub. Como o repositório **Solo Dev Hub Central** é privado, este token (GitHub GHP) garante que o Inelegis consiga ler scripts de validação, regras de agentes e geradores centralizados durante o desenvolvimento ou auditoria.

```env
HUB_ACCESS_TOKEN="ghp_xxx"
```

---

## 🚀 Como Configurar

1.  Crie o arquivo `.env.local` na raiz.
2.  Preencha as variáveis conforme sua infraestrutura.
3.  Execute `npm run supabase:config` para injetar as chaves necessárias no frontend.

---

## 🔒 Boas Práticas

- **NUNCA** commite o arquivo `.env.local`.
- **NUNCA** use a `SERVICE_ROLE_KEY` em arquivos dentro da pasta `public/`.
- Utilize o Dashboard do seu provedor de Hosting (ex: Vercel) para configurar as variáveis em produção.

---

_Última atualização: 12/02/2026 • v0.3.11 (Hub v0.5.5)_
_Editado via: Antigravity | Modelo: claude-3.5-sonnet | OS: Windows 11_
