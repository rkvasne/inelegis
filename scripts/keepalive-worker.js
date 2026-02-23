/**
 * Cloudflare Worker — Keepalive (padrão Hub)
 * Pinger externo: envia POST para o endpoint do projeto a cada 30 min.
 *
 * Configuração no Dashboard Cloudflare:
 * - Trigger Cron: a cada 30 minutos (ex.: 0,30 * * * * ou equivalente)
 * - Variables: KEEPALIVE_URL, KEEPALIVE_TOKEN (mesmo valor do .env.local / Vercel)
 */
export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(handleKeepalive(env, null));
  },

  async fetch(request, env, ctx) {
    return await handleKeepalive(env, request);
  },
};

function resolveRegion(env, request) {
  const cfColo = request?.cf?.colo;
  if (cfColo) return cfColo;

  if (typeof env.KEEPALIVE_REGION === "string" && env.KEEPALIVE_REGION.trim()) {
    return env.KEEPALIVE_REGION.trim();
  }

  return "edge";
}

async function handleKeepalive(env, request) {
  const KEEPALIVE_URL = env.KEEPALIVE_URL;
  const KEEPALIVE_TOKEN = env.KEEPALIVE_TOKEN;
  const KEEPALIVE_PROJECT_SLUG = env.KEEPALIVE_PROJECT_SLUG;
  const KEEPALIVE_ENVIRONMENT = env.KEEPALIVE_ENVIRONMENT;

  if (!KEEPALIVE_URL || !KEEPALIVE_TOKEN) {
    // eslint-disable-next-line no-console -- Worker: único canal de log
    console.error("❌ Configuração ausente: KEEPALIVE_URL ou KEEPALIVE_TOKEN");
    return new Response("Missing configuration", { status: 500 });
  }

  const start = Date.now();

  try {
    const response = await fetch(KEEPALIVE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${KEEPALIVE_TOKEN}`,
        "User-Agent": "Cloudflare-Worker-Keepalive/1.0",
      },
      body: JSON.stringify({
        source: "cloudflare-worker",
        project_slug: KEEPALIVE_PROJECT_SLUG || undefined,
        environment: KEEPALIVE_ENVIRONMENT || "production",
        region: resolveRegion(env, request),
        timestamp: new Date().toISOString(),
      }),
    });

    const duration = Date.now() - start;
    const data = await response.text();

    return new Response(
      JSON.stringify({
        success: response.ok,
        status: response.status,
        duration_ms: duration,
        response: data,
      }),
      { headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    // eslint-disable-next-line no-console -- Worker: único canal de log
    console.error(`❌ Ping falhou: ${error.message}`);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
