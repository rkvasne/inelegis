<div align="center">

<h1>🛡️ Inelegis</h1>

<img src="public/assets/images/logo-dark.png" alt="Logo do Inelegis" width="256" height="256">

**Sistema de Consulta de Inelegibilidade Eleitoral.**  
_Uma ferramenta moderna, rápida e precisa para análise jurídica eleitoral._

[![Version](https://img.shields.io/badge/version-0.3.16-blue.svg?style=for-the-badge)](CHANGELOG.md)
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

O projeto utiliza **Supabase** como única fonte de verdade (Single Source of Truth), eliminando dependências de arquivos locais ou cache temporário.

1.  **Backend (Supabase):**
    - **Tabelas:** `normas`, `artigos_inelegiveis`, `artigos_excecoes` (Base jurídica multi-tabela - Schema V2).
    - **Validação:** RPCs (`verificar_elegibilidade`) garantem lógica segura no lado do servidor.
    - **Audit Trail:** Sistema de histórico detalhado que registra o veredicto jurídico completo e metadados de consulta.
    - **Keepalive:** Sistema de monitoramento baseado no **Hub Keepalive Pattern** para garantir disponibilidade.

2.  **Frontend (Vanilla JS):**
    - Consome dados via `@supabase/supabase-js`.
    - Sem cache estático (removido na v0.3.1 para garantir integridade).

---

## 🛠️ Scripts Disponíveis

- `npm run serve`: Inicia servidor de desenvolvimento.
- `npm run check`: Roda lint e testes (Sanity check).
- `npm run verify`: Valida a integridade do projeto e conformidade com o Hub.

---

## ✨ Funcionalidades

### 🚀 Produtividade

- **Validação Estruturada:** Fluxo de seleção "Lei -> Artigo" à prova de erros (Drop-down dinâmico).
- **Feedback Imediato:** Status de inelegibilidade exibido instantaneamente ao selecionar o artigo.
- **Base Oficial:** Dados sincronizados diretamente com a tabela do TRE/CRE (DOCX).
- **Cópia Rápida:** Resultados claros e objetivos com fundamentação legal inclusa.
- **Histórico e Auditoria:** Rastreio detalhado de pesquisas com estatísticas e verificação de fundamentação jurídica (v0.3.12).
- **Analytics Server-side:** Dashboard administrativo com gráficos de tendências otimizados via views SQL.

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

## Estrutura

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

---

_Última atualização: 15/02/2026 • v0.3.16 (Hub v0.5.6)_
_Editado via: Antigravity | Modelo: claude-3.5-sonnet | OS: Windows 11_
