-- Migration: Keepalive System (Heartbeat & Historical Events)
-- Author: Agents Rules (Based on Suprix Pattern)
-- Target: Supabase (PostgreSQL)
-- Version: 0.3.9 (v0.5.4 Hub)

-- 1. Table: keepalive (Singleton / Current Status)
-- Mantém apenas O ÚLTIMO status (id=1 fixo). Ideal para dashboards "Status Page".
CREATE TABLE IF NOT EXISTS public.keepalive (
    id BIGINT NOT NULL PRIMARY KEY DEFAULT 1,
    project_slug TEXT NOT NULL DEFAULT 'inelegis',
    environment TEXT NOT NULL DEFAULT 'prod',
    region TEXT,
    source TEXT NOT NULL DEFAULT 'unknown',
    last_ping_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_success_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_error TEXT,
    latency_ms INTEGER,
    schema_version INTEGER NOT NULL DEFAULT 1,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    -- Constraint para garantir Singleton (apenas ID 1 permitido)
    CONSTRAINT keepalive_singleton_check CHECK (id = 1)
);

-- Ativa RLS (Segurança)
ALTER TABLE public.keepalive ENABLE ROW LEVEL SECURITY;

-- Política RLS: Público pode ler (Dashboard / Status), Apenas anon para Heartbeat simplificado
CREATE POLICY "Allow public read access" ON public.keepalive FOR SELECT USING (true);
CREATE POLICY "Allow anon update access" ON public.keepalive FOR UPDATE USING (true);
CREATE POLICY "Allow anon insert access" ON public.keepalive FOR INSERT WITH CHECK (true);

-- 2. Table: keepalive_events (Historical Log)
-- Registra CADA ping para métricas de uptime e latência.
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

-- Ativa RLS
ALTER TABLE public.keepalive_events ENABLE ROW LEVEL SECURITY;

-- Política RLS: Anon pode inserir logs
CREATE POLICY "Allow anon insert access" ON public.keepalive_events FOR INSERT WITH CHECK (true);

-- 3. Índices para Performance
CREATE INDEX IF NOT EXISTS idx_keepalive_events_project_env ON public.keepalive_events (project_slug, environment);
CREATE INDEX IF NOT EXISTS idx_keepalive_events_ping_at ON public.keepalive_events (ping_at DESC);
