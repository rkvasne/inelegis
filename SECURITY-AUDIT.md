# 🕵️ SECURITY-AUDIT.md - Inelegis

> **Status:** Concluído | **Data:** 14/02/2026
> **Auditor:** Antigravity (Red Team Mode)
> **Escopo:** Inelegis (Satellite Project)
> **Padrão:** Solo Dev Hub (v0.5.6)

Este documento detalha as vulnerabilidades encontradas durante a auditoria de segurança pré-lançamento.

---

## 📊 Resumo de Riscos

| Severidade     | Quantidade | Impacto                                                           |
| :------------- | :--------- | :---------------------------------------------------------------- |
| 🚨 **CRÍTICA** | 1          | Acesso não autorizado a dados de histórico de terceiros.          |
| 🟠 **ALTA**    | 1          | Vazamento de informações técnicas do banco via logs de erro.      |
| 🟡 **MÉDIA**   | 1          | Configuração de CORS permissiva para desenvolvimento em produção. |
| 🔵 **BAIXA**   | 2          | Falta de Rate Limiting e poluição de Analytics.                   |

---

## 🚨 1. [CRÍTICA] Quebra de Controle de Acesso (ID Spoofing)

**Descrição:**
As funções RPC do Supabase (`get_user_history`, `add_to_history`, `get_user_stats`) e os endpoints Vercel (especialmente `search-history.js`) aceitam um `userId` arbitrário sem validação de identidade (JWT). Como as funções SQL utilizam `SECURITY DEFINER`, elas ignoram o RLS e permitem que qualquer um leia ou grave no histórico de qualquer usuário, bastando conhecer ou adivinhar o ID (gerado via JS).

**Achado:** `supabase/migrations/20260120000000_create_historico_consultas.sql` (Line 60, 81, 105).

**Impacto:** Vazamento de privacidade e integridade das consultas de auditoria.

**Mitigação:**

1. Alterar as funções para `SECURITY INVOKER` (respeita RLS).
2. Corrigir a política RLS para validar contra um segredo assinado ou usar Supabase Auth.
3. No endpoint Vercel, validar a integridade do ID.

---

## 🟠 2. [ALTA] Exposição de Informações Sensíveis (Verbose Errors)

**Descrição:**
Múltiplos handlers de API (Vercel e Supabase Edge Functions) capturam exceções e retornam `error.message` diretamente para o cliente. Isso pode expor nomes de tabelas, estruturas de colunas e detalhes de lógica interna em caso de erros de banco.

**Achado:** `api/search-history.js:202`, `api/maintenance.js:74`, `supabase/functions/keepalive/index.ts:87`.

**Impacto:** Facilita o reconhecimento da infraestrutura por atacantes (reconnaissance).

**Mitigação:**
Retornar mensagens de erro genéricas ("Internal Server Error") para o cliente e registrar o erro detalhado apenas em logs internos (console/telemetria).

---

## 🟡 3. [MÉDIA] CORS Permissivo (Localhost em Produção)

**Descrição:**
A lógica de validação de origem permite `http://localhost:3000` e `http://localhost:8080` mesmo em ambiente de produção (se o cabeçalho for enviado).

**Achado:** `api/search-history.js:34-35`, `api/dashboard.js:35-36`.

**Impacto:** Risco de ataques de Cross-Site Request Forgery (CSRF) se um atacante conseguir enganar um usuário em um ambiente local malicioso.

**Mitigação:**
Utilizar variáveis de ambiente para definir as origens permitidas baseadas no estágio (prod/dev).

---

## 🔵 4. [BAIXA] Ausência de Rate Limiting

**Descrição:**
Não há limites globais de requisições por IP nos endpoints da Vercel ou na Edge Function.

**Impacto:** Suscetibilidade a ataques de negação de serviço (DoS) ou scraping em massa dos dados de inelegibilidade.

**Mitigação:**
Implementar `edge-config` ou middleware de rate-limiting (ex: Upstash) na Vercel.

---

## 🔵 5. [BAIXA] Pollutive Analytics

**Descrição:**
O endpoint `/api/analytics` não exige autenticação. Qualquer bot pode enviar milhares de eventos fictícios para poluir os gráficos do Dashboard Admin.

**Mitigação:**
Adicionar uma validação básica de "Client Secret" ou assinatura de payload no envio de telemetria.

---

_Relatório gerado em conformidade com o Hub Rule #14._
_Última atualização: 14/02/2026_
