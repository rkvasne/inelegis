-- =====================================================
-- Migration: hotfix verificar_elegibilidade (fail-safe de lacuna estrutural)
-- =====================================================
-- Objetivo:
-- - Evitar falso ELEGIVEL quando houver excecao detalhada no artigo
--   sem qualquer linha impeditiva correspondente (lacuna de dados).
-- - Manter compatibilidade com a logica vigente da RPC base.
-- Data: 26/02/2026
-- =====================================================

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
    v_lacuna_excecao_detalhada BOOLEAN;
    v_mensagem TEXT;

    v_paragrafo_norm VARCHAR;
BEGIN
    -- Normalizacao defensiva de p_paragrafo na propria camada de banco.
    -- Casos esperados:
    -- - caput/cap -> NULL
    -- - unico, unico com acento, p. unico, p u, pu -> 'unico'
    -- - numericos e afins -> valor saneado sem simbolos.
    v_paragrafo_norm := LOWER(TRIM(COALESCE(p_paragrafo, '')));
    v_paragrafo_norm := REPLACE(v_paragrafo_norm, '§', '');
    v_paragrafo_norm := TRANSLATE(v_paragrafo_norm, 'º°ª', '');
    v_paragrafo_norm := TRANSLATE(
        v_paragrafo_norm,
        'áàâãäéèêëíìîïóòôõöúùûüç',
        'aaaaaeeeeiiiiooooouuuuc'
    );
    v_paragrafo_norm := REGEXP_REPLACE(v_paragrafo_norm, '[^a-z0-9]+', ' ', 'g');
    v_paragrafo_norm := TRIM(v_paragrafo_norm);

    IF v_paragrafo_norm IN ('', 'caput', 'cap') THEN
        v_paragrafo_norm := NULL;
    ELSIF v_paragrafo_norm IN ('unico', 'paragrafo unico', 'par unico', 'p unico', 'p u', 'pu') THEN
        v_paragrafo_norm := 'unico';
    ELSE
        v_paragrafo_norm := REPLACE(v_paragrafo_norm, ' ', '');
    END IF;

    SELECT t.eh_excecao, t.tipo_crime, t.observacoes, t.item_alinea_e
    INTO v_record
    FROM public.crimes_inelegibilidade t
    WHERE t.codigo = UPPER(p_codigo_norma)
      AND t.artigo = p_artigo
      AND (
          (v_paragrafo_norm IS NULL AND t.paragrafo IS NULL) OR
          (v_paragrafo_norm IS NOT NULL AND LOWER(TRIM(t.paragrafo)) = v_paragrafo_norm)
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
      (v_paragrafo_norm IS NOT NULL AND LOWER(TRIM(t.paragrafo)) = v_paragrafo_norm) DESC NULLS LAST,
      (p_inciso IS NOT NULL AND t.inciso = p_inciso) DESC NULLS LAST,
      (p_alinea IS NOT NULL AND t.alinea = p_alinea) DESC NULLS LAST,
      t.eh_excecao DESC
    LIMIT 1;

    IF FOUND THEN
        SELECT string_agg(
            CASE
                WHEN t2.paragrafo IS NOT NULL THEN
                    CASE WHEN LOWER(TRIM(t2.paragrafo)) = 'unico' THEN 'paragrafo unico' ELSE '§ ' || t2.paragrafo END
                WHEN t2.inciso IS NOT NULL THEN 'inciso ' || t2.inciso
                WHEN t2.alinea IS NOT NULL THEN 'alinea ' || t2.alinea
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
            ('Artigo consta na Tabela Oficial da Corregedoria (Item ' || COALESCE(v_record.item_alinea_e, '?') || ' da alinea "e")')::TEXT,
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
            'Artigo nao consta na tabela de inelegibilidade.'::TEXT,
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
                  (v_paragrafo_norm IS NULL AND t.paragrafo IS NULL) OR
                  (v_paragrafo_norm IS NOT NULL AND LOWER(TRIM(t.paragrafo)) = v_paragrafo_norm)
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
                'Dispositivo consta como excecao na Tabela Oficial.'::TEXT,
                NULL::VARCHAR, NULL::TEXT;
            RETURN;
        END IF;

        v_mensagem := 'Art. ' || p_artigo ||
            COALESCE(
                CASE
                    WHEN v_paragrafo_norm IS NULL THEN NULL
                    WHEN v_paragrafo_norm = 'unico' THEN ', § unico'
                    ELSE ', § ' || v_paragrafo_norm
                END,
                ''
            ) ||
            COALESCE(', inc. ' || p_inciso, '') ||
            COALESCE(', al. ' || p_alinea, '') ||
            ' nao consta explicitamente na tabela; conforme interpretacao (artigo inteiro impeditivo), trata-se como inelegivel.';
        RETURN QUERY SELECT
            'INELEGIVEL'::VARCHAR,
            v_artigo_inteiro_impeditivo.tipo_crime::TEXT,
            NULL::TEXT, v_mensagem::TEXT,
            v_artigo_inteiro_impeditivo.item_alinea_e::VARCHAR,
            (SELECT string_agg(
                CASE
                    WHEN t2.paragrafo IS NOT NULL THEN
                        CASE WHEN LOWER(TRIM(t2.paragrafo)) = 'unico' THEN 'paragrafo unico' ELSE '§ ' || t2.paragrafo END
                    WHEN t2.inciso IS NOT NULL THEN 'inciso ' || t2.inciso
                    WHEN t2.alinea IS NOT NULL THEN 'alinea ' || t2.alinea
                    ELSE 'caput'
                END,
                '; '
            ) FROM public.crimes_inelegibilidade t2
            WHERE t2.codigo = UPPER(p_codigo_norma) AND t2.artigo = p_artigo AND t2.eh_excecao = TRUE)::TEXT;
        RETURN;
    END IF;

    -- Fail-safe defensivo: se houver somente excecao detalhada sem qualquer
    -- linha impeditiva, tratar como INELEGIVEL para nao liberar indevidamente.
    SELECT
        EXISTS (
            SELECT 1
            FROM public.crimes_inelegibilidade t
            WHERE t.codigo = UPPER(p_codigo_norma)
              AND t.artigo = p_artigo
              AND t.eh_excecao = TRUE
              AND (t.paragrafo IS NOT NULL OR t.inciso IS NOT NULL OR t.alinea IS NOT NULL)
        )
        AND NOT EXISTS (
            SELECT 1
            FROM public.crimes_inelegibilidade t
            WHERE t.codigo = UPPER(p_codigo_norma)
              AND t.artigo = p_artigo
              AND t.eh_excecao = FALSE
        )
        AND NOT EXISTS (
            SELECT 1
            FROM public.crimes_inelegibilidade t
            WHERE t.codigo = UPPER(p_codigo_norma)
              AND t.artigo = p_artigo
              AND t.eh_excecao = TRUE
              AND t.paragrafo IS NULL
              AND t.inciso IS NULL
              AND t.alinea IS NULL
        )
    INTO v_lacuna_excecao_detalhada;

    IF v_lacuna_excecao_detalhada THEN
        RETURN QUERY SELECT
            'INELEGIVEL'::VARCHAR, NULL::TEXT, NULL::TEXT,
            'Inconsistencia estrutural detectada para este artigo (excecao detalhada sem base impeditiva). Aplicado fail-safe para evitar falso elegivel.'::TEXT,
            NULL::VARCHAR, NULL::TEXT;
        RETURN;
    END IF;

    v_mensagem := 'Dispositivo nao consta na enumeracao impeditiva da tabela; fora do rol explicito, trata-se como elegivel.';
    RETURN QUERY SELECT
        'ELEGIVEL'::VARCHAR, NULL::TEXT, NULL::TEXT,
        v_mensagem::TEXT, NULL::VARCHAR, NULL::TEXT;
END;
$$;

COMMENT ON FUNCTION public.verificar_elegibilidade IS 'Hotfix 20260226000400: fail-safe para lacuna estrutural (excecao detalhada sem base impeditiva), mantendo normalizacao defensiva.';
GRANT EXECUTE ON FUNCTION public.verificar_elegibilidade TO postgres, service_role, anon, authenticated;
