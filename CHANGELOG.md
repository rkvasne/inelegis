# Changelog

> Navegação: [README do projeto](README.md) • [Documentação](docs/README.md)

---

Todas as alterações notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

---

## [0.3.11] - 12/02/2026

### 📊 Dashboard Administrativo (Novo)

- **Portal de Auditoria (`/admin`)**: Implementação de interface administrativa "oculta" para monitoramento técnico e jurídico.
- **Visual Compliance**: Design system baseado em Glassmorphism e Dark Mode premium.
- **Gráficos de Inteligência (Chart.js)**: 
  - Timeline de consultas com média móvel.
  - Distribuição de veredictos (Doughnut Chart).
- **Log de Auditoria Profissional**: Tabela detalhada com visualização de fundamentação jurídica atômica (Artigo, Parágrafo, Inciso).
- **Monitor de Disponibilidade**: Indicador visual pulsante sincronizado com o sistema de Keepalive.
- **Segurança Robusta (RLS)**: Proteção de dados sensíveis permitindo acesso apenas a usuários administrativos via Supabase Auth.

### 📡 Monitoramento & Uptime (Keepalive)

- **Hub Keepalive Pattern**: Implementação completa do sistema de monitoramento para reduzir o risco de suspensão do Supabase por inatividade.
- **Protocolo de Disparo**: Configuração do Cloudflare Worker como único pinger externo oficial, operando a cada 30 minutos.
- **Receptor Supabase**: Criação da Edge Function `keepalive` com validação de JWT para registro de sinais de vida e eventos.
- **Heartbeat do Cliente**: Sistema de ping nativo no navegador que atua enquanto a aplicação está em uso.
- **Hardenização de Padrão**: Documentação técnica e prompt de governança atualizados para proibir o uso de métodos alternativos (GitHub/Vercel Cron) em favor da uniformidade do ecossistema.

### 🛰️ Supabase Structure (Bridge Mode)

- **Adapter simplificado (`supabase/structure/adapter.js`)**:
  - Removida a lógica de mover/copiar `.json` após execução.
  - Adotado `--outDir supabase/structure` para saída local nativa dos extractors do Hub.
  - Injeção explícita de variáveis de `.env.local`/`.env` do satélite no processo filho para reforçar isolamento de contexto.
- **Documentação local do Bridge**:
  - Atualizado `supabase/structure/README.md` com seção "Bridge v2" e fluxo atual de execução.

### 🛡️ Auditoria & Governança (Zeladoria)

- **Audit-Ready History**: Expansão do sistema de histórico para registrar o "veredicto" completo de cada consulta, incluindo parágrafos, incisos, alíneas e a fundamentação legal detalhada (motivo).
- **Rastreabilidade**: Integração da gravação de histórico na interface de **Consulta Manual** (Dropdowns), garantindo que 100% das buscas realizadas na plataforma sejam auditáveis.
- **Metadados de Contexto**: Inclusão de metadados técnicos (origem da busca, lawName, timestamp preciso) para permitir análise de precisão e auditoria de resultados.
- **Higiene de Ambiente**: Padronização global dos arquivos `.env` entre Inelegis e Zappy seguindo o padrão Solo Dev Hub v0.5.5.
- **Limpeza de Código**: Depreciação do módulo `analytics.js` legado em favor do sistema de Histórico e Keepalive nativo no Supabase.
- **Padronização de Documentação**: Implementação do novo sistema híbrido de metadados do Solo Dev Hub v0.5.5 (Frontmatter estrutural + Assinatura técnica no rodapé) em toda a base de conhecimento.
- **Estrutura do Banco de Dados (Supabase Structure)**: Integração do sistema de extração de metadados do Solo Dev Hub via **Bridge Mode**.
  - **Logic-as-a-Service**: O projeto agora consome a lógica de extração centralizada no Hub, eliminando duplicação de scripts `.js` e `.sql`.
  - **Satellite Adapter**: Implementação do `adapter.js` com suporte a injeção de contexto (`.env.local`), `--preserve-symlinks` e saída controlada via `--outDir`.
  - **Snapshot de Auditoria**: Geração automatizada de JSONs modulares (`tables`, `functions`, `rls`, `triggers`) e consolidados para documentação técnica do banco.
  - **Comando Mestre**: Adição do script `npm run db:extract` no `package.json` para zeladoria completa da estrutura em um único comando.

## [0.3.10] - 11/02/2026

## [0.3.9] - 11/02/2026

### 🔍 Inteligência de Busca (Analisador)

- **Suporte a Múltiplas Citações**: Implementada extração avançada que suporta pluralidade em um único bloco (ex: "Art. 121, §§ 1º, 2º e 3º" ou "Arts. 1, 2 e 3, inciso I"). O sistema agora multiplica automaticamente as combinações para validação individual.
- **Análise por Cláusula**: Refatoração do motor de extração para operar por sentenças (cláusulas), permitindo contextos mais precisos e evitando "vazamento" de parâmetros entre artigos distantes no texto.

## [0.3.8] - 11/02/2026

### 🛡️ Validação & UX (Segurança de Entrada)

- **Sinalização de Exceções**: Resultados que se enquadram em exceções legais agora são exibidos explicitamente como "ELEGÍVEL (EXCEÇÃO)" tanto na busca simples quanto na análise de dispositivo, evitando confusões sobre a natureza do artigo.
- **Filtro de Extração**: Implementada camada de sanidade que ignora capturas "lixo" (falsos positivos) como termos técnicos ("agrafo", "inciso") detectados erroneamente no lugar de valores.
- **Feedback Instrutivo**: Adicionado sistema de Toasts de aviso que bloqueia consultas inconclusivas e instrui o usuário sobre o padrão esperado.
- **Guia de Formato (UX)**: Adicionado box de ajuda rápida com exemplos reais diretamente na interface de Análise de Dispositivo.
- **Prevenção de Erros**: O sistema agora prefere não mostrar resultado do que mostrar um resultado errado baseado em extração parcial.

## [0.3.7] - 11/02/2026

### 🔍 Inteligência de Busca (Analisador)

- **Extração Robusta**: Melhorado algoritmo de captura de dispositivos legais.
  - Suporte a numerais por extenso ("primeiro", "segundo", "1º").
  - Extração inteligente de parágrafos (`§`), incisos e alíneas.
  - Detecção dinâmica de contexto: o sistema agora identifica se um artigo se refere a uma lei citada anteriormente ou no contexto imediato.
- **UX de Entrada**:
  - Implementado gatilho de busca ao pressionar `Enter` no campo de texto.
  - Suporte a `Shift + Enter` para quebras de linha manuais sem disparar a análise.

### 🎨 UI/UX Premium (Feedback & Layout)

- **Resultados Individuais**:
  - Implementados badges de status semânticos (Sucesso/Perigo/Neutro) com design compacto.
  - **Skeleton Loaders**: Adicionada animação de pulso durante a verificação assíncrona dos artigos, melhorando a percepção de performance.
- **Higiene de Tabela**:
  - Adicionado utilitário `line-clamp-2` para evitar que nomes de crimes longos quebrem o alinhamento da tabela.
  - Adicionado feedback visual de hover nas linhas de resultado.
  - Corrigido alinhamento e dimensionamento de colunas para evitar truncamento indesejado de botões.

### 🧪 QA & DevOps (Windows Compatibility)

- **Puppeteer E2E**: Reativada a suíte de testes de layout automatizados.
  - Corrigido carregamento do Puppeteer em módulos ESM via `createRequire`.
  - Refatorada detecção de execução do script (`import.meta.url`) para compatibilidade com caminhos de arquivo do Windows.
- **Estabilidade**: Garantia de 100% de sucesso em testes unitários, funcionais e de layout em ambiente PowerShell/Windows.

---

## [0.3.6] - 10/02/2026

### 🏛️ Governança e Hub (SSoT)

- **Solo Dev Hub CI Strategy**: Adotada a estratégia oficial v0.5.4 para integração contínua.
  - Implementado checkout explícito do repositório do Hub (`.agent/hub`) no workflow de CI/CD.
  - Adotado o uso de `HUB_ACCESS_TOKEN` (Secret) para autenticação com o repositório privado do Hub.
- **Limpeza de Core**: Removidos scripts locais redundantes (`doc-auditor.js`, `validator-web-standards.js`) em favor de chamadas diretas à fonte da verdade no Hub.
- **Theme Linter**: Identificado e documentado bug no linter oficial do Hub. **Resolvido Upstream**: As correções foram incorporadas ao núcleo do Hub e o fork local foi deletado.
- **Documentação**: Sincronização global da versão 0.3.6 em todos os guias técnicos e frontend (cache-busting).

### ⚙️ Backend & Infraestrutura

- **Supabase Service**: Adicionado tratamento de erros robusto (`try/catch`) e injeção de configuração dinâmica no `validator-service.js` para melhor estabilidade em ambiente local e CI.

## [0.3.5] - 09/02/2026

### 🐛 Correções de Interface

- **Página de Consulta**: Corrigido problema de população do dropdown de leis causado por incompatibilidade com o novo schema da tabela `crimes_inelegibilidade`.
  - **Problema**: JavaScript tentava acessar colunas `nome` e `nome_completo` que não existem mais após a migration 002.
  - **Solução**: Atualizado `validator-service.js` e `validator-ui.js` para usar apenas a coluna `lei` que contém o nome completo.
- **CSS**: Melhorado alinhamento da seta do refinamento de busca com `margin-left: 0.5rem`.

### 📊 Auditoria e Documentação

- **Auditoria Completa**: Verificação detalhada da migration 002 contra a tabela oficial da Corregedoria Regional Eleitoral de São Paulo (outubro/2024).
  - **Resultado**: ✅ **100% CONFORME** - Todos os artigos, exceções e categorias estão corretamente mapeados.
  - **Documento**: Criado `docs/auditoria-tabela-oficial.md` com análise completa.
  - **Cobertura**: Código Penal, Código Penal Militar, Código Eleitoral e 28 leis especiais verificadas.

### 🔧 Melhorias Técnicas

- **Sincronização**: Arquivos JavaScript sincronizados entre `src/` e `public/`.
- **Estrutura de Dados**: Confirmada consistência entre frontend e backend após refatoração do banco de dados.

---

## [0.3.4] - 08/02/2026

### 🎨 UI/UX (Modernização)

- **Sistema de Toast**: Implementado novo sistema de notificações visuais elegantes (`toast.js`) substituindo o `alert()` nativo.
- **Feedback Acessível**: Toasts com suporte a ARIA-live e variações contextuais (success, error, warning, info).
- **Estilização**: Design compacto e responsivo integrado ao tema corporativo.

### 🛡️ Compliance & Governança

- **Solo Dev Hub v0.5.4**: Sincronização completa de manifestos (`AGENTS.md`, `GEMINI.md`) e auditoria profunda.
- **Badge de Versão**: Sincronizado badge do README com `package.json` (`0.3.4`).
- **Limpeza de Raiz**: Removidos arquivos órfãos e scripts temporários.
- **Git Hygiene**: Adicionado `.agent/telemetry` ao `.gitignore`.

### 🔧 Correções Críticas (Base de Dados)

- **Inconsistência Massiva na Base de Dados**:
  - **Problema Identificado**: A tabela `crimes_inelegibilidade` continha dados incorretos em VÁRIOS artigos, não apenas no Art. 122 CP.
  - **Descoberta**: Art. 122 CP caput retornava INELEGÍVEL (errado) em vez de ELEGÍVEL foi apenas o sintoma inicial que revelou o problema maior.
  - **Auditoria Completa**: Comparação com a Tabela Oficial revelou divergências em centenas de artigos do CP, CPM, CE e leis especiais.
  - **Causa Raiz Dupla**:
    1. **Dados Incorretos**: Tabela original não seguia a fonte oficial da Corregedoria Regional Eleitoral SP.
    2. **Bug na Função SQL**: `verificar_elegibilidade` usava lógica `(p_paragrafo IS NULL OR t.paragrafo = p_paragrafo)` que casava qualquer parágrafo quando null era passado, mascarando ainda mais os erros de dados.
  - **Solução**: Reconstrução total da tabela (migration 002) + correção da lógica SQL para busca exata de caput.

### 🗄️ Banco de Dados (Migration 002)

- **Reconstrução Completa da Tabela de Crimes**:
  - Criada migration `002_tabela_oficial_completa.sql` baseada 100% na Tabela Exemplificativa oficial da Corregedoria Regional Eleitoral de São Paulo (LC 64/90 atualizada pela LC 135/2010, Outubro 2024).
  - **Motivo**: Tabela anterior tinha erros em múltiplos artigos (não apenas Art. 122), com dados não condizentes com a fonte oficial.
  - **Estrutura Melhorada**:
    - Removido campo `combinacao` (redundante).
    - Adicionados campos de auditoria: `created_at`, `updated_at`.
    - Criados 4 índices otimizados: `idx_crimes_codigo`, `idx_crimes_artigo`, `idx_crimes_codigo_artigo`, `idx_crimes_excecao`.
    - Adicionada documentação SQL completa (COMMENT ON TABLE/COLUMN/FUNCTION).
  - **Dados Inseridos** (~850+ registros, TODOS revisados):
    - Código Penal (CP): ~200 artigos (CORRIGIDOS: Art. 122 caput, crimes contra dignidade sexual, e outros)
    - Código Penal Militar (CPM): ~140 artigos (VALIDADOS contra tabela oficial)
    - Código Eleitoral (CE): ~76 artigos (289-364A)
    - Leis Especiais (40+ leis): CLT, Lei Falimentar, Racismo, ECA, Crimes Tributários, Licitações, Tortura, CTB, Crimes Ambientais, Lavagem de Dinheiro, Desarmamento, Drogas, Organização Criminosa, Terrorismo, entre outras.
  - **Exemplos de Correções Aplicadas**:
    - Art. 122 CP: caput marcado como exceção (ELEGÍVEL), §1º-7º como impeditivos (INELEGÍVEL).
    - Crimes contra dignidade sexual: 216-A e 216-B corretamente marcados como exceções.
    - Lei 9.605/98 (Meio Ambiente): 41 artigos com 10 exceções mapeadas (antes estava incorreto).
    - CPM, CE e leis especiais: diversos artigos que estavam ausentes ou marcados incorretamente foram corrigidos.

### ⚙️ Frontend

- **Detecção de Caput**:
  - Adicionado regex `/[,\s]*\bcaput\b/i` em `formatters.js` para extrair palavra-chave "caput" do input do usuário.
  - Suporte a variações: "122 caput", "122, Caput", "122,caput", etc.
  - Prioridade: detecção de "caput" ocorre antes da extração de parágrafos numéricos.

### ✅ Testes

- **Testes de Caput**: Adicionados 2 novos casos de teste em `formatters.test.js`:
  - Test 11: Extração básica de caput.
  - Test 12: Variações de formatação (espaços, capitalização).
- **Resultado**: 12/12 testes passando (100% success rate).

### 📚 Documentação

- **Migration Scripts**: DROP FUNCTION adicionado para evitar conflito "function name not unique" ao aplicar migration 002.

## [0.3.3] - 03/02/2026

### 🧱 Refatoração de Banco de Dados (Schema V2)

- **Consolidação de Migrações**:
  - Unificação de múltiplas tabelas (`normas`, `artigos_inelegiveis`, `artigos_excecoes`) em uma estrutura plana otimizada (`crimes_inelegibilidade`).
  - Simplificação drástica das queries e redução de complexidade de joins.
  - Limpeza de scripts de migração antigos fragmentados.
- **Correção de Integridade**:
  - Ajuste na constraint `NOT NULL` para leis que definem crimes de forma genérica (ex: Lei 12.850/13 - Organização Criminosa), garantindo inserção correta.
  - Adicionados casts explícitos de tipo (`::TEXT`) na função RPC `verificar_elegibilidade` para sanar erros de compatibilidade de tipos no Retorno de Tabela.
  - Transformação da migração `001` em script idempotente (safe drop) para facilitar reconstruções de schema.
  - **Priorização de Regras (Hotfix)**: Refinado `ORDER BY` no RPC para garantir que a regra geral (Inelegível) prevaleça sobre exceções específicas quando detalhes (parágrafo/inciso) não são selecionados pelo usuário.
  - **Nomenclatura Amigável**: Atualização de todos os nomes de leis na base para formatos humanos (ex: 'Código Penal') e remoção de lógica redundante de string no Frontend.

### 🛡️ Segurança & Frontend

- **Correção de Vulnerabilidade**: Atualização de dependências (`npm audit fix`) mitigando falha crítica em `@isaacs/brace-expansion`.
- **Compatibilidade Frontend**:
  - Refatoração do `ValidatorService.js` para consultar a nova tabela unificada.
  - Otimização de lógica de cache e ordenação de leis/artigos no cliente.

## [0.3.2] - 03/02/2026

### 🛡️ Compliance & Governança

- **Solo Dev Hub v0.4.7**:
  - Atualização dos manifestos de IA (`AGENTS.md`, `GEMINI.md`) para o modelo Hub-First (SsoT).
  - Conexão validada via Junction com `E:\Agents` (`.agent/hub/`).
- **Qualidade de Código & Hooks**:
  - Integração do **Husky** para Git Hooks.
  - Configuração de **lint-staged** para formatação automática em arquivos staged.
  - Novo hook `pre-commit` executando `npm run format` e `npm run verify`.
- **Scripts de Zeladoria**:
  - Adicionados scripts padronizados no `package.json`: `verify`, `context`, `format`, `format:check`.

## [0.3.1] - 02/02/2026

### 🧹 Limpeza & Refatoração (Deep Cleaning)

- **Remoção de Legado de Dados**:
  - Excluídos diretórios de dados locais (`src/data`) e scripts de ETL/migração obsoletos (`migrate.js`, `rollback.js`, `optimize.js`).
  - Removidos arquivos de cache do frontend (`data-search-index.js`, `consulta-normalizado.js`). A aplicação agora é 100% dependente do Supabase em tempo real.
- **Serviço de Histórico & Analytics**:
  - Refatoração do `search-history.js` para suportar sincronização proativa e cálculo local de estatísticas avançadas (Top Leis/Artigos).
  - Integração automática de rastreamento de consultas (Analytics + Histórico) nos componentes `ValidatorUI` e `AnalyzerUI`.
  - Mapeamento consistente de campos do banco (`observacoes`, `motivo`) para a interface do usuário.
- **Estabilidade**:
  - Correção na função RPC `verificar_elegibilidade` para garantir nomes de colunas consistentes e evitar ambiguidades de alias.
  - Implementação do método `init()` nos serviços core para garantir persistência de UID desde o primeiro acesso.

### ⚙️ Build & Infraestrutura

- **Build System**:
  - Automatizada geração de `supabase-config.js` durante o processo de build/deploy.
  - Suporte a variáveis de ambiente (`process.env`) no script de configuração para compatibilidade com Vercel/CI/CD.
  - Corrigido erro de sintaxe (`SyntaxError: export`) em arquivos carregados no navegador (`formatters.js`, `exceptions.js`).
- **Novas Funcionalidades**:
  - Introduzida a **Análise de Dispositivo de Sentença (BETA)**: permite colar o texto de sentenças para extração automática de artigos.
  - Parser inteligente com detecção de contexto legal e suporte a combinações (ex: Art. 121 c/c Art. 14).
  - Sugestão inteligente de códigos **ASE (337 e 370)** baseada na análise do texto da decisão.
  - **Busca Simples "Pro"**: Adicionados campos opcionais para **Parágrafo**, **Inciso** e **Alínea** com layout ergonômico (Grid 1-2-1).
  - **Feedback Visual**: Exibição explícita dos filtros aplicados durante a validação.
- **Segurança & PWA**:
  - Atualizada a política de segurança (**CSP**) no `vercel.json` para permitir conexões com o Supabase (`connect-src`).
  - Corrigidos caminhos de assets no **Service Worker** e incrementada versão do cache para resolver falhas de `addAll` no PWA.
- **Melhorias de Visualização**:
  - Dropsdowns de Lei agora mostram "Código - Nome Completo" (ex: "LEI_9504 - Lei das Eleições").
  - Tabela do Analisador exibe o nome da lei por extenso e o Tipo de Crime (se inelegível) diretamente na lista.
- **Limpeza de Código Morto**:
  - Removidos arquivos obsoletos: `constants.js`, `core-utils.js`, `search-logic.test.mjs`.
  - Removidas referências a scripts inexistentes nos arquivos HTML (`data-normalizado.js`).

## [0.3.0] - 02/02/2026

### 🚀 Infraestrutura (Supabase Migration)

- **Migração Completa de Banco de Dados**: Substituição do Redis pelo Supabase (PostgreSQL) para persistência de dados.
  - **Motivo**: Redução de custos, maior integridade de dados e eliminação de dependência de serviço externo pago para features básicas.
  - **Tabelas Migradas**:
    - `normas`, `artigos_inelegiveis`, `artigos_excecoes` (Dados estáticos).
    - `historico_consultas` (Dados de usuário).
    - `analytics_events` (Dados de telemetria).
- **Backend/API**:
  - Migração de todas as Serverless Functions (`api/search-history.js`, `api/analytics.js`, `api/dashboard.js`) para usar `@supabase/supabase-js`.
  - Criação de `api/maintenance.js` para limpeza automática de dados antigos.
- **Frontend**:
  - Novo `SupabaseClient` leve para consultas diretas (leitura) no cliente.
  - Atualização do `ValidatorService` para consultas assíncronas com fallback resiliente (dados estáticos).
  - Atualização de UI (`validator-ui.js`) com estados de carregamento (loading seeds).
- **Documentação**:
  - Novo guia `docs/guides/setup-supabase.md`.
  - Atualização de `.env.example` e remoção de scripts `redis-*`.

### 🎨 UI/UX - Validação Estruturada

- **Fluxo de Decisão**: Substituição da busca textual por seleção hierárquica (Wizard):
  - **Seleção de Lei**: Filtro inteligente de normas disponíveis.
  - **Seleção de Artigo**: Carregamento dinâmico apenas de artigos existentes na tabela do TRE.
  - **Feedback Imediato**: Exibição instantânea do status de inelegibilidade ao selecionar o artigo.
- **Remoção de Erro Humano**: Eliminação de typos via input manual; sistema agora funciona como validador de conformidade.
- **Interface**: Novos componentes de Dropdown e Cards de Resultado com estilização semântica (Vermelho/Verde) clara.

### 🏗️ Arquitetura & Código

- **Refatoração Modular do Core**:
  - Migração de `script.js` (monólito) para arquitetura de Módulos ES6.
  - Criação de módulos especializados:
    - `search-logic.js` (Lógica de busca e regras de negócio).
    - `ui-events.js` (Gerenciamento de eventos de UI).
    - `dom-manipulation.js` (Manipulação de interface e modais).
    - `article-builder.js` (Construtor interativo de artigos).
    - `core-utils.js` (Utilitários transversais).
  - Atualização de `consulta.html` para suporte nativo a `type="module"`.
- **Testes**:
  - Implementação de testes unitários para a nova arquitetura modular.
  - Validação de 100% de sucesso nos testes de lógica de busca.
- **Estrutura de Arquivos**:
  - Reorganização semântica de `src/js/modules/` para arquitetura em camadas:
    - `src/js/services/` (Lógica)
    - `src/js/utils/` (Utilitários)
    - `src/js/components/` (Componentes UI)
    - `src/js/ui/` (Views/Events)
  - Limpeza de redundâncias e atualização dos scripts de build/lint para suportar a nova estrutura.
  - Atualização automática de imports em todos os arquivos JS.

### ⚙️ CI/CD & DevOps

- **Containerização**:
  - Criação de `Dockerfile` otimizado (Multi-stage, Node 22 Alpine) e seguro (Rootless).
  - Criação de `docker-compose.yml` para orquestração local de App + Redis.
  - Criação de `docs/guides/devops-manual.md` com instruções de deploy.
- **Pipeline GitHub Actions**:
  - Adicionado estágio de verificação de build do Docker (`Docker Build Check`) para garantir integridade da imagem.
  - Implementado workflow completo de CI/CD (`.github/workflows/ci-cd.yml`) com Quality Gate.
- **Scripts**:
  - Removido `scripts/deploy.js` (redundante/obsoleto).
  - Movido e renomeado `deploy.sh` da raiz para `scripts/deploy-server.sh` (organização).
- **Documentação**: Criado guia `docs/guides/devops.md` detalhando o pipeline de automação.

### 📚 Documentação

- Unificação de documentação: remoção de arquivos `release-notes-*` (conteúdo consolidado no CHANGELOG).
- Padronização de metadados (front matter) em `README.md`, `docs/README.md`, `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md` e `SECURITY.md`.
- Atualização de links internos e índice central em `docs/README.md`.
- Documentação de agentes atualizada para apontar para o repositório global de regras.
- Remoção de menções a ferramentas e referências externas específicas na documentação.
- Histórico de commits reescrito para remover menções a ferramentas externas.
- Adicionada seção “Ferramentas e Versões Recomendadas” em `docs/guides/development.md`.
  - Node.js 22.x; ESLint 9.39.x; Prettier 3.8.x; HTML-validate 10.6.x; Puppeteer 24.35.x; ioredis 5.9.x; dotenv 17.2.x.

### 📐 Layout & Design

- **Container**: Ajustada largura máxima para `1312px` (referência: referência visual).
- **Gutter**: Padronizado espaçamento lateral (padding) para `1.5rem` (24px).
- **Responsividade**: Unificado breakpoint de tablet/desktop para `768px`.
- **Header/Footer**: Alinhamento perfeito das margens internas com o conteúdo principal.

### ⚙️ CI/CD

- **Testes**: Configurado script de teste para pular (skip) validação de layout via Puppeteer se o navegador não puder ser iniciado (fix para Vercel/Serverless).

### 🎨 UI/UX

- Cards da página inicial renomeados para `card-primary`/`card-secondary` e opacidade via variável.
- Rodapé de componentes com seção de transparência e CTA “GitHub”.
- Mensagem de “Nenhuma lei encontrada” sem estilos inline no JavaScript.
- **Footer**:
  - Sincronização de layout com projeto Dahora App (Grid 40% / 30% / 30%).
  - Correção de conflito de classes (`.footer-content`) que comprimia a largura do rodapé.
  - **Melhoria Visual**: Removida borda sólida e adicionada sombra suave para melhor separação do conteúdo (Sistema e Landing Page).
  - **Dark Mode**: Ajustado fundo do rodapé (`--bg-tertiary`) para contraste mais leve em relação ao corpo da página.
  - **Marca**: Cor do texto "Inelegis" e ícone padronizados com o cabeçalho em todos os temas e páginas.
  - **Lógica de Logo**: Implementado `ThemeManager.updateLogo` aprimorado para sincronizar logos do rodapé (`.theme-aware-logo`) com o tema ativo.
  - **Header**: Ajustada lógica para utilizar logo claro em todas as páginas quando em modo escuro (correção para páginas internas).
  - **Dark Mode**: Aumentado contraste do fundo do rodapé (`Slate 900`) para melhor diferenciação do corpo da página.
  - Largura forçada para 100% dentro do container de 1200px para evitar "shrink" indesejado.
  - Redesign completo para estilo minimalista e compacto.
  - Altura reduzida com espaçamento otimizado entre elementos.
  - Tipografia ajustada: Fonte 15px para copyright e 13px para descrição e links.
  - Alinhamento visual unificado entre Landing Page e páginas internas.
- Remoção da borda/“card” ao redor da logo no rodapé.
- Breakpoint de altura fixa ajustado para incluir 768px (desktop).
- **Favicon**:
  - Atualizado para `logo-dark.ico` em todas as páginas e modos (Claro/Escuro) para consistência.
- **Cards**:
  - Melhorado contraste de subtítulos no tema escuro (ex.: “Confirme os termos...”).
- **Legenda de Resultados**:
  - Títulos ("INELEGÍVEL", "ELEGÍVEL", "NÃO ENCONTRADO") transformados em badges.
  - Badges agora ficam em linha separada da descrição.
  - Cores dos badges correspondem à cor da borda do card (Vermelho, Verde, Laranja) para melhor destaque e organização.

### 🎨 CSS & Tema

- Substituição de cores e opacidades hardcoded por variáveis de tema.
- Atualizações em `landing.css` para CTA, rodapé e menu mobile.

### 🧪 Validação

- Validador de tema ignora o diretório `agents-link`.

## [0.2.0] - 05/12/2025

### 🎨 UI/UX - Padronização Visual Completa

- **Heroes Unificados**: Todas as páginas (Index, FAQ, Sobre, Histórico) agora possuem hero sections com visual consistente:
  - Background: `var(--bg-secondary)` com `border-bottom`
  - Títulos: 1.875rem (1.5rem mobile)
  - Subtítulos: 1rem (0.9375rem mobile)
  - Padding padronizado em todas as páginas
- **Breadcrumbs**: Adicionados em FAQ, Sobre, Histórico e Consulta para navegação consistente
- **Botões**:
  - Corrigido contraste do `btn-primary` no tema escuro (cores hex diretas para garantir visibilidade)
  - Ajustado estado `disabled` para melhor visibilidade em ambos os temas
  - Texto do botão principal simplificado: "Acessar Sistema de Consulta" → "Acessar Consulta"
- **Modal de Resultados**:
  - "Não Encontrado" agora usa cor laranja/warning (diferenciando de vermelho/inelegível)
  - Ícone atualizado para interrogação (consistente com legenda)
  - Corrigido contraste do texto de conclusão no tema escuro
- **Legenda da Consulta**: "Não Encontrado" agora usa cores warning (laranja) em vez de neutro
- **Ícones do Histórico**: Padronizados com cores primárias (azul) como nas outras páginas
- **CTA do FAQ**: Transformado em card centralizado para consistência visual
- **Landing Page**: Corrigido modal de atalhos que aparecia visível após o footer

### 📝 Textos e Conteúdo

- **Página Inicial**:
  - Subtítulo atualizado com fonte completa: "Consulte crimes que ensejam inelegibilidade eleitoral com base na tabela do TRE-SP (outubro/2024), revisada pela CRE-RO (junho2025)"
  - Link "Conheça mais sobre o Inelegis" transformado em botão CTA centralizado
- **Página Sobre**: Subtítulo simplificado para versão mais concisa
- **Página Histórico**: Subtítulo melhorado para "Acompanhe suas consultas, exporte relatórios e visualize estatísticas"

### 🏗 Arquitetura

- Estilos do modal de atalhos adicionados ao `landing.css` para funcionamento correto na landing page
- Novos estilos CSS para `.modal-section.modal-info` (usado em "Não Encontrado")
- Classe `.nao-encontrado` criada para diferenciação visual no modal

### 📚 Documentação

- Versão incrementada para 0.2.0
- CHANGELOG atualizado com todas as mudanças de UI/UX
- README atualizado com nova versão

---

## [0.1.9] - 05/12/2025

### 🎨 UI/UX & Design

- **Histórico de Consultas**:
  - Refatoração completa do layout para uso de cards (`features-grid`).
  - Estatísticas organizadas em grid de 3 colunas para melhor visualização de totais.
  - Correção de espaçamentos entre painéis de "Consultas Recentes/Frequentes" e seção de "Estatísticas".
  - Tabelas e badges padronizados com o design system.
- **Página de Consulta**:
  - Atualização dos ícones dos cards de comunicação:
    - "Condenação" agora usa ícone de cadeado com indicador visual vermelho (`danger`).
    - "Extinção da Punibilidade" usa ícone de check com indicador verde (`success`).
- **Sistema de Design**:
  - Correção de variáveis de espaçamento inexistentes.
  - Melhoria de contraste e sombras nos cards do tema claro.
  - Padronização dos botões do modal ("Fechar" e "Exportar") com tamanhos iguais e correção de cor no hover (uso de `bg-tertiary` para contraste).
- **Página FAQ**:
  - Correção completa do layout (hero, busca, categorias, acordeões).
  - Ajuste fino de posição da barra de busca (subida de 25px e descida de 5px conforme solicitado).
  - Transições e responsividade revisadas.
- **Página Inicial**:
  - Restauração do indicador visual (mãozinha) antes do checkbox de consentimento.
  - Alinhamento do conjunto "mãozinha + checkbox + texto" dentro do card de acesso.

### 🏗 Arquitetura & Backend

- **Limpeza de Legado**: Remoção do arquivo `src/js/data.js` (dados brutos não normalizados) e atualização dos scripts de build para usar apenas a fonte normalizada.
- **Ambiente de Desenvolvimento**:
  - Remoção de mock local para API de histórico.
  - Obrigatoriedade de configuração do Redis (`REDIS_URL`) no ambiente de desenvolvimento para garantir paridade com produção.

### 📚 Documentação

- Consolidação do índice geral (`docs/README.md`) com mapa único, guideline de formato e links para todos os subdiretórios.
- Criação de `docs/history/RELEASE-NOTES-v0.1.0.md`, removendo duplicação de conteúdo do README.
- Revisão do `README.md` para apontar apenas para fontes oficiais e atualizar badge, links e metadados de versão.
- Inclusão dos Release Notes para `v0.1.3`, `v0.1.4` e `v0.1.9` em `docs/history/`.

### 🧩 Manutenção

- Versão do projeto promovida para `0.1.9` no `package.json`, badges e documentos.
- Atualização dos campos "Última atualização" e referências cruzadas para manter consistência com o estado atual do repositório.

### 🔐 Segurança & Acesso

- Remoção do bloqueio por consentimento das páginas públicas `sobre` e `faq` (bloqueio permanece apenas na página `consulta`).
- Melhoria do controle visual de desabilitação de link de consulta quando os termos não estão aceitos.

## [0.1.8] - 03/12/2025

### 🛠 Plataforma

- Padronização de versão de assets com `?v=0.1.8` nas páginas públicas.
- Dev Server com live reload, sincronização automática de assets (`src/js` → `public/assets/js`) e fallback de rotas.

### 🧭 Funcionalidades

- Página **Histórico (Admin)** inicial com cards compactos e estatísticas agregadas.
- Consolidação de módulos utilitários em `public/assets/js/modules/` (storage, formatters, exceptions, modal-manager, components).

### 🔐 Segurança & Acesso

- Introdução do guard de consentimento apenas para a página `consulta`.
- Indicação visual de desabilitado para acesso à consulta quando termos não aceitos.

### 📚 Documentação

- Inclusão de `docs/history/RELEASE-NOTES-v0.1.8.md` com resumo das mudanças.

## [0.1.7] - 04/12/2025

### Correções & UX

- FAQ: melhorias em espaçamentos e estados de hover dos cards.
- Busca na FAQ: autoexpansão de itens quando termo > 2 caracteres.
- Acessibilidade: `aria-disabled` e foco consistentes em links desabilitados do header.
- Atalhos de teclado: refinamentos para foco e navegação (busca e modal).

## [0.1.6.1] - 05/12/2025

Hotfix pontual na página inicial:

- Correção de erro de redeclaração de variável `arrowIndicator` que impedia o indicador de consentimento.
- Override de CSS para posicionamento estático do indicador junto ao checkbox.
- Troca do SVG por emoji de mão para consistência cross-browser.

## [0.1.6] - 04/12/2025

### Correções & UX

- Página Inicial: confiabilidade do indicador de consentimento (exibir/ocultar).
- Consentimento: desabilitação do link de consulta com feedback visual.
- Tipografia: tamanhos e espaçamentos consistentes em botões e labels.
- Toasts: textos e animações de saída ajustados.

## [0.1.5] - 04/12/2025

### Correções & UX

- Modal: padronização de botões do rodapé (tamanhos e espaçamentos).
- Tema claro: sombras e contraste refinados em cards.
- Transições: ajustes sutis para reduzir reflow.
- Pequenos bugs: correções de alinhamento em headers e grids.

## [0.1.4.1] - 04/12/2025

Pequeno hotfix de UI/UX:

- Ajuste fino da posição da barra de busca da FAQ (subida de 25px e descida de 5px) com correção de sobreposição e z-index.
- Restauração de media query removida por engano para responsividade do modal.
- Fallback de cor para o indicador visual usando variáveis de tema.

## [0.1.4] - 04/12/2025

### 🎨 UI/UX & Design

- **Modal de Resultados Compactado**: Otimização do layout para telas menores (notebooks).
  - Redução de padding e margens nos cards.
  - Ajuste de line-height e espaçamento de textos para maior densidade de informação sem perder legibilidade.
  - Unificação do estilo de cards para alertas e informações.
- **Correções Visuais**:
  - Restauração do indicador visual ("mãozinha") acima do seletor de lei.
  - Ajuste de tipografia do modal para alinhar com o sistema de design (fontes menores e mais equilibradas).
  - Melhoria de contraste no disclaimer de exceções.

### 📚 Documentação

- Unificação e limpeza de toda a documentação do projeto.
- Atualização de versão para `0.1.4` em todos os arquivos (`package.json`, HTMLs, CHANGELOG).

---

## [0.1.3] - 04/12/2025

...

```

---

_Última atualização: 11/02/2026 • v0.3.11 (Hub v0.5.5)_
_Editado via: Antigravity | Modelo: claude-3.5-sonnet | OS: Windows 11_
```
