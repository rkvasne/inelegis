-- =====================================================
-- Migration: keepalive_events RLS hardening (service_role only)
-- =====================================================
-- Objetivo: garantir compliance com Prompt 26 / Hub Keepalive Pattern
-- - keepalive_events: leitura/escrita interna restrita à service_role
-- - remove políticas legadas de leitura pública/autenticada (se existirem)
-- Data: 03/03/2026
-- =====================================================

ALTER TABLE public.keepalive_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated read access" ON public.keepalive_events;
DROP POLICY IF EXISTS "Allow public read access" ON public.keepalive_events;
DROP POLICY IF EXISTS "Allow service role full access" ON public.keepalive_events;

CREATE POLICY "Allow service role full access"
ON public.keepalive_events
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');
