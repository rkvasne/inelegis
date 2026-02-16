# PRD e Escopo — Inelegis

> **Objetivo:** Formalizar o escopo do produto para evitar scope creep em versões futuras. Este documento é a referência para decisões "isto entra ou não no Inelegis?".

**Fase:** Definição de Produto (referência contínua)  
**Versão do Projeto:** v0.3.19

---

## 1. Visão e Proposta de Valor

**Uma frase:** Consulta rápida de inelegibilidade eleitoral: dado um artigo (Lei Complementar 64/90 e normas relacionadas), o sistema informa se há inelegibilidade ou exceção, com fundamentação jurídica.

- **Usuário-alvo:** Servidores da Justiça Eleitoral que trabalham com o cadastro eleitoral e códigos **ASE (Atos do Sistema Eleitoral)** — códigos anotados no cadastro conforme o Manual ASE (TRE/CRE).
- **Problema:** Evitar consultas manuais e inconsistentes à tabela oficial; auxiliar na fundamentação das anotações ASE.
- **Solução:** Ferramenta web, simples e estática, que consulte uma base sincronizada com a tabela oficial e devolva veredicto + fundamentação (e sugestão de códigos ASE quando aplicável).

---

## 2. Escopo em Escopo (Core — O que o Inelegis É)

| Área                                | O quê                                                                                    | Prioridade |
| ----------------------------------- | ---------------------------------------------------------------------------------------- | ---------- |
| **Consulta estruturada**            | Fluxo Lei → Artigo (dropdowns) com veredicto imediato (inelegível / elegível / exceção). | P0         |
| **Consulta por texto (Analisador)** | Extração de artigos/parágrafos de texto livre e verificação em lote.                     | P0         |
| **Fundamentação jurídica**          | Exibição clara do dispositivo legal e da conclusão, com possibilidade de cópia.          | P0         |
| **Base oficial**                    | Dados alinhados à tabela oficial (TRE/CRE, DOCX) — SSoT no Supabase.                     | P0         |
| **Histórico e auditoria**           | Registro de consultas por sessão, com estatísticas e rastreabilidade (sem PII sensível). | P1         |
| **Operação e confiabilidade**       | Deploy estático (Vercel), monitoramento (Keepalive), segurança (RLS, CSP, sanitização).  | P0         |
| **Acessibilidade e UX**             | Responsivo, tema escuro, acessibilidade básica, performance adequada.                    | P1         |

Tudo acima é **escopo atual** e deve ser mantido estável e documentado.

---

## 3. Fora de Escopo (O que o Inelegis Não É)

Estes itens **não** fazem parte do produto a menos que sejam explicitamente aprovados como mudança de escopo (e refletidos neste PRD):

| Categoria                               | Exemplo                                                                      | Motivo                                            |
| --------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------- |
| **Outras leis/domínios**                | Consulta a outras leis além da LC 64/90 e normas integradas na base oficial. | Escopo jurídico definido.                         |
| **Autenticação de usuário**             | Login, cadastro, perfis.                                                     | Produto opera com uso anônimo/sessão.             |
| **API pública aberta**                  | Endpoints públicos para terceiros consumirem em alta escala.                 | Foco em uso via interface web.                    |
| **App mobile nativo**                   | Aplicativo iOS/Android dedicado.                                             | Web responsivo é o canal.                         |
| **Geração de pareceres/PDF**            | Relatórios formatados, assinatura digital.                                   | Cópia de texto + fundamentação é o suporte atual. |
| **Integração com ERPs/outros sistemas** | Conectores, webhooks, SSO corporativo.                                       | Fora do MVP e da proposta atual.                  |
| **Conteúdo editorial**                  | Blog, notícias, artigos de opinião.                                          | Ferramenta de consulta, não portal de conteúdo.   |

Qualquer funcionalidade nova que se encaixe nos itens acima deve ser tratada como **mudança de escopo** e atualizar este documento antes de entrar no backlog.

---

## 4. Requisitos Não-Funcionais (Resumo)

- **Performance:** Resposta rápida na consulta (RPC + front leve).
- **Segurança:** RLS, CSP, sem expor chaves sensíveis no front, sanitização de saída.
- **Manutenibilidade:** Código em `src/js/` como SSoT, documentação em `docs/`, conformidade com Hub (AGENTS.md).
- **Disponibilidade:** Monitoramento via Keepalive; deploy estático sem estado no Vercel.

---

## 5. Uso deste Documento

- **Novas features:** Antes de implementar, verificar se estão na seção 2 (em escopo) ou se configuram mudança de escopo (seção 3).
- **Refinamento de backlog:** Priorização (P0/P1) pode ser refinada; inclusão/exclusão de escopo deve ser refletida aqui.
- **Onboarding:** Novos contribuidores e agentes de IA devem usar este arquivo para entender o que o Inelegis faz e o que não faz.

---

## 6. Referências

- [README do projeto](../README.md) — visão geral e funcionalidades
- [Guia de Desenvolvimento](guides/development.md) — arquitetura e módulos
- [Estado do projeto](../.agent/memory/project-status.md) — objetivos e tarefas atuais
- [Decisões de design](design/design-decisions.md) — justificativas técnicas

---

_Última atualização: 15/02/2026 • v0.3.19_
_Editado via: Cursor | Modelo: claude-4.6-opus | OS: Windows 11_
