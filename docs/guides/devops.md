# 🚀 DevOps e Deploy — Inelegis

Guia unificado de CI/CD, deploy e manutenção do Inelegis.

---

## 🏗️ Arquitetura

- **Produção (Vercel):** HTML/JS/CSS estático + APIs serverless em `/api`. Deploy automático a cada push na `main`.
- **Desenvolvimento:** Node.js (`serve.js`) para Live Reload e proxy das APIs.
- **Persistência:** Supabase para histórico de consultas, base jurídica (`crimes_inelegibilidade`) e analytics.

---

## 🔄 CI/CD (GitHub Actions)

O workflow está definido em `.github/workflows/ci-cd.yml`, acionado em **push** ou **PR** para `main`.

### Estrutura do Pipeline

#### 1. 🛡️ Quality Gate (Validação)

| Etapa                | Comando                        | Descrição                                                                                                                   |
| -------------------- | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| **Security Audit**   | `npm audit --audit-level=high` | Verifica vulnerabilidades. Falha só para high/critical; moderate são aceitas. Ver nota sobre `overrides` no `package.json`. |
| **Linting**          | `npm run lint`                 | Valida estilo (JS, CSS, HTML).                                                                                              |
| **Theme Validation** | `npm run validate:theme`       | Garante integridade das variáveis de tema.                                                                                  |
| **Tests**            | `npm run test:all`             | Testes unitários e de componentes.                                                                                          |
| **Docs Check**       | `npm run doc:check`            | Verifica integridade da documentação.                                                                                       |

#### 2. 🏗️ Build Verification

| Etapa      | Comando         | Descrição                                   |
| ---------- | --------------- | ------------------------------------------- |
| **Build**  | `npm run build` | Compila para produção (diretório `dist/`).  |
| **Docker** | (implícito)     | Garante que o Dockerfile não está quebrado. |

---

## 🚀 Deploy Manual

> **Preferência:** Deploy via CI/CD (push na `main`). Deploy manual apenas para cenários específicos.

### Opção A: Vercel (Recomendado para Produção)

1. Conecte o repositório GitHub ao projeto Vercel.
2. Configure as variáveis em _Settings → Environment Variables_: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` e demais conforme [variaveis-ambiente.md](variaveis-ambiente.md).
3. O deploy é automático a cada push na `main`.

### Opção B: Docker Compose (VPS/On-Premise)

1. Clone o repositório.
2. Na raiz: `docker-compose up -d --build`
3. Aplicação em `http://localhost:3000`.

### Requisitos de Ambiente

Crie `.env.local` baseado em `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NODE_ENV=production
```

### Scripts Legado

`scripts/deploy-server.sh` — deploy em Apache/Nginx (Linux): backup, cópia de arquivos e permissões.

---

## 🩺 Monitoramento e Manutenção

### Logs (Docker)

```bash
docker-compose logs -f app
```

### Manutenção de Dados

A limpeza do histórico é feita via `POST /api/maintenance` (Serverless Function), geralmente acionada por Cron Job externo. Ver [auditoria-e-monitoramento.md](../operations/auditoria-e-monitoramento.md).

---

## 🔐 Variáveis do CI (GitHub Secrets)

O pipeline usa secrets em **Settings > Secrets and variables > Actions**:

→ **[Variáveis do GitHub Actions](ci-variaveis-github.md)** — referência detalhada.

Para configurar o token do Hub em novos satélites: [hub-access-token-ci.md](hub-access-token-ci.md).

---

## 📦 Versionamento

O projeto segue [Semantic Versioning](https://semver.org/). Histórico em [CHANGELOG.md](../../CHANGELOG.md).

---

_Última atualização: 21/02/2026 • v0.3.26 (Hub v0.6.1)_
_Editado via: Cursor | Modelo: claude-4.6-opus | OS: Windows 11_
