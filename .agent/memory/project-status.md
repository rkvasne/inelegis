# 📊 Project Status & Context

> **Last Updated:** 03/03/2026
> **Current Phase:** Testes com usuários reais / Zeladoria
> **Project Version:** v0.3.28 (SSoT Synchronized)

## 🎯 Objetivos Concluídos (Sessão 15/02/2026 – Histórico Expandido)

- [x] **fix(historico):** Migration `20260225000100_historico_consultas.sql` — função `add_to_history` expandida para 12 parâmetros (inciso, alinea, paragrafo, motivo_detalhado, excecoes_citadas, metadata). API `api/search-history.js` passou a usar RPC em vez de INSERT direto; mapeamento completo em getHistory/addToHistory. Frontend `search-history.js` mapeia todos os campos no fetch.
- [x] **docs:** api-reference, auditoria-e-monitoramento, migrations-status e setup-supabase atualizados.
- [x] **v0.3.25 (Prompt #19 com bump):** CHANGELOG, sync:version, cache-bust (HTML), constants, analytics, components, project-status.

## 🎯 Objetivos Concluídos (Sessão 15/02/2026 – RPC Match Exato)

- [x] **fix(rpc) verificar_elegibilidade:** Match exato apenas. Sem match e artigo com dispositivos impeditivos → ELEGIVEL com aviso em `mensagem` (ex.: Art. 148 sem §). Correção ORDER BY NULLS LAST para priorizar dispositivo exato (ex.: Art. 121 § 3º retorna ELEGIVEL corretamente). Formatação de `excecoes_artigo`: § em vez de "Par."; "parágrafo único" por extenso; sem observações. Migration `20260215000000_verificar_elegibilidade_fallback_hierarquico.sql`.
- [x] **Documentação:** api-reference.md, development.md e auditoria-tabela-oficial.md atualizados com nova lógica da RPC.
- [x] **Verificação:** 54 exceções, 390 impeditivos validados; testes unitários e verify OK.

## 🎯 Objetivos Concluídos (Sessão 15/02/2026 – Checkpoint)

- [x] **UX (Exceção + Modal unificado):** Exceção explícita em consulta simples e análise por extração; ResultRenderer como único exibidor de resultados; página Sobre e badges atualizados para v0.3.20.
- [x] **Compliance (Prompt 18):** Execução do Prompt 18; correção de links `prompts-library` → `prompts` em AGENTS.md e GEMINI.md; formatação Prettier (supabase-config, core-utils); validador de proteção do Hub e verify OK.
- [x] **Segurança XSS (Sanitização):** Implementação de escape HTML em todas as UIs que interpolam dados do banco/usuário: `analyzer-ui.js`, `result-renderer.js`, `dashboard-ui.js`; novo utilitário `escape-html.js` para módulos ES.
- [x] **Documentação e Config:** README (arquitetura de dados), `.env.example` (ANALYTICS_ADMIN_TOKEN), `development.md` (tabela e sanitização), `devops-manual.md` (.env.local). CHANGELOG [Unreleased] atualizado.
- [x] **Validações:** Testes, verify, lint e doc:check executados com sucesso (Prompt 19 – sem bump).

## 🎯 Objetivos Concluídos (Sessão 15/02/2026)

- [x] **Resiliência de Build v0.3.16**: Correção técnica no script de configuração do Supabase com diagnósticos avançados e sincronização dinâmica de versão em todos os relatórios (Build/Test).
- [x] **Refatoração Clean Code v0.3.16**: Desacoplamento da UI via `ResultRenderer` e unificação de funções RPC no Supabase, eliminando débito técnico e OIDs duplicados.
- [x] **Consolidação SSoT v0.3.16 → v0.3.25**: Migration `20260225000000_crimes_inelegibilidade.sql` (tabela única `crimes_inelegibilidade`) sincronizada com a tabela oficial da Corregedoria (Outubro/2024). Substitui o schema anterior (normas, artigos_inelegiveis, artigos_excecoes).
- [x] **Normalização Técnica**: Padronização global de códigos de normas para MAIÚSCULAS no banco de dados, eliminando erros de case-sensitivity.
- [x] **Lógica de Fallback de Elegibilidade**: Aprimoramento da função RPC para validar o artigo principal (caput) caso parágrafos específicos não estejam mapeados individualmente.
- [x] **Zeladoria de Estrutura**: Regeneração completa dos metadados técnicos em `supabase/structure/` via Bridge Mode do Hub.
- [x] **v0.3.18 (Docs):** Consolidação e unificação da documentação (mode-documentation): índice docs/ ampliado, estrutura padronizada, rodapés e versão v0.3.18 em todos os docs.
- [x] **v0.3.17 (Checkpoint + Bump):** Remoção de `history-page.js` (código morto), Code Janitor (console.log), remoção de DISABLE_MINIFICATION no vercel.json, Analisador com getLaws único e Promise.all. Documentação e memória atualizadas.

## 🎯 Objetivos Concluídos (Sessão 14/02/2026)

- [x] **Padronização Global v0.3.15**: Sincronização completa de versão em toda a base de código, documentação (GitHub e Hub), landing pages e parâmetros de cache-busting.
- [x] **Resiliência Keepalive**: Diagnóstico e resolução de erro 401 (Unauthorized) no Cloudflare Trigger via deploy de Edge Function robusta com logging granular.
- [x] **Privacidade v0.3.15:** Implementado isolamento de dados RLS para usuários anônimos e sanitização global de mensagens de erro técnico em todas as APIs.
- [x] **Segurança Keepalive v0.3.14:** Blindagem RLS das tabelas de monitoramento concluída. Acesso de escrita bloqueado para a role `anon`.
- [x] **Integridade SSoT:** Regeneração dos manifestos de estrutura Supabase (`db:extract`) para refletir o estado atômico atual do banco de dados.

## 🎯 Objetivos Concluídos (Sessão 13/02/2026)

- [x] **Blindagem de Governança**: Implementação de Husky pre-commit hooks, correção de CSP para CDNs e limpeza de cores hardcoded (Theme Linter Compliance).
- [x] **Estabilidade de Infraestrutura (Hub Bridge)**: Resolução de bloqueio técnico no servidor MCP e restauração de acesso a skills.
- [x] **Zeladoria Técnica (Code Janitor)**: Execução de limpeza técnica (Prompt #20), migração de logs e JSDoc em métodos estruturais.

---

## 🏗️ Arquitetura Atual

- **Frontend:** HTML5, CSS3 (Utilidades Custom), Vanilla JavaScript (Módulos ES6).
- **Backend/Database:** Supabase (Schema V2) + RPC functions + RLS Isolation.
- **Monitoring:** Hub Keepalive Pattern (Cloudflare Workers -> Supabase Edge Functions).
- **Audit/History:** Sistema de histórico detalhado com fundamentação jurídica e isolamento por sessão.
- **QA:** Puppeteer (E2E), Custom Test Runner, 100% Success Rate.

## 🔄 Tarefas em Aberto (Próximos Passos)

1. Acompanhar feedback de testes com usuários reais (fase atual).
2. Refinamento contínuo das políticas de segurança e sanitização.

## ⚠️ Riscos e Bloqueios

- **Puppeteer Headless:** Monitorar estabilidade de timeouts em ambiente Windows/CI.

---

**Log de Governança/Sessão:**

- 03/03/2026: **Prompt 19 (checkpoint sem bump) — encerramento da sessão atual:** documentação e memória local sincronizadas após normalização das inconsistências (`satellite-risk-catalog` e task dashboard), com rastreabilidade registrada em `CHANGELOG [Unreleased]` e status preparado para persistência Git.

- 03/03/2026: **Normalização de inconsistências documentais da memória local:** corrigidas duas divergências de estado nesta sessão — (1) `satellite-risk-catalog.md` deixou de estar sem avaliação registrada e passou a conter entrada formal da rodada (status, mitigação, rollback e evidências), e (2) `task-dashboard-v0-3-12-refinement.md` foi alinhada ao `status: completed` com checklist final marcado como concluído.

- 03/03/2026: **Pacote de pendências documentadas (auditoria + correção local):** varredura de pendências documentadas concluída; aplicada correção local de conformidade Keepalive via migration `20260303000100_keepalive_events_rls_service_only.sql` (remove políticas legadas de leitura em `keepalive_events` e restringe acesso a `service_role`). Documentação sincronizada (`migrations-status`, `setup-supabase`, `supabase/migrations/README`) para trilha 1-13; `.env.example` ajustado para refletir receptor ativo em Supabase Edge Function (sem legado `/api/keepalive` na Vercel). Validação local executada com `npm run verify`.

- 03/03/2026: **Prompt 19 (checkpoint sem bump) — fechamento de governança e persistência Git:** consolidadas mudanças não commitadas da rodada (sync de prompts para Hub v0.6.2, ajustes de docs/ambiente e refino do worker keepalive). Auditoria de compliance reexecutada com correção crítica no `.gitignore` (`supabase/structure/`), validações `check-hub-version`, `validator-hub-protection`, `format:check` e `build` concluídas com sucesso, e sessão preparada para commit/push atômico.

- 25/02/2026: **Prompt 19 (checkpoint sem bump) — fechamento para persistência git:** sessão consolidada com validações finais verdes (`npm run verify`, `npm run test:all`, `npm run doc:check`, `npm run format:check`, `npm run check`) e coesão de governança confirmada via `node .agent/hub/system/scripts/check-hub-version.js` (Hub v0.6.1). Alterações preparadas para commit/push atômico.
- 25/02/2026: **Prompt 19 (checkpoint sem bump) — saneamento documental:** `CHANGELOG.md` reestruturado para consistência de versionamento (`Unreleased`, `0.3.28`, `0.3.27`), remoção de duplicidade de entrada de checkpoint e normalização da seção quebrada em `0.3.26` (`fix/docs complementares`), mantendo rastreabilidade histórica.
- 25/02/2026: **Prompt 19 (checkpoint com bump) — versão v0.3.28:** bump patch aplicado (`0.3.27` -> `0.3.28`) com `npm version patch --no-git-tag-version` + `npm run sync:version`; documentação e assinaturas sincronizadas em toda a base, com checkpoint de memória consolidado.
- 25/02/2026: **Prompt 19 (checkpoint sem bump) — persistência de memória da sessão:** memória operacional confirmada e mantida em `.agent/memory/project-status.md` com padrão Hub para `tasks/`; checkpoint executado com validações de documentação e governança para manter rastreabilidade da rodada atual.
- 26/02/2026: **Prompt 19 (checkpoint sem bump) — memória alinhada ao Hub:** documentação de memória atualizada para padrão Hub (`tasks/` como repositório permanente de planos, sem arquivamento local), task consolidada em `.agent/memory/tasks/task-dashboard-v0-3-12-refinement.md`, `CHANGELOG.md` ajustado para refletir o padrão final. Validações executadas: `npm run doc:check` (46 docs, íntegro) e `check-hub-version` (v0.6.1, OK).
- 26/02/2026: **Padronização da memória com Hub (tasks):** revertida a política local de arquivamento em `.agent/memory/archive/tasks/`; task histórica retornada para `.agent/memory/tasks/task-dashboard-v0-3-12-refinement.md`; `tasks/README.md` alinhado ao padrão Hub (`task-*` e permanência em `tasks/`).
- 26/02/2026: **Prompt 19 (checkpoint sem bump) — fechamento final da rodada:** documentação consolidada com novo SSoT de arquitetura (`docs/architecture-and-adr.md`), índice de docs atualizado, validações de doc/format/verify verdes e coesão com Hub confirmada (`check-hub-version` OK). Na memória, task concluída `v0.3.12-dashboard-refinement` foi arquivada em `.agent/memory/archive/tasks/` e `tasks/README.md` criado para separar tarefas ativas de histórico.
- 26/02/2026: **Higiene de memória (tasks):** task concluída `v0.3.12-dashboard-refinement` movida de `.agent/memory/tasks/` para `.agent/memory/archive/tasks/2026-02-13-v0-3-12-dashboard-refinement.md` para manter `tasks/` focada apenas em trabalho ativo.
- 25/02/2026: **Prompt 19 (checkpoint sem bump) — hotfix de normalização na camada de banco:** aplicada a migration `20260226000200_hotfix_verificar_elegibilidade_normalizacao_paragrafo.sql` para normalizar `p_paragrafo` dentro da `verificar_elegibilidade` (`caput`/`cap` -> `NULL`; `único/unico` -> `unico`; remoção de símbolos/acentos), reduzindo falsos resultados em chamadas diretas ao Supabase. Frontend alinhado (`validator-service`, `input-validator`, `validator-ui`) com testes de regressão adicionais e suíte `test:unit` verde. Estrutura do banco reextraída via `npm run db:extract` e documentação sincronizada (`README`, `CHANGELOG`, `api-reference`, guias de setup/migrations).
- 25/02/2026: **Prompt 19 (checkpoint sem bump) — acentuação final de placeholder:** placeholder do `§ Parágrafo` no bloco `c.c.` ajustado para `Ex: 1 ou único`; documentação e memória sincronizadas para encerramento da sessão.
- 24/02/2026: **Prompt 19 (checkpoint sem bump) — placeholder legível em campos uppercase:** ajustado o comportamento de inputs normalizados em maiúsculas para manter placeholders em formato normal, com conversão aplicada apenas ao texto digitado.
- 24/02/2026: **Prompt 19 (checkpoint sem bump) — alinhamento dos botões `Limpar`:** botão `Limpar` do card de refinamento ajustado para o mesmo padrão de altura/alinhamento do botão `Limpar` no card `c.c.`, eliminando diferença visual entre os cabeçalhos expansíveis.
- 24/02/2026: **Prompt 19 (checkpoint sem bump) — legibilidade do botão `Adicionar`:** ajustado contraste no dark mode para o estado desabilitado, preservando sinal de inatividade sem apagar o texto. Documentação sincronizada em `CHANGELOG.md` e `docs/guides/development.md`.
- 24/02/2026: **Prompt 19 (checkpoint sem bump) — fix region persistence:** Atualizada a Edge Function `keepalive` para persistir o campo `region` (vindo do payload do Cloudflare Worker) na tabela singleton de status (`keepalive`), corrigindo a exibição de "global" no dashboard central Keepvasne.
- 24/02/2026: **Prompt 19 (checkpoint sem bump) — padronização visual estilo IDE:** refinado o visual dos botões de ação nos cards de refinamento e `c.c.` para um padrão único (compacto, borda discreta e hover leve), com `Adicionar` reduzido e com destaque moderado. Documentação sincronizada em `CHANGELOG.md` e `docs/guides/development.md`; validações de checkpoint executadas na sequência.
- 24/02/2026: **Prompt 19 (checkpoint sem bump) — documentação + UX c.c. polida:** documentação atualizada para refletir o polimento final do card `c.c.` (contraste do `Inciso` no dark mode, botão `Limpar` no topo do card, botão `Adicionar` em destaque, inputs em maiúsculas, remoção inline com lixeira e confirmação customizada para rascunho pendente sem `window.confirm`). Validações executadas com sucesso: `npm run doc:check` (Doc Auditor íntegro) e `node .agent/hub/system/scripts/check-hub-version.js` (satélite coeso com Hub v0.6.1).
- 24/02/2026: **Prompt 19 (checkpoint sem bump) — fluxo c.c. mais seguro:** inputs de parágrafo exibem `§ Parágrafo`; tecla Enter nos campos do bloco `c.c.` passa a acionar pesquisa; inclusão de confirmação de rascunho não adicionado no `c.c.` antes da consulta; correção da validação CP 149-A c.c. para aceitar preenchimento invertido (caput no principal + §1, II no `c.c.`) com normalização interna para RPC v2.
- 24/02/2026: **Prompt 19 (checkpoint sem bump) — UX de consulta refinada:** ajuste de consistência para `Caput` no refinamento principal e no bloco `c.c.` (bloqueio/limpeza de parágrafo quando `Caput` ativo e desmarcação automática de `Caput` ao digitar parágrafo), padronização dos botões de ação do `c.c.` no estilo compacto com ícone/alinhamento à direita e melhoria da legenda de resultados (4 cards em linha no desktop). Terminologia da UI atualizada de “Pendente de análise” para “Revisão necessária”, mantendo o código de domínio `PENDENTE_ANALISE` no backend.
- 24/02/2026: **Prompt 19 (checkpoint sem bump) — atualização documental completa:** revisão de consistência de `README.md`, `CHANGELOG.md` e guias em `docs/`; atualização do changelog em `Unreleased` para registrar checkpoint; validações executadas com sucesso: `npm run doc:check` e `node .agent/hub/system/scripts/check-hub-version.js` (satélite coeso com Hub v0.6.1). Mantido escopo local sem alterações em `.agent/hub/`.
- 23/02/2026: **Prompt 19 (checkpoint sem bump) + UX caput explícito:** implementada seleção explícita de `Caput` também no refinamento principal (exclusiva com `Único`) e no bloco `c.c.`; adicionadas validações orientativas para o caso CP 149-A combinado; modal de resultado atualizado para exibir o resumo completo da entrada (principal + relacionados + situações marcadas) com formatação correta de `caput`. Arquivos: `public/consulta.html`, `public/styles/styles.css`, `src/js/ui/validator-ui.js`, `src/js/ui/result-renderer.js`, `tests/result-renderer.test.js` + sync em `public/assets/js`. Validações: `lint`, `test:unit`, `test`, `sync:js` OK.
- 23/02/2026: **Padronização Hub-First (documentação e nomenclatura):** execução orientada por personas `mode-documentation`, `mode-quality` e `mode-orchestrator` (via Junction `.agent/hub`), com varredura completa e ajustes de nomenclatura para kebab-case em documentos legados (`docs/plan-initial.md`) e padrão de archive `YYYY-MM-DD-<slug>.md` (`docs/archive/2026-02-23-release-history-v0.md`, `docs/archive/2026-02-23-release-history-v0-3-early.md`), além de atualização de referências cruzadas em `docs/README.md` e `CHANGELOG.md`. Validações: `doc:check`, `format:check`, `verify` e `check-hub-version` (100% conforme Hub v0.6.1).
- 23/02/2026: **Prompt 19 (checkpoint sem bump) + ajuste final de UX c.c.:** card `Combinação de Dispositivos` reorganizado com hierarquia visual por blocos (introdução, Passo 1, Passo 2 e resumo), melhoria de contraste e alinhamento de opções condicionais, padronização de espaçamento e correção da lista de relacionados sem marcador visual indevido (`public/consulta.html`, `public/styles/styles.css`). Validações executadas: `npm run lint` e `npm run test` (13/13).
- 23/02/2026: **Prompt 19 (checkpoint sem bump) pós-Prompt 26:** documentação consolidada para correção de compliance keepalive (migration `20260226000100_keepalive_hub_compat.sql`, atualização de guias de setup/migrations/keepalive e remoção de referências não portáveis em `docs/README.md`), com registro operacional da auditoria: ping manual validado e recência normalizada (`KEEPALIVE_AGE_MIN=0` no momento do teste).
- 23/02/2026: **Polimento visual do card c.c. (frontend):** refinado o bloco de combinação para legibilidade operacional (passos com padrão único, checkboxes em grid alinhado, textos ajustados e botões “Adicionar à combinação / Limpar lista” com dimensões padronizadas).
- 23/02/2026: **UX busca composta (ajuste estrutural):** separação do bloco `c.c.` para um expansível independente do refinamento de busca e remoção do aviso legado "uma consulta por vez", para manter coerência com a implementação atual de dispositivos relacionados.
- 23/02/2026: **Prompt 26 (Keepalive Compliance) + correções aplicadas:** ajuste técnico para compliance parcial do Hub Keepalive no repositório com migration `20260226000100_keepalive_hub_compat.sql` (`status_code`/`response_time_ms` em `keepalive_events`, com backfill retrocompatível), atualização da Edge Function `supabase/functions/keepalive/index.ts` para persistir os campos novos e respeitar `project_slug/environment` do payload, e normalização do fallback de ambiente em `scripts/keepalive-worker.js` para `prod`. Executado ping manual no receptor para normalizar recência de eventos (`KEEPALIVE_AGE_MIN=0`).
- 23/02/2026: **Prompt 19 (checkpoint sem bump) + UX avançada c.c.:** refinamento adicional da busca composta com bloco de exceções condicionais em formato expansível, microajuda contextual por opção (`?` com tooltip de exemplo prático) e resumo pré-pesquisa em chips, incluindo ação de desmarcar por `x` direto no resumo (`public/consulta.html`, `public/styles/styles.css`, `src/js/ui/validator-ui.js` + sync).
- 23/02/2026: **Prompt 19 (checkpoint sem bump) + UX busca composta:** melhoria de clareza na `public/consulta.html` para reduzir ambiguidade do fluxo c.c. (troca de "contexto fático" por "situação do caso", microcopy orientada por passos, botão "Adicionar à combinação" e mensagem de lista vazia mais explícita), além de ajuste de layout responsivo para manter `Artigo relacionado`, `Parágrafo`, `Inciso` e `Alínea` na mesma linha em desktop (`public/styles/styles.css`, `src/js/ui/validator-ui.js` + sync para `public/assets/js/ui/validator-ui.js`). Validações Prompt 19 executadas.
- 23/02/2026: **Prompt 19 (checkpoint sem bump) + documentação integral da v2:** consolidação final da documentação da nova consulta composta com criação de `docs/auditoria-rpc-v2-matriz.md` (12 casos críticos, 12/12 conformes), referência cruzada no índice (`docs/README.md`) e na auditoria principal (`docs/auditoria-tabela-oficial.md`), mantendo governança Hub coesa (`check-hub-version` OK).
- 23/02/2026: **Prompt 19 (checkpoint sem bump) + hardening v2:** revisão em modo code review da nova versão de consulta (RPC composta), com correções de robustez em `20260225000500_verificar_elegibilidade_v2_compostas.sql` (normalização defensiva e restrição de regras condicionais ao caput), alinhamento de normalização no `validator-service`, atualização de documentação (`api-reference` e `CHANGELOG`) e validação por extração (`supabase/structure/extract-functions.json`) confirmando migration 00500 aplicada no banco. Testes: `test:unit`, `format:check` e `db:extract` OK.
- 23/02/2026: **Prompt 19 (checkpoint sem bump) pós-migration 00500:** documentação atualizada para refletir execução da `20260225000500_verificar_elegibilidade_v2_compostas.sql`; auditoria final consolidada com cobertura de regras compostas/condicionais na RPC v2; memória de sessão revisada e health check do Hub (`check-hub-version`) validado como coeso (v0.6.1).
- 23/02/2026: **Prompt 19 (checkpoint sem bump) + atualização global de docs:** revisão e harmonização de documentação operacional para `v0.3.26` (PRD, API Reference, Troubleshooting Vercel e Development), consolidação da auditoria final CRE (remoção de CTB/Improbidade da base ativa e referência explícita às 4 páginas da tabela oficial), regeneração de `supabase/structure` com `db:extract` e validações completas (`format:check`, `doc:check`, `verify`). Hub Health: `check-hub-version` OK (coeso com v0.6.1).
- 23/02/2026: **Auditoria profunda CRE (frontend+backend+docs+DB):** Validação da planilha oficial `tabela-oficial.xlsx` contra migration/RPC e bateria de casos representativos via Supabase RPC. Encontradas divergências no banco ativo (Lei 11.343/06 art. 33 caput como exceção; Lei 2.889/56 arts. 2/3 caput como exceção) e bug de fluxo da RPC com `record IS NOT NULL` quando há campos nulos. Correções consolidadas na migration SSoT `20260225000000_crimes_inelegibilidade.sql` (dados + RPC com `IF FOUND`), mantendo `historico_consultas`, `analytics` e `keepalive` em migrations separadas.
- 23/02/2026: **Conferência extraídos vs PDF CRE:** comparação de `supabase/structure/*.json` com `tabela-oficial.xlsx` e regras de interpretação. Ajuste necessário aplicado: remoção de `LEI_9503_97` e `LEI_8429_92` da migration SSoT e limpeza no banco ativo (service role). Pós-ajuste: 33 códigos CRE e bateria crítica RPC 10/10 OK.
- 23/02/2026: **Prompt 18 (compliance/governança):** AGENTS.md e GEMINI.md sincronizados com template Hub v0.6.1; regra local de SSoT para `public/assets/js` preservada no AGENTS local. Corrigido gerador `build-supabase-config.js` para emitir `supabase-config.js` conforme Prettier e evitar falha de `format:check` após build. Validações: `check-hub-version`, `validator-hub-protection`, `format:check` e `build` OK.
- 23/02/2026: **v0.3.26 (docs + governança):** Tratamento de órfãos do validator (`.cursor/commands` e `.github/prompts`), consolidação de documentação (remoção de obsoletos no archive), bump patch 0.3.25→0.3.26 com `sync:version`, changelog atualizado e validações completas (`doc:check`, `test:unit`, `verify`).
- 23/02/2026: **Prompt 25 + alinhamento completo + Prompt 19 (sem bump):** revisão integral da tabela oficial x migration; correções SSoT na `20260225000000_crimes_inelegibilidade.sql` (padrões combinados 148/149-A, exceção Lei 11.343 art. 33 §3º, exceções condicionais CP 304 e Lei 2.889); normalização de artigo no frontend (`2º-A`→`2-A`) com testes; auditoria/atualização de docs (api-reference, auditoria, interpretação, PRD, plano inicial, assinaturas); `doc:check`, `test:unit` e `verify` executados com sucesso.
- 21/02/2026: **docs(consolidacao + Prompt 19):** Unificação de docs (devops, keepalive), arquivamento (revisao-tabela, relatorio-doc-janitor, inventario, refatoracao), correções (paths components, endpoint maintenance, setup 5 migrations, test-supabase crimes_inelegibilidade). CHANGELOG [Unreleased], project-status, verify OK.
- 20/02/2026: **fix(401 historico):** Frontend search-history usa POST /api/search-history (API Vercel com service_role) em vez de Supabase direto; migration 00150; docs atualizados. Commit e push.
- 15/02/2026: **Prompt #19 (checkpoint sem bump):** Docs pendentes: supabase/migrations/README (4 migrations), api-reference (payload search expandido), api/README (tabelas SSoT), development (search-history 12 params). CHANGELOG [Unreleased].
- 15/02/2026: **v0.3.25 (Prompt #19 com bump):** fix(historico) add_to_history expandido (12 params), API usa RPC, docs atualizados. Bump 0.3.24 → 0.3.25.
- 15/02/2026: **v0.3.24 (Prompt #19 com bump):** Bump 0.3.23 → 0.3.24. Testes (91 cenários), fix versão frontend (badges, constants, analytics, cache-bust), Prompt 29 (gotchas, Modos). CHANGELOG, sync:version, sobre.html. IA Health: Hub v0.5.9 — rodar Prompt 23 para atualizar governança.
- 15/02/2026: **Prompt #19 (checkpoint sem bump):** Testes (Prompt 11) ampliados: input-validator.test.js (23), validator-service.test.js (11 com mock RPC), toast e theme-manager integrados ao test:unit. Total: 91 testes unitários. Docs: CHANGELOG [Unreleased], development.md, sobre.html (v0.3.23). Commit e push.
- 20/02/2026: **v0.3.23 (Prompt #19 com bump):** Interpretação da tabela CRE aplicada (Art. 121 §8 → INELEGIVEL; Art. 122 §8 → ELEGIVEL). Docs: interpretacao-tabela-oficial, migrations-status (obsoletas, setup), setup-supabase (estrutura, 13 migrations obrigatórias). sync-js fix Windows. Bump 0.3.22 → 0.3.23.
- 20/02/2026: **fix(rpc + ui):** Migration `20260220000000_verificar_elegibilidade_dispositivo_inexistente.sql` aplicada. Dispositivo inexistente (ex.: Art. 121 § 8) retorna NAO_CONSTA. Análise de Dispositivo exibe badge "NÃO ENCONTRADO". Docs: migrations-status, api-reference, development, auditoria; CHANGELOG [Unreleased]; sync-js fix para Windows. Prompt 19 (checkpoint sem bump).
- 15/02/2026: **Prompt #19 (checkpoint sem bump):** Doc keepalive-config-inelegis — Project ID `btdbfspuazgerdbmurza` aplicado em URLs (Vercel, Cloudflare, Supabase). CHANGELOG [Unreleased], project-status. Commit e push.
- 15/02/2026: **Prompt #19 (checkpoint sem bump):** Code Janitor (Prompt #20) — JSDoc em escape-html.js, varredura higiene OK (sem dead code, sem imports órfãos); formatação e sync JS. CHANGELOG [Unreleased], project-status. Commit e push.
- 20/02/2026: **Prompt #19 (checkpoint sem bump):** npm audit overrides (minimatch, html-validate/ajv) para reduzir vulnerabilidades; Prompt 18 (Compliance) com AGENTS.md atualizado; CHANGELOG [Unreleased] e project-status. Commit e push.
- 15/02/2026: **v0.3.22 (Prompt #19 com bump):** Bump 0.3.21 → 0.3.22. Docs ci-variaveis-github.md, hub-access-token-ci.md, migrations-status.md; variaveis-ambiente, devops e docs/README atualizados. CHANGELOG consolidado, project-status e commit/push.
- 15/02/2026: **Prompt #19 (checkpoint):** Match estrito RPC (Art. 122 § 8 sem fallback para caput); revert do alerta de exceções (sempre exibir até tabela 100%); migration aplicada via MCP Supabase. Docs: hub-access-token-ci.md, migrations-status.md; variaveis-ambiente e docs/README atualizados. IA Health (check-hub-version) e git push.
- 15/02/2026: **v0.3.21 (Prompt #19):** fix(rpc) verificar_elegibilidade – match exato, ELEGIVEL com aviso, ORDER BY NULLS LAST. Formatação excecoes_artigo (§, parágrafo único, sem observações). Docs e CHANGELOG atualizados.
- 16/02/2026: **v0.3.20 (Prompt #19 com bump):** Exceção explícita, modal unificado (ResultRenderer), testes result-renderer (14 cenários), governança Prompt 18. Bump 0.3.19 → 0.3.20, docs e validadores atualizados.
- 15/02/2026: **v0.3.19 (Prompt #19 sem bump):** Exceção explícita (consulta simples + extração), modal unificado (ResultRenderer único), docs e Sobre atualizados para v0.3.19. Checkpoint sem bump.
- 15/02/2026: **v0.3.19 (Prompt #19 com bump):** Sanitização XSS (escape-html.js + analyzer/result-renderer/dashboard-ui), docs e config atualizados (README, .env.example, development, devops-manual), CHANGELOG [Unreleased]. Commit e push sem bump.
- 16/02/2026: **v0.3.18 (Documentação):** Consolidação e unificação de docs (mode-documentation), padronização de versão e rodapés, índice e estrutura docs/ atualizados.
- 15/02/2026: **Checkpoint v0.3.17 (Prompt #19 com bump):** Zeladoria (history-page removido, Code Janitor), performance leve (Analisador em paralelo, vercel minificação), docs e memória atualizados.
- 15/02/2026: **Compliance Prompt #18**: AGENTS.md e GEMINI.md atualizados para Hub v0.5.8. Validador de proteção OK.
- 15/02/2026 (01:33): **Hub Junction Reconectada**: Re-estabelecida conexão com `E:\Agents` via Junction após submodule git estar vazio.
- 15/02/2026: **Consolidação SSoT v0.3.16**: Sincronização total com a tabela oficial (Outubro/2024), normalização de case no banco e fallback de elegibilidade.
- 14/02/2026: **Padronização v0.3.15**: Sincronização de versão e correção crítica do sistema de Keepalive (Erro 401) e Privacidade RLS.
- 13/02/2026: Zeladoria Técnica e Estabilidade de Infraestrutura (Hub Bridge).
- 12/02/2026: Implementação do Hub Keepalive Pattern e Dashboard Administrativo v1.

---

_Última atualização: 03/03/2026 • v0.3.28 (Hub v0.6.2)_
_Editado via: Copilot (VS Code) | Modelo: GPT-5.3-Codex | OS: Windows 11_
