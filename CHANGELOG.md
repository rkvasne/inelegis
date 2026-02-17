# Changelog

> Navegação: [README do projeto](README.md) • [Documentação](docs/README.md)

---

Todas as alterações notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

---

## [Unreleased]

### fix(verificação)

- **fix(rpc):** Match exato apenas na `verificar_elegibilidade`. Sem match e artigo com dispositivos impeditivos → ELEGIVEL com aviso ("combinação exata que produz inelegibilidade; verifique na sentença"). Sem match e artigo inexistente → NAO_CONSTA. Correção ORDER BY NULLS LAST para priorizar match exato de §/inciso (ex.: Art. 121 §3º retorna ELEGIVEL corretamente). Verificação completa: 54 exceções, 390 impeditivos, artigos específicos (148, 129, 149-A).
- **fix(rpc):** Formatação de `excecoes_artigo`: usar § em vez de "Par."; "parágrafo único" por extenso quando for parágrafo único; remover observações (tipo de crime) — exibir apenas o dispositivo conforme a tabela.
- **fix(ui):** Revertido: o aviso "Atenção: Exceções Existentes" volta a ser exibido sempre que houver `excecoes_artigo` (até a tabela estar 100% validada).
- **fix(rpc):** Match estrito para §/inciso/alínea: quando o usuário informa um dispositivo inexistente (ex.: Art. 122 § 8), não fazer fallback para o caput. Retorna fluxo "sem match" (ELEGIVEL com aviso ou NAO_CONSTA conforme o artigo).

## [0.3.21] - 17/02/2026

### ✨ UX e ASE (Conformidade Manual)

- **fix(ase):** ASE no modal e na tabela passa a seguir o Manual ASE conforme tipo de comunicação (Condenação/Extinção) e resultado, independente de exceção.
- **Condenação:** inelegível → ASE 337 Motivo 7; elegível → ASE 337 Motivo 2.
- **Extinção:** inelegível → ASE 370 + ASE 540 (Motivo 4); elegível → ASE 370.
- **fix(data-ocorrencia):** Data de Ocorrência no modal passa a variar conforme tipo: Condenação = "Trânsito em Julgado / Da sentença condenatória"; Extinção = "Data da sentença de extinção / Extinção da punibilidade ou cumprimento da pena" (Manual ASE 337/370).
- **UX (Radios compartilhados):** Tipo de Comunicação (Condenação/Extinção) movido para card único acima das abas, evitando duplicação em Busca Simples e Análise de Dispositivo.
- **Docs:** development.md e manual-ase.md atualizados com mapeamento UI → ASE.

## [0.3.20] - 16/02/2026

### ✨ UX e Qualidade

- **UX (Exceção explícita):** Consulta simples e análise por extração exibem claramente quando o resultado é elegível por exceção legal (badge "ELEGÍVEL (EXCEÇÃO)" e texto explicativo).
- **Refactor (Modal unificado):** `ResultRenderer` passou a ser o único exibidor de resultados; consulta simples e análise por extração usam o mesmo componente, eliminando duplicação e garantindo padronização.
- **Testes (Prompt 11):** Criado `tests/result-renderer.test.js` (14 cenários) cobrindo exceção explícita, ASE, incidência e escape XSS; integrado ao `npm run test:unit`.

### 📚 Governança

- **Governança (Prompt 18):** Correção de links `prompts-library` → `prompts` em AGENTS.md e GEMINI.md; formatação Prettier em supabase-config e core-utils; assinaturas de edição atualizadas; verify OK.

---

## [0.3.19] - 15/02/2026

### 🛡️ Segurança (Sanitização XSS)

- **fix(security):** Sanitização de dados interpolados em HTML para mitigar XSS em todas as UIs que exibem dados do banco ou do usuário.
- **Novo utilitário:** `src/js/utils/escape-html.js` exporta `escapeHtml()` para uso em módulos ES; integrado em `analyzer-ui.js`, `result-renderer.js` e `dashboard-ui.js`.
- **Escopo:** Valores de lei, artigo, dispositivo legal, tipo_crime, item_alinea_e, exceções, mensagens e IDs passam por escape antes de inserção em `innerHTML` ou templates.

### 📚 Documentação e Configuração

- **README:** Arquitetura de dados atualizada (tabela SSoT `crimes_inelegibilidade`, cliente customizado Supabase, `historico_consultas`).
- **.env.example:** Inclusão de `ANALYTICS_ADMIN_TOKEN` na seção Dashboard Admin.
- **docs/guides/development.md:** Referência à tabela `crimes_inelegibilidade` e regra de sanitização (escapeHtml / textContent).
- **docs/guides/devops-manual.md:** Padronização de `.env` para `.env.local` e comentário para copiar de `.env.example`.

---

## [0.3.18] - 16/02/2026

### 📚 Documentação (Consolidação e Unificação)

- **Consolidação (mode-documentation):** Unificação e padronização de toda a documentação do projeto.
- **Índice docs/:** Inclusão de links para Auditoria Tabela Oficial, Keepalive Config (Inelegis), Troubleshooting Vercel, Deploy manual (devops-manual), e referência a SECURITY-AUDIT no índice.
- **Estrutura docs/:** Árvore atualizada no `docs/README.md` (api-reference, prd-and-scope, PLAN-INITIAL, guides, archive).
- **Versionamento:** Padronização de rodapés e versão em todos os arquivos de documentação para v0.3.18 (Hub v0.5.8).
- **Sem remoção de documentos:** Nenhum documento obsoleto removido; históricos e SECURITY-AUDIT mantidos como referência.

---

## [0.3.17] - 15/02/2026

### 🧹 Zeladoria e Performance (Leve)

- **Remoção de código morto:** Exclusão de `history-page.js` (não referenciado por nenhum HTML); atualização de `toast.js` e `src/js/README.md`.
- **Code Janitor (Prompt #20):** Remoção de `console.log` de inicialização em `script.js`.
- **Build (Vercel):** Remoção de `DISABLE_MINIFICATION` do `vercel.json` para permitir minificação em produção quando aplicável.
- **Analisador de Dispositivo:** Refatoração para uma única chamada a `getLaws()` antes do loop e verificação em paralelo via `Promise.all`, reduzindo tempo de análise quando múltiplos artigos são extraídos.
- **Documentação:** Alinhada à v0.3.17; checkpoint de sessão (Prompt #19) com bump.

---

## [0.3.16] - 15/02/2026

### 🛠️ Build & Infraestrutura (Zeladoria)

- **Fix (Build Resilience)**: Refatoração do script `build-supabase-config.js` para maior robustez, incluindo detecção de BOM, diagnóstico detalhado e suporte a `override` de variáveis de ambiente no `dotenv`.
- **Improved (DevExp)**: Sincronização din âmica da versão do projeto nos scripts de `build` e `test`, eliminando versões hardcoded e garantindo relatórios consistentes em conformidade com o `package.json`.
- **Refactor (Clean Code)**: Desacoplamento da lógica de UI com a criação do `ResultRenderer`, unificação de funções RPC no Supabase (removendo redundâncias de OID) e centralização de constantes de resultado.
- **Fix (Deploy)**: Restauração de `NEXT_PUBLIC_SUPABASE_ANON_KEY` na Vercel após remoção incorreta. **IMPORTANTE**: Frontend **sempre** precisa de credenciais Supabase. A "Arquitetura A" (Edge Functions) dispensa apenas `KEEPALIVE_TOKEN` e `SERVICE_ROLE_KEY`, mas **nunca** `NEXT_PUBLIC_*`.
- **Docs (Hub)**: Criação de `ARCHITECTURE.md` no Hub Keepalive para esclarecer diferenças entre Arquitetura A (receptor no Supabase) vs B (receptor no Next.js). Previne confusão sobre quais variáveis são necessárias em cada cenário.

### 🏛️ Banco de Dados & SSoT (Fonte Única de Verdade)

- **Consolidação da Tabela Oficial**: Reconstrução total da migration `20260121000000_tabela_oficial_completa.sql` sincronizada com as 4 páginas da tabela oficial da Corregedoria (Outubro/2024).
- **Idempotência de Banco**: Implementação de lógica de `DROP` e `RECREATE` na migration para garantir reconstruções limpas e seguras em qualquer ambiente.
- **Normalização Técnica**: Padronização global de todos os códigos de normas para MAIÚSCULAS, eliminando divergências de case-sensitive entre frontend (Validator UI) e backend (Supabase).
- **Lógica de Fallback Inteligente**: Aprimoramento da função RPC `verificar_elegibilidade` para suportar buscas hierárquicas — se um parágrafo/inciso específico não estiver mapeado, o sistema valida a inelegibilidade do Artigo Principal (caput) como camada de proteção.
- **Sincronização de Metadados**: Atualização completa de todos os snapshots de estrutura (`supabase/structure/*.json`) via **Bridge Mode** do Hub, garantindo que a documentação técnica reflita o estado atual do banco.

## [0.3.15] - 14/02/2026

### 🛡️ Segurança (Hardenização e Privacidade)

- **Eliminação de Verbose Errors**: Sanitização de todas as APIs (Vercel e Supabase) para retornar mensagens genéricas ao usuário, evitando vazamento de estrutura do banco de dados (reconnaissance prevention).
- **RLS para Dados Abertos**: Implementação do padrão `set_app_user_id` e conversão de funções SQL para `SECURITY INVOKER`, garantindo isolamento total de histórico entre usuários anônimos via Postgres RLS.
- **Segurança de Origem**: Restrição de CORS mais rígida em produção, desativando automaticamente o acesso via `localhost` fora do ambiente de desenvolvimento.

## [0.3.14] - 14/02/2026

### 🛡️ Segurança e Governança (Hardenização RLS)

- **Blindagem do Keepalive**: Implementação da migration `20260214221500_secure_keepalive_rls.sql` para remover permissões de escrita/insert da role `anon` nas tabelas de monitoramento.
- **Princípio do Menor Privilégio**: Restrição do controle total das tabelas `keepalive` e `keepalive_events` exclusivamente para a `service_role` (utilizada pela Supabase Edge Function).
- **Consistência de Dashboard**: Preservada a política de leitura pública (`SELECT`) apenas para a tabela singleton de status, garantindo que o painel administrativo frontend continue exibindo o indicador de Uptime em tempo real.

## [0.3.13] - 14/02/2026

### 📡 Monitoramento & Uptime (Hub Keepalive Pattern)

- **Desacoplamento de Infraestrutura**: Removida a lógica de heartbeat client-side (`keepaliveService.init()`) em favor do pinger 100% externo via Cloudflare Worker.
- **Higiene de Ambiente (Vercel)**: Identificadas e removidas variáveis redundantes no painel da Vercel (`KEEPALIVE_TOKEN`, etc.) para projetos que utilizam Supabase Edge Functions como receptor.
- **Clarificação de Padrão (Hub)**: Atualização da documentação centralizada do Hub para incluir uma **Árvore de Decisão**, permitindo que futuras IAs saibam quando aplicar pings via API Route (Next.js) ou Edge Functions (Vanilla/Static).
- **Zeladoria Documental**: Reescrita completa dos guias de `Keepalive Setup` e `Variáveis de Ambiente` no Inelegis para refletir a separação entre Zeladoria (Vercel) e Monitoramento (Cloudflare + Supabase).

## [0.3.12] - 13/02/2026

### 📊 Dashboard Administrativo (Refinamento)

- **Detailed Audit Modal**: Substituição do `alert()` por um Modal Premium customizado.
  - Visualização completa da fundamentação jurídica.
  - Exibição de exceções citadas, observações e metadados técnicos (ID, Timestamp).
- **Inteligência de Filtragem**:
  - Barra de filtros dinâmica no log de auditoria (por Lei, Veredicto e busca textual por Artigo/Crime).
  - Contador de registros encontrados em tempo real.
- **Otimização de Performance (Server-side Grouping)**:
  - Migração da lógica do gráfico "Top 5 Leis" para uma View SQL no Supabase (`analytics_top_leis`).
  - Redução drástica de latência e consumo de banda ao processar agrupamentos no banco de dados.
- **Centralização Jurídica (Clean Code)**:
  - Criação do utilitário `ArtigoFormatter.formatLegalDevice` para padronização de citações em todo o sistema.
  - Refatoração do dashboard para eliminação de lógica duplicada e uso de CSS variables via JavaScript helper.
- **Visual Analytics**:
  - Novo gráfico "Top 5 Leis" para identificação de tendências de consulta.
  - Aprimoramento estético dos gráficos com degradês lineares e animações de entrada (Staggered Animations).
- **Higiene Visual (Glass) e UX**:
  - Implementação de bordas luminosas nos badges e painéis de vidro.
  - Otimização de micro-transições e scrollbars customizadas para o painel administrativo.

---

## [Versões Anteriores]

As alterações das versões **v0.2.0 a v0.3.11** e **v0.1.x** foram movidas para arquivos de histórico para manter o CHANGELOG principal sob o limite de 600 linhas (Doc Auditor).

- 📂 [v0.2.0 a v0.3.11](docs/archive/CHANGELOG_V0_3_early.md)
- 📂 [v0.1.x](docs/archive/CHANGELOG_V0.md)

_Última atualização: 17/02/2026 • v0.3.21 (Hub v0.5.8)_
_Editado via: Cursor | Modelo: claude-4.6-opus | OS: Windows 11_
