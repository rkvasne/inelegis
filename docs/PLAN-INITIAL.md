# Plano Inicial — Inelegis

> **Prompt:** 03-prd-and-scope.md (Planejamento: PRD, Escopo e Estimativas)  
> **Fase:** Descoberta / Definição  
> **Versão do Projeto:** v0.3.22  
> **Data:** 16/02/2026

---

## Passo 1: Análise de Contexto

### 1.1 Arquivos Relacionados no Projeto

| Tipo                    | Caminho                           | Relevância                                                    |
| ----------------------- | --------------------------------- | ------------------------------------------------------------- |
| PRD/Escopo              | `docs/prd-and-scope.md`           | Escopo formalizado; referência para decisões                  |
| Manual ASE              | `docs/references/manual-ase.md`   | Códigos ASE (337, 370, 540, 019) usados no cadastro eleitoral |
| Estado do Projeto       | `.agent/memory/project-status.md` | Objetivos, arquitetura, tarefas                               |
| Decisões de Design      | `docs/design/design-decisions.md` | Justificativas técnicas (Vanilla JS, etc.)                    |
| Guia de Desenvolvimento | `docs/guides/development.md`      | Arquitetura e módulos                                         |

### 1.2 Domínio e Público-Alvo (Atualizado)

O Inelegis é voltado principalmente a **servidores da Justiça Eleitoral**, que:

- Trabalham com o **cadastro eleitoral** e os códigos **ASE (Atos do Sistema Eleitoral)**
- Precisam consultar artigos da LC 64/90 e normas relacionadas para anotar o ASE correto (ex.: 337, 370, 540)
- Usam o sistema para apoiar decisões sobre inelegibilidade e fundamentação jurídica

**ASE:** códigos anotados no cadastro eleitoral conforme o Manual ASE (TRE/CRE). O Inelegis auxilia na fundamentação dessas anotações ao cruzar artigo da lei com o veredicto (inelegível / elegível / exceção).

### 1.3 Compatibilidade com o Hub Central

- **Stack atual:** Vanilla JS, Supabase, Vercel (site estático).
- **Hub:** Existem stacks para Supabase (`stack-supabase.md`), Node.js e landing page; o modelo estático + Supabase está alinhado ao Hub.
- **Conclusão:** Stack atual compatível com o ecossistema do Hub.

---

## Passo 2: Plano de Partida

### 2.1 Visão Geral e Requisitos (O "O Quê")

#### Requisitos Funcionais (Core Features)

| RF   | Descrição                                                                                    | Prioridade |
| ---- | -------------------------------------------------------------------------------------------- | ---------- |
| RF01 | Consulta estruturada Lei → Artigo com veredicto imediato (inelegível / elegível / exceção)   | P0         |
| RF02 | Analisador: extração de artigos/parágrafos de texto livre e verificação em lote              | P0         |
| RF03 | Fundamentação jurídica clara, com possibilidade de cópia                                     | P0         |
| RF04 | Base oficial sincronizada com a tabela TRE/CRE (DOCX)                                        | P0         |
| RF05 | Histórico de consultas por sessão, estatísticas, rastreabilidade (sem PII sensível)          | P1         |
| RF06 | Sugestão de códigos ASE (337, 370, etc.) a partir da decisão, para uso no cadastro eleitoral | P1         |

#### Requisitos Não-Funcionais

| RNF   | Descrição                                                                            |
| ----- | ------------------------------------------------------------------------------------ |
| RNF01 | **Performance:** Resposta rápida na consulta (RPC, front leve)                       |
| RNF02 | **Segurança:** RLS, CSP, sanitização, sem chaves sensíveis no front                  |
| RNF03 | **Disponibilidade:** Deploy estático (Vercel), Keepalive                             |
| RNF04 | **Manutenibilidade:** SSoT em `src/js/`, docs em `docs/`, conformidade Hub           |
| RNF05 | **Usuário:** Uso por servidores da Justiça Eleitoral (navegador web, sem app nativo) |

---

### 2.2 Escopo do MVP e Priorização (T-Shirt Sizing)

| Item                      | Tamanho | Esforço  | Complexidade | Status       |
| ------------------------- | ------- | -------- | ------------ | ------------ |
| Consulta Lei→Artigo       | M       | 2–3 dias | Baixa        | ✅ Concluído |
| Analisador texto livre    | M       | 2–3 dias | Média        | ✅ Concluído |
| Fundamentação jurídica    | P       | 0.5 dia  | Baixa        | ✅ Concluído |
| Base oficial (migrations) | G       | 3–5 dias | Alta         | ✅ Concluído |
| Histórico/auditoria       | M       | 1–2 dias | Média        | ✅ Concluído |
| Sugestão ASE (337/370)    | M       | 1–2 dias | Média        | ✅ Concluído |
| Keepalive/monitoramento   | M       | 1 dia    | Baixa        | ✅ Concluído |
| Refinamento UX/ASE        | P       | 0.5 dia  | Baixa        | 🔄 Contínuo  |

**Legenda T-shirt:** P = Pequeno (<1 dia), M = Médio (1–3 dias), G = Grande (3+ dias)

**MVP atual:** Entregue. Próximos passos: testes com usuários reais e refinamento conforme feedback dos servidores.

---

### 2.3 Seleção de Stack e Justificativa

| Camada        | Tecnologia                                 | Justificativa                                                        |
| ------------- | ------------------------------------------ | -------------------------------------------------------------------- |
| Frontend      | HTML/CSS + Vanilla JS (ES6 modules)        | Site estático, zero framework, bundle pequeno, compatível com Vercel |
| Backend/DB    | Supabase (PostgreSQL + RPC + RLS)          | BaaS, segurança, escalabilidade, sem servidor próprio                |
| Deploy        | Vercel                                     | CDN global, previews, variáveis de ambiente                          |
| Monitoramento | Hub Keepalive (Cloudflare + Edge Function) | Heartbeat externo, sem carga no front                                |

**Validação:** Stack atual atende aos requisitos. Migrar para React/Next.js traria ganho limitado frente ao custo de reescrita, dado o escopo enxuto do produto.

---

### 2.4 Matriz de Riscos e Trade-offs

| Risco                                | Impacto | Mitigação                                                                                                            |
| ------------------------------------ | ------- | -------------------------------------------------------------------------------------------------------------------- |
| **Tabela oficial desatualizada**     | Alto    | Migrations versionadas; processo de sincronização documentado em `docs/guides/maintenance.md`                        |
| **Interpretação jurídica incorreta** | Alto    | Sistema apenas consulta dados; fundamentação vem da base oficial; sugestão ASE é auxiliar, não substituto de decisão |
| **Timeouts em Puppeteer/CI**         | Médio   | Monitorar; ajustar timeouts em ambiente Windows/CI                                                                   |
| **Complexidade de novos ASE**        | Médio   | Manual ASE em `docs/references/`; sugestão ASE limitada aos códigos mapeados                                         |

| Trade-off                    | Decisão           | Sacrifício                                              |
| ---------------------------- | ----------------- | ------------------------------------------------------- |
| Simplicidade vs. Framework   | Manter Vanilla JS | Menos ecossistema de componentes; maior controle manual |
| Anonimato vs. Personalização | Sem login         | Sem perfis personalizados, histórico por sessão apenas  |
| Estático vs. SSR             | Site estático     | Sem SEO dinâmico; aceitável para ferramenta interna     |

---

## 3. Entregável e Uso

Este documento serve como **guia de decisão** para:

- Definir o que entra ou não em novas versões
- Priorizar features com base em T-shirt sizing
- Manter o escopo alinhado ao público-alvo (servidores da Justiça Eleitoral e uso de ASE no cadastro eleitoral)
- Referenciar riscos e trade-offs em discussões técnicas

**Documentos relacionados:**

- [PRD e Escopo](prd-and-scope.md) — escopo explícito e anti-scope creep
- [Manual ASE](references/manual-ase.md) — códigos anotados no cadastro eleitoral
- [Estado do projeto](../.agent/memory/project-status.md) — objetivos e tarefas atuais

---

_Última atualização: 20/02/2026 • v0.3.25_
_Editado via: Cursor | Modelo: claude-4.6-opus | OS: Windows 11_
