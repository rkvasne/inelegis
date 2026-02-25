-- =====================================================
-- Migration: hotfix artigo_inteiro_impeditivo (padrao enumerado)
-- =====================================================
-- Objetivo:
-- - Tornar explicito no banco que artigos sem linha-base impeditiva
--   e com dispositivos impeditivos detalhados seguem padrao enumerado.
-- - Reduzir risco de ambiguidade sem alterar resultado esperado da RPC.
-- Data: 26/02/2026
-- =====================================================

UPDATE public.crimes_inelegibilidade t
SET artigo_inteiro_impeditivo = FALSE
WHERE t.eh_excecao = FALSE
  AND (t.paragrafo IS NOT NULL OR t.inciso IS NOT NULL OR t.alinea IS NOT NULL)
  AND COALESCE(t.artigo_inteiro_impeditivo, TRUE) <> FALSE
  AND NOT EXISTS (
      SELECT 1
      FROM public.crimes_inelegibilidade b
      WHERE b.codigo = t.codigo
        AND b.artigo = t.artigo
        AND b.eh_excecao = FALSE
        AND b.paragrafo IS NULL
        AND b.inciso IS NULL
        AND b.alinea IS NULL
  );

