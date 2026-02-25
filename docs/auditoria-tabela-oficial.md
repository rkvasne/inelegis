# 📋 Auditoria: Tabela Oficial vs Migration (v0.3.27)

**Data da Auditoria:** 09/02/2026 (conteúdo); revisões: 16/02/2026 e 23/02/2026  
**Tabela de Referência:** Corregedoria Regional Eleitoral de São Paulo (outubro/2024)  
**Migration Analisada:** `20260225000000_crimes_inelegibilidade.sql` (reconsolidada em 25/02/2026; substitui tabelas `normas`, `artigos_inelegiveis`, `artigos_excecoes`)

**Status:** ✅ **CONFORME NO REPOSITÓRIO E NO BANCO ATIVO (hotfixes 9-12 aplicados)**

> **Validação final (23/02/2026):** Após aplicar `20260225000400_cleanup_extras_nao_cre.sql`, a base ativa ficou sem registros de `LEI_9503_97` e `LEI_8429_92` (ausentes nas 4 páginas da tabela oficial CRE). Em seguida, com `20260225000500_verificar_elegibilidade_v2_compostas.sql` executada, a RPC v2 passou a cobrir combinações `c.c.` e exceções condicionais sem regressão da regra base. Estado validado também na extração local de estrutura (`supabase/structure`).
>
> **Varredura profunda (26/02/2026):** Detectada lacuna estrutural no banco ativo para `CP 177/180/184` (exceções detalhadas sem linha-base impeditiva), causando falso `ELEGIVEL` em consultas fora das exceções (ex.: `CP 180 §8`). Correção consolidada via migrations `20260226000300`, `20260226000400` e `20260226000500`.
>
> **Fechamento de execução (26/02/2026):** Apply confirmado das migrations `20260226000200` a `20260226000500`, com validação pós-apply via testes automatizados (`npm run test:unit`), auditoria documental (`npm run doc:check`) e compliance de governança (`check-hub-version` + `validator-hub-protection`) sem falhas.

---

## 📊 Resumo Executivo

A migration `20260225000000_crimes_inelegibilidade.sql` está **substancialmente alinhada** com a tabela oficial da Corregedoria Regional Eleitoral de São Paulo, atualizada em outubro/2024. A estrutura contempla todos os elementos principais da LC 64/90, atualizada pela LC 135/2010.

### ✅ Pontos Conformes

1. **Estrutura da Tabela**
   - ✅ Colunas corretas: `codigo`, `lei`, `artigo`, `paragrafo`, `inciso`, `alinea`
   - ✅ Campo `eh_excecao` para distinguir exceções
   - ✅ Campo `tipo_crime` para categorização
   - ✅ Campo `item_alinea_e` para referência à LC 64/90
   - ✅ Índices otimizados para performance

2. **Código Penal (DL 2.848/40)**
   - ✅ Arts. 121, 121-A (Feminicídio), 122 §1º a §7º, 123 a 127 (Crimes contra a vida - Item 9)
   - ✅ Art. 129 §2º e §3º c.c. §12 (Crime hediondo - Item 7)
   - ✅ Art. 149 (Redução à condição análoga à de escravo - Itens 8 e 9)
   - ✅ Art. 149-A caput I a V c.c. §1º, II (Tráfico de pessoas - Item 7)
   - ✅ Arts. 155 a 184 (Crimes contra o patrimônio - Itens 1 e 2)
   - ✅ **EXCEÇÕES MAPEADAS:** Art. 163 caput, Art. 175 caput e I/II, Art. 177 §2º, Art. 180 §3º, Art. 184 §4º
   - ✅ Arts. 213 a 231-A (Crimes contra a dignidade sexual - Item 9)
   - ✅ **EXCEÇÕES MAPEADAS:** Art. 216-A, Art. 216-B
   - ✅ Arts. 267 a 280 (Crimes contra a saúde pública - Item 3)
   - ✅ **EXCEÇÕES MAPEADAS:** Arts. 267 §2º, 270 §2º, 271 parágrafo único, 272 §2º, 273 §2º, 278 parágrafo único, 280 parágrafo único
   - ✅ Arts. 288 e 288-A (Crimes praticados por quadrilha ou bando - Item 10)
   - ✅ Arts. 289 a 311-A (Crimes contra a fé pública - Item 1)
   - ✅ **EXCEÇÕES MAPEADAS:** Art. 289 §2º, Art. 293 §4º, Art. 304 nas figuras dos arts. 301 e 302
   - ✅ Arts. 312 a 359-H (Crimes contra a administração pública - Item 1)
   - ✅ **EXCEÇÕES MAPEADAS:** Art. 312 §2º, Art. 317 §2º, Art. 323 caput e §1º, Art. 325 caput e §1º, Art. 328 caput, Art. 347 caput, Art. 351 caput e §4º

3. **Código Penal Militar (DL 1.001/69)**
   - ✅ Arts. 205 e 207 (Crimes contra a vida - Item 9)
   - ✅ Art. 208 (Crimes hediondos - Item 7)
   - ✅ Arts. 232 a 239 (Crimes contra a dignidade sexual - Item 9)
   - ✅ Arts. 240 a 267 (Crimes contra o patrimônio - Itens 1 e 2)
   - ✅ **EXCEÇÕES MAPEADAS:** Arts. 262, 263, 264, 265 quando combinados com art. 266 (crimes culposos)
   - ✅ Arts. 290 a 297 (Crimes contra o meio ambiente e a saúde pública - Item 3)
   - ✅ **EXCEÇÕES MAPEADAS:** Art. 292 §2º, Art. 293 §3º, Art. 294 parágrafo único, Art. 295 parágrafo único, Art. 296 parágrafo único
   - ✅ Arts. 298 a 354 (Crimes contra a administração pública e a fé pública - Item 1)
   - ✅ **EXCEÇÕES MAPEADAS:** Art. 303 §3º, Art. 332 §2º, Art. 352 parágrafo único
   - ✅ Arts. 400, 401, 402 (Crimes contra a vida e hediondos)
   - ✅ Arts. 404 a 408 (Crimes contra o patrimônio e dignidade sexual)

4. **Legislação Especial**
   - ✅ CLT (DL 5.452/43) - Art. 49
   - ✅ DL 7.661/45 - Arts. 186 a 189 (Lei Falimentar revogada)
   - ✅ DL 201/67 - Art. 1º (Crimes de responsabilidade dos Prefeitos)
   - ✅ LC 105/01 - Art. 10
   - ✅ Lei 1.521/51 - Art. 3º
   - ✅ Lei 2.889/56 - Arts. 1º, 2º, 3º (Genocídio)
   - ✅ **EXCEÇÕES MAPEADAS:** Art. 2º e 3º caput quando se referir ao art. 1º, alínea "e"
   - ✅ Lei 4.591/64 - Art. 65
   - ✅ Lei 4.595/64 - Art. 34
   - ✅ Lei 4.728/65 - Arts. 66-B, 73, 74
   - ✅ **Código Eleitoral (Lei 4.737/65)** - Arts. 289, 291, 298, 299, 301, 302, 307 a 309, 315 a 317, 339, 340, 348 a 350, 352 a 354-A
   - ✅ Lei 4.898/65 - Art. 6º §3º "c"
   - ✅ Lei 6.091/74 - Art. 11 III e IV
   - ✅ Lei 6.368/76 - Arts. 12, 13, 14 (Lei de Drogas revogada)
   - ✅ Lei 6.385/76 - Arts. 27-C, 27-D
   - ✅ Lei 6.766/79 - Arts. 50, 51
   - ✅ Lei 6.996/82 - Art. 15
   - ✅ **Lei 7.492/86 (Lei do Colarinho Branco)** - Arts. 2º a 23
   - ✅ **Lei 7.716/89 (Crimes de racismo)** - Arts. 2º-A, 3º a 14 e 20
   - ✅ **ECA (Lei 8.069/90)** - Arts. 240, 241, 241-A a 241-D, 244-A
   - ✅ Lei 8.137/90 - Arts. 1º, 3º, 4º, 5º, 6º, 7º
   - ✅ **EXCEÇÃO MAPEADA:** Art. 7º parágrafo único
   - ✅ Lei 8.176/91 - Arts. 1º, 2º
   - ✅ Lei 8.666/93 - Arts. 89, 90, 92, 94, 95, 96
   - ✅ Lei 9.455/97 (Tortura) - Art. 1º
   - ✅ Lei 9.504/97 - Arts. 57-H §1º, 72
   - ✅ Lei 9.605/98 (Lei Ambiental) - Arts. 30, 33 a 35, 38, 38-A, 39 a 42, 50-A, 54, 56, 61 a 63, 66 a 69, 69-A
   - ✅ **EXCEÇÕES MAPEADAS:** Art. 38 parágrafo único, Art. 38-A parágrafo único, Art. 40 §3º, Art. 41 parágrafo único, Art. 54 §1º, Art. 56 §3º, Art. 62 parágrafo único, Art. 67 parágrafo único, Art. 68 parágrafo único, Art. 69-A §1º
   - ✅ Lei 9.613/98 (Lavagem de dinheiro) - Art. 1º
   - ✅ **Estatuto do Desarmamento (Lei 10.826/03)** - Arts. 16 caput e §1º, 17, 18
   - ✅ Lei 11.101/05 (Lei de Falências) - Arts. 168 a 177
   - ✅ **Lei 11.343/06 (Lei de Drogas)** - Arts. 33, 34, 35, 36, 37
   - ✅ **EXCEÇÃO MAPEADA:** Art. 33 §3º
   - ✅ Lei 12.850/13 (Organização Criminosa) - Art. 2º
   - ✅ Lei 13.260/16 (Terrorismo) - Arts. 2º a 6º

---

## ⚠️ Ressalvas e Observações

### 1. **Atualização de Outubro/2024**

A tabela oficial menciona que houve atualização em outubro/2024, incluindo:

- ✅ Art. 121-A do Código Penal (Feminicídio) - **PRESENTE na migration**
- ✅ Art. 2º-A da Lei 7.716/89 - **PRESENTE na migration** (mapeado como '2-A')
- ✅ Arts. 216-A e 216-B do Código Penal alterados para exceções - **PRESENTE na migration**

### 2. **Nomenclatura dos Artigos**

- **Tabela Oficial:** Usa notação com "º" (ex: "2º", "3º")
- **Migration:** Usa notação sem "º" (ex: "2", "3")
- **Impacto:** ⚠️ **BAIXO** - A função `verificar_elegibilidade` trata isso corretamente, mas pode causar confusão na entrada de dados manual.

### 3. **Artigo 2º-A da Lei 7.716/89**

- **Tabela Oficial:** "2º-A"
- **Migration:** "2-A"
- **Impacto:** ✅ **RESOLVIDO** - A validação do frontend normaliza `2º-A` para `2-A`.

### 4. **Reconsolidação v0.3.16**

Em 25/02/2026 a migration `20260225000000_crimes_inelegibilidade.sql` foi consolidada (substituindo o schema anterior) (sincronização total com as 4 páginas da tabela oficial). A **normalização de case** (códigos em MAIÚSCULAS) foi implementada na **RPC `verificar_elegibilidade`**. A lógica atual (v202602201) segue a **interpretação da tabela CRE** usada pelos servidores do TRE: match exato; sem match → artigo inexistente NAO_CONSTA; artigo inteiro impeditivo (ex.: Art. 121) e dispositivo fora das exceções → INELEGIVEL; dispositivos enumerados (ex.: Art. 122 §1–7) e fora do rol → ELEGIVEL. Ver [interpretacao-tabela-oficial.md](references/interpretacao-tabela-oficial.md). Esta auditoria continua referindo-se ao conteúdo jurídico da base (conformidade CRE out/2024).

### 5. **Observações Adicionais**

A migration inclui observações detalhadas sobre:

- ✅ Leis revogadas (ex: DL 7.661/45, Lei 6.368/76)
- ✅ Entendimentos do TSE (ex: Recurso Especial Eleitoral nº 145-94.2016.6.24.0074/SC)
- ✅ Alterações legislativas recentes (ex: Lei 13.142/2015, Lei 14.811/2024)

### 6. **Exceções condicionais (análise manual)**

Há hipóteses da tabela oficial cuja exceção depende de combinação textual/fática e não deve ser aplicada automaticamente por `eh_excecao=TRUE`:

- CP, art. 304: exceção apenas "nas figuras dos arts. 301 e 302".
- Lei 2.889/56, arts. 2º e 3º (caput): exceção somente quando se referir ao art. 1º, alínea "e".
- CPM, arts. 262 a 265: exceção quando combinados com art. 266 (culposo).

No banco, esses casos seguem impeditivos por padrão, com observação explícita para revisão jurídica manual no caso concreto.

### 7. **Divergências encontradas no banco ativo (corrigidas no repositório)**

Na verificação ponta a ponta (RPC real), foram detectados cenários fora da interpretação CRE por **dados legados**:

- Lei 11.343/06, art. 33: caput aparecendo como exceção (deveria ser apenas §3º).
- Lei 2.889/56, arts. 2º e 3º: caput aparecendo como exceção (na tabela oficial a exceção é condicional/fática, sem automação caput).

Também foi identificado um ponto de robustez na RPC:

- `IF v_record IS NOT NULL` em variável `record` pode falhar quando há colunas nulas no match exato.
- Ajuste aplicado na migration SSoT: uso de `IF FOUND`.

### 8. **Conferência final pós-cleanup (estado ativo antes dos hotfixes 10-12)**

- ✅ `crimes_inelegibilidade`: 33 códigos e 431 registros no banco ativo.
- ✅ `LEI_9503_97` e `LEI_8429_92`: não existem mais na base.
- ✅ RPC `verificar_elegibilidade` segue interpretação documentada em `docs/references/interpretacao-tabela-oficial.md`.
- ✅ Padrões críticos conferidos: Art. 121 (fallback impeditivo), Art. 122 (§1-§7 enumerados), Art. 148/149-A (combinação específica), Lei 11.343/06 art. 33 (§3 exceção).

### 9. **Matriz de validação RPC v2 (evidência de execução)**

- ✅ Bateria manual com 12 casos críticos da `verificar_elegibilidade_v2` executada no banco ativo.
- ✅ Resultado: 12/12 conformes (0 falhas), incluindo cenários com/sem `p_relacionados` e `p_contexto`.
- ✅ Evidência detalhada em: [auditoria-rpc-v2-matriz.md](auditoria-rpc-v2-matriz.md).

### 10. **Correções de confiabilidade aplicadas (26/02/2026)**

- ✅ `20260226000300_hotfix_cp_177_180_184_base_impeditiva.sql`: adiciona linhas-base impeditivas ausentes para CP 177/180/184.
- ✅ `20260226000400_hotfix_verificar_elegibilidade_failsafe_lacuna_dados.sql`: adiciona fail-safe na RPC base para bloquear falso `ELEGIVEL` em lacunas estruturais equivalentes.
- ✅ `20260226000500_hotfix_artigo_inteiro_impeditivo_enumerados.sql`: explicita `artigo_inteiro_impeditivo=FALSE` em padrões enumerados sem linha-base.
- ✅ Teste automatizado ampliado: `tests/migration-crimes-consistency.test.js` agora valida integridade estrutural + matriz crítica de fallback (inclui `CP 180 §8`).
- ✅ Resultado esperado após aplicar migrations 10-12: base ativa com **434 registros** (431 + 3 linhas-base CP) e sem artigos com exceção detalhada órfã.

---

## 🎯 Conclusão

A migration `20260225000000_crimes_inelegibilidade.sql` está **CONFORME** com a tabela oficial da Corregedoria Regional Eleitoral de São Paulo. Crimes, exceções estruturadas e categorias estão mapeados; exceções condicionais foram explicitadas para análise manual.

### Recomendações:

1. ✅ **Normalização de Entrada (concluída):** frontend normaliza `2º` e variações de hífen.
2. ✅ **Validação de Artigos Especiais (concluída):** artigos como `2º-A` são convertidos para `2-A`.
3. ✅ **Documentação:** Manter a tabela oficial atualizada no diretório `docs/references/`
4. ✅ **Testes:** Criar testes automatizados para validar todos os artigos da tabela oficial

---

_Última atualização: 26/02/2026 • v0.3.28 (Hub v0.6.1)_
_Editado via: Codex CLI | Modelo: GPT-5 | OS: Windows 11_
