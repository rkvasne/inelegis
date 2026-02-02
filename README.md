<div align="center">

<h1>🛡️ Inelegis</h1>

<img src="public/assets/images/logo-dark.png" alt="Logo do Inelegis" width="256" height="256">

**Sistema de Consulta de Inelegibilidade Eleitoral.**  
*Uma ferramenta moderna, rápida e precisa para análise jurídica eleitoral.*

[![Version](https://img.shields.io/badge/version-0.2.0-blue.svg?style=for-the-badge)](CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-orange.svg?style=for-the-badge)](LICENSE.md)
[![Status](https://img.shields.io/badge/status-active-success.svg?style=for-the-badge)](CHANGELOG.md)

[Documentação](docs/README.md) • [Changelog](CHANGELOG.md) • [Contribuição](CONTRIBUTING.md) • [Licença](LICENSE.md)

</div>

---

## 📖 Sobre

O **Inelegis** é uma aplicação web para consulta de inelegibilidade eleitoral, focada em performance, acessibilidade e manutenção simples.

> **Nota:** o runtime carrega scripts de `public/assets/js`. Quando existir fonte equivalente em `src/js`, ela pode ser sincronizada para o runtime via `npm run sync:js`.

---

## 🗄️ Arquitetura de Dados

O projeto utiliza um pipeline ETL para garantir a integridade das normas jurídicas:

1.  **Fonte:** `docs/references/tabela-oficial.docx` (Nova Fonte Primária).
2.  **Processamento:** `npm run data:refresh` (ou `node scripts/etl-docx.js`) extrai os dados do DOCX via XML estruturado e gera:
    *   `src/data/legal-database.json`: Banco de dados versionado (Fonte da Verdade).
    *   `public/assets/js/data-search-index.js`: Índice otimizado para busca rápida no frontend.
    *   `public/assets/js/data-normalizado.js`: Arquivo legado de compatibilidade.
3.  **Redis:** `node scripts/redis-loader.js` carrega os dados processados para o Redis para consultas de alta performance no backend.

---

## 🛠️ Scripts Disponíveis

*   `npm run serve`: Inicia servidor de desenvolvimento
*   `npm run etl`: Regenera a base de dados a partir do XML
*   `npm run load:redis`: Carrega dados no Redis
*   `npm test`: Executa testes

---

## ✨ Funcionalidades

### 🚀 Produtividade
- **Busca Inteligente:** pesquisa por artigo, lei, descrição ou palavras-chave com feedback instantâneo.
- **Construtor de Artigos:** montagem de referências legais complexas com preview em tempo real.
- **Cópia Rápida:** exporte resultados formatados para documentos oficiais.
- **Histórico de Consultas:** rastreio de pesquisas com estatísticas e exportação.

### 🎨 Interface
- **Design Responsivo:** interface adaptada para desktop, tablet e mobile.
- **Tema Escuro:** alternância automática com persistência de preferência.
- **Componentes Reutilizáveis:** sistema modular de componentes para manutenção.
- **Theme Validator:** validação automatizada de temas com categorias de problemas.
- **Animações Globais:** transições e hovers padronizados.

---

## 🛠️ Instalação

Consulte [CONTRIBUTING.md](CONTRIBUTING.md) para pré-requisitos, instalação e execução local.

---

##  Estrutura

```text
inelegis-app/
├── public/        # Páginas e assets públicos
├── src/           # Fontes JavaScript
├── scripts/       # Build, validações e sync
├── docs/          # Documentação
├── tests/         # Testes automatizados
└── README.md      # Este arquivo
```

---

## 📚 Documentação

Toda a documentação oficial vive em `docs/`. Use o índice central:

**[docs/README.md](docs/README.md)**

---

## 🆕 Novidades

Consulte o [CHANGELOG.md](CHANGELOG.md) para histórico completo e versão atual.

---

## �️ Tecnologias (opcional)

- HTML5
- CSS3
- JavaScript
- Node.js

---

## 🤝 Contribuição

Contribuições são bem-vindas! Veja [CONTRIBUTING.md](CONTRIBUTING.md) para saber como ajudar.

---

## 🔒 Políticas do Repositório

- [SECURITY.md](SECURITY.md)
- [PRIVACY.md](PRIVACY.md)
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE.md](LICENSE.md) para mais detalhes.