# 📚 Documentação do Inelegis

Bem-vindo à documentação oficial do projeto **Inelegis**.

## 🚀 Guias Principais

### 📖 Navegação
- **[📚 Índice Completo](INDEX.md)** - Navegação completa e organizada de toda documentação
- **[✅ Relatório de Padronização](PADRONIZACAO.md)** - Status da padronização dos documentos

### 🛠️ Desenvolvimento
- **[Guia de Desenvolvimento](DEVELOPMENT.md)** - Arquitetura, módulos, testes e padrões de código
- **[Sistema de Componentes](COMPONENTS.md)** - Componentes reutilizáveis
- **[Guia de Proteção](PROTECTION.md)** - Edições seguras e prevenção de corrupção

### 🔧 Manutenção
- **[Guia de Manutenção](MAINTENANCE.md)** - Atualização de dados, validação e deploy

### 🔄 Refatoração
- **[Plano de Refatoração](REFACTORING-PLAN.md)** - Detalhes da refatoração v0.0.6
- **[Guia de Implementação](IMPLEMENTATION-GUIDE.md)** - Como implementar as melhorias

### 📁 Referências
- **[Referências Oficiais](references/)** - Documentos originais do TRE-SP e manuais ASE

## 📂 Estrutura da Documentação

- `docs/`
    - `README.md`: Este índice
    - `DEVELOPMENT.md`: Guia para desenvolvedores (arquitetura, módulos, testes)
    - `MAINTENANCE.md`: Guia para mantenedores (atualização de dados, validação)
    - `REFACTORING-PLAN.md`: Plano de refatoração v0.0.6
    - `IMPLEMENTATION-GUIDE.md`: Guia de implementação das melhorias
    - `COMPONENTS.md`: Sistema de componentes
    - `PROTECTION.md`: Guia de proteção
    - `references/`: Arquivos PDF, XML e TXT de referência
        - `manual-ase.txt`: Guia operacional das ASEs
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

## 🆕 Novidades v0.0.6

- ✅ 6 módulos JavaScript para segurança e performance
- ✅ 20 testes unitários automatizados
- ✅ Scripts de migração e rollback
- ✅ CSP implementado
- ✅ Busca 90% mais rápida
- ✅ Zero vulnerabilidades XSS

---

**Última atualização:** 01 de dezembro de 2025  
**Versão:** 0.0.6
