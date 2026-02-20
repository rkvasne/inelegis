# 🚀 CI/CD e DevOps

Este documento descreve o pipeline de integração e entrega contínua (CI/CD) do Inelegis, implementado via GitHub Actions.

## 🔄 Workflow Automático

O workflow principal está definido em `.github/workflows/ci-cd.yml`. Ele é acionado automaticamente em:

- **Push** na branch `main`.
- **Pull Requests** direcionados para a branch `main`.

### Estrutura do Pipeline

O pipeline segue o princípio de **Fail Fast** e é dividido em dois jobs principais:

#### 1. 🛡️ Quality Gate (Validação)

Este estágio roda em paralelo e bloqueia o processo se qualquer verificação falhar.

| Etapa                | Comando                        | Descrição                                                                                                                        |
| -------------------- | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| **Security Audit**   | `npm audit --audit-level=high` | Verifica vulnerabilidades em dependências. Falha só para high/critical; moderate são aceitas. Ver nota abaixo sobre `overrides`. |
| **Linting**          | `npm run lint`                 | Valida estilo de código (JS, CSS, HTML).                                                                                         |
| **Theme Validation** | `npm run validate:theme`       | Garante integridade das variáveis de tema e consistência visual.                                                                 |
| **Tests**            | `npm run test:all`             | Executa testes unitários e de componentes.                                                                                       |
| **Docs Check**       | `npm run doc:check`            | Verifica integridade da documentação.                                                                                            |

> **Sobre `npm audit --audit-level=high`:** Sem o parâmetro, o comando falha para qualquer vulnerabilidade (incl. moderate/low). Com `--audit-level=high`, falha apenas para high e critical. O projeto possui 4 vulnerabilidades moderadas (ajv no ESLint) sem correção sem breaking change; o `package.json` usa `overrides` (minimatch, html-validate/ajv) para mitigar as demais.

#### 2. 🏗️ Build Verification

Executado apenas se o _Quality Gate_ for aprovado.

| Etapa     | Comando         | Descrição                                            |
| --------- | --------------- | ---------------------------------------------------- |
| **Build** | `npm run build` | Compila o projeto para produção (diretório `dist/`). |

---

## 🛠️ Scripts de Deploy Manual (Legado/Servidor)

Para ambientes que não utilizam o deploy automático do GitHub (ex: servidores Linux dedicados), scripts auxiliares estão disponíveis em `scripts/`:

- **`scripts/deploy-server.sh`**: Script Shell para deploy em servidores Apache/Nginx (Linux). Realiza backup, cópia de arquivos e configuração de permissões.

> **Nota:** O deploy preferencial é via CI/CD. Scripts manuais devem ser usados apenas em cenários específicos de infraestrutura on-premise.

---

## 🔐 Variáveis do CI (GitHub Secrets)

O pipeline usa secrets configurados em **Settings > Secrets and variables > Actions**. Para referência detalhada (por que cada variável é usada, padrão do Hub, placeholders vs credenciais reais):

→ **[Variáveis do GitHub Actions (CI)](ci-variaveis-github.md)**

Para configurar o token do Hub em novos satélites: [hub-access-token-ci.md](hub-access-token-ci.md).

---

## 📦 Versionamento e Releases

O projeto segue [Semantic Versioning](https://semver.org/).

- **Major (X.0.0)**: Breaking changes.
- **Minor (0.X.0)**: Novas features compatíveis.
- **Patch (0.0.X)**: Correções de bugs.

O histórico de versões é mantido estritamente no [CHANGELOG.md](../../CHANGELOG.md).

---

_Última atualização: 20/02/2026 • v0.3.25 (Hub v0.5.8)_
_Editado via: Cursor | Modelo: Auto | OS: Windows 11_
