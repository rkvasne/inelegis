-- =====================================================
-- Migration: keepalive hub compat (status_code/response_time_ms)
-- =====================================================
-- Objetivo:
-- 1) Alinhar keepalive_events ao checklist de compliance do Hub
-- 2) Preservar retrocompatibilidade com campos legados (status/latency_ms)
-- Data: 26/02/2026
-- =====================================================

ALTER TABLE public.keepalive_events
ADD COLUMN IF NOT EXISTS status_code INTEGER;

ALTER TABLE public.keepalive_events
ADD COLUMN IF NOT EXISTS response_time_ms INTEGER;

-- Backfill inicial a partir dos campos legados, sem perda de histórico.
UPDATE public.keepalive_events
SET status_code = CASE
    WHEN LOWER(COALESCE(status, '')) = 'ok' THEN 200
    WHEN LOWER(COALESCE(status, '')) = 'error' THEN 500
    ELSE NULL
END
WHERE status_code IS NULL;

UPDATE public.keepalive_events
SET response_time_ms = latency_ms
WHERE response_time_ms IS NULL
  AND latency_ms IS NOT NULL;

COMMENT ON COLUMN public.keepalive_events.status_code IS 'Código HTTP do ping recebido pelo receptor de keepalive.';
COMMENT ON COLUMN public.keepalive_events.response_time_ms IS 'Tempo de resposta em ms (padrão Hub). Campo legado: latency_ms.';
