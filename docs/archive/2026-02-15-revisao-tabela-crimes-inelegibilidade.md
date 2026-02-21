# Revisão da Tabela crimes_inelegibilidade (15/02/2026)

> **Arquivado:** Documento histórico. O estado atual está em [interpretacao-tabela-oficial.md](../references/interpretacao-tabela-oficial.md).

Auditoria completa contra a tabela oficial CRE-SP (out/2024).

---

## Alterações aplicadas na migration `20260225000000`

### 1. Nova coluna `artigo_inteiro_impeditivo`

- **Tipo:** BOOLEAN DEFAULT TRUE
- **Uso:** FALSE = artigo com apenas combinações específicas impeditivas; não usar fallback "artigo inteiro"

### 2. Padrão C — Combinações específicas (sem artigo inteiro)

| Artigo                 | Correção                                                                                      |
| ---------------------- | --------------------------------------------------------------------------------------------- |
| **148**                | Antes: (§1) impeditivo. Agora: (§1, inciso IV) apenas — conforme "Art. 148, § 1º, IV"         |
| **149-A**              | Antes: (NULL) artigo inteiro. Agora: (§1, inciso II) apenas — "caput I a V c.c. § 1º, II"     |
| **Lei 10.826 art. 16** | Antes: (NULL) artigo inteiro. Agora: (NULL) e (§1) impeditivos; artigo_inteiro=FALSE para §2+ |

### 3. Padrão A — Artigo inteiro + exceções adicionais

| Artigo  | Correção                                                                                 |
| ------- | ---------------------------------------------------------------------------------------- |
| **163** | Adicionada linha (163, NULL, FALSE) como impeditivo; caput e p.único já eram exceções    |
| **175** | Adicionada linha (175, NULL, FALSE) como impeditivo; exceções incisos I e II adicionadas |
| **323** | Exceção §1º adicionada (caput e §1 eram exceções)                                        |
| **325** | Exceção §1º adicionada                                                                   |
| **351** | Exceção caput adicionada (caput e §4 eram exceções)                                      |

### 4. Lei 2.889 (Genocídio) — Arts. 2 e 3

- Adicionadas linhas impeditivas (2, NULL, FALSE) e (3, NULL, FALSE)
- Caput permanece como exceção; §1 e demais dispositivos → INELEGIVEL

---

## Resultado esperado por consulta

| Consulta                       | Resultado  |
| ------------------------------ | ---------- |
| Art. 149-A § 3                 | ELEGIVEL   |
| Art. 148 § 1 (sem inciso)      | ELEGIVEL   |
| Art. 148 § 1 IV                | INELEGIVEL |
| Art. 16 Lei 10.826 § 2         | ELEGIVEL   |
| Art. 16 Lei 10.826 caput ou §1 | INELEGIVEL |
| Art. 323 § 1                   | ELEGIVEL   |
| Art. 351 caput                 | ELEGIVEL   |
| Art. 175 inciso I ou II        | ELEGIVEL   |

---

_Arquivado em: 21/02/2026 • Original: docs/guides/revisao-tabela-15022026.md_
