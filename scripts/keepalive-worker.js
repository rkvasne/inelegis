/**
 * Cloudflare Worker — Keepalive (padrão Hub)
 * Pinger externo: envia POST para o endpoint do projeto a cada 30 min.
 *
 * Configuração no Dashboard Cloudflare (Padrão Vercel Inteligente, Cloudflare Burro):
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

function resolveRegion(request) {
  return request?.cf?.colo || "edge";
}

async function handleKeepalive(env, request) {
  const KEEPALIVE_URL = env.KEEPALIVE_URL;
  const KEEPALIVE_TOKEN = env.KEEPALIVE_TOKEN;

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
        Authorization: "Bearer " + KEEPALIVE_TOKEN,
        "User-Agent": "Cloudflare-Worker-Keepalive/1.0",
      },
      body: JSON.stringify({
        source: "cloudflare-worker",
        region: resolveRegion(request),
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
    console.error("❌ Ping falhou: " + error.message);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
