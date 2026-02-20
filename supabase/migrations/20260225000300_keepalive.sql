-- =====================================================
-- Migration: keepalive (padrão Hub - system/scaffolding/keepalive)
-- =====================================================
-- Tabelas de status e eventos de heartbeat.
-- Sobe o padrão do Hub: E:\Agents\system\scaffolding\keepalive\migration-keepalive.sql
-- Preserva dados: CREATE IF NOT EXISTS. NUNCA DROP.
-- Data: 25/02/2026
-- =====================================================

-- 1. Tabela keepalive (Singleton / Status atual)
CREATE TABLE IF NOT EXISTS public.keepalive (
    id BIGINT NOT NULL PRIMARY KEY DEFAULT 1,
    project_slug TEXT NOT NULL DEFAULT 'project',
    environment TEXT NOT NULL DEFAULT 'prod',
    region TEXT,
    source TEXT NOT NULL DEFAULT 'unknown',
    last_ping_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_success_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_error TEXT,
    latency_ms INTEGER,
    schema_version INTEGER NOT NULL DEFAULT 1,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    CONSTRAINT keepalive_singleton_check CHECK (id = 1)
);

-- 2. Tabela keepalive_events (histórico de pings)
CREATE TABLE IF NOT EXISTS public.keepalive_events (
    id BIGSERIAL PRIMARY KEY,
    project_slug TEXT NOT NULL,
    environment TEXT NOT NULL,
    region TEXT,
    source TEXT NOT NULL,
    ping_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'ok',
    latency_ms INTEGER,
    error TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Índices para performance
CREATE INDEX IF NOT EXISTS idx_keepalive_events_project_env ON public.keepalive_events (project_slug, environment);
CREATE INDEX IF NOT EXISTS idx_keepalive_events_ping_at ON public.keepalive_events (ping_at DESC);

ALTER TABLE public.keepalive ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.keepalive_events ENABLE ROW LEVEL SECURITY;

-- RLS: público lê keepalive (dashboard); service_role escreve
DROP POLICY IF EXISTS "Allow public read access" ON public.keepalive;
CREATE POLICY "Allow public read access" ON public.keepalive FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow service role full access" ON public.keepalive;
CREATE POLICY "Allow service role full access" ON public.keepalive FOR ALL USING (auth.role() = 'service_role');

-- RLS: apenas service_role acessa keepalive_events
DROP POLICY IF EXISTS "Allow service role full access" ON public.keepalive_events;
CREATE POLICY "Allow service role full access" ON public.keepalive_events FOR ALL USING (auth.role() = 'service_role');
