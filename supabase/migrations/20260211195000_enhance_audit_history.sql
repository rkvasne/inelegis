-- 20260211195000_enhance_audit_history.sql
-- Melhora a estrutura de histórico para fins de auditoria e precisão técnica.
-- Author: Antigravity

-- 1. Adicionar novas colunas para auditoria detalhada
ALTER TABLE public.historico_consultas 
ADD COLUMN IF NOT EXISTS inciso VARCHAR(50),
ADD COLUMN IF NOT EXISTS alinea VARCHAR(50),
ADD COLUMN IF NOT EXISTS paragrafo VARCHAR(50),
ADD COLUMN IF NOT EXISTS motivo_detalhado TEXT,
ADD COLUMN IF NOT EXISTS excecoes_citadas TEXT,
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- 2. Atualizar a função RPC para suportar os novos campos
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
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS public.historico_consultas AS $$
DECLARE
  v_new_record public.historico_consultas;
BEGIN
  INSERT INTO public.historico_consultas (
    user_id, lei, artigo, resultado, tipo_crime, 
    observacoes, inciso, alinea, paragrafo, 
    motivo_detalhado, excecoes_citadas, metadata
  )
  VALUES (
    p_user_id, p_lei, p_artigo, p_resultado, p_tipo_crime, 
    p_observacoes, p_inciso, p_alinea, p_paragrafo, 
    p_motivo_detalhado, p_excecoes_citadas, p_metadata
  )
  RETURNING * INTO v_new_record;
  
  RETURN v_new_record;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Garantir permissões
GRANT EXECUTE ON FUNCTION public.add_to_history TO anon, authenticated, service_role;
