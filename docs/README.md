# 📚 Documentação do Inelegis

> Navegação: [README do projeto](../README.md) • [Documentação](README.md)

---

Bem-vindo à documentação oficial do projeto **Inelegis**.

---

## 🚀 Navegação Rápida

### 📖 Índice

- **[📚 README (Índice principal)](README.md)** – este documento
- **[PRD e Escopo](prd-and-scope.md)** – escopo explícito do produto (evita scope creep)
- **[Plano Inicial](PLAN-INITIAL.md)** – plano de partida (prompt 03): visão, requisitos, T-shirt sizing, riscos
- **[Referência de API](api-reference.md)** – endpoints Vercel, RPCs Supabase, Quick Start e FAQ (prompt 17)

### 🛠️ Guias

- **[Guia de Desenvolvimento](guides/development.md)** – arquitetura, módulos, testes e padrões
- **[DevOps e CI/CD](guides/devops.md)** – pipeline de automação e deploy
- **[Guia de Manutenção](guides/maintenance.md)** – atualização de dados, validação e deploy
- **[Variáveis de Ambiente](guides/variaveis-ambiente.md)** – catálogo de variáveis
- **[Setup Supabase](guides/setup-supabase.md)** – configuração do banco de dados

### ⚙️ Operações e Segurança

- **[Auditoria e Monitoramento](operations/auditoria-e-monitoramento.md)** – rastreabilidade, fundamentação e Keepalive
- **[Proteção](operations/protection.md)** – estratégias de edição segura e hardening
- **[Keepalive (Hub Keepalive Pattern)](guides/keepalive-setup.md)** – monitoramento de uptime do banco de dados
- **[Config Keepalive (Inelegis)](guides/keepalive-config-inelegis.md)** – configuração específica do projeto
- **[Troubleshooting Vercel](guides/troubleshooting-vercel-deploy.md)** – erros de deploy e variáveis
- **[Deploy manual (Docker/Vercel)](guides/devops-manual.md)** – opções de implantação sem CI
- **[Auditoria Tabela Oficial](auditoria-tabela-oficial.md)** – conformidade CRE vs migration

### 🎨 Design System

- **[Componentes](design/components.md)** – catálogo dos componentes reutilizáveis
- **[Decisões de Design](design/design-decisions.md)** – porquês de cada escolha
- **[Theme Validator](design/theme-validator.md)** – uso do validador de temas

### 🗂️ Histórico e Versões

- **[Changelog](../CHANGELOG.md)** – histórico consolidado de versões e mudanças
- **[Refatoração v0.0.6](history/refatoracao-v0.0.6.md)** – arquivo histórico (não operacional)
- **Commits e Versionamento (Hotfix crítico)**: veja o repositório `e:\Agents` – seção “Commits e Versionamento”

### 📁 Referências

- **[`references/`](references/)** – manual ASE, tabelas oficiais e anexos de domínio
- **[Documentação das APIs](../api/README.md)** – endpoints disponíveis

---

## 📂 Estrutura da Documentação

```
docs/
├── README.md                   # Índice principal
├── api-reference.md            # Referência de API (Vercel + Supabase RPC)
├── auditoria-tabela-oficial.md # Conformidade tabela CRE vs migration
├── prd-and-scope.md            # PRD e escopo do produto
├── PLAN-INITIAL.md             # Plano de partida (prompt 03)
│
├── design/                     # Sistema de design e temas
│   ├── components.md
│   ├── design-decisions.md
│   └── theme-validator.md
│
├── guides/                     # Guias de desenvolvimento e manutenção
│   ├── development.md
│   ├── devops.md               # CI/CD (GitHub Actions)
│   ├── devops-manual.md        # Deploy manual (Docker, Vercel)
│   ├── keepalive-setup.md
│   ├── keepalive-config-inelegis.md
│   ├── maintenance.md
│   ├── setup-supabase.md
│   ├── troubleshooting-vercel-deploy.md
│   └── variaveis-ambiente.md
│
├── operations/                 # Operações, segurança e monitoramento
│   ├── auditoria-e-monitoramento.md
│   └── protection.md
│
├── history/                    # Releases e marcos do projeto
│   └── refatoracao-v0.0.6.md
│
├── references/                 # Materiais oficiais e anexos
│   └── manual-ase.md
│
└── archive/                    # Documentos arquivados
    ├── CHANGELOG_V0.md
    └── 2026-02-08-audit-relatorio-deep-dive.md
```

## 📐 Padrão de Formato

Para manter consistência entre todos os documentos, siga o padrão centralizado no repositório `e:\Agents` (seções “Documentação” e “Commits e Versionamento”).

## 🔗 Links Úteis

- [Repositório GitHub](https://github.com/rkvasne/inelegis)
- [Changelog](../CHANGELOG.md)
- [Voltar para a Raiz](../README.md)
- [Contribuição](../CONTRIBUTING.md)
- [Política de Privacidade](../PRIVACY.md)
- [Política de Segurança](../SECURITY.md) • [Relatório de Auditoria de Segurança](../SECURITY-AUDIT.md)
- [Código de Conduta](../CODE_OF_CONDUCT.md)
- [Licença](../LICENSE.md)
- [🤖 Instruções para Copilotos](../.github/copilot-instructions.md)
- Regras para Agentes: repositório `e:\Agents`

---

_Última atualização: 16/02/2026 • v0.3.18 (Hub v0.5.8)_
_Editado via: Cursor | Modelo: claude-4.6-opus | OS: Windows 11_
