---
docStatus: active
docScope: docs-index
lastReviewed: 14/01/2026
---
# 📚 Documentação do Inelegis

Bem-vindo à documentação oficial do projeto **Inelegis**.

## 🚀 Navegação Rápida

### 📖 Índice e Histórico
- **[📚 README (Índice principal)](README.md)** – este documento

### 🛠️ Guias
- **[Guia de Desenvolvimento](guides/development.md)** – arquitetura, módulos, testes e padrões
- **[Guia de Manutenção](guides/maintenance.md)** – atualização de dados, validação e deploy
- **[Variáveis de Ambiente](guides/variaveis-ambiente.md)** – configuração completa
- **[Setup Redis](guides/setup-redis.md)** – configuração consolidada do Redis

### ⚙️ Operações e Segurança
- **[Analytics](operations/analytics.md)** – coleta, estrutura e monitoramento
- **[Proteção](operations/protection.md)** – estratégias de edição segura e hardening

### 🎨 Design System
- **[Componentes](design/components.md)** – catálogo dos componentes reutilizáveis
- **[Landing Page](design/landing-page.md)** – guia de design e template da landing page
- **[Landing Template](design/landing-template.md)** – modelo base para páginas de marketing
- **[Decisões de Design](design/design-decisions.md)** – porquês de cada escolha
- **[Theme Validator](design/theme-validator.md)** – uso do validador de temas

### 🗂️ Histórico e Versões
- **[Changelog](../CHANGELOG.md)** – histórico consolidado de versões e mudanças
- **[Refatoração v0.0.6](history/refatoracao-v0.0.6.md)** – contexto, plano e implementação
- **Commits e Versionamento (Hotfix crítico)**: veja [AGENTS.md](../AGENTS.md) – seção “Commits e Versionamento”

### 📁 Referências
- **[`references/`](references/)** – manual ASE, tabelas oficiais e anexos de domínio
- **[Documentação das APIs](../api/README.md)** – endpoints disponíveis

---

## 📂 Estrutura da Documentação

```
docs/
├── README.md                # Índice principal
│
├── design/                  # Sistema de design e temas
│   ├── components.md
│   ├── design-decisions.md
│   ├── landing-page.md
│   ├── landing-template.md
│   └── theme-validator.md
│
├── guides/                  # Guias de desenvolvimento e manutenção
│   ├── development.md
│   ├── maintenance.md
│   ├── setup-redis.md
│   └── variaveis-ambiente.md
│
├── operations/              # Operações, segurança e analytics
│   ├── analytics.md
│   └── protection.md
│
├── history/                 # Releases e marcos do projeto
│   ├── refatoracao-v0.0.6.md
│
└── references/              # Materiais oficiais e anexos
    ├── manual-ase.md
    └── tabela-oficial.xml
```

## 📐 Padrão de Formato

Para manter consistência entre todos os documentos, siga o padrão centralizado em [AGENTS.md](../AGENTS.md) (seções “Documentação” e “Commits e Versionamento”).

## 🔗 Links Úteis

- [Repositório GitHub](https://github.com/rkvasne/inelegis)
- [Changelog](../CHANGELOG.md)
- [Voltar para a Raiz](../README.md)
- [🤖 Instruções para Copilotos](../.github/copilot-instructions.md)
- [Regras para Agentes (AGENTS.md)](../AGENTS.md)
