-- Migration: Secure History Functions
-- Descrição: Recria as funções de histórico como SECURITY INVOKER para garantir RLS.
-- Versão: 0.3.15

-- 1. Função: get_user_history
CREATE OR REPLACE FUNCTION public.get_user_history(
  p_user_id VARCHAR,
  p_limit INTEGER DEFAULT 50
)
RETURNS SETOF public.historico_consultas AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM public.historico_consultas
  WHERE user_id = p_user_id
    AND (
      user_id = current_setting('app.user_id', true) -- Contexto manual via API
      OR user_id = current_setting('request.jwt.claims', true)::json->>'user_id' -- JWT se houver
    )
  ORDER BY timestamp DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;

-- 2. Função: add_to_history
CREATE OR REPLACE FUNCTION public.add_to_history(
  p_user_id VARCHAR,
  p_lei VARCHAR,
  p_artigo VARCHAR,
  p_resultado VARCHAR,
  p_tipo_crime TEXT DEFAULT NULL,
  p_observacoes TEXT DEFAULT NULL
)
RETURNS public.historico_consultas AS $$
DECLARE
  v_new_record public.historico_consultas;
BEGIN
  -- Nota: Como o anon tem permissão de INSERT, SECURITY INVOKER funciona.
  INSERT INTO public.historico_consultas (user_id, lei, artigo, resultado, tipo_crime, observacoes)
  VALUES (p_user_id, p_lei, p_artigo, p_resultado, p_tipo_crime, p_observacoes)
  RETURNING * INTO v_new_record;
  
  RETURN v_new_record;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;

-- 3. Função: get_user_stats
CREATE OR REPLACE FUNCTION public.get_user_stats(p_user_id VARCHAR)
RETURNS TABLE(
  total BIGINT,
  inelegiveis BIGINT,
  elegiveis BIGINT,
  nao_consta BIGINT,
  primeira_consulta TIMESTAMPTZ,
  ultima_consulta TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::BIGINT as total,
    COUNT(*) FILTER (WHERE resultado = 'inelegivel')::BIGINT as inelegiveis,
    COUNT(*) FILTER (WHERE resultado = 'elegivel')::BIGINT as elegiveis,
    COUNT(*) FILTER (WHERE resultado = 'nao_consta')::BIGINT as nao_consta,
    MIN(timestamp) as primeira_consulta,
    MAX(timestamp) as ultima_consulta
  FROM public.historico_consultas
  WHERE user_id = p_user_id
    AND (
      user_id = current_setting('app.user_id', true)
      OR user_id = current_setting('request.jwt.claims', true)::json->>'user_id'
    );
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;

-- 4. Função auxiliar de contexto (Sessão Vercel)
CREATE OR REPLACE FUNCTION public.set_app_user_id(p_user_id TEXT)
RETURNS VOID AS $$
BEGIN
    PERFORM set_config('app.user_id', p_user_id, true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Reforçar Políticas RLS
DROP POLICY IF EXISTS "Users can read own history" ON public.historico_consultas;

CREATE POLICY "Users can read own history" 
ON public.historico_consultas 
FOR SELECT 
TO anon
USING (
    user_id = current_setting('app.user_id', true)
    OR user_id = current_setting('request.jwt.claims', true)::json->>'user_id'
);
