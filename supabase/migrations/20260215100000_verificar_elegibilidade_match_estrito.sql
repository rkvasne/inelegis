-- =====================================================
-- Migration: Match estrito para parágrafo/inciso/alínea
-- =====================================================
-- Bug: Art. 122 § 8 retornava ELEGIVEL (caput) pois a condição
-- (t.paragrafo = p_paragrafo OR t.paragrafo IS NULL) permitia
-- match com o caput quando o § informado não existe.
-- Correção: quando o usuário informa §/inciso/alínea, exigir
-- match exato. Sem match → v_record NULL → fluxo sem match.
-- Data: 15/02/2026
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
    v_impeditivos_list TEXT;
    v_excecoes_obs TEXT;
    v_mensagem TEXT;
BEGIN
    -- 1. Buscar o registro (match exato: quando usuário informa §/inciso/alínea, só aceita valor exato; não faz fallback para caput)
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

    -- 2. Buscar exceções do artigo (para resposta com match)
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

    -- 3. Resposta Final
    IF v_record IS NULL THEN
        SELECT string_agg(
            CASE
                WHEN t.paragrafo IS NOT NULL AND t.inciso IS NOT NULL THEN
                    (CASE WHEN LOWER(TRIM(t.paragrafo)) = 'unico' THEN 'parágrafo único' ELSE '§ ' || t.paragrafo END) || ', inciso ' || t.inciso
                WHEN t.paragrafo IS NOT NULL THEN
                    CASE WHEN LOWER(TRIM(t.paragrafo)) = 'unico' THEN 'parágrafo único' ELSE '§ ' || t.paragrafo END
                WHEN t.inciso IS NOT NULL THEN 'inciso ' || t.inciso
                WHEN t.alinea IS NOT NULL THEN 'alínea ' || t.alinea
                ELSE 'caput'
            END,
            '; '
        ) INTO v_impeditivos_list
        FROM public.crimes_inelegibilidade t
        WHERE t.codigo = UPPER(p_codigo_norma)
          AND t.artigo = p_artigo
          AND t.eh_excecao = FALSE;

        SELECT string_agg(
            CASE
                WHEN t.paragrafo IS NOT NULL THEN
                    CASE WHEN LOWER(TRIM(t.paragrafo)) = 'unico' THEN 'parágrafo único' ELSE '§ ' || t.paragrafo END
                WHEN t.inciso IS NOT NULL THEN 'inciso ' || t.inciso
                WHEN t.alinea IS NOT NULL THEN 'alínea ' || t.alinea
                ELSE 'caput'
            END,
            '; '
        ) INTO v_excecoes_obs
        FROM public.crimes_inelegibilidade t
        WHERE t.codigo = UPPER(p_codigo_norma)
          AND t.artigo = p_artigo
          AND t.eh_excecao = TRUE;

        IF v_impeditivos_list IS NOT NULL AND v_impeditivos_list <> '' THEN
            v_mensagem := 'Dispositivo não mapeado como impeditivo. Atenção: o Art. ' || p_artigo || ' possui combinação(ões) exata(s) que produzem inelegibilidade (' || v_impeditivos_list || '). Verifique na sentença se informou o dispositivo corretamente.';
            RETURN QUERY SELECT
                'ELEGIVEL'::VARCHAR, NULL::TEXT, NULL::TEXT,
                v_mensagem::TEXT, NULL::VARCHAR, NULL::TEXT;
        ELSIF v_excecoes_obs IS NOT NULL AND v_excecoes_obs <> '' THEN
            v_mensagem := 'Dispositivo não mapeado como impeditivo. O Art. ' || p_artigo || ' possui exceção(ões) (' || v_excecoes_obs || ') que seriam elegíveis.';
            RETURN QUERY SELECT
                'NAO_CONSTA'::VARCHAR, NULL::TEXT, NULL::TEXT,
                v_mensagem::TEXT, NULL::VARCHAR, NULL::TEXT;
        ELSE
            RETURN QUERY SELECT
                'NAO_CONSTA'::VARCHAR, NULL::TEXT, NULL::TEXT,
                'Dispositivo não mapeado como impeditivo.'::TEXT, NULL::VARCHAR, NULL::TEXT;
        END IF;
    ELSE
        RETURN QUERY SELECT
            (CASE WHEN v_record.eh_excecao THEN 'ELEGIVEL' ELSE 'INELEGIVEL' END)::VARCHAR,
            v_record.tipo_crime::TEXT, v_record.observacoes::TEXT,
            ('Artigo consta na Tabela Oficial da Corregedoria (Item ' || COALESCE(v_record.item_alinea_e, '?') || ' da alínea "e")')::TEXT,
            v_record.item_alinea_e::VARCHAR, v_excecoes_list::TEXT;
    END IF;
END;
$$;

COMMENT ON FUNCTION public.verificar_elegibilidade IS 'Verifica elegibilidade por match exato estrito. §/inciso/alínea informados exigem valor exato na tabela (v2026021510).';
