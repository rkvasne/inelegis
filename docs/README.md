# 📚 Documentação do Inelegis

Bem-vindo à documentação oficial do projeto **Inelegis**.

## 🚀 Navegação Rápida

### 📖 Índice e Histórico
- **[📚 Índice Completo](INDEX.md)** – atalho direto para este README
- **[📝 Changelog da Documentação](CHANGELOG-DOCS.md)** – histórico de edições

### 🛠️ Guias
- **[Guia de Desenvolvimento](guides/DEVELOPMENT.md)** – arquitetura, módulos, testes e padrões
- **[Guia de Manutenção](guides/MAINTENANCE.md)** – atualização de dados, validação e deploy
- **[Variáveis de Ambiente](guides/VARIAVEIS-AMBIENTE.md)** – configuração completa
- **[Setup Redis](guides/SETUP-REDIS.md)** – configuração consolidada do Redis

### ⚙️ Operações e Segurança
- **[Analytics](operations/ANALYTICS.md)** – coleta, estrutura e monitoramento
- **[Proteção](operations/PROTECTION.md)** – estratégias de edição segura e hardening

### 🎨 Design System
- **[Componentes](design/COMPONENTS.md)** – catálogo dos componentes reutilizáveis
- **[Decisões de Design](design/DESIGN-DECISIONS.md)** – porquês de cada escolha
- **[Theme Validator](design/THEME-VALIDATOR.md)** – uso do validador de temas

### 🗂️ Histórico e Release Notes
- **[Refatoração v0.0.6](history/refatoracao-v0.0.6.md)** – contexto, plano e implementação
- **[Release Notes v0.0.9](history/RELEASE-NOTES-v0.0.9.md)** – reorganização de documentação e atualização de paths
- **[Release Notes v0.0.8](history/RELEASE-NOTES-v0.0.8.md)** – padronização completa de design
- **[Template de Hotfix Crítico](history/templates/critical-hotfix-template.md)** – mensagem de commit para correções urgentes

### 📁 Referências
- **[`references/`](references/)** – manual ASE, tabelas oficiais e anexos de domínio
- **[Documentação das APIs](../api/README.md)** – endpoints disponíveis

---

## 📂 Estrutura da Documentação

```
docs/
├── README.md                # Este índice
├── INDEX.md                 # Alias apontando para o README
├── CHANGELOG-DOCS.md        # Histórico de edições
│
├── design/                  # Sistema de design e temas
│   ├── COMPONENTS.md
│   ├── DESIGN-DECISIONS.md
│   └── THEME-VALIDATOR.md
│
├── guides/                  # Guias de desenvolvimento e manutenção
│   ├── DEVELOPMENT.md
│   ├── MAINTENANCE.md
│   ├── SETUP-REDIS.md
│   └── VARIAVEIS-AMBIENTE.md
│
├── operations/              # Operações, segurança e analytics
│   ├── ANALYTICS.md
│   └── PROTECTION.md
│
├── history/                 # Releases e marcos do projeto
│   ├── refatoracao-v0.0.6.md
│   ├── RELEASE-NOTES-v0.0.9.md
│   └── RELEASE-NOTES-v0.0.8.md
│
└── references/              # Materiais oficiais e anexos
    ├── manual-ase.md
    └── tabela-oficial.xml
```

## 🔗 Links Úteis

- [Repositório GitHub](https://github.com/rkvasne/ineleg-app)
- [Changelog](../CHANGELOG.md)
- [Voltar para a Raiz](../README.md)

## ✏️ Fluxo de Edição

Sempre edite os arquivos-fonte dentro de `src/` (ex.: `src/js/modules/*`, `src/js/data.js`). Os bundles em `public/` e `assets/` são gerados automaticamente; rode `npm run sync:js` ou `npm run dev` para refletir suas mudanças antes de validar ou abrir PR.

## 🆕 Novidades v0.0.9

- ✅ Documentação reestruturada por domínio (`design/`, `guides/`, `operations/`, `history/`).
- ✅ Histórico consolidado em `history/refatoracao-v0.0.6.md` e novas release notes para 0.0.9.
- ✅ Referências internas e scripts atualizados para os novos caminhos.
- ✅ Versão do projeto elevada para 0.0.9.

---

**Última atualização:** 02 de dezembro de 2025  
**Versão:** 0.0.9
