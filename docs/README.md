---
docStatus: active
docScope: docs-index
lastReviewed: 2026-01-11
---
# 📚 Documentação do Inelegis

Bem-vindo à documentação oficial do projeto **Inelegis**.

## 🚀 Navegação Rápida

### 📖 Índice e Histórico
- **[📚 README (Índice principal)](README.md)** – este documento

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

### 🗂️ Histórico e Release Notes (ordem decrescente)
- **[Release Notes v0.2.0](history/RELEASE-NOTES-v0.2.0.md)** – padronização visual completa, heroes unificados, breadcrumbs
- **[Release Notes v0.1.9](history/RELEASE-NOTES-v0.1.9.md)** – histórico reformulado, FAQ corrigida e melhorias de acesso
- **[Release Notes v0.1.8](history/RELEASE-NOTES-v0.1.8.md)** – página Histórico, módulos utilitários e Dev Server
- **[Release Notes v0.1.7](history/RELEASE-NOTES-v0.1.7.md)** – melhorias de FAQ, acessibilidade e atalhos
- **[Release Notes v0.1.6](history/RELEASE-NOTES-v0.1.6.md)** – confiabilidade do consentimento e ajustes de UI
- **[Release Notes v0.1.5](history/RELEASE-NOTES-v0.1.5.md)** – padronização de modal e refinamentos de tema
- **[Release Notes v0.1.4](history/RELEASE-NOTES-v0.1.4.md)** – otimizações do modal e correções visuais
- **[Release Notes v0.1.3](history/RELEASE-NOTES-v0.1.3.md)** – ajustes menores de UI/UX
- **[Release Notes v0.1.0](history/RELEASE-NOTES-v0.1.0.md)** – consolidação de documentação e padronização
- **[Release Notes v0.0.9](history/RELEASE-NOTES-v0.0.9.md)** – avanços no fluxo de sessão e UX
- **[Release Notes v0.0.8](history/RELEASE-NOTES-v0.0.8.md)** – padronização completa de design
- **[Refatoração v0.0.6](history/refatoracao-v0.0.6.md)** – contexto, plano e implementação
- **[Resumo da sessão 02/12/2025](history/SESSION-SUMMARY-2025-12-02.md)** – métricas da virada para 0.0.9
- **[Template de Hotfix Crítico](history/templates/critical-hotfix-template.md)** – mensagem de commit para correções urgentes

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
│   ├── RELEASE-NOTES-v0.2.0.md
│   ├── RELEASE-NOTES-v0.1.9.md
│   ├── ...
│   └── RELEASE-NOTES-v0.0.8.md
│
└── references/              # Materiais oficiais e anexos
    ├── manual-ase.md
    └── tabela-oficial.xml
```

## 📐 Padrão de Formato

Para manter consistência entre todos os documentos:

1. Inicie cada arquivo com um título (`# Nome do Documento`).
2. Inclua o frontmatter YAML com `docStatus`, `docScope` e `lastReviewed`.
3. Utilize subtítulos (`## Seção`) e listas curtas e escaneáveis.
4. Quando referenciar outro arquivo, prefira caminhos relativos (ex.: `../CHANGELOG.md`).
5. Atualize `lastReviewed` sempre que revisar ou alterar conteúdo substancial.

## 🔗 Links Úteis

- [Repositório GitHub](https://github.com/rkvasne/inelegis)
- [Changelog](../CHANGELOG.md)
- [Voltar para a Raiz](../README.md)
- [🤖 Instruções para Copilotos](../.github/copilot-instructions.md)

## ✏️ Fluxo de Dados e Edição

O runtime usa exclusivamente dados previamente normalizados e API de consulta:
- Gere `public/assets/js/data-normalizado.js` a partir do XML oficial (`docs/references/tabela-oficial.xml`) usando `scripts/extrair_normalizado_xml.js`.
- Carregue `data-normalizado.js` (dados) antes de `consulta-normalizado.js` (API) nas páginas que realizam consulta.
- Use `public/assets/js/consulta-normalizado.js` como API única de consultas (`DataNormalizer.query`, índices por lei, sugestões por lei).
- A pasta `src/js/` é espelho histórico; o runtime atual usa `public/assets/js`.

## 🆕 Novidades v0.2.0

Veja [Release Notes v0.2.0](history/RELEASE-NOTES-v0.2.0.md) para o resumo completo desta versão.

---

**Última atualização:** 11 de janeiro de 2026  
**Versão:** 0.2.0
