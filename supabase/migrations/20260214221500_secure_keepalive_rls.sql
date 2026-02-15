-- Migration: Secure Keepalive RLS
-- Descrição: Restringe o acesso às tabelas de monitoramento seguindo o padrão de Segurança Hub.
-- Autor: Antigravity (v0.3.14)

-- ==========================================================
-- 1. Tabela: public.keepalive (Status Atual)
-- ==========================================================

-- Remover políticas inseguras herdadas
DROP POLICY IF EXISTS "Allow public read access" ON public.keepalive;
DROP POLICY IF EXISTS "Allow anon update access" ON public.keepalive;
DROP POLICY IF EXISTS "Allow anon insert access" ON public.keepalive;

-- Garantir que RLS está ativo
ALTER TABLE public.keepalive ENABLE ROW LEVEL SECURITY;

-- POLÍTICA: Leitura Pública (Dashboard Administrativo)
-- Permite que o frontend consulte o status de Uptime usando a anon_key.
CREATE POLICY "Allow public read access" 
ON public.keepalive FOR SELECT 
USING (true);

-- POLÍTICA: Escrita Protegida (Edge Functions)
-- Permite que apenas a service_role (usada pela Edge Function) atualize o status.
-- O Cloudflare não tem acesso direto; ele passa pelo receptor que usa SERVICE_ROLE.
CREATE POLICY "Allow service role full access" 
ON public.keepalive FOR ALL 
USING (auth.role() = 'service_role');


-- ==========================================================
-- 2. Tabela: public.keepalive_events (Histórico)
-- ==========================================================

-- Remover políticas inseguras herdadas
DROP POLICY IF EXISTS "Allow anon insert access" ON public.keepalive_events;

-- Garantir que RLS está ativo
ALTER TABLE public.keepalive_events ENABLE ROW LEVEL SECURITY;

-- POLÍTICA: Acesso Total Restrito (Service Role)
-- O histórico de eventos (latência, erros) é de uso técnico. 
-- Não deve ser exposto publicamente via anon_key.
CREATE POLICY "Allow service role full access" 
ON public.keepalive_events FOR ALL 
USING (auth.role() = 'service_role');

-- Nota: Caso o dashboard precise exibir gráficos de latência no futuro via anon_key, 
-- precisaremos adicionar uma política de SELECT aqui.
