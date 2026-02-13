# 📚 Documentação do Inelegis

> Navegação: [README do projeto](../README.md) • [Documentação](README.md)

---

Bem-vindo à documentação oficial do projeto **Inelegis**.

---

## 🚀 Navegação Rápida

### 📖 Índice

- **[📚 README (Índice principal)](README.md)** – este documento

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
│   ├── setup-supabase.md
│   └── variaveis-ambiente.md
│
├── operations/              # Operações, segurança e monitoramento
│   ├── auditoria-e-monitoramento.md
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
- [Contribuição](../CONTRIBUTING.md)
- [Política de Privacidade](../PRIVACY.md)
- [Política de Segurança](../SECURITY.md)
- [Código de Conduta](../CODE_OF_CONDUCT.md)
- [Licença](../LICENSE.md)
- [🤖 Instruções para Copilotos](../.github/copilot-instructions.md)
- Regras para Agentes: repositório `e:\Agents`

---

_Última atualização: 12/02/2026 • v0.3.11 (Hub v0.5.5)_
_Editado via: Antigravity | Modelo: claude-3.5-sonnet | OS: Windows 11_
