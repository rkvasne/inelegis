# 🐳 Manual de DevOps & Deploy - Inelegis

> **Status:** Otimizado (v0.2.1)
> **Stack:** Node.js 22, Redis, Docker

Este guia detalha como operar, implantar e manter a aplicação Inelegis em qualquer ambiente compatível com containers.

---

## 🏗️ Arquitetura de Deploy

A aplicação foi containerizada para garantir consistência entre desenvolvimento e produção.

- **Frontend/Backend:** Servido via Node.js (`serve.js` customizado) para suportar Live Reload (Dev) e API de Histórico (Prod).
- **Persistência:** Redis é utilizado para armazenar o histórico de buscas anonimizado.

### Requisitos de Ambiente

Crie um arquivo `.env` (baseado em `.env.example`):

```env
PORT=3000
REDIS_URL=redis://localhost:6379  # Obrigatório para histórico
NODE_ENV=production               # Otimiza performance
```

---

## 🚀 Como fazer Deploy

### Opção A: Docker Compose (Recomendado para VPS/On-Premise)

Ideal para servidores Linux simples (DigitalOcean, AWS EC2, HomeLab).

1. Clone o repositório.
2. Na raiz, execute:
   ```bash
   docker-compose up -d --build
   ```
3. A aplicação estará disponível em `http://localhost:3000`.

**Por que é seguro?**
- O `Dockerfile` usa **Multi-stage build**, garantindo que apenas dependências de produção (`npm ci --only=production`) e arquivos necessários cheguem na imagem final.
- O contêiner roda como usuário não-root (`USER node`), mitigando riscos de escalada de privilégios.
- Inclui **Healthcheck** nativo para reiniciar automaticamente se travar.

### Opção B: Plataformas PaaS (Railway, Render, Fly.io)

A maioria detectará o `Dockerfile` automaticamente.

1. Conecte o repositório GitHub.
2. Adicione o serviço Redis (add-on).
3. Defina a variávei de ambiente `REDIS_URL` com a string de conexão interna.
4. Deploy!

### Opção C: Vercel (Static + Serverless)

O projeto já possui `vercel.json` e estrutura para Vercel.

- Os scripts `scripts/api/` podem precisar de adaptação para Vercel Functions se a lógica do `serve.js` (Redis) for migrada para Serverless Functions.
- *Nota:* O deploy atual via Vercel pode não persistir histórico se não houver um Redis externo conectado.

---

## 🛡️ Pipeline CI/CD (GitHub Actions)

Toda vez que você envia código para a `main`, o workflow `.github/workflows/ci-cd.yml` é acionado:

1. **Quality Gate:** Roda Lints (JS/CSS/HTML), Testes Unitários e Auditoria de Segurança (`npm audit`).
2. **Build Verification:** Verifica se o projeto compila (`npm run build`).
3. **Docker Check:** Tenta construir a imagem Docker para garantir que o Dockerfile não está quebrado.

Se qualquer passo falhar, o GitHub bloqueará o merge (se configurado como branch protegida).

---

## 🩺 Monitoramento & Manutenção

### Healthcheck
O endpoint `/` responde com 200 OK se o servidor estiver de pé.
O Docker faz verificações a cada 30s.

### Logs
Para ver logs em tempo real:
```bash
docker-compose logs -f app
```
O formato de logs é padronizado com emojis para facilitar leitura visual (✅ Sucesso, ❌ Erro, ⚠️ Aviso).

### Backup (Redis)
O volume `redis_data` persiste os dados. Para backup, copie o conteúdo de `/var/lib/docker/volumes/...` ou use dumps do Redis (`BGSAVE`).
