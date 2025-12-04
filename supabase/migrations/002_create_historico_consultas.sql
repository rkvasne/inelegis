-- 002_create_historico_consultas.sql
DROP TABLE IF EXISTS historico_consultas CASCADE;
DROP FUNCTION IF EXISTS get_user_history(varchar, integer);
DROP FUNCTION IF EXISTS add_to_history(varchar, varchar, varchar, varchar, text, text);
DROP FUNCTION IF EXISTS get_user_stats(varchar);

-- Tabela para armazenar histórico de consultas (substitui Redis)

CREATE TABLE IF NOT EXISTS historico_consultas (
  id BIGSERIAL PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,          -- ID anônimo do usuário (cookie)
  lei VARCHAR(50) NOT NULL,                -- Código da lei consultada
  artigo VARCHAR(20) NOT NULL,             -- Número do artigo
  resultado VARCHAR(20) NOT NULL,          -- 'inelegivel', 'elegivel', 'nao_consta'
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  
  -- Metadados opcionais
  tipo_crime TEXT,
  observacoes TEXT
);

-- Índices para buscas frequentes
CREATE INDEX IF NOT EXISTS idx_historico_user_id 
  ON historico_consultas(user_id);

CREATE INDEX IF NOT EXISTS idx_historico_timestamp 
  ON historico_consultas(timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_historico_user_timestamp 
  ON historico_consultas(user_id, timestamp DESC);

-- RLS (Row Level Security) - cada usuário vê apenas seu histórico
ALTER TABLE historico_consultas ENABLE ROW LEVEL SECURITY;

-- Policy: usuários anônimos podem inserir
CREATE POLICY "Allow anonymous insert" ON historico_consultas
  FOR INSERT
  WITH CHECK (true);

-- Policy: usuários podem ler apenas seu próprio histórico
CREATE POLICY "Users can read own history" ON historico_consultas
  FOR SELECT
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'user_id'
         OR user_id = current_setting('app.user_id', true));

-- Função para buscar histórico de um usuário
CREATE OR REPLACE FUNCTION get_user_history(
  p_user_id VARCHAR,
  p_limit INTEGER DEFAULT 50
)
RETURNS SETOF historico_consultas AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM historico_consultas
  WHERE user_id = p_user_id
  ORDER BY timestamp DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para adicionar consulta ao histórico
CREATE OR REPLACE FUNCTION add_to_history(
  p_user_id VARCHAR,
  p_lei VARCHAR,
  p_artigo VARCHAR,
  p_resultado VARCHAR,
  p_tipo_crime TEXT DEFAULT NULL,
  p_observacoes TEXT DEFAULT NULL
)
RETURNS historico_consultas AS $$
DECLARE
  v_new_record historico_consultas;
BEGIN
  INSERT INTO historico_consultas (user_id, lei, artigo, resultado, tipo_crime, observacoes)
  VALUES (p_user_id, p_lei, p_artigo, p_resultado, p_tipo_crime, p_observacoes)
  RETURNING * INTO v_new_record;
  
  RETURN v_new_record;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para estatísticas do usuário
CREATE OR REPLACE FUNCTION get_user_stats(p_user_id VARCHAR)
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
  FROM historico_consultas
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
