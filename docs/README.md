# 📚 Documentação do Inelegis

> Navegação: [README do projeto](../README.md) • [Documentação](README.md)

---

Bem-vindo à documentação oficial do projeto **Inelegis**.

---

## 🚀 Navegação Rápida

### 📖 Índice

- **[📚 README (Índice principal)](README.md)** – este documento
- **[PRD e Escopo](prd-and-scope.md)** – escopo explícito do produto (evita scope creep)
- **[Arquitetura e ADR](architecture-and-adr.md)** – visão canônica da arquitetura e decisões técnicas consolidadas
- **[Plano Inicial](plan-initial.md)** – plano de partida (prompt 03): visão, requisitos, T-shirt sizing, riscos
- **[Referência de API](api-reference.md)** – endpoints Vercel, RPCs Supabase, Quick Start e FAQ (prompt 17)

### 🛠️ Guias

- **[Guia de Desenvolvimento](guides/development.md)** – arquitetura, módulos, testes e padrões
- **[Convenções de Documentação](guides/documentation-conventions.md)** – SSoT, nomenclatura e checklist de publicação
- **[DevOps e Deploy](guides/devops.md)** – CI/CD, deploy (Vercel, Docker) e manutenção
- **[Guia de Manutenção](guides/maintenance.md)** – atualização de dados, validação e deploy
- **[Variáveis de Ambiente](guides/variaveis-ambiente.md)** – catálogo de variáveis
- **[HUB_ACCESS_TOKEN e CI/CD](guides/hub-access-token-ci.md)** – configurar token do Hub para GitHub Actions em satélites
- **[Variáveis do GitHub Actions (CI)](guides/ci-variaveis-github.md)** – referência detalhada: HUB_ACCESS_TOKEN, Supabase, padrão Hub vs Inelegis
- **[Setup Supabase](guides/setup-supabase.md)** – configuração do banco de dados

### ⚙️ Operações e Segurança

- **[Auditoria e Monitoramento](operations/auditoria-e-monitoramento.md)** – rastreabilidade, fundamentação e Keepalive
- **[Proteção](operations/protection.md)** – estratégias de edição segura e hardening
- **[Keepalive (Inelegis)](guides/keepalive-inelegis.md)** – monitoramento de uptime do banco (Hub Keepalive Pattern)
- **[Troubleshooting Vercel](guides/troubleshooting-vercel-deploy.md)** – erros de deploy e variáveis
- **[Auditoria Tabela Oficial](auditoria-tabela-oficial.md)** – conformidade CRE vs migration
- **[Matriz RPC v2](auditoria-rpc-v2-matriz.md)** – evidência de validação manual dos cenários compostos/condicionais

### 🎨 Design System

- **[Componentes](design/components.md)** – catálogo dos componentes reutilizáveis
- **[Decisões de Design](design/design-decisions.md)** – porquês de cada escolha
- **[Theme Validator](design/theme-validator.md)** – uso do validador de temas

### 🗂️ Histórico e Versões

- **[Changelog](../CHANGELOG.md)** – histórico consolidado de versões e mudanças
- **[Refatoração v0.0.6](archive/2025-12-01-refatoracao-v0-0-6.md)** – histórico arquivado (Dez/2025)
- **Commits e Versionamento (Hotfix crítico)**: veja o [Changelog](../CHANGELOG.md) e o [Guia de Desenvolvimento](guides/development.md)

### 📁 Referências

- **[`references/`](references/)** – manual ASE, tabelas oficiais e anexos de domínio
- **[Interpretação da Tabela Oficial](references/interpretacao-tabela-oficial.md)** – regras de fallback (artigo inteiro vs dispositivos enumerados) usadas na prática pelos servidores do TRE
- **[Documentação das APIs](../api/README.md)** – endpoints disponíveis

---

## 📂 Estrutura da Documentação

```
docs/
├── README.md                   # Índice principal
├── api-reference.md            # Referência de API (Vercel + Supabase RPC)
├── architecture-and-adr.md     # Arquitetura canônica e ADRs consolidados
├── auditoria-tabela-oficial.md # Conformidade tabela CRE vs migration
├── auditoria-rpc-v2-matriz.md  # Matriz de validação da RPC v2 (c.c./condicionais)
├── prd-and-scope.md            # PRD e escopo do produto
├── plan-initial.md             # Plano de partida (prompt 03)
│
├── design/                     # Sistema de design e temas
│   ├── components.md
│   ├── design-decisions.md
│   └── theme-validator.md
│
├── guides/                     # Guias de desenvolvimento e manutenção
│   ├── development.md
│   ├── documentation-conventions.md # Convenções de documentação (SSoT + nomenclatura)
│   ├── devops.md               # CI/CD, deploy e manutenção
│   ├── hub-access-token-ci.md  # Token do Hub para CI em satélites
│   ├── ci-variaveis-github.md  # Variáveis do GitHub Actions (detalhado)
│   ├── migrations-status.md    # Status de migrations (local vs Supabase)
│   ├── keepalive-inelegis.md    # Keepalive (Hub Pattern)
│   ├── maintenance.md
│   ├── setup-supabase.md
│   ├── troubleshooting-vercel-deploy.md
│   └── variaveis-ambiente.md
│
├── operations/                 # Operações, segurança e monitoramento
│   ├── auditoria-e-monitoramento.md
│   └── protection.md
│
├── references/                 # Materiais oficiais e anexos
│   └── manual-ase.md
│
└── archive/                    # Documentos arquivados
    ├── 2026-02-23-release-history-v0.md
    ├── 2026-02-23-release-history-v0-3-early.md
    ├── 2026-02-08-audit-relatorio-deep-dive.md
    ├── 2026-02-15-revisao-tabela-crimes-inelegibilidade.md
    ├── 2025-12-01-refatoracao-v0-0-6.md
    └── 2026-02-15-conferencia-cre-banco.md
```

## 📐 Padrão de Formato

Para manter consistência entre todos os documentos, siga os padrões deste repositório em `AGENTS.md`, `CHANGELOG.md` e `docs/guides/development.md`.

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
- [Regras para Agentes](../AGENTS.md)

---

_Última atualização: 26/02/2026 • v0.3.27 (Hub v0.6.1)_
_Editado via: Codex CLI | Modelo: GPT-5 | OS: Windows 11_
