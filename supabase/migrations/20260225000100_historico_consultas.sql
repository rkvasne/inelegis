-- =====================================================
-- Migration: historico_consultas
-- =====================================================
-- Tabela de histórico de consultas + funções + RLS.
-- Preserva dados: CREATE IF NOT EXISTS.
-- Data: 25/02/2026
-- =====================================================

CREATE TABLE IF NOT EXISTS historico_consultas (
  id BIGSERIAL PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  lei VARCHAR(50) NOT NULL,
  artigo VARCHAR(20) NOT NULL,
  resultado VARCHAR(20) NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  tipo_crime TEXT,
  observacoes TEXT,
  inciso VARCHAR(50),
  alinea VARCHAR(50),
  paragrafo VARCHAR(50),
  motivo_detalhado TEXT,
  excecoes_citadas TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_historico_user_id ON historico_consultas(user_id);
CREATE INDEX IF NOT EXISTS idx_historico_timestamp ON historico_consultas(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_historico_user_timestamp ON historico_consultas(user_id, timestamp DESC);

ALTER TABLE historico_consultas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anonymous insert" ON historico_consultas;
CREATE POLICY "Allow anonymous insert" ON historico_consultas
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can read own history" ON public.historico_consultas;
CREATE POLICY "Users can read own history"
ON public.historico_consultas
FOR SELECT
TO anon
USING (
    user_id = current_setting('app.user_id', true)
    OR user_id = current_setting('request.jwt.claims', true)::json->>'user_id'
);

DROP POLICY IF EXISTS "Allow authenticated read all history" ON public.historico_consultas;
CREATE POLICY "Allow authenticated read all history"
ON public.historico_consultas FOR SELECT
TO authenticated
USING (true);

CREATE OR REPLACE FUNCTION public.add_to_history(
  p_user_id VARCHAR,
  p_lei VARCHAR,
  p_artigo VARCHAR,
  p_resultado VARCHAR,
  p_tipo_crime TEXT DEFAULT NULL,
  p_observacoes TEXT DEFAULT NULL,
  p_inciso VARCHAR DEFAULT NULL,
  p_alinea VARCHAR DEFAULT NULL,
  p_paragrafo VARCHAR DEFAULT NULL,
  p_motivo_detalhado TEXT DEFAULT NULL,
  p_excecoes_citadas TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
)
RETURNS public.historico_consultas AS $$
DECLARE
  v_new_record public.historico_consultas;
BEGIN
  INSERT INTO public.historico_consultas (
    user_id, lei, artigo, resultado, tipo_crime, observacoes,
    inciso, alinea, paragrafo, motivo_detalhado, excecoes_citadas, metadata
  )
  VALUES (
    p_user_id, p_lei, p_artigo, p_resultado, p_tipo_crime, p_observacoes,
    p_inciso, p_alinea, p_paragrafo, p_motivo_detalhado, p_excecoes_citadas,
    COALESCE(p_metadata, '{}'::jsonb)
  )
  RETURNING * INTO v_new_record;
  RETURN v_new_record;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;

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
      user_id = current_setting('app.user_id', true)
      OR user_id = current_setting('request.jwt.claims', true)::json->>'user_id'
    )
  ORDER BY timestamp DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;

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

CREATE OR REPLACE FUNCTION public.set_app_user_id(p_user_id TEXT)
RETURNS VOID AS $$
BEGIN
    PERFORM set_config('app.user_id', p_user_id, true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT SELECT ON public.historico_consultas TO authenticated;
GRANT INSERT ON public.historico_consultas TO anon;
