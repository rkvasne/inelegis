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

1.  **Fonte:** `docs/references/tabela-oficial.docx` (Fonte Primária).
2.  **Processamento:** `npm run data:refresh` executa o pipeline completo:
    *   **Extração:** DOCX -> JSON Bruto (`legal-database-docx.json`).
    *   **Normalização:** Expansão de intervalos de artigos (ex: "121 a 125" -> [121...125]).
    *   **Publicação:** Gera `public/assets/js/data-normalizado.js` consumido pelo Frontend.
3.  **Redis:** `npm run load:redis` sincroniza o cache de backend (opcional para dev).

---

## 🛠️ Scripts Disponíveis

*   `npm run serve`: Inicia servidor de desenvolvimento.
*   `npm run data:refresh`: Regenera a base de dados a partir do DOCX.

---

## ✨ Funcionalidades

### 🚀 Produtividade
- **Validação Estruturada:** Fluxo de seleção "Lei -> Artigo" à prova de erros (Drop-down dinâmico).
- **Feedback Imediato:** Status de inelegibilidade exibido instantaneamente ao selecionar o artigo.
- **Base Oficial:** Dados sincronizados diretamente com a tabela do TRE/CRE (DOCX).
- **Cópia Rápida:** Resultados claros e objetivos.
- **Histórico de Consultas:** Rastreio de pesquisas com estatísticas.

### 🎨 Interface
- **Design Responsivo:** Interface adaptada para desktop, tablet e mobile.
- **Tema Escuro:** Alternância automática com persistência de preferência.
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