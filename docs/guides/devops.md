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

| Etapa                | Comando                  | Descrição                                                           |
| -------------------- | ------------------------ | ------------------------------------------------------------------- |
| **Security Audit**   | `npm audit`              | Verifica vulnerabilidades conhecidas em dependências (nível high+). |
| **Linting**          | `npm run lint`           | Valida estilo de código (JS, CSS, HTML).                            |
| **Theme Validation** | `npm run validate:theme` | Garante integridade das variáveis de tema e consistência visual.    |
| **Tests**            | `npm run test:all`       | Executa testes unitários e de componentes.                          |
| **Docs Check**       | `npm run doc:check`      | Verifica integridade da documentação.                               |

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

## 📦 Versionamento e Releases

O projeto segue [Semantic Versioning](https://semver.org/).

- **Major (X.0.0)**: Breaking changes.
- **Minor (0.X.0)**: Novas features compatíveis.
- **Patch (0.0.X)**: Correções de bugs.

O histórico de versões é mantido estritamente no [CHANGELOG.md](../../CHANGELOG.md).

---

_Última atualização: 15/02/2026 • v0.3.19 (Hub v0.5.8)_
_Editado via: Antigravity | Modelo: claude-3.5-sonnet | OS: Windows 11_
