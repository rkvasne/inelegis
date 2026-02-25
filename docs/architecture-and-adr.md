# Arquitetura e ADR — Inelegis

> Documento canônico da arquitetura técnica do projeto e registro consolidado das principais decisões arquiteturais (ADRs).

**Fase:** Arquitetura (referência contínua)  
**Versão do Projeto:** v0.3.27

---

## 1. Visão de Arquitetura

O Inelegis é uma aplicação web estática com frontend em Vanilla JS e backend de dados no Supabase. A lógica jurídica crítica de elegibilidade é executada no banco por RPCs versionadas.

### Princípios arquiteturais

- SSoT de código JS: `src/js/` (distribuição gerada em `public/assets/js/`).
- SSoT jurídico: tabela `crimes_inelegibilidade` + RPCs no Supabase.
- Hub-first para governança: `.agent/hub/` apenas leitura.
- Segurança por padrão: RLS, sanitização de saída e segregação de chaves.

---

## 2. Camadas e Responsabilidades

| Camada                   | Responsabilidade                              | Artefatos principais                                                                       |
| ------------------------ | --------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Interface                | Coleta de entrada e renderização de resultado | `public/consulta.html`, `src/js/ui/validator-ui.js`, `src/js/ui/result-renderer.js`        |
| Serviço Frontend         | Orquestra RPCs e normalização de payload      | `src/js/services/validator-service.js`                                                     |
| Domínio Jurídico (DB)    | Regras de elegibilidade e exceções            | `supabase/migrations/*.sql`, RPCs `verificar_elegibilidade` e `verificar_elegibilidade_v2` |
| Persistência Operacional | Histórico, analytics e keepalive              | `historico_consultas`, `analytics_events`, `keepalive`, `keepalive_events`                 |
| Observabilidade          | Uptime e auditoria técnica                    | `scripts/keepalive-worker.js`, `docs/operations/auditoria-e-monitoramento.md`              |

---

## 3. Fluxos Principais

### 3.1 Consulta jurídica

1. Usuário informa Lei/Código + Artigo (e opcionalmente refinamento e `c.c.`).
2. Frontend normaliza entrada (ex.: `caput`, `único`, símbolos).
3. `validator-service` prioriza `verificar_elegibilidade_v2`.
4. Se a v2 não existir no ambiente, fallback controlado para `verificar_elegibilidade`.
5. UI exibe resultado, fundamentação, exceções e resumo da entrada informada.

### 3.2 Keepalive

1. Worker externo envia heartbeat.
2. Edge Function `keepalive` persiste evento e status atual.
3. Dashboard administrativo lê estado e recência.

---

## 4. Fronteiras SSoT (Obrigatórias)

- Editar JS somente em `src/js/**` (não editar `public/assets/js/**` manualmente).
- Não editar `.agent/hub/**` neste repositório satélite.
- Mudanças jurídicas devem ser feitas por migration em `supabase/migrations/`.
- Atualizações documentais devem refletir o estado real de código e banco.

---

## 5. ADRs Consolidados (Resumo)

| ID      | Decisão                                          | Motivação                                                                | Status |
| ------- | ------------------------------------------------ | ------------------------------------------------------------------------ | ------ |
| ADR-001 | Manter frontend em Vanilla JS                    | Menor complexidade e melhor custo de manutenção para escopo atual        | Aceita |
| ADR-002 | Supabase como SSoT de domínio jurídico           | Centraliza regra jurídica no banco e simplifica distribuição do frontend | Aceita |
| ADR-003 | RPC v2 como caminho padrão de consulta           | Cobertura de casos compostos e condicionais com fallback seguro          | Aceita |
| ADR-004 | Normalização defensiva de parágrafo na camada DB | Reduz falsos resultados por variação semântica (`caput`/`único`)         | Aceita |
| ADR-005 | Fail-safe para lacunas estruturais de dados      | Evita falso `ELEGIVEL` quando há inconsistência na base                  | Aceita |
| ADR-006 | Governança Hub-First com proteção de pre-commit  | Impede poluição do Hub e mantém conformidade em satélite                 | Aceita |

---

## 6. Backlog de ADRs (Próximos)

- ADR de política de versionamento de migrations jurídicas (critérios de consolidação x hotfix incremental).
- ADR de estratégia de testes de contrato RPC (ambiente local/CI/produção).

---

## 7. Referências

- [PRD e Escopo](prd-and-scope.md)
- [Guia de Desenvolvimento](guides/development.md)
- [Decisões de Design](design/design-decisions.md)
- [Referência de API](api-reference.md)
- [Status de Migrations](guides/migrations-status.md)
- [Auditoria Tabela Oficial](auditoria-tabela-oficial.md)

---

_Última atualização: 26/02/2026 • v0.3.28_
_Editado via: Codex CLI | Modelo: GPT-5 | OS: Windows 11_
