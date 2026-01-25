---
docStatus: active
docScope: docs-index
lastReviewed: 15/01/2026
---
# 📚 Documentação do Inelegis

Bem-vindo à documentação oficial do projeto **Inelegis**.

## 🚀 Navegação Rápida

### 📖 Índice e Histórico
- **[📚 README (Índice principal)](README.md)** – este documento

### 🛠️ Guias
- **[Guia de Desenvolvimento](guides/development.md)** – arquitetura, módulos, testes e padrões
- **[DevOps e CI/CD](guides/devops.md)** – pipeline de automação e deploy
- **[Guia de Manutenção](guides/maintenance.md)** – atualização de dados, validação e deploy
- **[Variáveis de Ambiente](guides/variaveis-ambiente.md)** – configuração completa
- **[Setup Redis](guides/setup-redis.md)** – configuração consolidada do Redis

### ⚙️ Operações e Segurança
- **[Analytics](operations/analytics.md)** – coleta, estrutura e monitoramento
- **[Proteção](operations/protection.md)** – estratégias de edição segura e hardening

### 🎨 Design System
- **[Componentes](design/components.md)** – catálogo dos componentes reutilizáveis
- **[Decisões de Design](design/design-decisions.md)** – porquês de cada escolha
- **[Theme Validator](design/theme-validator.md)** – uso do validador de temas

### 🗂️ Histórico e Versões
- **[Changelog](../CHANGELOG.md)** – histórico consolidado de versões e mudanças
- **[Refatoração v0.0.6](history/refatoracao-v0.0.6.md)** – contexto, plano e implementação
- **Commits e Versionamento (Hotfix crítico)**: veja o repositório `e:\Agents` – seção “Commits e Versionamento”

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

Para manter consistência entre todos os documentos, siga o padrão centralizado no repositório `e:\Agents` (seções “Documentação” e “Commits e Versionamento”).

## 🔗 Links Úteis

- [Repositório GitHub](https://github.com/rkvasne/inelegis)
- [Changelog](../CHANGELOG.md)
- [Voltar para a Raiz](../README.md)
- [Política de Privacidade](../PRIVACY.md)
- [Política de Segurança](../SECURITY.md)
- [Código de Conduta](../CODE_OF_CONDUCT.md)
- [Licença](../LICENSE.md)
- [🤖 Instruções para Copilotos](../.github/copilot-instructions.md)
- Regras para Agentes: repositório `e:\Agents`
