# 📑 Matriz de Validação RPC v2 (Consulta Composta)

> Escopo: validação manual da `public.verificar_elegibilidade_v2` com casos críticos da tabela CRE-SP (out/2024).
> Base testada: banco ativo após migrations `20260225000400` e `20260225000500`.
> Método: chamadas reais via endpoint RPC Supabase (`rest/v1/rpc/verificar_elegibilidade_v2`).

---

## Resultado Geral

- Total de casos: **12**
- Sucesso: **12**
- Falha: **0**
- Status: ✅ **CONFORME**

---

## Matriz (Entrada -> Saída)

| Caso                        | Entrada resumida                                 | Esperado           | Obtido             | Regra aplicada                   | Pendente manual |
| --------------------------- | ------------------------------------------------ | ------------------ | ------------------ | -------------------------------- | --------------- |
| `CP149A-sem-cc`             | `CP 149-A §1 II`, sem relacionados               | `PENDENTE_ANALISE` | `PENDENTE_ANALISE` | `CP_149A_CC_CAPUT_I_A_V_PAR1_II` | `true`          |
| `CP149A-com-cc`             | `CP 149-A §1 II`, relacionado `149-A inc I`      | `INELEGIVEL`       | `INELEGIVEL`       | `CP_149A_CC_CAPUT_I_A_V_PAR1_II` | `false`         |
| `CP129-sem-cc12`            | `CP 129 §2`, sem `§12`                           | `PENDENTE_ANALISE` | `PENDENTE_ANALISE` | `CP_129_CC_PAR12`                | `true`          |
| `CP129-com-cc12`            | `CP 129 §2`, relacionado `129 §12`               | `INELEGIVEL`       | `INELEGIVEL`       | `CP_129_CC_PAR12`                | `false`         |
| `CP304-sem-contexto`        | `CP 304`, sem contexto                           | `PENDENTE_ANALISE` | `PENDENTE_ANALISE` | `CP_304_FIGURAS_301_302`         | `true`          |
| `CP304-com-contexto`        | `CP 304`, `figuras_301_302=true`                 | `ELEGIVEL`         | `ELEGIVEL`         | `CP_304_FIGURAS_301_302`         | `false`         |
| `LEI2889-art2-sem-contexto` | `LEI_2889_56 art 2`, sem contexto                | `PENDENTE_ANALISE` | `PENDENTE_ANALISE` | `LEI_2889_56_ART2_3_REF_ART1_E`  | `true`          |
| `LEI2889-art2-com-contexto` | `LEI_2889_56 art 2`, `refere_art1_alinea_e=true` | `ELEGIVEL`         | `ELEGIVEL`         | `LEI_2889_56_ART2_3_REF_ART1_E`  | `false`         |
| `LEI10826-art16-sem-cc2`    | `LEI_10826_03 art 16 §1`, sem `§2`               | `PENDENTE_ANALISE` | `PENDENTE_ANALISE` | `LEI_10826_03_ART16_CC_PAR2`     | `true`          |
| `LEI10826-art16-com-cc2`    | `LEI_10826_03 art 16 §1`, relacionado `16 §2`    | `INELEGIVEL`       | `INELEGIVEL`       | `LEI_10826_03_ART16_CC_PAR2`     | `false`         |
| `CPM262-sem-cc266`          | `CPM 262`, sem `266`                             | `PENDENTE_ANALISE` | `PENDENTE_ANALISE` | `CPM_262_265_CC_266_CULPOSO`     | `true`          |
| `CPM262-com-cc266`          | `CPM 262`, relacionado `266`                     | `ELEGIVEL`         | `ELEGIVEL`         | `CPM_262_265_CC_266_CULPOSO`     | `false`         |

---

## Observações de Governança

- Esta matriz valida a camada de regra composta/condicional da v2 sem alterar a regra-base da RPC v1.
- A validação confirmou coerência entre `resultado`, `regra_aplicada` e `pendencia_validacao_manual`.
- Evidência de aplicação da migration no banco está refletida em `supabase/structure/extract-functions.json` (função `verificar_elegibilidade_v2` com definição atual).

---

## Referências

- `supabase/migrations/20260225000500_verificar_elegibilidade_v2_compostas.sql`
- `docs/references/interpretacao-tabela-oficial.md`
- `docs/auditoria-tabela-oficial.md`
- `supabase/structure/extract-functions.json`

---

_Última atualização: 23/02/2026 • v0.3.28 (Hub v0.6.1)_
_Editado via: Codex CLI | Modelo: GPT-5 | OS: Windows 11_
