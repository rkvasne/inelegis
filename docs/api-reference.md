# Referência de API — Inelegis

> **Prompt:** 17-api-and-docs.md (Documentação: API Docs e Manuais)  
> **Fase:** Finalização / Handover  
> **Versão do Projeto:** v0.3.27

Documentação técnica das APIs do Inelegis: endpoints serverless (Vercel) e funções RPC do Supabase consumidas pelo frontend.

---

## Fase 1: Análise Técnica

### Dependências e pré-requisitos

| Camada         | Dependência                                                                                        | Uso                                |
| -------------- | -------------------------------------------------------------------------------------------------- | ---------------------------------- |
| **Frontend**   | `@supabase/supabase-js` (ou cliente custom em `src/js/services/supabase-client.js`)                | RPCs e leitura de tabelas          |
| **Vercel API** | `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`                                            | Todas as rotas em `api/`           |
| **Dashboard**  | `ANALYTICS_ADMIN_TOKEN`                                                                            | Autenticação em `/api/dashboard`   |
| **Manutenção** | `CRON_SECRET`                                                                                      | Autenticação em `/api/maintenance` |
| **CORS**       | Origens permitidas: produção `https://inelegis.vercel.app`; dev `localhost:3000`, `localhost:8080` | Todas as rotas                     |

### Arquitetura de consumo

- **Consulta de elegibilidade:** o frontend chama **diretamente** o Supabase; usa `verificar_elegibilidade` no fluxo padrão e `verificar_elegibilidade_v2` quando há combinação `c.c.` e/ou contexto condicional.
- **UX de entrada jurídica (consulta estruturada):** o refinamento principal permite marcar `Caput` e `Único` de forma explícita (exclusivos), e o bloco `c.c.` também permite `Caput` explícito para dispositivos relacionados.
- **Rastreabilidade no resultado:** o modal exibe um resumo da entrada informada (dispositivo principal, relacionados `c.c.` e situações condicionais marcadas).
- **Histórico e estatísticas do usuário:** o frontend pode usar a API Vercel (`/api/search-history`) ou, em fluxos internos, o Supabase (RPCs `add_to_history`, `get_user_stats`) com contexto `set_app_user_id`.
- **Dashboard administrativo:** a aplicação admin usa a Vercel API (`/api/dashboard`) com token Bearer.

---

## Fase 2: API Reference

### A. Endpoints Vercel (Serverless)

Base URL (produção): `https://inelegis.vercel.app`

---

#### POST /api/analytics

Recebe eventos de telemetria (busca, erro, ação). Em transição para o sistema de Auditoria/Keepalive nativo do Supabase.

| Item             | Valor                     |
| ---------------- | ------------------------- |
| **Método**       | POST                      |
| **Content-Type** | application/json          |
| **Autenticação** | Nenhuma (CORS por origem) |

**Payload (JSON):**

```json
{
  "events": [
    {
      "type": "search",
      "userId": "string (5-100 chars)",
      "timestamp": "ISO 8601",
      "data": {
        "lei": "string",
        "artigo": "string",
        "resultado": "inelegivel|elegivel|nao_consta"
      }
    }
  ]
}
```

**Tipos de evento:** `search`, `error`, `action`.

**Respostas:**

| Código | Significado                           |
| ------ | ------------------------------------- |
| 200    | Sucesso                               |
| 400    | Payload inválido ou evento malformado |
| 403    | Origem não permitida (CORS)           |
| 500    | Erro interno                          |

---

#### GET /api/dashboard

Retorna estatísticas consolidadas para o painel administrativo.

| Item             | Valor                                                                                                                                                 |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Método**       | GET                                                                                                                                                   |
| **Autenticação** | `Authorization: Bearer <ANALYTICS_ADMIN_TOKEN>`                                                                                                       |
| **Query**        | `type` (opcional): `general`, `top-searches`, `distribution`, `errors`, `timeline`, `all`; `days` (opcional): número de dias para timeline (padrão 7) |

**Exemplo:**

```bash
curl -H "Authorization: Bearer TOKEN" \
  "https://inelegis.vercel.app/api/dashboard?type=all&days=7"
```

**Resposta 200 (exemplo):**

```json
{
  "general": {
    "totalSearches": 1234,
    "totalUsers": 56,
    "totalErrors": 0,
    "inelegiveis": 800,
    "elegiveis": 400,
    "period": "all_time"
  },
  "topSearches": [{ "lei": "LC64", "artigo": "1", "count": 42 }],
  "distribution": { "inelegivel": 800, "elegivel": 400 },
  "timeline": [{ "date": "2026-02-15", "searches": 20 }]
}
```

**Respostas:** 200 OK; 401 Unauthorized (token ausente ou inválido); 403 Forbidden (CORS).

---

#### GET /api/search-history

Lista o histórico de consultas do usuário ou suas estatísticas.

| Item             | Valor                                                                                              |
| ---------------- | -------------------------------------------------------------------------------------------------- |
| **Método**       | GET                                                                                                |
| **Autenticação** | Nenhuma (identificação por `userId`)                                                               |
| **Query**        | `userId` (obrigatório, 5–100 chars); `limit` (opcional, padrão 50); `stats=true` para estatísticas |

**Exemplo (lista):**

```bash
curl "https://inelegis.vercel.app/api/search-history?userId=user_abc123&limit=50"
```

**Exemplo (estatísticas):**

```bash
curl "https://inelegis.vercel.app/api/search-history?userId=user_abc123&stats=true"
```

**Resposta 200 (lista):**

```json
{
  "success": true,
  "history": [
    {
      "lei": "LC64",
      "artigo": "1",
      "resultado": "inelegivel",
      "timestamp": "2026-02-15T12:00:00Z",
      "tipoCrime": "Crime contra a administração pública",
      "observacoes": null
    }
  ]
}
```

**Resposta 200 (stats):**

```json
{
  "success": true,
  "stats": {
    "total": 42,
    "inelegiveis": 30,
    "elegiveis": 10,
    "naoConsta": 2,
    "primeiraConsulta": "2026-01-01T00:00:00Z",
    "ultimaConsulta": "2026-02-15T12:00:00Z"
  }
}
```

**Respostas:** 200 OK; 400 Invalid or missing userId; 403 CORS; 500 Internal server error.

---

#### POST /api/search-history

Insere uma consulta no histórico do usuário.

| Item             | Valor            |
| ---------------- | ---------------- |
| **Método**       | POST             |
| **Content-Type** | application/json |
| **Autenticação** | Nenhuma          |

**Payload:**

```json
{
  "userId": "string (5-100 chars)",
  "search": {
    "lei": "string",
    "artigo": "string",
    "resultado": "inelegivel|elegivel|nao_consta",
    "tipoCrime": "string (opcional)",
    "observacoes": "string (opcional)",
    "inciso": "string (opcional)",
    "alinea": "string (opcional)",
    "paragrafo": "string (opcional)",
    "motivoDetalhado": "string (opcional)",
    "excecoesCitadas": "string (opcional)",
    "metadata": "object (opcional)"
  }
}
```

**Resposta 200:**

```json
{
  "success": true,
  "entry": {
    "id": "...",
    "user_id": "...",
    "lei": "...",
    "artigo": "...",
    "resultado": "...",
    "timestamp": "..."
  }
}
```

**Respostas:** 200 OK; 400 Invalid userId or missing search / search sem lei, artigo ou resultado; 403 CORS; 500 Internal server error.

---

#### POST /api/maintenance

Executa limpeza de registros antigos (política de retenção). Uso típico: cron job.

| Item             | Valor                                 |
| ---------------- | ------------------------------------- |
| **Método**       | POST                                  |
| **Autenticação** | `Authorization: Bearer <CRON_SECRET>` |

**Resposta 200:**

```json
{
  "success": true,
  "message": "Manutenção concluída",
  "details": {
    "deletedRecords": 150,
    "retentionDays": 90,
    "totalRecordsAfter": 1000,
    "executedAt": "2026-02-15T00:00:00.000Z"
  }
}
```

**Respostas:** 200 OK; 401 Unauthorized (token ausente ou diferente de `CRON_SECRET`); 405 Method not allowed; 500 Internal server error.

---

### B. Supabase RPC (consumo direto pelo frontend)

O frontend usa o cliente Supabase com a chave **anon** (pública). As funções abaixo são as principais para integração.

---

#### verificar_elegibilidade

Verifica se um artigo gera inelegibilidade ou exceção conforme a tabela oficial da CRE. Reproduz o uso prático pelos servidores do TRE. Ver [interpretação da tabela](references/interpretacao-tabela-oficial.md).

**Comportamento:**

- **Match exato** → `INELEGIVEL` ou `ELEGIVEL` (quando for exceção legal).
- **Sem match e artigo inexistente na tabela** → `NAO_CONSTA`.
- **Sem match e artigo com dispositivo "artigo inteiro impeditivo"** (ex.: Art. 121): dispositivo não consta nas exceções → `INELEGIVEL` (fallback conforme interpretação).
- **Sem match e artigo com dispositivos apenas enumerados** (ex.: Art. 122 § 1–7): dispositivo fora do rol → `ELEGIVEL`.
- **Entrada de artigo no frontend:** há normalização (`2º-A` → `2-A`, hífens e ordinais) antes da chamada RPC.
- **Exceções condicionais textuais** (ex.: CP 304 nas figuras dos arts. 301/302) exigem revisão jurídica manual do caso concreto.

**Exemplos:** Art. 121 § 8 → `INELEGIVEL` (artigo inteiro impeditivo; § 3º é a única exceção). Art. 122 § 8 → `ELEGIVEL` (só § 1–7 impeditivos).

**Parâmetros:**

| Nome           | Tipo    | Obrigatório | Descrição                       |
| -------------- | ------- | ----------- | ------------------------------- |
| p_codigo_norma | VARCHAR | Sim         | Código da norma (ex.: LC64, CP) |
| p_artigo       | VARCHAR | Sim         | Número do artigo                |
| p_paragrafo    | VARCHAR | Não         | Parágrafo                       |
| p_inciso       | VARCHAR | Não         | Inciso                          |
| p_alinea       | VARCHAR | Não         | Alínea                          |

**Retorno (uma linha):**

| Campo           | Tipo    | Descrição                                                                                                                                                                                                               |
| --------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| resultado       | VARCHAR | `INELEGIVEL`, `ELEGIVEL` (exceção ou sem match com aviso) ou `NAO_CONSTA`                                                                                                                                               |
| tipo_crime      | TEXT    | Descrição do tipo de crime (quando inelegível)                                                                                                                                                                          |
| observacoes     | TEXT    | Observações adicionais                                                                                                                                                                                                  |
| mensagem        | TEXT    | Mensagem de fundamentação (ex.: item da alínea "e")                                                                                                                                                                     |
| item_alinea_e   | VARCHAR | Item na tabela oficial                                                                                                                                                                                                  |
| excecoes_artigo | TEXT    | Exceções do mesmo artigo: dispositivo apenas (§ N; parágrafo único; inciso X; caput), sem observações. O alerta "Atenção: Exceções Existentes" é exibido sempre que houver exceções (até a tabela estar 100% validada). |

**Exemplo (JavaScript):**

```javascript
const { data, error } = await supabase.rpc("verificar_elegibilidade", {
  p_codigo_norma: "LC64",
  p_artigo: "1",
  p_paragrafo: null,
  p_inciso: null,
  p_alinea: null,
});
const resultado = data?.[0]; // { resultado: "INELEGIVEL", tipo_crime: "...", ... }
```

---

#### verificar_elegibilidade_v2

Versão avançada da RPC para cenários de combinação (`c.c.`) e exceções condicionais da tabela oficial CRE.

**Parâmetros adicionais:**

| Nome           | Tipo  | Obrigatório | Descrição                                                                      |
| -------------- | ----- | ----------- | ------------------------------------------------------------------------------ |
| p_relacionados | JSONB | Não         | Lista de dispositivos relacionados (ex.: `[{ artigo: "149-A", inciso: "I" }]`) |
| p_contexto     | JSONB | Não         | Flags fáticas para exceções condicionais (ex.: `figuras_301_302: true`)        |

**Campos extras no retorno:**

| Campo                      | Tipo    | Descrição                                             |
| -------------------------- | ------- | ----------------------------------------------------- |
| match_composto             | BOOLEAN | Indica se a regra composta/condicional foi satisfeita |
| pendencia_validacao_manual | BOOLEAN | Indica necessidade de análise manual complementar     |
| regra_aplicada             | TEXT    | Identificador técnico da regra aplicada               |

**Exemplo (JavaScript):**

```javascript
const { data } = await supabase.rpc("verificar_elegibilidade_v2", {
  p_codigo_norma: "CP",
  p_artigo: "149-A",
  p_paragrafo: "1",
  p_inciso: "II",
  p_relacionados: [{ artigo: "149-A", inciso: "III" }],
  p_contexto: {},
});
```

---

#### add_to_history

Registra uma consulta no histórico do usuário (com contexto RLS).

**Parâmetros:** `p_user_id`, `p_lei`, `p_artigo`, `p_resultado`, `p_tipo_crime` (opcional), `p_observacoes` (opcional), `p_inciso` (opcional), `p_alinea` (opcional), `p_paragrafo` (opcional), `p_motivo_detalhado` (opcional), `p_excecoes_citadas` (opcional), `p_metadata` (opcional, JSONB).

**Retorno:** uma linha da tabela `historico_consultas` (o registro inserido).

**Pré-requisito:** chamar `set_app_user_id({ p_user_id })` na mesma sessão/contexto quando o consumo for via API serverless (Vercel), para RLS reconhecer o usuário.

---

#### get_user_stats

Retorna estatísticas agregadas do histórico do usuário.

**Parâmetros:** `p_user_id` (VARCHAR).

**Retorno (uma linha):** `total`, `inelegiveis`, `elegiveis`, `nao_consta`, `primeira_consulta`, `ultima_consulta`.

---

#### get_dashboard_stats

Retorna totais gerais para o painel administrativo (uso com **service_role** ou contexto autenticado).

**Parâmetros:** nenhum.

**Retorno:** totais como `total_searches`, `total_users`, `total_errors`, `inelegiveis`, `elegiveis`.

---

## Fase 3: Quick Start

### Consulta de elegibilidade (frontend)

1. Inicialize o cliente Supabase com `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
2. Chame `supabase.rpc("verificar_elegibilidade", { p_codigo_norma, p_artigo, p_paragrafo, p_inciso, p_alinea })`.
3. Trate o primeiro elemento do array retornado: `resultado` (INELEGIVEL | ELEGIVEL | NAO_CONSTA), `tipo_crime`, `observacoes`, `mensagem`.

### Histórico do usuário (via Vercel API)

1. **Listar:** `GET /api/search-history?userId=<id>&limit=50`
2. **Estatísticas:** `GET /api/search-history?userId=<id>&stats=true`
3. **Inserir:** `POST /api/search-history` com body `{ userId, search: { lei, artigo, resultado, ... } }`

### Dashboard (admin)

1. Configure `ANALYTICS_ADMIN_TOKEN` no ambiente.
2. `GET /api/dashboard?type=all` com header `Authorization: Bearer <token>`.

### Manutenção (cron)

1. Configure `CRON_SECRET` e `HISTORY_RETENTION_DAYS` (padrão 90).
2. `POST /api/maintenance` com header `Authorization: Bearer <CRON_SECRET>`.

---

## FAQ e Limitações

- **Por que a consulta de elegibilidade não passa pela Vercel?** Para reduzir latência e carga: o frontend fala direto com o Supabase; a lógica está na RPC e na base oficial.
- **Limite de histórico por usuário:** 100 registros considerados na API de listagem (parâmetro `limit` até 50 por request). Política de retenção global via `/api/maintenance` (ex.: 90 dias).
- **CORS:** Em produção apenas `https://inelegis.vercel.app` é aceito como origem; em dev, localhost 3000 e 8080.
- **Segurança:** Nunca exponha `SUPABASE_SERVICE_ROLE_KEY` no frontend. Use apenas nas funções serverless (Vercel) e em ferramentas de backend.

---

## Integração no projeto

- **Resumo dos endpoints:** [api/README.md](../api/README.md)
- **Variáveis de ambiente:** [guides/variaveis-ambiente.md](guides/variaveis-ambiente.md)
- **Setup Supabase:** [guides/setup-supabase.md](guides/setup-supabase.md)
- **Auditoria e monitoramento:** [operations/auditoria-e-monitoramento.md](operations/auditoria-e-monitoramento.md)

---

_Última atualização: 23/02/2026 • v0.3.27_
_Editado via: Codex CLI | Modelo: GPT-5 | OS: Windows 11_
