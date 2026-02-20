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

### Padrão C — Combinação específica (ex.: Art. 129)

- Apenas certas combinações são impeditivas (ex.: § 2º c/c § 12º).
- Qualquer outra combinação → **ELEGIVEL**.

---

## 3. Critério técnico no banco de dados

A distinção entre padrões é feita pela presença de uma linha com **parágrafo/inciso/alínea nulos** e **eh_excecao = FALSE**:

| Condição                                                                      | Interpretação                                                                  |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Existe `(artigo, paragrafo NULL, inciso NULL, alinea NULL, eh_excecao=FALSE)` | Artigo inteiro impeditivo. Dispositivo não exceção → INELEGIVEL                |
| Não existe essa linha                                                         | Só dispositivos enumerados são impeditivos. Dispositivo não listado → ELEGIVEL |

### Exemplos no banco

| Artigo | Linhas                                               | Padrão                    |
| ------ | ---------------------------------------------------- | ------------------------- |
| 121    | (121, NULL) impeditivo; (121, 3) exceção             | A — artigo inteiro        |
| 122    | (122, NULL) exceção (caput); (122, 1..7) impeditivos | B — enumerado             |
| 129    | (129, 2), (129, 3) impeditivos (c/c §12)             | C — combinação específica |

---

## 4. Regra de fallback (sem match exato)

Quando o dispositivo informado **não tem match exato** na tabela:

1. **Artigo inexistente na tabela** → `NAO_CONSTA`
2. **Artigo existe e tem linha "artigo inteiro impeditivo"** → dispositivo não é exceção → `INELEGIVEL`
3. **Artigo existe e não tem linha "artigo inteiro impeditivo"** → dispositivo fora da enumeração → `ELEGIVEL`

---

## 5. Referências

- [api-reference.md](../api-reference.md) — RPC `verificar_elegibilidade`
- [auditoria-tabela-oficial.md](../auditoria-tabela-oficial.md) — Conformidade CRE vs migration
- [tabela-oficial PDF](tabela-oficial_page-0001.jpg) — Páginas da tabela oficial

---

_Última atualização: 20/02/2026_
_Editado via: Cursor | Modelo: Auto | OS: Windows 11_
