-- =====================================================
-- Migration: Fallback conforme interpretação da tabela
-- =====================================================
-- Interpretação usada pelos servidores do TRE:
-- - Artigo inteiro impeditivo (ex: Art. 121): dispositivo
--   não listado e não exceção → INELEGIVEL
-- - Dispositivos enumerados (ex: Art. 122 §1-7): dispositivo
--   fora da enumeração → ELEGIVEL
-- - Artigo inexistente na tabela → NAO_CONSTA
-- Ver docs/references/interpretacao-tabela-oficial.md
-- Data: 20/02/2026
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
    v_artigo_inteiro_impeditivo record;  -- row (tipo_crime, item_alinea_e) ou NULL
    v_eh_excecao BOOLEAN;
    v_mensagem TEXT;
BEGIN
    -- 1. Buscar match exato
    SELECT
        t.eh_excecao, t.tipo_crime, t.observacoes, t.item_alinea_e
    INTO v_record
    FROM public.crimes_inelegibilidade t
    WHERE t.codigo = UPPER(p_codigo_norma)
      AND t.artigo = p_artigo
      AND (
          (p_paragrafo IS NULL AND t.paragrafo IS NULL) OR
          (p_paragrafo IS NOT NULL AND t.paragrafo = p_paragrafo)
      )
      AND (
          (p_inciso IS NULL AND t.inciso IS NULL) OR
          (p_inciso IS NOT NULL AND t.inciso = p_inciso)
      )
      AND (
          (p_alinea IS NULL AND t.alinea IS NULL) OR
          (p_alinea IS NOT NULL AND t.alinea = p_alinea)
      )
    ORDER BY
      (p_paragrafo IS NOT NULL AND t.paragrafo = p_paragrafo) DESC NULLS LAST,
      (p_inciso IS NOT NULL AND t.inciso = p_inciso) DESC NULLS LAST,
      (p_alinea IS NOT NULL AND t.alinea = p_alinea) DESC NULLS LAST,
      t.eh_excecao DESC
    LIMIT 1;

    IF v_record IS NOT NULL THEN
        -- Match exato: retornar resultado direto
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

    -- 2. Sem match: aplicar fallback conforme interpretação da tabela

    -- Artigo existe na tabela?
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

    -- Artigo tem linha "artigo inteiro impeditivo" (paragrafo/inciso/alinea NULL, eh_excecao=FALSE)?
    SELECT t.tipo_crime, t.item_alinea_e INTO v_artigo_inteiro_impeditivo
    FROM public.crimes_inelegibilidade t
    WHERE t.codigo = UPPER(p_codigo_norma)
      AND t.artigo = p_artigo
      AND t.paragrafo IS NULL
      AND t.inciso IS NULL
      AND t.alinea IS NULL
      AND t.eh_excecao = FALSE
    LIMIT 1;

    IF v_artigo_inteiro_impeditivo IS NOT NULL THEN
        -- Padrão A: artigo inteiro impeditivo. Verificar se dispositivo está na exceção.
        SELECT EXISTS (
            SELECT 1 FROM public.crimes_inelegibilidade t
            WHERE t.codigo = UPPER(p_codigo_norma)
              AND t.artigo = p_artigo
              AND t.eh_excecao = TRUE
              AND (
                  (p_paragrafo IS NULL AND t.paragrafo IS NULL) OR
                  (p_paragrafo IS NOT NULL AND t.paragrafo = p_paragrafo)
              )
              AND (
                  (p_inciso IS NULL AND t.inciso IS NULL) OR
                  (p_inciso IS NOT NULL AND t.inciso = p_inciso)
              )
              AND (
                  (p_alinea IS NULL AND t.alinea IS NULL) OR
                  (p_alinea IS NOT NULL AND t.alinea = p_alinea)
              )
        ) INTO v_eh_excecao;

        IF v_eh_excecao THEN
            RETURN QUERY SELECT
                'ELEGIVEL'::VARCHAR, NULL::TEXT, NULL::TEXT,
                'Dispositivo consta como exceção na Tabela Oficial.'::TEXT,
                NULL::VARCHAR, NULL::TEXT;
            RETURN;
        END IF;

        -- Dispositivo não é exceção → INELEGIVEL (fallback artigo inteiro)
        v_mensagem := 'Art. ' || p_artigo ||
            COALESCE(' § ' || p_paragrafo, '') ||
            COALESCE(', inc. ' || p_inciso, '') ||
            COALESCE(', al. ' || p_alinea, '') ||
            ' não consta explicitamente na tabela; conforme interpretação (artigo inteiro impeditivo, exceções apenas as listadas), trata-se como inelegível.';
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

    -- Padrão B/C: apenas dispositivos enumerados são impeditivos. Dispositivo fora → ELEGIVEL
    v_mensagem := 'Dispositivo não consta na enumeração impeditiva da tabela; fora do rol explícito, trata-se como elegível.';
    RETURN QUERY SELECT
        'ELEGIVEL'::VARCHAR, NULL::TEXT, NULL::TEXT,
        v_mensagem::TEXT, NULL::VARCHAR, NULL::TEXT;
END;
$$;

COMMENT ON FUNCTION public.verificar_elegibilidade IS 'Verifica elegibilidade conforme interpretação da tabela CRE: match exato; sem match: artigo inexistente → NAO_CONSTA; artigo inteiro impeditivo e dispositivo não exceção → INELEGIVEL; dispositivos enumerados e fora do rol → ELEGIVEL (v202602201).';
