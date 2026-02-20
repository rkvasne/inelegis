-- =====================================================
-- Migration: analytics_events
-- =====================================================
-- Tabela de analytics + views + funções + RLS.
-- Preserva dados: CREATE IF NOT EXISTS.
-- Data: 25/02/2026
-- =====================================================

CREATE TABLE IF NOT EXISTS analytics_events (
  id BIGSERIAL PRIMARY KEY,
  type VARCHAR(20) NOT NULL,
  user_id VARCHAR(100) NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  lei VARCHAR(50),
  artigo VARCHAR(20),
  resultado VARCHAR(20),
  tem_excecao BOOLEAN,
  tempo_resposta INTEGER,
  browser TEXT,
  version VARCHAR(20),
  data JSONB
);

CREATE INDEX IF NOT EXISTS idx_analytics_type ON analytics_events(type);
CREATE INDEX IF NOT EXISTS idx_analytics_timestamp ON analytics_events(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_user ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_lei ON analytics_events(lei) WHERE lei IS NOT NULL;

CREATE OR REPLACE VIEW analytics_stats AS
SELECT
  COUNT(*) as total_events,
  COUNT(*) FILTER (WHERE type = 'search') as total_searches,
  COUNT(*) FILTER (WHERE type = 'error') as total_errors,
  COUNT(*) FILTER (WHERE type = 'action') as total_actions,
  COUNT(DISTINCT user_id) as unique_users,
  MIN(timestamp) as first_event,
  MAX(timestamp) as last_event
FROM analytics_events;

CREATE OR REPLACE VIEW analytics_top_artigos AS
SELECT
  lei,
  artigo,
  COUNT(*) as count
FROM analytics_events
WHERE type = 'search' AND lei IS NOT NULL AND artigo IS NOT NULL
GROUP BY lei, artigo
ORDER BY count DESC
LIMIT 20;

CREATE OR REPLACE VIEW analytics_result_distribution AS
SELECT
  resultado,
  COUNT(*) as count
FROM analytics_events
WHERE type = 'search' AND resultado IS NOT NULL
GROUP BY resultado;

CREATE OR REPLACE VIEW analytics_timeline AS
SELECT
  DATE(timestamp) as date,
  COUNT(*) as searches
FROM analytics_events
WHERE type = 'search' AND timestamp > NOW() - INTERVAL '30 days'
GROUP BY DATE(timestamp)
ORDER BY date DESC;

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated read analytics" ON public.analytics_events;
CREATE POLICY "Allow authenticated read analytics"
ON public.analytics_events FOR SELECT
TO authenticated
USING (true);

GRANT SELECT ON public.analytics_events TO authenticated;

CREATE OR REPLACE FUNCTION insert_analytics_event(
  p_type VARCHAR,
  p_user_id VARCHAR,
  p_lei VARCHAR DEFAULT NULL,
  p_artigo VARCHAR DEFAULT NULL,
  p_resultado VARCHAR DEFAULT NULL,
  p_tem_excecao BOOLEAN DEFAULT NULL,
  p_tempo_resposta INTEGER DEFAULT NULL,
  p_browser TEXT DEFAULT NULL,
  p_version VARCHAR DEFAULT NULL,
  p_data JSONB DEFAULT NULL
)
RETURNS analytics_events AS $$
DECLARE
  v_new_record analytics_events;
BEGIN
  INSERT INTO analytics_events (
    type, user_id, lei, artigo, resultado,
    tem_excecao, tempo_resposta, browser, version, data
  )
  VALUES (
    p_type, p_user_id, p_lei, p_artigo, p_resultado,
    p_tem_excecao, p_tempo_resposta, p_browser, p_version, p_data
  )
  RETURNING * INTO v_new_record;
  RETURN v_new_record;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS TABLE(
  total_searches BIGINT,
  total_users BIGINT,
  total_errors BIGINT,
  inelegiveis BIGINT,
  elegiveis BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) FILTER (WHERE type = 'search')::BIGINT as total_searches,
    COUNT(DISTINCT user_id)::BIGINT as total_users,
    COUNT(*) FILTER (WHERE type = 'error')::BIGINT as total_errors,
    COUNT(*) FILTER (WHERE resultado = 'inelegivel')::BIGINT as inelegiveis,
    COUNT(*) FILTER (WHERE resultado = 'elegivel')::BIGINT as elegiveis
  FROM analytics_events;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
