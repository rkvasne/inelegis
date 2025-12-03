-- 999_fix_ambiguous_function.sql
-- Remove TODAS as sobrecargas possíveis para resolver o erro PGRST203 (Function Overloading)

-- Drop da versão com VARCHAR (causadora provável do conflito)
DROP FUNCTION IF EXISTS public.verificar_elegibilidade(character varying, character varying, character varying, character varying, character varying);

-- Drop da versão com TEXT (versão canônica atual)
DROP FUNCTION IF EXISTS public.verificar_elegibilidade(text, text, text, text, text);

-- Recriar a função usando TEXT (Formato Padrão PostgREST)
CREATE OR REPLACE FUNCTION public.verificar_elegibilidade(
    p_codigo_norma TEXT,
    p_artigo TEXT,
    p_paragrafo TEXT DEFAULT NULL,
    p_inciso TEXT DEFAULT NULL,
    p_alinea TEXT DEFAULT NULL
)
RETURNS TABLE (
    resultado VARCHAR,
    tipo_crime TEXT,
    observacoes TEXT,
    motivo TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_norma_id INTEGER;
    v_tem_inelegivel BOOLEAN;
    v_tem_excecao BOOLEAN;
BEGIN
    -- Obter o ID da norma
    SELECT n.id INTO v_norma_id FROM public.normas n WHERE n.codigo = p_codigo_norma;
    
    IF v_norma_id IS NULL THEN
        RETURN QUERY SELECT 'ELEGIVEL'::VARCHAR, NULL::TEXT, NULL::TEXT, 'Norma não encontrada na base.'::TEXT;
        RETURN;
    END IF;

    -- Verificar inelegibilidade usando alias 'ai'
    SELECT EXISTS(
        SELECT 1 FROM public.artigos_inelegiveis ai
        WHERE ai.norma_id = v_norma_id AND ai.artigo = p_artigo
          AND (p_paragrafo IS NULL OR ai.paragrafo = p_paragrafo)
          AND (p_inciso IS NULL OR ai.inciso = p_inciso)
          AND (p_alinea IS NULL OR ai.alinea = p_alinea)
    ) INTO v_tem_inelegivel;

    IF v_tem_inelegivel THEN
        RETURN QUERY 
        SELECT 
          'INELEGIVEL'::VARCHAR,
          ai.tipo_crime,
          ai.observacoes,
          'Artigo consta na tabela de inelegibilidade (Item ' || COALESCE(ai.item_alinea_e, '?') || ')'
        FROM public.artigos_inelegiveis ai
        WHERE ai.norma_id = v_norma_id AND ai.artigo = p_artigo
          AND (p_paragrafo IS NULL OR ai.paragrafo = p_paragrafo)
          AND (p_inciso IS NULL OR ai.inciso = p_inciso)
          AND (p_alinea IS NULL OR ai.alinea = p_alinea)
        LIMIT 1;
        RETURN;
    END IF;

    -- Verificar exceção usando alias 'ae'
    SELECT EXISTS(
        SELECT 1 FROM public.artigos_excecoes ae
        WHERE ae.norma_id = v_norma_id AND ae.artigo = p_artigo
          AND (p_paragrafo IS NULL OR ae.paragrafo = p_paragrafo)
          AND (p_inciso IS NULL OR ae.inciso = p_inciso)
          AND (p_alinea IS NULL OR ae.alinea = p_alinea)
    ) INTO v_tem_excecao;

    IF v_tem_excecao THEN
        RETURN QUERY 
        SELECT 
          'ELEGIVEL'::VARCHAR,
          NULL::TEXT,
          ae.motivo_excecao,
          'Artigo consta ressalvado na tabela de exceções.'
        FROM public.artigos_excecoes ae
        WHERE ae.norma_id = v_norma_id AND ae.artigo = p_artigo
          AND (p_paragrafo IS NULL OR ae.paragrafo = p_paragrafo)
          AND (p_inciso IS NULL OR ae.inciso = p_inciso)
          AND (p_alinea IS NULL OR ae.alinea = p_alinea)
        LIMIT 1;
        RETURN;
    END IF;

    -- Caso padrão
    RETURN QUERY SELECT 'NAO_CONSTA'::VARCHAR, NULL::TEXT, NULL::TEXT, 'Artigo não mapeado como impeditivo.'::TEXT;
END;
$$;

-- Permissões
GRANT EXECUTE ON FUNCTION public.verificar_elegibilidade(text, text, text, text, text) TO anon, authenticated, service_role;
