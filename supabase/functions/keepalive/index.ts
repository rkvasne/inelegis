// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/**
 * Inelegis Keepalive Receiver (Supabase Edge Function)
 * Padrão: Hub-First / Hub Keepalive Pattern
 * @version 0.3.10
 */

const KEEPALIVE_TOKEN = Deno.env.get("KEEPALIVE_TOKEN");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY =
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

Deno.serve(async (req: Request) => {
  // 1. Método HTTP (Apenas POST)
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 2. Validação de Token
  const authHeader = req.headers.get("Authorization");
  const providedToken = authHeader?.startsWith("Bearer ")
    ? authHeader.substring(7)
    : req.headers.get("x-keepalive-token");

  if (!KEEPALIVE_TOKEN || providedToken !== KEEPALIVE_TOKEN) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        persistSession: false,
      },
    });

    const payload = await req.json().catch(() => ({}));
    const now = new Date().toISOString();
    const source = payload.source || "external-trigger";

    // 3. Heartbeat (Status Principal)
    const { error: heartbeatError } = await supabase.from("keepalive").upsert({
      id: 1,
      project_slug: "inelegis",
      environment: "prod",
      source: source,
      last_ping_at: now,
      last_success_at: now,
      schema_version: 1,
    });

    if (heartbeatError) throw heartbeatError;

    // 4. Registro de Evento Histórico
    const { error: eventError } = await supabase
      .from("keepalive_events")
      .insert({
        project_slug: "inelegis",
        environment: "prod",
        source: source,
        ping_at: now,
        status: "ok",
        latency_ms: payload.latency_ms || null,
        metadata: { region: payload.region || "edge" },
      });

    if (eventError)
      console.error("[Keepalive] Erro ao gravar evento:", eventError);

    return new Response(
      JSON.stringify({ ok: true, timestamp: now, source: source }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("[Keepalive] Erro Fatal:", errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
