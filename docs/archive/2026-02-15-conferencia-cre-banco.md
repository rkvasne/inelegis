# Conferência: Leis da tabela CRE vs Banco de Dados

> **Arquivado em 21/02/2026.** Snapshot obsoleto. A conformidade CRE está em [auditoria-tabela-oficial.md](../auditoria-tabela-oficial.md).

Confronto entre as leis da tabela oficial CRE-SP (4 páginas) e o que está na migration `crimes_inelegibilidade`.

---

## ✅ Status (atualizado em 15/02/2026)

**Todas as leis da tabela CRE foram incluídas na migration** `20260225000000_crimes_inelegibilidade.sql`.

### Leis no banco e no input select

O input select é populado por `validator-service.getLaws()`, que obtém `DISTINCT codigo, lei` da tabela `crimes_inelegibilidade`. Todas as leis abaixo aparecem no select após aplicar a migration.

| Codigo       | Lei                                     |
| ------------ | --------------------------------------- |
| CP           | Código Penal (DL 2.848/40)              |
| CPM          | Código Penal Militar (DL 1.001/69)      |
| CE           | Código Eleitoral (Lei 4.737/65)         |
| CLT          | CLT (DL 5.452/43)                       |
| DL_7661_45   | DL 7.661/45 - Lei Falimentar (revogada) |
| DL_201_67    | DL 201/67 - Crimes de responsabilidade  |
| LC_105_01    | LC 105/01                               |
| LEI_1521_51  | Lei 1.521/51 - Economia popular         |
| LEI_2889_56  | Lei 2.889/56 - Genocídio                |
| LEI_4591_64  | Lei 4.591/64 - Condomínios              |
| LEI_4595_64  | Lei 4.595/64 - Sistema financeiro       |
| LEI_4728_65  | Lei 4.728/65 - Mercado de capitais      |
| LEI_4898_65  | Lei 4.898/65 - Abuso de autoridade      |
| LEI_6091_74  | Lei 6.091/74 - Transporte eleitores     |
| LEI_6368_76  | Lei 6.368/76 - Drogas (revogada)        |
| LEI_6385_76  | Lei 6.385/76 - CVM                      |
| LEI_6766_79  | Lei 6.766/79 - Parcelamento solo        |
| LEI_6996_82  | Lei 6.996/82 - Processamento eletrônico |
| LEI_7492_86  | Lei 7.492/86 - Colarinho Branco         |
| LEI_7716_89  | Lei 7.716/89 - Racismo                  |
| LEI_8069_90  | Lei 8.069/90 - ECA                      |
| LEI_8137_90  | Lei 8.137/90 - Ordem tributária         |
| LEI_8176_91  | Lei 8.176/91 - Ordem econômica          |
| LEI_8429_92  | Lei 8.429/92 - Improbidade              |
| LEI_8666_93  | Lei 8.666/93 - Licitações               |
| LEI_9455_97  | Lei 9.455/97 - Tortura                  |
| LEI_9503_97  | Lei 9.503/97 - CTB                      |
| LEI_9504_97  | Lei 9.504/97 - Lei Eleitoral            |
| LEI_9605_98  | Lei 9.605/98 - Ambiental                |
| LEI_9613_98  | Lei 9.613/98 - Lavagem                  |
| LEI_10826_03 | Lei 10.826/03 - Desarmamento            |
| LEI_11101_05 | Lei 11.101/05 - Lei Falimentar          |
| LEI_11343_06 | Lei 11.343/06 - Drogas                  |
| LEI_12850_13 | Lei 12.850/13 - Org. Crim.              |
| LEI_13260_16 | Lei 13.260/16 - Terrorismo              |

---

## Resumo

| Situação                       | Quantidade |
| ------------------------------ | ---------- |
| Leis no banco (após migration) | 36         |
| Leis na CRE (4 páginas)        | ~36        |
| Leis faltantes                 | 0          |

---

_Arquivado em: 21/02/2026 • Original: docs/guides/conferencia-leis-cre-vs-banco.md_
