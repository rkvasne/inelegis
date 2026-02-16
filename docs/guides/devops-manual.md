# 🐳 Manual de DevOps & Deploy - Inelegis

Este guia detalha como operar, implantar e manter a aplicação Inelegis em qualquer ambiente compatível com containers.

---

## 🏗️ Arquitetura de Deploy

A aplicação foi containerizada para garantir consistência entre desenvolvimento e produção.

- **Frontend/Backend:** Servido via Node.js (`serve.js` customizado) para suportar Live Reload (Dev) e APIs de Integração.
- **Persistência:** Supabase (Cloud) é utilizado para toda a persistência de dados (histórico, base jurídica, analytics).

### Requisitos de Ambiente

Crie um arquivo `.env.local` (baseado em `.env.example`):

```env
# Copie de .env.example e preencha os valores
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NODE_ENV=production
```

---

## 🚀 Como fazer Deploy

### Opção A: Docker Compose (Recomendado para VPS/On-Premise)

1. Clone o repositório.
2. Na raiz, execute:
   ```bash
   docker-compose up -d --build
   ```
3. A aplicação estará disponível em `http://localhost:3000`.

### Opção B: Vercel (Recomendado para Produção)

O projeto já possui `vercel.json` e estrutura para Vercel.

1. Conecte o repositório GitHub.
2. Configure as variáveis de ambiente (`NEXT_PUBLIC_SUPABASE_URL`, etc) no painel da Vercel.
3. O deploy é automático em cada push para a `main`.

---

## 🛡️ Pipeline CI/CD (GitHub Actions)

Toda vez que você envia código para a `main`, o workflow `.github/workflows/ci-cd.yml` é acionado:

1. **Quality Gate:** Roda Lints (JS/CSS/HTML), Testes Unitários e Auditoria de Segurança (`npm audit`).
2. **Build Verification:** Verifica se o projeto compila (`npm run build`).
3. **Docker Check:** Tenta construir a imagem Docker para garantir que o Dockerfile não está quebrado.

---

## 🩺 Monitoramento & Manutenção

### Logs

Para ver logs em tempo real:

```bash
docker-compose logs -f app
```

### Manutenção de Dados

A limpeza de dados é feita via endpoint `/api/maintenance` (Serverless Function), geralmente acionado por um Cron Job externo.

---

_Última atualização: 15/02/2026 • v0.3.20 (Hub v0.5.8)_
_Editado via: Antigravity | Modelo: claude-3.5-sonnet | OS: Windows 11_
