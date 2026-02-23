# Changelog Archive (v0.2.0 a v0.3.11)

Histórico de alterações das versões 0.2.0 a 0.3.11 do Inelegis.
Para versões mais recentes, consulte o [CHANGELOG principal](../../CHANGELOG.md).

---

## [0.3.11] - 13/02/2026

### 🛡️ Blindagem de Governança (Novo)

- **Git Armor (Husky)**: Implementação de pre-commit hooks que impedem a entrada de código sem validação de tema (Theme Linter), build (scripts/build.js) e integridade do Hub (verify).
- **Zeladoria Automatizada**: Integração de `npm run format` e `npm run check` no fluxo de commit para garantir dívida técnica zero no repositório.

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

### 🧹 Zeladoria Técnica (Code Janitor)

- **Dead Code Cleanup**: Remoção de lista de leis obsoleta em `constants.js` e variáveis não utilizadas em `validator-ui.js`.
- **Nomenclatura**: Padronização de classes (PascalCase), variáveis (camelCase) e arquivos (kebab-case).
- **Logging Profissional**: Migração massiva de `console.log` para `debugLog` em todos os serviços e controladores, permitindo controle centralizado de verbosidade.
- **Documentação Interna**: Adição de JSDoc em métodos estruturais do `AnalyerUI`, `ValidatorUI` e funções utilitárias globais para melhor suporte ao IntelliSense.
- **Restauração de Integridade**: Correção de corrupção acidental no `ValidatorUI` durante o processo de refatoração, validada com 100% de passagem no lint.

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

- **Inconsistência Massiva na Base de Dados**: Reconstrução total da tabela (migration 002) + correção da lógica SQL para busca exata de caput.
- **Migration 002**: Tabela baseada 100% na Tabela Exemplificativa oficial da Corregedoria Regional Eleitoral SP.

### ⚙️ Frontend

- **Detecção de Caput**: Adicionado regex em `formatters.js` para extrair "caput" do input do usuário.

### ✅ Testes

- **Testes de Caput**: Adicionados 2 novos casos em `formatters.test.js` (12/12 passando).

## [0.3.3] - 03/02/2026

### 🧱 Refatoração de Banco de Dados (Schema V2)

- **Consolidação de Migrações**: Unificação em `crimes_inelegibilidade`.
- **Correção de Integridade**: Priorização de regras, nomenclatura amigável.

### 🛡️ Segurança & Frontend

- **Correção de Vulnerabilidade**: `npm audit fix` para `@isaacs/brace-expansion`.
- **Compatibilidade Frontend**: Refatoração do ValidatorService para nova tabela unificada.

## [0.3.2] - 03/02/2026

### 🛡️ Compliance & Governança

- **Solo Dev Hub v0.4.7**: Atualização de manifestos, conexão via Junction.
- **Husky e lint-staged**: Pre-commit com format e verify.

## [0.3.1] - 02/02/2026

### 🧹 Limpeza & Refatoração

- **Remoção de Legado**: Excluídos `src/data` e scripts ETL obsoletos.
- **Serviço de Histórico**: Refatoração do search-history.js, integração automática de rastreamento.
- **Análise de Dispositivo (BETA)**: Parser inteligente, suporte a combinações.
- **Busca Simples "Pro"**: Parágrafo, Inciso e Alínea opcionais.

## [0.3.0] - 02/02/2026

### 🚀 Infraestrutura (Supabase Migration)

- **Migração Completa**: Redis → Supabase (PostgreSQL).
- **Backend/API**: Serverless Functions migradas para @supabase/supabase-js.
- **Frontend**: Novo SupabaseClient, ValidatorService assíncrono.

### 🎨 UI/UX - Validação Estruturada

- **Fluxo de Decisão**: Seleção hierárquica (Lei → Artigo).
- **Refatoração Modular**: Módulos ES6, estrutura em camadas.

### ⚙️ CI/CD & DevOps

- **Containerização**: Dockerfile multi-stage, docker-compose.
- **Pipeline GitHub Actions**: Quality Gate.

## [0.2.0] - 05/12/2025

### 🎨 UI/UX - Padronização Visual Completa

- **Heroes Unificados**: Todas as páginas com hero sections consistentes.
- **Breadcrumbs**: FAQ, Sobre, Histórico, Consulta.
- **Botões**: Contraste corrigido, texto simplificado.
- **Modal de Resultados**: "Não Encontrado" em cor warning (laranja).

### 📝 Textos e Conteúdo

- Subtítulos atualizados em Inicial, Sobre e Histórico.

---

_Última sincronização: 16/02/2026_
