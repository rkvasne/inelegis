-- 001_create_inelegibilidade.sql

-- Tabelas base
CREATE TABLE IF NOT EXISTS normas (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(50) NOT NULL UNIQUE,          -- ex: 'CP', 'CPM', 'lei_7716_89'
  nome_curto VARCHAR(100) NOT NULL,            -- ex: 'Código Penal', 'Lei 7.716/89'
  nome_completo TEXT NOT NULL,
  descricao TEXT
);

CREATE TABLE IF NOT EXISTS artigos_inelegiveis (
  id SERIAL PRIMARY KEY,
  norma_id INTEGER NOT NULL REFERENCES normas(id) ON DELETE CASCADE,
  artigo VARCHAR(20) NOT NULL,     -- '121', '122', '149', etc
  paragrafo VARCHAR(20),           -- '1', '2', '3', '3º', etc (normalize como você preferir)
  inciso VARCHAR(20),              -- 'I', 'II', 'III', 'IV', etc
  alinea VARCHAR(20),              -- 'a', 'b', 'c', etc
  tipo_crime TEXT,                 -- 'Crimes contra a vida', 'Crime hediondo', etc
  item_alinea_e VARCHAR(20),       -- '9', '7', '1 e 2', etc
  observacoes TEXT,
  UNIQUE(norma_id, artigo, paragrafo, inciso, alinea)
);

CREATE TABLE IF NOT EXISTS artigos_excecoes (
  id SERIAL PRIMARY KEY,
  norma_id INTEGER NOT NULL REFERENCES normas(id) ON DELETE CASCADE,
  artigo VARCHAR(20) NOT NULL,
  paragrafo VARCHAR(20),
  inciso VARCHAR(20),
  alinea VARCHAR(20),
  motivo_excecao TEXT,
  UNIQUE(norma_id, artigo, paragrafo, inciso, alinea)
);

-- Índices para busca rápida
CREATE INDEX IF NOT EXISTS idx_artigos_inelegiveis_lookup 
  ON artigos_inelegiveis(norma_id, artigo, paragrafo);

CREATE INDEX IF NOT EXISTS idx_artigos_excecoes_lookup 
  ON artigos_excecoes(norma_id, artigo, paragrafo);

-- Função de verificação de elegibilidade
CREATE OR REPLACE FUNCTION verificar_elegibilidade(
  p_codigo_norma VARCHAR,
  p_artigo VARCHAR,
  p_paragrafo VARCHAR DEFAULT NULL,
  p_inciso VARCHAR DEFAULT NULL,
  p_alinea VARCHAR DEFAULT NULL
)
RETURNS TABLE(
  resultado VARCHAR,
  tipo_crime TEXT,
  observacoes TEXT,
  motivo TEXT
) AS $$
DECLARE
  v_norma_id INTEGER;
  v_tem_excecao BOOLEAN;
  v_tem_inelegivel BOOLEAN;
BEGIN
  -- Buscar ID da norma
  SELECT id INTO v_norma_id 
  FROM normas 
  WHERE codigo = p_codigo_norma;

  IF v_norma_id IS NULL THEN
    RETURN QUERY 
      SELECT 
        'NORMA_NAO_ENCONTRADA'::VARCHAR,
        NULL::TEXT,
        NULL::TEXT,
        'Norma não cadastrada no sistema'::TEXT;
    RETURN;
  END IF;

  -- Verificar exceções (prioridade)
  SELECT EXISTS(
    SELECT 1 
    FROM artigos_excecoes 
    WHERE norma_id = v_norma_id 
      AND artigo = p_artigo
      AND (paragrafo = p_paragrafo OR (paragrafo IS NULL AND p_paragrafo IS NULL))
      AND (inciso = p_inciso OR (inciso IS NULL AND p_inciso IS NULL))
      AND (alinea = p_alinea OR (alinea IS NULL AND p_alinea IS NULL))
  ) INTO v_tem_excecao;

  IF v_tem_excecao THEN
    RETURN QUERY 
    SELECT 
      'ELEGIVEL'::VARCHAR,
      NULL::TEXT,
      NULL::TEXT,
      'Artigo consta na lista de exceções: ' || motivo_excecao AS motivo
    FROM artigos_excecoes
    WHERE norma_id = v_norma_id 
      AND artigo = p_artigo
      AND (paragrafo = p_paragrafo OR (paragrafo IS NULL AND p_paragrafo IS NULL))
      AND (inciso = p_inciso OR (inciso IS NULL AND p_inciso IS NULL))
      AND (alinea = p_alinea OR (alinea IS NULL AND p_alinea IS NULL))
    LIMIT 1;
    RETURN;
  END IF;

  -- Verificar inelegibilidade
  SELECT EXISTS(
    SELECT 1 
    FROM artigos_inelegiveis 
    WHERE norma_id = v_norma_id 
      AND artigo = p_artigo
      AND (paragrafo = p_paragrafo OR (paragrafo IS NULL AND p_paragrafo IS NULL))
      AND (inciso = p_inciso OR (inciso IS NULL AND p_inciso IS NULL))
      AND (alinea = p_alinea OR (alinea IS NULL AND p_alinea IS NULL))
  ) INTO v_tem_inelegivel;

  IF v_tem_inelegivel THEN
    RETURN QUERY 
    SELECT 
      'INELEGIVEL'::VARCHAR,
      tipo_crime,
      observacoes,
      'Artigo consta na lista de crimes que geram inelegibilidade (item ' 
        || COALESCE(item_alinea_e, '?') || ' da alínea "e" do art. 1º da LC 64/90)' AS motivo
    FROM artigos_inelegiveis
    WHERE norma_id = v_norma_id 
      AND artigo = p_artigo
      AND (paragrafo = p_paragrafo OR (paragrafo IS NULL AND p_paragrafo IS NULL))
      AND (inciso = p_inciso OR (inciso IS NULL AND p_inciso IS NULL))
      AND (alinea = p_alinea OR (alinea IS NULL AND p_alinea IS NULL))
    LIMIT 1;
    RETURN;
  END IF;

  -- Não consta nem como inelegível nem como exceção
  RETURN QUERY 
    SELECT 
      'NAO_CONSTA'::VARCHAR,
      NULL::TEXT,
      NULL::TEXT,
      'Artigo não consta na tabela de inelegibilidade nem na de exceções'::TEXT;
END;
$$ LANGUAGE plpgsql;