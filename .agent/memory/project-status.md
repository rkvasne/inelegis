# 🧠 Memória do Projeto: Ineleg App

**Status Atual:** Stable / Integrated
**Última Atualização:** 03/02/2026

---

## Log de Sessão / Últimas Atualizações

### 03/02/2026 - Data Cleanup & Services Integration
- **Feito:**
  - **Limpeza de Legado**: Remoção de `src/data` e scripts de migração antigos (`migrate.js`, `rollback.js`). A aplicação agora é 100% dinâmica com Supabase.
  - **Analytics & Histórico**: Integração completa nos componentes `ValidatorUI` e `AnalyzerUI`.
  - **Refatoração de Serviços**: `SearchHistory` agora possui estatísticas calculadas localmente a partir de dados sincronizados.
  - **Estabilidade de Banco**: Correção de nomes de colunas e aliases no RPC `verificar_elegibilidade`.
  - **Documentação**: `CHANGELOG.md` e `README.md` atualizados para refletir a arquitetura "Supabase-only".

### 02/02/2026 - UX Pack (Busca Detalhada & Visual)
- **Feito:**
  - **Busca Simples**: Adicionados campos opcionais (Parágrafo, Inciso, Alínea) com validação reativa e layout 1-2-1.
  - **Identidade Legal**: Dropdowns e tabelas agora exibem nomes completos das leis ("Lei 9.504 - Lei das Eleições") em vez de códigos.
  - **Análise de Sentença**: Melhoria na densidade de informações da tabela de resultados (Tipo de Crime in-line).
  - **Documentação**: Atualização do `ux-improvements.md` marcando todas as tarefas como concluídas.

### 02/02/2026 - Migração de Infraestrutura (Supabase)
- **Feito:**
  - Migração completa de Redis para Supabase (PostgreSQL).
  - Implementação de Client/Service assíncrono para validação de elegibilidade.
  - Refatoração de APIs Serverless para uso do SDK Supabase.
  - Setup de Migrations SQL e configuração de RLS (Row Level Security).
  - Limpeza de dívida técnica (scripts Redis removidos).
  - Documentação atualizada (Setup Guide + Changelog).

### 01/02/2026 - Interface de Validação Estruturada (UX Pivot)
- **Feito:**
  - Implementação de `ValidatorService` e `ValidatorUI`.
  - Refatoração de `consulta.html` para eliminar input de texto livre.
  - Implementação de Selects em cascata (Lei -> Artigo).
  - Exibição de resultados em tempo real (Instant Feedback).
  - Remoção de código morto: `search-logic.js`, `article-builder.js`, `dom-manipulation.js`.

### 01/02/2026 - Recuperação de Dados Legais (Data Recovery)
- **Feito:**
  - Recuperação integral da base de dados a partir do `tabela-oficial.docx` (restaurando "Código Penal").
  - Criação de novo pipeline ETL (`etl-docx.js`) autossuficiente (extração XML automática).
  - Eliminação da dependência de conversão PDF->XML instável.
  - Atualização do `redis-loader.js` para suportar nova estrutura JSON.
  - Limpeza de scripts legados e arquivos temporários.

### 01/02/2026 - Refatoração do Core JS (Modularização)
- **Feito:**
  - Decomposição do `script.js` em módulos ES6 (`search-logic`, `ui-events`, `dom-manipulation`, `article-builder`).
  - Atualização do entrypoint em `consulta.html`.
  - Implementação de testes unitários para módulos críticos.
  - Atualização do Relatório de Auditoria (`AUDIT-RELATORIO.md`).
- **Reorganização Estrutural (Code Janitor):**
  - Migração de `src/js/modules` (flat) para camadas semânticas (`services`, `utils`, `components`, `ui`).
  - Atualização dos scripts de build/sync/lint e Unificação da Documentação (`src/js/README.md`).
- **DevOps (Containerização):**
  - Implementação de `Dockerfile` e `docker-compose.yml` (App + Redis).
  - Atualização do Pipeline CI/CD com `docker build check`.
  - Criação do Manual de Operações (`docs/guides/devops-manual.md`).
- **Próximos Passos:**
  - Migração de componentes de UI para Web Components (Médio Prazo).
  - Hardening de segurança com Husky.
