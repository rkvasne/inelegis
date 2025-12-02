# 📚 Documentação do Inelegis

Bem-vindo à documentação oficial do projeto **Inelegis**.

## 🚀 Guias Principais

### 📖 Navegação
- **[📚 Índice Completo](INDEX.md)** - Navegação completa e organizada de toda documentação
- **[📝 Changelog da Documentação](CHANGELOG-DOCS.md)** - Histórico de mudanças na documentação

### 🛠️ Desenvolvimento
- **[Guia de Desenvolvimento](DEVELOPMENT.md)** - Arquitetura, módulos, testes e padrões de código
- **[Guia de Proteção](PROTECTION.md)** - Edições seguras e prevenção de corrupção

### 🔧 Manutenção
- **[Guia de Manutenção](MAINTENANCE.md)** - Atualização de dados, validação e deploy

### 🎨 Design e Temas
- **[Theme Validator](THEME-VALIDATOR.md)** - Documentação completa do validador de temas
- **[Componentes](COMPONENTS.md)** - Sistema de componentes reutilizáveis
- **[Decisões de Design](DESIGN-DECISIONS.md)** - Arquitetura e padrões de design

### 📊 Analytics e APIs
- **[Analytics](ANALYTICS.md)** - Sistema de analytics e histórico
- **[Setup Redis](SETUP-REDIS.md)** - Configuração do banco de dados
- **[Variáveis de Ambiente](VARIAVEIS-AMBIENTE.md)** - Configuração de ambiente
- **[API Endpoints](../api/README.md)** - Documentação das APIs

### 🔄 Refatoração (Histórico)
- **[Plano de Refatoração](REFACTORING-PLAN.md)** - Detalhes da refatoração v0.0.6
- **[Guia de Implementação](IMPLEMENTATION-GUIDE.md)** - Como implementar as melhorias

### 📁 Referências
- **[Referências Oficiais](references/)** - Documentos originais do TRE-SP e manuais ASE

## 📂 Estrutura da Documentação

- `docs/`
    - `README.md`: Este índice
    - `DEVELOPMENT.md`: Guia para desenvolvedores (arquitetura, módulos, testes)
    - `MAINTENANCE.md`: Guia para mantenedores (atualização de dados, validação)
    - `REFACTORING-PLAN.md`: Plano de refatoração v0.0.6 (histórico)
    - `IMPLEMENTATION-GUIDE.md`: Guia de implementação (histórico)
    - `PROTECTION.md`: Guia de proteção
    - `references/`: Arquivos PDF, XML e Markdown de referência
        - `manual-ase.md`: Manual formatado das ASEs
        - `tabela-oficial.pdf`: Tabela original do TRE-SP
        - `tabela-oficial.xml`: Dados originais em XML
    - `legacy/`: Documentos de versões anteriores

- `js/`: Módulos JavaScript (v0.0.6+)
    - `README.md`: Documentação dos módulos
    - `sanitizer.js`: Prevenção XSS
    - `storage.js`: localStorage seguro
    - `formatters.js`: Formatação de artigos
    - `exceptions.js`: Validação de exceções
    - `modal-manager.js`: Gestão de modal
    - `search-index.js`: Busca otimizada

- `tests/`: Testes automatizados
    - `formatters.test.js`: Testes de formatação
    - `exceptions.test.js`: Testes de exceções

## 🔗 Links Úteis

- [Repositório GitHub](https://github.com/rkvasne/ineleg-app)
- [Changelog](../CHANGELOG.md)
- [Voltar para a Raiz](../README.md)

## 🆕 Novidades v0.0.8

- ✅ Sistema de Analytics com Redis (ioredis)
- ✅ Histórico de buscas sincronizado com Redis
- ✅ APIs: `/api/analytics`, `/api/dashboard`, `/api/search-history`
- ✅ Documentação de APIs atualizada

---

**Última atualização:** 02 de dezembro de 2025  
**Versão:** 0.0.8
