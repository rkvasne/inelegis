<div align="center">

  <img src="public/assets/images/logo-dark.png" width="256" height="256" alt="Logo do INELEGIS" />

  # INELEGIS
  
  **Sistema de Consulta de Inelegibilidade Eleitoral.**  
  *Uma ferramenta moderna, rápida e precisa para análise jurídica eleitoral.*
 
[![Version](https://img.shields.io/badge/version-0.2.0-blue.svg?style=for-the-badge)](https://semver.org)
[![License](https://img.shields.io/badge/license-MIT-green.svg?style=for-the-badge)](LICENSE.md)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-active-success.svg?style=for-the-badge)](.github/workflows/ci-cd.yml)
[![Tests](https://img.shields.io/badge/tests-suite-blue.svg?style=for-the-badge)](tests/)
[![Theme](https://img.shields.io/badge/theme-validated-success.svg?style=for-the-badge)](docs/design/theme-validator.md)

[Acesse o Sistema](https://inelegis.vercel.app) • [Recursos](#-recursos-principais) • [Tecnologias](#-tecnologias) • [Começando](#-começando) • [Estrutura](#-estrutura-do-projeto) • [Novidades](#-novidades) • [Documentação](#-documentação) • [Contribuição](#-contribuição)

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

## 🛠 Tecnologias

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

*   **Node.js** (22.x)
*   **Git**

### Instalação

1.  **Clone o repositório**
    ```bash
    git clone https://github.com/rkvasne/inelegis.git
    cd inelegis
    ```

2.  **Instale as dependências**
    ```bash
    npm install
    ```

3.  **Execute os testes** (opcional)
    ```bash
    npm run test:unit
    ```

4.  **Configure as variáveis de ambiente**
    Crie um arquivo `.env.local` na raiz do projeto com a URL do seu Redis (necessário para o histórico):
    ```env
    REDIS_URL=redis://seu-usuario:sua-senha@seu-host:porta
    ```

5.  **Inicie o servidor de desenvolvimento**
    ```bash
    npm run dev
    ```

6.  **Acesse no navegador**
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
│       └── 📁 modules/         # Componentes especializados
├── 📁 scripts/                 # Build, deploy, validações, sync
├── 📁 docs/                    # Documentação completa
├── 📁 tests/                   # Testes automatizados
├── package.json
└── README.md
```

> **Nota:** o runtime carrega scripts de `public/assets/js`. Quando existir fonte equivalente em `src/js`, ela pode ser sincronizada para o runtime via `npm run sync:js` (executado por `npm run dev/build`).

---

## 🆕 Novidades

Consulte o [CHANGELOG](CHANGELOG.md) para o histórico completo e a versão atual (0.2.0).

---

## 📚 Documentação

Toda a documentação oficial vive em [`docs/`](docs/). Utilize a tabela abaixo como mapa único:

| Seção | Descrição |
|-------|-----------|
| [Índice Geral](docs/README.md) | Navegação centralizada e padrões de escrita |
| [Guias](docs/guides/) | Desenvolvimento, manutenção, variáveis de ambiente e operação do Redis |
| [Design](docs/design/) | Componentes, decisões visuais e Theme Validator |
| [Operações](docs/operations/) | Analytics, segurança e rotinas administrativas |
| [Histórico](docs/history/) | Release notes, marcos e templates de hotfix |
| [Referências](docs/references/) | Tabelas e anexos oficiais (manual ASE, XML do TRE-SP) |

> Precisa editar ou criar um novo documento? Siga primeiro o padrão definido em `docs/README.md#padrao-de-formato`.

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

Distribuído sob a licença MIT. Veja `LICENSE.md` para mais informações.

Políticas do projeto:
- [Política de Privacidade](PRIVACY.md)
- [Política de Segurança](SECURITY.md)
- [Código de Conduta](CODE_OF_CONDUCT.md)

---

## 🔒 Privacidade

Veja [PRIVACY.md](PRIVACY.md).
