# Changelog

> Navegação: [README do projeto](README.md) • [Documentação](docs/README.md)

---

Todas as alterações notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

---

## [Unreleased]

### docs

- **docs(ux-ide-actions):** `guides/development.md` atualizado para refletir a padronização visual dos botões de ação do refinamento e do card `c.c.` no estilo IDE (mesma linguagem visual para `Limpar` e `Adicionar` com destaque mais sutil).
- **docs(ux-cc-polish):** `guides/development.md` atualizado com o novo padrão visual/funcional do card `c.c.`: botão `Limpar` no topo do card, botão `Adicionar` em destaque, remoção inline por ícone de lixeira, inputs normalizados para maiúsculas e confirmação customizada para rascunho não adicionado.
- **docs(ux-cc-enter):** Atualizado `guides/development.md` com o comportamento de Enter nos campos do bloco `c.c.` e confirmação de rascunho não adicionado antes da pesquisa.
- **docs(ux-legenda):** `guides/development.md` atualizado para documentar a legenda em linha única no desktop e a nomenclatura de exibição “Revisão necessária” para o estado técnico `PENDENTE_ANALISE`.
- **docs(prompt19-checkpoint):** Revisão global de consistência documental executada (README/CHANGELOG/docs + memória de sessão), com validação automática `npm run doc:check` e coesão de governança confirmada via `check-hub-version` (Hub v0.6.1).
- **docs(ux-caput-explicito):** Atualizados os guias (`development.md`, `api-reference.md`) para refletir o novo fluxo de `Caput` explícito no refinamento principal e no bloco `c.c.`, além do resumo completo de entrada exibido no modal de resultado.
- **docs(prompt25):** Auditoria de saúde documental (Prompt 25) executada com padronização de nomenclatura no `archive` (`YYYY-MM-DD-<slug>.md`), atualização de referências e criação do guia canônico `docs/guides/documentation-conventions.md` (SSoT, nomenclatura e checklist de publicação).
- **docs(checkpoint-keepalive):** Prompt 19 executado após ajustes do Prompt 26: documentação alinhada para migração `20260226000100_keepalive_hub_compat.sql`, checklist de apply/deploy reforçado e registro de evidência de recência (ping manual com `KEEPALIVE_AGE_MIN=0` durante auditoria).
- **docs(governança):** Execução do Prompt 18 com sincronização obrigatória de `AGENTS.md` e `GEMINI.md` ao template do Hub v0.6.1, preservando regras locais de SSoT para `public/assets/js`.
- **docs(checkpoint):** Execução do Prompt 19 (sem bump) com revisão ampla de documentação: alinhamento de versões (`v0.3.27`) em PRD, API Reference, Troubleshooting e Development; auditoria final CRE consolidada em `auditoria-tabela-oficial.md` e `interpretacao-tabela-oficial.md`; atualização da memória em `.agent/memory/project-status.md`.
- **docs(v2-cc):** Atualização dos guias de migration/setup/API para incluir a RPC `verificar_elegibilidade_v2` e o fluxo de combinações condicionais (`c.c.`).
- **docs(pos-migration-00500):** Registro da execução da migration `20260225000500_verificar_elegibilidade_v2_compostas.sql` no ambiente ativo e validação final de conformidade documental.
- **docs(api-consumo):** Arquitetura de consumo atualizada para explicitar uso de `verificar_elegibilidade_v2` no fluxo composto e verificação da aplicação da migration via `supabase/structure/extract-functions.json`.
- **docs(auditoria-rpc-v2):** Nova evidência versionada em `docs/auditoria-rpc-v2-matriz.md` com matriz de 12 casos críticos (entrada/esperado/obtido) da `verificar_elegibilidade_v2`, vinculada ao índice de docs e à auditoria principal.

### feat

- **feat(rpc-v2):** Nova migration `20260225000500_verificar_elegibilidade_v2_compostas.sql` com RPC `verificar_elegibilidade_v2` para cenários compostos e condicionais da tabela CRE (ex.: CP 149-A c.c.; CP 304; Lei 2.889 art. 2º/3º; CPM 262-265; CP 129 c.c. §12; Lei 10.826 art. 16 c.c. §2º).
- **feat(frontend-cc):** Busca simples ganhou bloco avançado de dispositivos relacionados e contexto fático; frontend chama RPC v2 quando há dados de combinação, mantendo fallback para RPC base.

### fix

- **fix(frontend-ide-action-buttons):** Botões `Limpar` (refinamento e `c.c.`) unificados no mesmo padrão visual e ajuste do botão `Adicionar` para proporção menor com destaque moderado, seguindo linguagem de interface estilo IDE.
- **fix(frontend-cc-polish):** Polimento final do card `c.c.`: ajuste de contraste do input `Inciso` em dark mode, `Limpar` movido para o topo do card (padrão do refinamento), botão `Adicionar` em destaque, inputs do fluxo composto forçados para maiúsculas e remoção de item relacionado com lixeira inline junto ao texto.
- **fix(frontend-cc-confirm-modal):** Substituído `window.confirm` por modal interno padronizado ao design do sistema para confirmar pesquisa quando houver rascunho `c.c.` não adicionado.
- **fix(frontend-cc-enter):** Tecla Enter nos inputs do bloco `c.c.` agora dispara o mesmo fluxo do botão Pesquisar (quando Lei + Artigo estão selecionados), evitando perda de produtividade.
- **fix(frontend-cc-rascunho):** Antes de pesquisar, o sistema detecta preenchimento pendente no `c.c.` e pergunta se deve adicionar automaticamente o dispositivo relacionado na consulta.
- **fix(frontend-copy-inputs):** Títulos dos campos de parágrafo ajustados para `§ Parágrafo` no refinamento principal e no bloco `c.c.`.
- **fix(frontend-149a-cc):** Validação do cenário CP 149-A c.c. corrigida para aceitar entrada invertida (caput no principal + §1, II no `c.c.`), com normalização interna para a RPC v2.
- **fix(frontend-legenda):** Card “Legenda de Resultados” ajustado para exibir os quatro estados em uma única linha no desktop (com fallback responsivo para 2/1 colunas).
- **fix(frontend-copy):** Texto do estado “PENDENTE DE ANÁLISE” simplificado na interface para “REVISÃO NECESSÁRIA”, com descrição orientada a ação do usuário.
- **fix(frontend-caput-consistencia):** Reforçada consistência de `Caput` no refinamento principal e no bloco `c.c.`: ao marcar `Caput`, o campo de parágrafo é limpo/bloqueado; ao digitar parágrafo, `Caput` é desmarcado automaticamente para evitar combinações inválidas.
- **fix(frontend-acao-cc):** Botões de ação do bloco `c.c.` padronizados para estilo compacto com ícone e alinhamento à direita no desktop, mantendo resposta adaptativa no mobile.
- **fix(frontend-ux-caput):** Adicionada seleção explícita de `Caput` no refinamento principal (exclusiva com `Único`) e no bloco `c.c.`, com bloqueio/desbloqueio automático de parágrafo para reduzir ambiguidade de preenchimento.
- **fix(frontend-modal-contexto):** Modal de resultado passou a exibir a consulta informada (dispositivo principal + relacionados `c.c.` + situações marcadas), incluindo formatação correta de `caput` (sem `§ caput`).
- **fix(frontend-ux-cc-hierarquia):** Reorganizado o card `Combinação de Dispositivos (c.c.)` em blocos visuais claros (introdução, Passo 1, Passo 2 e resumo), com melhoria de contraste/legibilidade, alinhamento de checkboxes e remoção de marcador indevido na lista de relacionados.
- **fix(keepalive-compliance):** Correções de conformidade parcial do Keepalive: nova migration `20260226000100_keepalive_hub_compat.sql` para adicionar `status_code` e `response_time_ms` em `keepalive_events` (com backfill), atualização da Edge Function `supabase/functions/keepalive/index.ts` para gravar os campos novos e normalização do `KEEPALIVE_ENVIRONMENT` padrão para `prod` no worker.
- **fix(frontend-ux-cc):** Refinamento da seção de consulta composta na página de busca: linguagem simplificada (remoção de jargão "contexto fático"), instruções por passos, botão `Adicionar à combinação`, lista vazia mais explícita e layout compacto com os quatro campos relacionados na mesma linha (responsivo).
- **fix(frontend-ux-cc-contexto):** Bloco de exceções condicionais convertido para seletor expansível com ajuda contextual (`?` + tooltip por opção) e resumo pré-pesquisa em chips, incluindo remoção rápida por `x` diretamente no resumo.
- **fix(frontend-ux-cc-layout):** Separação do fluxo `c.c.` em card expansível próprio (fora do refinamento de parágrafo/inciso/alínea) e remoção do aviso textual legado de “uma consulta por vez”, reduzindo ambiguidade da interface.
- **fix(frontend-ux-cc-polish):** Padronização visual final do card `c.c.`: “Passo 1/Passo 2” com tipografia consistente, opções condicionais em grid alinhado e botões de ação com altura/largura uniformes.
- **fix(build-config):** Ajustado `scripts/build-supabase-config.js` para gerar `public/assets/js/supabase-config.js` já compatível com Prettier, evitando quebra recorrente de `format:check` após `npm run build`.
- **fix(rpc-cre):** Corrigida a RPC `verificar_elegibilidade` na migration SSoT para usar `IF FOUND` (em vez de `IS NOT NULL` em record), evitando falso “sem match” quando o registro existe e possui campos nulos (ex.: `observacoes`).
- **fix(data-cre):** Consolidação final da trilha de inelegibilidade: reparos de dados CRE e ajuste da RPC incorporados na migration base `20260225000000_crimes_inelegibilidade.sql` (removida migration de hotfix separada para setup limpo do zero).
- **fix(cre-escopo):** Removidos da migration SSoT e do banco ativo os códigos `LEI_9503_97` (CTB) e `LEI_8429_92` (Improbidade), por não constarem na tabela oficial CRE-SP (out/2024) usada como fonte de verdade da alínea “e”.
- **fix(rpc-v2-hardening):** Endurecimento da `verificar_elegibilidade_v2`: normalização defensiva de `p_paragrafo/p_inciso/p_alinea` com `TRANSLATE`, aceitação de `caput` em relacionados e restrição de exceções condicionais (CP 304, Lei 2.889 arts. 2/3 e CPM 262-265) ao escopo de caput.
- **fix(frontend-v2-normalizacao):** `validator-service` normaliza `inciso` principal para maiúsculas e converte `paragrafo=caput` em relacionados para `null`, evitando falsos `PENDENTE_ANALISE`.

### test

- **test(auditoria-profunda):** Auditoria ponta a ponta da tabela oficial (`tabela-oficial.xlsx`), migration e RPC com bateria de casos representativos CRE; identificadas divergências no banco ativo e gerado hotfix idempotente no repositório.
- **test(prompt11-v2):** Prompt 11 executado com ampliação dos testes do `validator-service` para cenários de RPC v2 (uso de `p_relacionados/p_contexto`, fallback para RPC base e normalização de `caput`), além de correção do runner assíncrono para evitar falso positivo.

## [0.3.26] - 23/02/2026

### fix

- **fix(ssot-juridico):** Ajustes na migration `20260225000000_crimes_inelegibilidade.sql` para reduzir falsos positivos/negativos: Art. 148 e 149-A marcados como padrão C (`artigo_inteiro_impeditivo=FALSE`), exceção da Lei 11.343/06 corrigida para art. 33 §3º, e tratamento explícito de exceções condicionais (CP 304; Lei 2.889 arts. 2/3).
- **fix(busca):** Normalização de artigo no frontend (`2º-A` → `2-A`, hífens unicode e espaços) em `input-validator`, com testes unitários adicionais.

### docs

- **docs(consolidacao):** Unificação de índices e metadados de documentação; remoção de documentos obsoletos em `docs/archive` (inventário e relatório antigos do doc-janitor).
- **docs(orfãos):** Tratamento dos órfãos do validator com índice em `.cursor/commands/README.md` e correção de referência para `code-reviewer.prompt.md` em `.github/prompts/README.md`.

### test

- **test:** suíte unitária e verificações de integridade executadas após os ajustes (`test:unit`, `doc:check`, `verify`).

- **fix(historico):** Frontend `search-history.js` envia para POST `/api/search-history` (API Vercel) em vez de Supabase direto, evitando 401 Unauthorized (API usa service_role).
- **fix(migration):** Migration `20260225000150_grant_rpc_anon.sql` com GRANT EXECUTE nas RPCs para anon (uso pela API Vercel).
- **docs:** auditoria-e-monitoramento, development — fluxo via API Vercel.
- **docs(consolidacao):** Unificação de documentação: devops + devops-manual → devops.md; keepalive-setup + keepalive-config-inelegis → keepalive-inelegis.md.
- **docs(arquivo):** revisao-tabela, relatorio-doc-janitor, inventario, refatoracao-v0.0.6 movidos para docs/archive/ (padrão YYYY-MM-DD).
- **docs(fix):** Paths components.js (protection, components), endpoint /api/maintenance, setup-supabase 5 migrations, project-status migration ref, troubleshooting Keepalive.
- **fix(script):** test-supabase.js usa crimes_inelegibilidade em vez de normas.

## [0.3.25] - 15/02/2026

### fix

- **fix(historico):** Função `add_to_history` na migration `20260225000100_historico_consultas.sql` expandida para aceitar e persistir `p_inciso`, `p_alinea`, `p_paragrafo`, `p_motivo_detalhado`, `p_excecoes_citadas`, `p_metadata`, alinhando migration ao payload enviado pelo frontend.
- **fix(api):** API `api/search-history.js` passa a usar RPC `add_to_history` em vez de INSERT direto; `addToHistory` e `getHistory` mapeiam todos os campos de fundamentação (inciso, alinea, paragrafo, motivoDetalhado, excecoesCitadas, metadata).

### docs

- **docs:** api-reference.md, auditoria-e-monitoramento.md e setup-supabase.md atualizados com parâmetros completos de `add_to_history` e mapeamento do histórico.

## [0.3.24] - 15/02/2026

### test

- **test(Prompt 11):** Novos testes unitários integrados ao `npm run test:unit`: `input-validator.test.js` (23 cenários), `validator-service.test.js` (11 cenários com mock RPC), `toast.test.js` e `theme-manager.test.js`. Total: 91 testes unitários.

### fix

- **fix(frontend):** Versão exibida no frontend alinhada ao package.json: badge, landing, constants.js (0.3.23 → 0.3.24), analytics, cache-bust (?v=) em HTMLs e service-worker.

### chore

- **chore(hub):** Prompt 29 — gotchas.md criado em `.agent/memory/`; seção 🎭 Modos de Operação adicionada ao AGENTS.md.
- **chore(deps):** npm audit overrides para minimizar vulnerabilidades.
- **chore(governança):** Prompt 18 (Compliance). AGENTS.md footer v0.3.24.
- **docs(keepalive):** keepalive-config-inelegis.md — Project ID `btdbfspuazgerdbmurza`.

## [0.3.23] - 20/02/2026

### fix

- **fix(rpc):** Interpretação da tabela CRE conforme uso pelos servidores do TRE. Migration `20260220100000_verificar_elegibilidade_fallback_interpretacao.sql`: artigo inteiro impeditivo (ex.: Art. 121) e dispositivo fora das exceções → INELEGIVEL; dispositivos enumerados (ex.: Art. 122 §1–7) e fora do rol → ELEGIVEL; artigo inexistente → NAO_CONSTA.
- **fix(sync):** Condicional do `sync-js.js` ajustada para executar corretamente no Windows.

### docs

- **docs:** Novo guia [interpretacao-tabela-oficial.md](docs/references/interpretacao-tabela-oficial.md) documenta os padrões artigo inteiro vs dispositivos enumerados.
- **docs:** [migrations-status.md](docs/guides/migrations-status.md) — seção "Para replicar do zero", lista ordenada das 13 migrations, seção "Migrations logicamente obsoletas" (não excluir).
- **docs:** [setup-supabase.md](docs/guides/setup-supabase.md) — estrutura do banco atualizada (crimes_inelegibilidade SSoT); instrução de que todas as 13 migrations são obrigatórias.
- **docs:** [supabase/migrations/README.md](supabase/migrations/README.md) — guia rápido para replicar.

## [0.3.22] - 15/02/2026

### fix(verificação)

- **fix(rpc):** Match exato apenas na `verificar_elegibilidade`. Sem match e artigo com dispositivos impeditivos → ELEGIVEL com aviso ("combinação exata que produz inelegibilidade; verifique na sentença"). Sem match e artigo inexistente → NAO_CONSTA. Correção ORDER BY NULLS LAST para priorizar match exato de §/inciso (ex.: Art. 121 §3º retorna ELEGIVEL corretamente). Verificação completa: 54 exceções, 390 impeditivos, artigos específicos (148, 129, 149-A).
- **fix(rpc):** Formatação de `excecoes_artigo`: usar § em vez de "Par."; "parágrafo único" por extenso quando for parágrafo único; remover observações (tipo de crime) — exibir apenas o dispositivo conforme a tabela.
- **fix(ui):** Revertido: o aviso "Atenção: Exceções Existentes" volta a ser exibido sempre que houver `excecoes_artigo` (até a tabela estar 100% validada).
- **fix(rpc):** Match estrito para §/inciso/alínea: quando o usuário informa um dispositivo inexistente (ex.: Art. 122 § 8), não fazer fallback para o caput. Retorna fluxo "sem match" (ELEGIVEL com aviso ou NAO_CONSTA conforme o artigo).

### docs

- **docs:** Novo guia [hub-access-token-ci.md](docs/guides/hub-access-token-ci.md) — configuração de `HUB_ACCESS_TOKEN` no GitHub e em outros satélites; índice em docs/README e referência em variaveis-ambiente.
- **docs:** Novo guia [migrations-status.md](docs/guides/migrations-status.md) — status das migrations locais vs Supabase e como conferir se estão aplicadas.
- **docs:** Novo guia [ci-variaveis-github.md](docs/guides/ci-variaveis-github.md) — referência detalhada das variáveis do CI: HUB*ACCESS_TOKEN, NEXT_PUBLIC_SUPABASE*\*, por que cada uma é usada (com referência ao código), padrão do Hub vs Inelegis e uso de placeholders. Links em docs/README, variaveis-ambiente, hub-access-token-ci e devops.

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
- **Estrutura docs/:** Árvore atualizada no `docs/README.md` (api-reference, prd-and-scope, plan-initial, guides, archive).
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

- 📂 [v0.2.0 a v0.3.11](docs/archive/2026-02-23-release-history-v0-3-early.md)
- 📂 [v0.1.x](docs/archive/2026-02-23-release-history-v0.md)

_Última atualização: 24/02/2026 • v0.3.27 (Hub v0.6.1)_
_Editado via: Codex CLI | Modelo: GPT-5 | OS: Windows 11_
