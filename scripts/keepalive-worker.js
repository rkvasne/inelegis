// Cloudflare Worker: Inelegis Keepalive Trigger
// Este script deve ser implantado no Cloudflare Workers.
// Configuração: Triggers > Cron Triggers > Adicionar (ex: every 10 minutes)
//
// Variáveis Necessárias no Cloudflare:
// - KEEPALIVE_URL: https://[seu-projeto].supabase.co/functions/v1/keepalive
// - KEEPALIVE_TOKEN: [Sua Chave Segura]

export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(handleKeepalive(env));
  },

  async fetch(request, env, ctx) {
    return await handleKeepalive(env);
  },
};

async function handleKeepalive(env) {
  const { KEEPALIVE_URL, KEEPALIVE_TOKEN } = env;

  if (!KEEPALIVE_URL || !KEEPALIVE_TOKEN) {
    return new Response("Configuração ausente no Cloudflare", { status: 500 });
  }

  const start = Date.now();

  try {
    const response = await fetch(KEEPALIVE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${KEEPALIVE_TOKEN}`,
      },
      body: JSON.stringify({
        source: "cloudflare-worker",
        region: "edge-cron",
        latency_ms: 0, // Será calculado no receptor se necessário
      }),
    });

    const duration = Date.now() - start;
    const result = await response.text();

    console.log(`[Inelegis] Status: ${response.status} em ${duration}ms`);

    return new Response(result, {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(`[Inelegis] Falha no trigger: ${error.message}`);
    return new Response(error.message, { status: 500 });
  }
}
