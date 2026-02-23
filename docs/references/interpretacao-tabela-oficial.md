# Interpretação da Tabela Oficial de Inelegibilidade

> Fonte: Corregedoria Regional Eleitoral de São Paulo (CRE-SP)  
> Base: Tabela exemplificativa de crimes – Art. 1º, I, alínea "e", LC 64/90  
> Última atualização: outubro/2024

---

## 1. Uso prático da tabela

A tabela é formalmente "exemplificativa" para evitar substituir a lei, mas na prática os servidores do TRE usam como índice exaustivo dos dispositivos que geram inelegibilidade e das exceções. O sistema Inelegis reproduz esse uso operacional.

---

## 2. Dois padrões de modelagem na tabela

### Padrão A — Artigo inteiro impeditivo (ex.: Art. 121)

- O artigo inteiro gera inelegibilidade.
- A tabela lista apenas as **exceções** (ex.: Art. 121, § 3º).
- Dispositivo informado **não listado** e **não constando como exceção** → **INELEGIVEL**.

**Exemplo:** Art. 121 § 8 — O § 8 não consta na tabela, mas Art. 121 está como impeditivo e o § 3º é a única exceção. Logo, § 8 → **INELEGIVEL**.

### Padrão B — Dispositivos enumerados (ex.: Art. 122)

- A tabela informa explicitamente quais dispositivos são impeditivos (ex.: § 1º a § 7º).
- O caput (ou outros dispositivos listados) é exceção.
- Dispositivo **fora** dessa enumeração → **ELEGIVEL**.

**Exemplo:** Art. 122 § 8 — Só § 1 a § 7 são impeditivos. O § 8 está fora da enumeração → **ELEGIVEL**.

### Padrão C — Combinação específica (ex.: Art. 129, Art. 149-A)

- Apenas certas combinações são impeditivas (ex.: Art. 149-A caput I a V c.c. § 1º, II).
- Qualquer outra combinação ou dispositivo isolado → **ELEGIVEL**.

**Exemplo:** Art. 149-A § 3 — O § 3 não consta como impeditivo na tabela; apenas "caput I a V c.c. § 1º, II" gera inelegibilidade → **ELEGIVEL**.

---

## 3. Critério técnico no banco de dados

A distinção entre padrões é feita pela coluna `artigo_inteiro_impeditivo` e pela presença de linha com **parágrafo/inciso/alínea nulos** e **eh_excecao = FALSE**:

| Condição                                                                                                           | Interpretação                                                              |
| ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| Existe `(artigo, paragrafo NULL, inciso NULL, alinea NULL, eh_excecao=FALSE)` e `artigo_inteiro_impeditivo = TRUE` | Artigo inteiro impeditivo. Dispositivo não exceção → INELEGIVEL            |
| Não existe essa linha ou `artigo_inteiro_impeditivo = FALSE`                                                       | Só combinações específicas impeditivas. Dispositivo não listado → ELEGIVEL |

### Exemplos no banco

| Artigo             | Linhas                                                            | Padrão                    |
| ------------------ | ----------------------------------------------------------------- | ------------------------- |
| 121                | (121, NULL) impeditivo; (121, 3) exceção                          | A — artigo inteiro        |
| 122                | (122, NULL) exceção (caput); (122, 1..7) impeditivos              | B — enumerado             |
| 129                | (129, 2), (129, 3) impeditivos (c/c §12)                          | C — combinação específica |
| 148                | (148, 1, IV) impeditivo; sem linha artigo-inteiro                 | C — combinação específica |
| 149-A              | (149-A, 1, II) impeditivo; sem linha artigo-inteiro               | C — combinação específica |
| 163                | (163, NULL) impeditivo; (163, NULL), (163, unico) exceções        | A — artigo inteiro        |
| 175                | (175, NULL) impeditivo; (175, NULL), (175, I), (175, II) exceções | A — artigo inteiro        |
| 323/325            | (NULL) impeditivo; (NULL), (§1) exceções                          | A — artigo inteiro        |
| 351                | (NULL) impeditivo; (NULL), (§4) exceções                          | A — artigo inteiro        |
| Lei 10.826 art. 16 | (NULL), (§1) impeditivos; artigo_inteiro=FALSE                    | C — combinação específica |

---

## 4. Regra de fallback (sem match exato)

Quando o dispositivo informado **não tem match exato** na tabela:

1. **Artigo inexistente na tabela** → `NAO_CONSTA`
2. **Artigo existe e tem linha "artigo inteiro impeditivo"** → dispositivo não é exceção → `INELEGIVEL`
3. **Artigo existe e não tem linha "artigo inteiro impeditivo"** → dispositivo fora da enumeração → `ELEGIVEL`

### 4.1 Exceções condicionais (não estruturadas)

Há itens da tabela oficial que dependem de combinação textual/fática e não podem ser inferidos apenas por `(artigo, parágrafo, inciso, alínea)`:

- CP, art. 304: exceção apenas nas figuras dos arts. 301 e 302.
- Lei 2.889/56, arts. 2º e 3º (caput): exceção quando se referir ao art. 1º, alínea "e".
- CPM, arts. 262 a 265: exceção quando combinados com art. 266 (culposo).

Nesses cenários, a base mantém o registro impeditivo com observação de revisão jurídica manual.

---

## 5. Referências

- [api-reference.md](../api-reference.md) — RPC `verificar_elegibilidade`
- [auditoria-tabela-oficial.md](../auditoria-tabela-oficial.md) — Conformidade CRE vs migration
- [tabela-oficial PDF](tabela-oficial_page-0001.jpg) — Páginas da tabela oficial

---

_Última atualização: 23/02/2026 • v0.3.25_
_Editado via: Codex CLI | Modelo: GPT-5 | OS: Windows 11_
