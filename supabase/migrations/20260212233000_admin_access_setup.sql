-- 20260212233000_admin_access_setup.sql
-- Objetivo: Configurar acesso administrativo e seguranca para o Dashboard.
-- Author: Antigravity

-- 1. Habilitar RLS em analytics_events (se ainda nao estiver)
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- 2. Criar Politica para Admins (Autenticados) lerem Analytics
DROP POLICY IF EXISTS "Allow authenticated read analytics" ON public.analytics_events;
CREATE POLICY "Allow authenticated read analytics" 
ON public.analytics_events FOR SELECT 
TO authenticated 
USING (true);

-- 3. Criar Politica para Admins (Autenticados) lerem Historico Geral
DROP POLICY IF EXISTS "Allow authenticated read all history" ON public.historico_consultas;
CREATE POLICY "Allow authenticated read all history" 
ON public.historico_consultas FOR SELECT 
TO authenticated 
USING (true);

-- 4. Garantir que anonimos so possam INSERIR (nao ler tudo)
-- A politica "Users can read own history" ja protege o historico baseada em user_id/app.user_id.

-- 5. Revogar EXECUTE publico em funcoes administrativas (Opcional, mas recomendado)
-- REVOKE EXECUTE ON FUNCTION public.get_dashboard_stats() FROM PUBLIC;
-- GRANT EXECUTE ON FUNCTION public.get_dashboard_stats() TO authenticated, service_role;
