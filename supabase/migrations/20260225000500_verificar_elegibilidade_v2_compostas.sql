-- =====================================================
-- Migration: verificar_elegibilidade_v2 (regras compostas e condicionais)
-- =====================================================
-- Complementa a RPC atual com suporte a:
-- - dispositivos relacionados (c.c.)
-- - contexto fático mínimo para exceções condicionais
-- Mantém retrocompatibilidade: a RPC antiga continua ativa.
-- Data: 25/02/2026
-- =====================================================

DROP FUNCTION IF EXISTS public.verificar_elegibilidade_v2(VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR, JSONB, JSONB);

CREATE OR REPLACE FUNCTION public.verificar_elegibilidade_v2(
    p_codigo_norma VARCHAR,
    p_artigo VARCHAR,
    p_paragrafo VARCHAR DEFAULT NULL,
    p_inciso VARCHAR DEFAULT NULL,
    p_alinea VARCHAR DEFAULT NULL,
    p_relacionados JSONB DEFAULT '[]'::JSONB,
    p_contexto JSONB DEFAULT '{}'::JSONB
)
RETURNS TABLE (
    resultado VARCHAR,
    tipo_crime TEXT,
    observacoes TEXT,
    mensagem TEXT,
    item_alinea_e VARCHAR,
    excecoes_artigo TEXT,
    match_composto BOOLEAN,
    pendencia_validacao_manual BOOLEAN,
    regra_aplicada TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_base RECORD;
    v_codigo VARCHAR := UPPER(TRIM(COALESCE(p_codigo_norma, '')));
    v_artigo VARCHAR := TRIM(COALESCE(p_artigo, ''));
    -- Normalização defensiva para suportar entradas com símbolos (§, º) via RPC direta.
    v_paragrafo VARCHAR := TRANSLATE(LOWER(TRIM(COALESCE(p_paragrafo, ''))), '§º°ª ', '');
    v_inciso VARCHAR := TRANSLATE(UPPER(TRIM(COALESCE(p_inciso, ''))), ' ', '');
    v_alinea VARCHAR := TRANSLATE(LOWER(TRIM(COALESCE(p_alinea, ''))), ' ', '');
    v_relacionados JSONB := COALESCE(p_relacionados, '[]'::JSONB);
    v_contexto JSONB := COALESCE(p_contexto, '{}'::JSONB);

    v_resultado VARCHAR;
    v_tipo_crime TEXT;
    v_observacoes TEXT;
    v_mensagem TEXT;
    v_item_alinea_e VARCHAR;
    v_excecoes_artigo TEXT;
    v_match_composto BOOLEAN := FALSE;
    v_pendencia BOOLEAN := FALSE;
    v_regra TEXT := NULL;

    v_tem_caput_i_v BOOLEAN := FALSE;
    v_tem_art_129_p12 BOOLEAN := FALSE;
    v_tem_art_16_p2 BOOLEAN := FALSE;
    v_tem_art_301_302 BOOLEAN := FALSE;
    v_tem_art_266 BOOLEAN := FALSE;
BEGIN
    -- Base: mantém exatamente a interpretação já vigente.
    SELECT *
    INTO v_base
    FROM public.verificar_elegibilidade(
        p_codigo_norma,
        p_artigo,
        p_paragrafo,
        p_inciso,
        p_alinea
    )
    LIMIT 1;

    IF NOT FOUND THEN
        RETURN QUERY
        SELECT
            'NAO_CONSTA'::VARCHAR,
            NULL::TEXT,
            NULL::TEXT,
            'Artigo não consta na tabela de inelegibilidade.'::TEXT,
            NULL::VARCHAR,
            NULL::TEXT,
            FALSE,
            FALSE,
            NULL::TEXT;
        RETURN;
    END IF;

    v_resultado := v_base.resultado;
    v_tipo_crime := v_base.tipo_crime;
    v_observacoes := v_base.observacoes;
    v_mensagem := v_base.mensagem;
    v_item_alinea_e := v_base.item_alinea_e;
    v_excecoes_artigo := v_base.excecoes_artigo;

    -- Pré-cálculos de relacionados
    SELECT EXISTS (
        SELECT 1
        FROM jsonb_array_elements(v_relacionados) r
        WHERE UPPER(COALESCE(r->>'artigo', '')) = '149-A'
          AND COALESCE(NULLIF(TRANSLATE(LOWER(TRIM(COALESCE(r->>'paragrafo', ''))), '§º°ª ', ''), ''), '') IN ('', 'caput')
          AND UPPER(COALESCE(r->>'inciso', '')) IN ('I', 'II', 'III', 'IV', 'V')
    ) INTO v_tem_caput_i_v;

    SELECT EXISTS (
        SELECT 1
        FROM jsonb_array_elements(v_relacionados) r
        WHERE UPPER(COALESCE(r->>'artigo', '')) = '129'
          AND TRANSLATE(LOWER(COALESCE(r->>'paragrafo', '')), '§º°ª ', '') = '12'
    ) INTO v_tem_art_129_p12;

    SELECT EXISTS (
        SELECT 1
        FROM jsonb_array_elements(v_relacionados) r
        WHERE UPPER(COALESCE(r->>'artigo', '')) = '16'
          AND TRANSLATE(LOWER(COALESCE(r->>'paragrafo', '')), '§º°ª ', '') = '2'
    ) INTO v_tem_art_16_p2;

    SELECT EXISTS (
        SELECT 1
        FROM jsonb_array_elements(v_relacionados) r
        WHERE UPPER(COALESCE(r->>'artigo', '')) IN ('301', '302')
    ) INTO v_tem_art_301_302;

    SELECT EXISTS (
        SELECT 1
        FROM jsonb_array_elements(v_relacionados) r
        WHERE UPPER(COALESCE(r->>'artigo', '')) = '266'
    ) INTO v_tem_art_266;

    -- =====================================================
    -- Regras compostas / condicionais identificadas na CRE
    -- =====================================================

    -- CP 149-A: caput I a V c.c. § 1º, II
    IF v_codigo = 'CP' AND v_artigo = '149-A' AND v_paragrafo = '1' AND v_inciso = 'II' THEN
        IF v_tem_caput_i_v THEN
            v_match_composto := TRUE;
            v_pendencia := FALSE;
            v_regra := 'CP_149A_CC_CAPUT_I_A_V_PAR1_II';
            v_mensagem := 'Regra composta confirmada: Art. 149-A caput I a V c.c. §1º, II.';
        ELSE
            v_resultado := 'PENDENTE_ANALISE';
            v_match_composto := FALSE;
            v_pendencia := TRUE;
            v_regra := 'CP_149A_CC_CAPUT_I_A_V_PAR1_II';
            v_mensagem := 'Regra composta do Art. 149-A exige dispositivo relacionado no caput (incisos I a V). Informe no modo c.c.';
        END IF;
    END IF;

    -- CP 129 §§ 2º/3º c.c. § 12
    IF v_codigo = 'CP' AND v_artigo = '129' AND v_paragrafo IN ('2', '3') THEN
        IF v_tem_art_129_p12 OR LOWER(COALESCE(v_contexto->>'cp129_cc12', 'false')) = 'true' THEN
            v_match_composto := TRUE;
            v_pendencia := FALSE;
            v_regra := 'CP_129_CC_PAR12';
            v_mensagem := 'Regra composta confirmada: Art. 129 §§2º/3º c.c. §12.';
        ELSE
            v_resultado := 'PENDENTE_ANALISE';
            v_match_composto := FALSE;
            v_pendencia := TRUE;
            v_regra := 'CP_129_CC_PAR12';
            v_mensagem := 'A incidência do Art. 129 §§2º/3º depende da combinação com §12. Informe o relacionado/contexto.';
        END IF;
    END IF;

    -- Lei 10.826/03 art. 16 caput/§1º c.c. §2º
    IF v_codigo = 'LEI_10826_03' AND v_artigo = '16' AND (v_paragrafo = '' OR v_paragrafo = '1') THEN
        IF v_tem_art_16_p2 OR LOWER(COALESCE(v_contexto->>'lei10826_art16_cc2', 'false')) = 'true' THEN
            v_match_composto := TRUE;
            v_pendencia := FALSE;
            v_regra := 'LEI_10826_03_ART16_CC_PAR2';
            v_mensagem := 'Regra composta confirmada: Art. 16 c.c. §2º.';
        ELSE
            v_resultado := 'PENDENTE_ANALISE';
            v_match_composto := FALSE;
            v_pendencia := TRUE;
            v_regra := 'LEI_10826_03_ART16_CC_PAR2';
            v_mensagem := 'A incidência do Art. 16 requer validação de combinação com §2º.';
        END IF;
    END IF;

    -- CP 304: exceção somente nas figuras dos arts. 301 e 302
    IF v_codigo = 'CP' AND v_artigo = '304' AND v_paragrafo = '' AND v_inciso = '' AND v_alinea = '' THEN
        IF v_tem_art_301_302 OR LOWER(COALESCE(v_contexto->>'figuras_301_302', 'false')) = 'true' THEN
            v_resultado := 'ELEGIVEL';
            v_match_composto := TRUE;
            v_pendencia := FALSE;
            v_regra := 'CP_304_FIGURAS_301_302';
            v_mensagem := 'Exceção condicional confirmada: Art. 304 nas figuras dos arts. 301 e 302.';
        ELSE
            v_resultado := 'PENDENTE_ANALISE';
            v_match_composto := FALSE;
            v_pendencia := TRUE;
            v_regra := 'CP_304_FIGURAS_301_302';
            v_mensagem := 'A exceção do Art. 304 depende de enquadramento nas figuras dos arts. 301/302.';
        END IF;
    END IF;

    -- Lei 2.889/56 arts. 2º e 3º: exceção quando se referir ao art. 1º, alínea "e"
    IF v_codigo = 'LEI_2889_56' AND v_artigo IN ('2', '3') AND v_paragrafo = '' AND v_inciso = '' AND v_alinea = '' THEN
        IF LOWER(COALESCE(v_contexto->>'refere_art1_alinea_e', 'false')) = 'true' THEN
            v_resultado := 'ELEGIVEL';
            v_match_composto := TRUE;
            v_pendencia := FALSE;
            v_regra := 'LEI_2889_56_ART2_3_REF_ART1_E';
            v_mensagem := 'Exceção condicional confirmada: referência ao art. 1º, alínea "e".';
        ELSE
            v_resultado := 'PENDENTE_ANALISE';
            v_match_composto := FALSE;
            v_pendencia := TRUE;
            v_regra := 'LEI_2889_56_ART2_3_REF_ART1_E';
            v_mensagem := 'A exceção dos arts. 2º/3º da Lei 2.889/56 depende de referência ao art. 1º, alínea "e".';
        END IF;
    END IF;

    -- CPM 262-265: exceção quando combinados com art. 266 (culposo)
    IF v_codigo = 'CPM' AND v_artigo IN ('262', '263', '264', '265') AND v_paragrafo = '' AND v_inciso = '' AND v_alinea = '' THEN
        IF v_tem_art_266 OR LOWER(COALESCE(v_contexto->>'cpm_art266_culposo', 'false')) = 'true' THEN
            v_resultado := 'ELEGIVEL';
            v_match_composto := TRUE;
            v_pendencia := FALSE;
            v_regra := 'CPM_262_265_CC_266_CULPOSO';
            v_mensagem := 'Exceção condicional confirmada: combinação com art. 266 (culposo).';
        ELSE
            v_resultado := 'PENDENTE_ANALISE';
            v_match_composto := FALSE;
            v_pendencia := TRUE;
            v_regra := 'CPM_262_265_CC_266_CULPOSO';
            v_mensagem := 'A exceção dos arts. 262-265 do CPM depende de combinação com o art. 266 (culposo).';
        END IF;
    END IF;

    RETURN QUERY
    SELECT
        v_resultado::VARCHAR,
        v_tipo_crime::TEXT,
        v_observacoes::TEXT,
        v_mensagem::TEXT,
        v_item_alinea_e::VARCHAR,
        v_excecoes_artigo::TEXT,
        v_match_composto::BOOLEAN,
        v_pendencia::BOOLEAN,
        v_regra::TEXT;
END;
$$;

COMMENT ON FUNCTION public.verificar_elegibilidade_v2 IS 'RPC v2: mantém regra base e adiciona suporte a regras compostas (c.c.) e exceções condicionais da tabela CRE.';
GRANT EXECUTE ON FUNCTION public.verificar_elegibilidade_v2 TO postgres, service_role, anon, authenticated;
