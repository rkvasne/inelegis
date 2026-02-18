# 🔐 Variáveis de Ambiente

Este documento descreve as variáveis necessárias para a operação do Inelegis, organizadas por camadas de responsabilidade técnica (Vercel, Supabase, Cloudflare e Local).

---

## 🏗️ 1. Hosting e Backend (Vercel)

Estas variáveis alimentam as **APIs do Painel Administrativo** e tarefas de **Zeladoria**. Elas devem ser configuradas no Dashboard da Vercel (_Settings -> Environment Variables_).

| Variável                        | Descrição                                                                       | Importância     |
| :------------------------------ | :------------------------------------------------------------------------------ | :-------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | URL da API REST do seu projeto Supabase.                                        | **Crítica**     |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave pública "anon". Usada durante o build para gerar o config do frontend.    | **Obrigatória** |
| `SUPABASE_SERVICE_ROLE_KEY`     | Chave secreta administrativa. Permite que as APIs leiam/escrevam ignorando RLS. | **Crítica**     |
| `CRON_SECRET`                   | Token de segurança que valida se o disparo da "faxina" é legítimo.              | **Zeladoria**   |
| `HISTORY_RETENTION_DAYS`        | Define quantos dias os logs de consulta serão mantidos (Padrão: 90).            | **Zeladoria**   |
| `ANALYTICS_ADMIN_TOKEN`         | Senha (Bearer Token) que autoriza o acesso aos dados sensíveis no `/admin`.     | **Segurança**   |

---

## 💓 2. Banco e Receptor (Supabase)

Estas variáveis alimentam as **Edge Functions** (Monitoramento). Configure no Dashboard do Supabase (_Settings -> Edge Functions_).

| Variável                    | Descrição                                                             | Função no Círculo |
| :-------------------------- | :-------------------------------------------------------------------- | :---------------- |
| `KEEPALIVE_TOKEN`           | Segredo para validar se o ping recebido veio de um pinger autorizado. | Validação         |
| `SUPABASE_URL`              | Referência da URL do projeto para chamadas internas.                  | Conectividade     |
| `SUPABASE_SERVICE_ROLE_KEY` | Permite que a função atualize a tabela `keepalive` sem restrições.    | Persistência      |

---

## ⏰ 3. Despertador Externo (Cloudflare)

Configurações para o **Worker** que atua como disparador do sinal de vida.

| Variável          | Valor/Formato                                     | Observação               |
| :---------------- | :------------------------------------------------ | :----------------------- |
| `KEEPALIVE_URL`   | `https://[id].supabase.co/functions/v1/keepalive` | Ponto final do receptor. |
| `KEEPALIVE_TOKEN` | O mesmo hash configurado nos Secrets do Supabase. | Sincronia obrigatória.   |

---

## �️ 4. Governança e Hub (Desenvolvimento)

Necessário para que a IA e os scripts de validação consigam acessar o conhecimento centralizado.

| Variável           | Descrição                                                                                                                                      | Onde configurar                             |
| :----------------- | :--------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------ |
| `HUB_ACCESS_TOKEN` | Personal Access Token (PAT) do GitHub com acesso ao repositório `Agents`. Necessário como **Secret** no GitHub Actions para o CI clonar o Hub. | `.env.local` (dev); **GitHub Secrets** (CI) |

---

## 💻 5. Configuração Local (`.env.local`)

Crie o arquivo na raiz do projeto. Ele é ignorado pelo Git por segurança.

```env
# Supabase Core
NEXT_PUBLIC_SUPABASE_URL="https://xxxxxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGci..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGci..."

# Admin & Analytics
ANALYTICS_ADMIN_TOKEN="sua_senha_secreta"

# Zeladoria (Manutenção)
CRON_SECRET="token_da_faxina_vercel"
HISTORY_RETENTION_DAYS=90

# Monitoramento (Reference)
KEEPALIVE_TOKEN="mesmo_do_cloudflare"

# Governança
HUB_ACCESS_TOKEN="ghp_seu_token_github"
```

---

## 🚀 Como Aplicar as Chaves ao Frontend

Após configurar o `.env.local`, você deve injetar as chaves públicas na aplicação:

```bash
# Gera o arquivo public/assets/js/supabase-config.js
npm run supabase:config
```

---

## 🔒 Regras de Ouro

1.  **Vercel ≠ Keepalive**: Devido à arquitetura desacoplada do Inelegis, o `KEEPALIVE_TOKEN` **não** é necessário na Vercel (menos vetores de ataque).
2.  **Segurança de Chaves**: Nunca exponha a `SERVICE_ROLE_KEY` ou o `HUB_ACCESS_TOKEN` em arquivos públicos.
3.  **Ambientes**: Identifique sempre a variável `KEEPALIVE_ENVIRONMENT` (ex: `prod`, `local`) para não poluir os gráficos de produção durante testes.

**Ver também:** [Hub Access Token e CI/CD](hub-access-token-ci.md) — como configurar `HUB_ACCESS_TOKEN` no GitHub e em outros satélites.

---

_Última atualização: 15/02/2026 • v0.3.20 (Hub v0.5.8)_
_Editado via: Antigravity | Modelo: claude-3.5-sonnet | OS: Windows 11_
