-- =====================================================
-- Migration: Grant EXECUTE nas RPCs de histórico para anon
-- =====================================================
-- Corrige 401 Unauthorized ao chamar add_to_history do frontend.
-- Data: 25/02/2026
-- =====================================================

-- Frontend (anon) precisa executar estas funções
GRANT EXECUTE ON FUNCTION public.add_to_history(VARCHAR, VARCHAR, VARCHAR, VARCHAR, TEXT, TEXT, VARCHAR, VARCHAR, VARCHAR, TEXT, TEXT, JSONB) TO anon;
GRANT EXECUTE ON FUNCTION public.get_user_history(VARCHAR, INTEGER) TO anon;
GRANT EXECUTE ON FUNCTION public.get_user_stats(VARCHAR) TO anon;
GRANT EXECUTE ON FUNCTION public.set_app_user_id(TEXT) TO anon;
