-- =====================================================
-- Migration: Hotfix conformidade CRE (dados + RPC)
-- Data: 25/02/2026
-- Objetivo:
-- 1) Corrigir divergências históricas no dataset (caput marcado como exceção indevida)
-- 2) Corrigir bug da RPC em registros com campos nulos (usar FOUND em vez de IS NOT NULL)
-- =====================================================

-- Lei 11.343/06, art. 33: exceção correta é apenas §3º (nunca caput)
DELETE FROM public.crimes_inelegibilidade
WHERE codigo = 'LEI_11343_06'
  AND artigo = '33'
  AND paragrafo IS NULL
  AND inciso IS NULL
  AND alinea IS NULL
  AND eh_excecao = TRUE;

INSERT INTO public.crimes_inelegibilidade (codigo, lei, artigo, paragrafo, eh_excecao, tipo_crime, item_alinea_e, observacoes)
SELECT 'LEI_11343_06', 'Lei 11.343/06 - Drogas', '33', '3', TRUE, 'Crimes de tráfico de entorpecentes', '7', 'Exceção: § 3º'
WHERE NOT EXISTS (
  SELECT 1
  FROM public.crimes_inelegibilidade
  WHERE codigo = 'LEI_11343_06'
    AND artigo = '33'
    AND paragrafo = '3'
    AND eh_excecao = TRUE
);

-- Lei 2.889/56, arts. 2º e 3º: caput segue impeditivo (exceção é condicional/fática, revisão manual)
DELETE FROM public.crimes_inelegibilidade
WHERE codigo = 'LEI_2889_56'
  AND artigo IN ('2', '3')
  AND paragrafo IS NULL
  AND inciso IS NULL
  AND alinea IS NULL
  AND eh_excecao = TRUE;

INSERT INTO public.crimes_inelegibilidade (codigo, lei, artigo, paragrafo, inciso, alinea, eh_excecao, artigo_inteiro_impeditivo, tipo_crime, item_alinea_e, observacoes)
SELECT 'LEI_2889_56', 'Lei 2.889/56 - Genocídio', v.artigo, NULL, NULL, NULL, FALSE, TRUE, 'Crimes hediondos', '7',
       'Exceção condicional no caput: quando se referir ao art. 1º, alínea "e" (análise manual).'
FROM (VALUES ('2'), ('3')) v(artigo)
WHERE NOT EXISTS (
  SELECT 1
  FROM public.crimes_inelegibilidade t
  WHERE t.codigo = 'LEI_2889_56'
    AND t.artigo = v.artigo
    AND t.paragrafo IS NULL
    AND t.inciso IS NULL
    AND t.alinea IS NULL
    AND t.eh_excecao = FALSE
);

UPDATE public.crimes_inelegibilidade
SET observacoes = 'Exceção condicional no caput: quando se referir ao art. 1º, alínea "e" (análise manual).'
WHERE codigo = 'LEI_2889_56'
  AND artigo IN ('2', '3')
  AND paragrafo IS NULL
  AND inciso IS NULL
  AND alinea IS NULL
  AND eh_excecao = FALSE;

-- Reaplica RPC com correção de fluxo (FOUND)
CREATE OR REPLACE FUNCTION public.verificar_elegibilidade(
    p_codigo_norma VARCHAR,
    p_artigo VARCHAR,
    p_paragrafo VARCHAR DEFAULT NULL,
    p_inciso VARCHAR DEFAULT NULL,
    p_alinea VARCHAR DEFAULT NULL
)
RETURNS TABLE (
    resultado VARCHAR,
    tipo_crime TEXT,
    observacoes TEXT,
    mensagem TEXT,
    item_alinea_e VARCHAR,
    excecoes_artigo TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_record record;
    v_excecoes_list TEXT;
    v_artigo_existe BOOLEAN;
    v_artigo_inteiro_impeditivo record;
    v_eh_excecao BOOLEAN;
    v_mensagem TEXT;
BEGIN
    SELECT t.eh_excecao, t.tipo_crime, t.observacoes, t.item_alinea_e
    INTO v_record
    FROM public.crimes_inelegibilidade t
    WHERE t.codigo = UPPER(p_codigo_norma)
      AND t.artigo = p_artigo
      AND (
          (p_paragrafo IS NULL AND t.paragrafo IS NULL) OR
          (p_paragrafo IS NOT NULL AND LOWER(TRIM(t.paragrafo)) = LOWER(TRIM(p_paragrafo)))
      )
      AND (
          (p_inciso IS NULL AND t.inciso IS NULL) OR
          (p_inciso IS NOT NULL AND UPPER(TRIM(t.inciso)) = UPPER(TRIM(p_inciso)))
      )
      AND (
          (p_alinea IS NULL AND t.alinea IS NULL) OR
          (p_alinea IS NOT NULL AND UPPER(TRIM(t.alinea)) = UPPER(TRIM(p_alinea)))
      )
    ORDER BY
      (p_paragrafo IS NOT NULL AND t.paragrafo = p_paragrafo) DESC NULLS LAST,
      (p_inciso IS NOT NULL AND t.inciso = p_inciso) DESC NULLS LAST,
      (p_alinea IS NOT NULL AND t.alinea = p_alinea) DESC NULLS LAST,
      t.eh_excecao DESC
    LIMIT 1;

    IF FOUND THEN
        SELECT string_agg(
            CASE
                WHEN t2.paragrafo IS NOT NULL THEN
                    CASE WHEN LOWER(TRIM(t2.paragrafo)) = 'unico' THEN 'parágrafo único' ELSE '§ ' || t2.paragrafo END
                WHEN t2.inciso IS NOT NULL THEN 'inciso ' || t2.inciso
                WHEN t2.alinea IS NOT NULL THEN 'alínea ' || t2.alinea
                ELSE 'caput'
            END,
            '; '
        ) INTO v_excecoes_list
        FROM public.crimes_inelegibilidade t2
        WHERE t2.codigo = UPPER(p_codigo_norma)
          AND t2.artigo = p_artigo
          AND t2.eh_excecao = TRUE;

        RETURN QUERY SELECT
            (CASE WHEN v_record.eh_excecao THEN 'ELEGIVEL' ELSE 'INELEGIVEL' END)::VARCHAR,
            v_record.tipo_crime::TEXT, v_record.observacoes::TEXT,
            ('Artigo consta na Tabela Oficial da Corregedoria (Item ' || COALESCE(v_record.item_alinea_e, '?') || ' da alínea "e")')::TEXT,
            v_record.item_alinea_e::VARCHAR, v_excecoes_list::TEXT;
        RETURN;
    END IF;

    SELECT EXISTS (
        SELECT 1 FROM public.crimes_inelegibilidade t
        WHERE t.codigo = UPPER(p_codigo_norma) AND t.artigo = p_artigo
    ) INTO v_artigo_existe;

    IF NOT v_artigo_existe THEN
        RETURN QUERY SELECT
            'NAO_CONSTA'::VARCHAR, NULL::TEXT, NULL::TEXT,
            'Artigo não consta na tabela de inelegibilidade.'::TEXT,
            NULL::VARCHAR, NULL::TEXT;
        RETURN;
    END IF;

    SELECT t.tipo_crime, t.item_alinea_e INTO v_artigo_inteiro_impeditivo
    FROM public.crimes_inelegibilidade t
    WHERE t.codigo = UPPER(p_codigo_norma)
      AND t.artigo = p_artigo
      AND t.paragrafo IS NULL
      AND t.inciso IS NULL
      AND t.alinea IS NULL
      AND t.eh_excecao = FALSE
      AND COALESCE(t.artigo_inteiro_impeditivo, TRUE) = TRUE
    LIMIT 1;

    IF FOUND THEN
        SELECT EXISTS (
            SELECT 1 FROM public.crimes_inelegibilidade t
            WHERE t.codigo = UPPER(p_codigo_norma)
              AND t.artigo = p_artigo
              AND t.eh_excecao = TRUE
              AND (
                  (p_paragrafo IS NULL AND t.paragrafo IS NULL) OR
                  (p_paragrafo IS NOT NULL AND LOWER(TRIM(t.paragrafo)) = LOWER(TRIM(p_paragrafo)))
              )
              AND (
                  (p_inciso IS NULL AND t.inciso IS NULL) OR
                  (p_inciso IS NOT NULL AND UPPER(TRIM(t.inciso)) = UPPER(TRIM(p_inciso)))
              )
              AND (
                  (p_alinea IS NULL AND t.alinea IS NULL) OR
                  (p_alinea IS NOT NULL AND UPPER(TRIM(t.alinea)) = UPPER(TRIM(p_alinea)))
              )
        ) INTO v_eh_excecao;

        IF v_eh_excecao THEN
            RETURN QUERY SELECT
                'ELEGIVEL'::VARCHAR, NULL::TEXT, NULL::TEXT,
                'Dispositivo consta como exceção na Tabela Oficial.'::TEXT,
                NULL::VARCHAR, NULL::TEXT;
            RETURN;
        END IF;

        v_mensagem := 'Art. ' || p_artigo ||
            COALESCE(' § ' || p_paragrafo, '') ||
            COALESCE(', inc. ' || p_inciso, '') ||
            COALESCE(', al. ' || p_alinea, '') ||
            ' não consta explicitamente na tabela; conforme interpretação (artigo inteiro impeditivo), trata-se como inelegível.';
        RETURN QUERY SELECT
            'INELEGIVEL'::VARCHAR,
            v_artigo_inteiro_impeditivo.tipo_crime::TEXT,
            NULL::TEXT, v_mensagem::TEXT,
            v_artigo_inteiro_impeditivo.item_alinea_e::VARCHAR,
            (SELECT string_agg(
                CASE
                    WHEN t2.paragrafo IS NOT NULL THEN
                        CASE WHEN LOWER(TRIM(t2.paragrafo)) = 'unico' THEN 'parágrafo único' ELSE '§ ' || t2.paragrafo END
                    WHEN t2.inciso IS NOT NULL THEN 'inciso ' || t2.inciso
                    WHEN t2.alinea IS NOT NULL THEN 'alínea ' || t2.alinea
                    ELSE 'caput'
                END,
                '; '
            ) FROM public.crimes_inelegibilidade t2
            WHERE t2.codigo = UPPER(p_codigo_norma) AND t2.artigo = p_artigo AND t2.eh_excecao = TRUE)::TEXT;
        RETURN;
    END IF;

    v_mensagem := 'Dispositivo não consta na enumeração impeditiva da tabela; fora do rol explícito, trata-se como elegível.';
    RETURN QUERY SELECT
        'ELEGIVEL'::VARCHAR, NULL::TEXT, NULL::TEXT,
        v_mensagem::TEXT, NULL::VARCHAR, NULL::TEXT;
END;
$$;

COMMENT ON FUNCTION public.verificar_elegibilidade IS 'Verifica elegibilidade conforme interpretação CRE (docs/references/interpretacao-tabela-oficial.md).';
GRANT EXECUTE ON FUNCTION public.verificar_elegibilidade TO postgres, service_role, anon, authenticated;
