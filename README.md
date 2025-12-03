<div align="center">

  # ⚖️ INELEGIS
  
  **Sistema de Consulta de Inelegibilidade Eleitoral**
  
  <p align="center">
    Uma ferramenta moderna, rápida e precisa para análise jurídica eleitoral.
    <br />
    <a href="https://inelegis.vercel.app"><strong>Ver Demo Online »</strong></a>
    <br />
    <br />
    <a href="docs/README.md">Documentação</a>
    ·
    <a href="https://github.com/rkvasne/inelegis-app/issues">Reportar Bug</a>
    ·
    <a href="https://github.com/rkvasne/inelegis-app/issues">Solicitar Feature</a>
  </p>

  [![Version](https://img.shields.io/badge/version-0.0.9-blue.svg?style=for-the-badge)](https://semver.org)
  [![License](https://img.shields.io/badge/license-MIT-green.svg?style=for-the-badge)](LICENSE)
  [![Tests](https://img.shields.io/badge/tests-100%25-success.svg?style=for-the-badge)](tests/)
  [![Theme](https://img.shields.io/badge/theme-validated-success.svg?style=for-the-badge)](docs/design/THEME-VALIDATOR.md)

</div>

---

## ✨ Recursos Principais

| Recurso | Descrição |
|---------|-----------|
| 🔍 **Busca Inteligente** | Pesquise por número do artigo, lei, descrição ou palavras-chave com feedback instantâneo. |
| 🏗️ **Construtor de Artigos** | Monte referências legais complexas (Artigo, Parágrafo, Inciso, Alínea) com preview em tempo real. |
| 📱 **Design Responsivo** | Interface moderna que se adapta perfeitamente a desktops, tablets e smartphones. |
| ⚡ **Alta Performance** | Carregamento instantâneo, sem dependências pesadas de frameworks, utilizando Vanilla JS otimizado. |
| 📋 **Cópia Rápida** | Exporte resultados formatados prontos para colar em pareceres e documentos oficiais. |
| 🌙 **Tema Escuro** | Suporte nativo a modo escuro com alternância automática e persistência de preferência. |
| 🧩 **Componentes Reutilizáveis** | Sistema modular de componentes para fácil manutenção e consistência visual. |
| 📊 **Histórico de Consultas** | Rastreie suas pesquisas com estatísticas e exportação de dados. |
| 🎨 **Theme Validator** | Validação automatizada de temas com 23+ categorias de problemas detectados. |
| ✨ **Animações Globais** | Sistema completo de animações padronizadas e hover effects. |

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído com foco em **performance**, **acessibilidade** e **manutenibilidade**.

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)

---

## 🚀 Começando

Siga estes passos para rodar o projeto localmente.

### Pré-requisitos

*   **Node.js** (v18 ou superior)
*   **Git**

### Instalação

1.  **Clone o repositório**
    ```bash
    git clone https://github.com/rkvasne/inelegis-app.git
    cd inelegis-app
    ```

2.  **Instale as dependências**
    ```bash
    npm install
    ```

3.  **Execute os testes** (opcional)
    ```bash
    npm run test:unit
    ```

4.  **Inicie o servidor de desenvolvimento**
    ```bash
    npm run dev
    ```

5.  **Acesse no navegador**
    Abra `http://localhost:3000` para ver a aplicação rodando.

---

## 📂 Estrutura do Projeto

```
inelegis-app/
├── 📁 public/                  # Arquivos servidos e páginas HTML
│   ├── 📁 assets/
│   │   ├── 📁 images/          # Logos e ilustrações
│   │   └── 📁 js/              # Saída sincronizada de src/js
│   ├── 📁 styles/
│   │   └── styles.css          # Estilos globais e tokens de tema
│   ├── index.html              # Portal inicial / termos
│   ├── consulta.html           # Ferramenta principal de pesquisa
│   ├── faq.html
│   ├── sobre.html
│   ├── landing.html
│   └── test-theme.html         # Playground do Theme Validator
├── 📁 src/
│   └── 📁 js/                   # Fontes JavaScript
│       ├── script.js           # Lógica principal (fonte)
│       ├── data.js             # Base legislativa em memória
│       └── 📁 modules/         # Componentes especializados
├── 📁 scripts/                 # Build, deploy, validações, sync
├── 📁 docs/                    # Documentação completa
├── 📁 tests/                   # Testes automatizados
├── package.json
└── README.md
```

> **Nota:** os arquivos em `src/js` são sincronizados automaticamente para `public/assets/js` via `npm run sync:js` (executado por `npm run dev/build`). Sempre edite os fontes dentro de `src/`.

---

## 🆕 Novidades v0.0.9

- ✅ **Documentação reestruturada** – `docs/` agora possui as pastas `design/`, `guides/`, `operations/` e `history/` para navegação direta.
- ✅ **Histórico unificado** – `history/refatoracao-v0.0.6.md` concentra plano, execução e lições; `RELEASE-NOTES-v0.0.9.md` descreve este patch.
- ✅ **Referências atualizadas** – scripts, README e `.env.example` passam a apontar para os novos caminhos.
- ✅ **Patch release** – `package.json` e os badges refletem a versão `0.0.9`.
- ✅ **Painel histórico refinado** – `historico.html` agora usa hero compacto e cards estatísticos com ícones alinhados à FAQ administrativa.

## Histórico de versões anteriores

### Identidade Visual e Design
- ✅ **Favicon e Logo** - Identidade visual completa implementada
- ✅ **Footer Ultra-Compacto** - Layout minimalista de 3 linhas
- ✅ **Página Sobre Redesenhada** - Features grid com hover effects
- ✅ **Botões CTA Melhorados** - Layout responsivo e limpo

### Theme Validator Pro v3.1.0
- ✅ **Validação de Inputs** - Detecta inputs sem variáveis de tema
- ✅ **23+ Categorias** - Detecção abrangente de problemas
- ✅ **Suporte a 9+ Frameworks** - Tailwind, Material, Bootstrap, etc.

### Novidades v0.0.8
- ✅ **Analytics com Redis** - Sistema de analytics usando ioredis
- ✅ **Histórico sincronizado** - Buscas salvas no Redis
- ✅ **Toast e Modal** - UX melhorada sem alert() nativo
- ✅ **Verificação de termos** - Menu Consulta bloqueado sem aceitar termos
- ✅ **Cache desabilitado** - Sem Service Worker, sempre versão atual
- ✅ **Header azul** - Design consistente com landing page

### Novidades v0.0.7
- ✅ **Tema escuro completo** - Alternância automática
- ✅ **Componentes reutilizáveis** - Header, Nav, Footer modulares

### Novidades v0.0.6
- ✅ **Zero vulnerabilidades XSS** - Sanitização completa de HTML
- ✅ **90% mais rápido** - Busca otimizada de ~50ms para ~5ms
- ✅ **20 testes automatizados** - Cobertura de 60%
- ✅ **Código modular** - 6 módulos especializados
- ✅ **Documentação completa** - Guias técnicos atualizados

## 📚 Documentação

A documentação completa está disponível na pasta [`docs/`](docs/).

*   [📖 Índice da Documentação](docs/README.md)
*   [🛠️ Guia de Desenvolvimento](docs/guides/DEVELOPMENT.md)
*   [🔧 Guia de Manutenção](docs/guides/MAINTENANCE.md)
*   [📝 Release Notes v0.0.9](docs/history/RELEASE-NOTES-v0.0.9.md)
*   [📘 Histórico da Refatoração](docs/history/refatoracao-v0.0.6.md)
*   [🤖 Instruções para Copilotos](.github/copilot-instructions.md)

---

## 🤝 Contribuição

Contribuições são o que fazem a comunidade open source um lugar incrível para aprender, inspirar e criar. Qualquer contribuição que você fizer será **muito apreciada**.

1.  Faça um Fork do projeto
2.  Crie sua Feature Branch (`git checkout -b feature/MinhaFeature`)
3.  Commit suas mudanças (`git commit -m 'feat: Adiciona MinhaFeature'`)
4.  Push para a Branch (`git push origin feature/MinhaFeature`)
5.  Abra um Pull Request

Veja nosso [Guia de Contribuição](CONTRIBUTING.md) para mais detalhes.

---

## 📄 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

---

**Última atualização:** 02 de dezembro de 2025  
**Versão:** 0.0.9

---

<div align="center">
  
  **Desenvolvido com ☕ e código por [Raphael Kvasne](https://github.com/rkvasne)**
  
  [⬆ Voltar ao topo](#-inelegis)

</div>