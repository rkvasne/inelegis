-- =====================================================
-- Migration: hotfix CP 177/180/184 base impeditiva
-- =====================================================
-- Objetivo:
-- - Corrigir artigos do CP com exceção mapeada sem linha-base impeditiva.
-- - Evitar falso ELEGIVEL para dispositivos fora das exceções:
--   * Art. 177 (somente §2 é exceção)
--   * Art. 180 (somente §3 é exceção)
--   * Art. 184 (somente §4 é exceção)
-- Data: 26/02/2026
-- =====================================================

INSERT INTO public.crimes_inelegibilidade (
    codigo,
    lei,
    artigo,
    paragrafo,
    inciso,
    alinea,
    eh_excecao,
    artigo_inteiro_impeditivo,
    tipo_crime,
    item_alinea_e,
    observacoes
)
SELECT
    'CP',
    'Código Penal (DL 2.848/40)',
    '177',
    NULL,
    NULL,
    NULL,
    FALSE,
    TRUE,
    'Crimes contra o patrimônio',
    '1',
    'Art. inteiro; exceção §2'
WHERE NOT EXISTS (
    SELECT 1
    FROM public.crimes_inelegibilidade t
    WHERE t.codigo = 'CP'
      AND t.artigo = '177'
      AND t.paragrafo IS NULL
      AND t.inciso IS NULL
      AND t.alinea IS NULL
      AND t.eh_excecao = FALSE
);

INSERT INTO public.crimes_inelegibilidade (
    codigo,
    lei,
    artigo,
    paragrafo,
    inciso,
    alinea,
    eh_excecao,
    artigo_inteiro_impeditivo,
    tipo_crime,
    item_alinea_e,
    observacoes
)
SELECT
    'CP',
    'Código Penal (DL 2.848/40)',
    '180',
    NULL,
    NULL,
    NULL,
    FALSE,
    TRUE,
    'Crimes contra o patrimônio',
    '1',
    'Art. inteiro; exceção §3'
WHERE NOT EXISTS (
    SELECT 1
    FROM public.crimes_inelegibilidade t
    WHERE t.codigo = 'CP'
      AND t.artigo = '180'
      AND t.paragrafo IS NULL
      AND t.inciso IS NULL
      AND t.alinea IS NULL
      AND t.eh_excecao = FALSE
);

INSERT INTO public.crimes_inelegibilidade (
    codigo,
    lei,
    artigo,
    paragrafo,
    inciso,
    alinea,
    eh_excecao,
    artigo_inteiro_impeditivo,
    tipo_crime,
    item_alinea_e,
    observacoes
)
SELECT
    'CP',
    'Código Penal (DL 2.848/40)',
    '184',
    NULL,
    NULL,
    NULL,
    FALSE,
    TRUE,
    'Crimes contra o patrimônio',
    '1',
    'Art. inteiro; exceção §4'
WHERE NOT EXISTS (
    SELECT 1
    FROM public.crimes_inelegibilidade t
    WHERE t.codigo = 'CP'
      AND t.artigo = '184'
      AND t.paragrafo IS NULL
      AND t.inciso IS NULL
      AND t.alinea IS NULL
      AND t.eh_excecao = FALSE
);

