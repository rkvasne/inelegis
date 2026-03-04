/**
 * Cloudflare Worker — Keepvasne Keepalive (padrão Hub)
 * Pinger externo centralizado: envia POST para N endpoints a cada execução do cron.
 *
 * Configuração no Dashboard Cloudflare:
 * - Trigger Cron: a cada 30 minutos (ex.: 0,30 * * * * ou equivalente)
 * - Variáveis obrigatórias: KEEPALIVE_URLS, KEEPALIVE_TOKEN
 * - Variável opcional (manual trigger): KEEPALIVE_ADMIN_TOKEN
 *
 * Observação: este arquivo representa o contrato atual do Hub para o Worker central.
 * O Inelegis usa Supabase Edge Function como receptor.
 */
const DEFAULT_TIMEOUT_MS = 15000;
const MIN_TIMEOUT_MS = 1000;
const MAX_TIMEOUT_MS = 60000;

export default {
  async scheduled(_event, env, ctx) {
    ctx.waitUntil(handleScheduledKeepalive(env));
  },

  async fetch(request, env, _ctx) {
    return handleManualKeepalive(request, env);
  },
};

function resolveRegion(request) {
  return request?.cf?.colo || "edge";
}

function parseKeepaliveUrls(urlsRaw) {
  const unique = new Set();
  for (const item of String(urlsRaw || "").split(",")) {
    const value = item.trim();
    if (value) unique.add(value);
  }
  return [...unique];
}

function toPositiveInt(value, fallback, min, max) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function getBearerToken(request) {
  const authorization = request?.headers?.get("authorization");
  if (!authorization) return null;

  const match = authorization.match(/^Bearer\s+(.+)$/i);
  return match?.[1] ?? null;
}

function createTimeoutSignal(timeoutMs) {
  if (
    typeof AbortSignal !== "undefined" &&
    typeof AbortSignal.timeout === "function"
  ) {
    return { signal: AbortSignal.timeout(timeoutMs), cleanup: () => {} };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort("timeout"), timeoutMs);
  return {
    signal: controller.signal,
    cleanup: () => clearTimeout(timer),
  };
}

async function pingKeepaliveUrl(url, options) {
  const { token, region, timestamp, timeoutMs } = options;
  const startedAt = Date.now();
  const timeout = createTimeoutSignal(timeoutMs);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "User-Agent": "Keepvasne-Keepalive-Worker/1.0",
      },
      body: JSON.stringify({
        source: "cloudflare-worker",
        region,
        timestamp,
      }),
      signal: timeout.signal,
    });

    const responseText = await response.text();
    return {
      url,
      success: response.ok,
      status: response.status,
      duration_ms: Date.now() - startedAt,
      response_size_bytes: responseText.length,
    };
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    return {
      url,
      success: false,
      status: 500,
      duration_ms: Date.now() - startedAt,
      error: reason,
    };
  } finally {
    timeout.cleanup();
  }
}

function readRuntimeConfig(env) {
  const urlsRaw = env.KEEPALIVE_URLS;
  const keepaliveToken = env.KEEPALIVE_TOKEN;

  if (!urlsRaw || !keepaliveToken) {
    // eslint-disable-next-line no-console -- Worker: único canal de log
    console.error("❌ Configuração ausente: KEEPALIVE_URLS ou KEEPALIVE_TOKEN");
    throw new Error(
      "Missing configuration: KEEPALIVE_URLS and KEEPALIVE_TOKEN",
    );
  }

  const urls = parseKeepaliveUrls(urlsRaw);
  if (urls.length === 0) {
    throw new Error("Invalid configuration: empty keepalive targets list");
  }

  const timeoutMs = toPositiveInt(
    env.KEEPALIVE_TIMEOUT_MS,
    DEFAULT_TIMEOUT_MS,
    MIN_TIMEOUT_MS,
    MAX_TIMEOUT_MS,
  );

  return { urls, keepaliveToken, timeoutMs };
}

function computeStatusCode(successCount, failureCount) {
  if (failureCount === 0) return 200;
  if (successCount === 0) return 502;
  return 207;
}

function toJsonResponse(payload, status) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function executeKeepalive(env, request, mode) {
  const config = readRuntimeConfig(env);
  const region = resolveRegion(request);
  const timestamp = new Date().toISOString();

  const settled = await Promise.allSettled(
    config.urls.map((url) =>
      pingKeepaliveUrl(url, {
        token: config.keepaliveToken,
        region,
        timestamp,
        timeoutMs: config.timeoutMs,
      }),
    ),
  );

  const results = settled.map((entry, index) => {
    if (entry.status === "fulfilled") return entry.value;

    const reason =
      entry.reason instanceof Error
        ? entry.reason.message
        : String(entry.reason);
    return {
      url: config.urls[index],
      success: false,
      status: 500,
      duration_ms: 0,
      error: reason,
    };
  });

  const successCount = results.filter((item) => item.success).length;
  const failureCount = results.length - successCount;

  for (const item of results) {
    if (item.success) {
      // eslint-disable-next-line no-console -- Worker: único canal de log
      console.log(`Ping OK: ${item.url} (${item.duration_ms}ms)`);
    } else {
      // eslint-disable-next-line no-console -- Worker: único canal de log
      console.error(`Ping FALHOU: ${item.url} (${item.error || item.status})`);
    }
  }

  return {
    mode,
    execution_time: timestamp,
    total_targets: results.length,
    success_count: successCount,
    failure_count: failureCount,
    timeout_ms: config.timeoutMs,
    status_code: computeStatusCode(successCount, failureCount),
    results,
  };
}

async function handleScheduledKeepalive(env) {
  const execution = await executeKeepalive(env, null, "scheduled");
  if (execution.failure_count === execution.total_targets) {
    throw new Error("All keepalive targets failed in scheduled run");
  }
}

function isManualTriggerAuthorized(request, env) {
  const adminToken = String(env.KEEPALIVE_ADMIN_TOKEN || "").trim();
  if (!adminToken) return false;

  const bearerToken = getBearerToken(request);
  const headerToken = request.headers.get("x-keepalive-admin-token");
  const providedToken = bearerToken || headerToken;
  return providedToken === adminToken;
}

async function handleManualKeepalive(request, env) {
  if (!isManualTriggerAuthorized(request, env)) {
    return toJsonResponse(
      {
        ok: false,
        error: "Unauthorized manual trigger",
        hint: "Configure KEEPALIVE_ADMIN_TOKEN and send Authorization: Bearer <token>",
      },
      401,
    );
  }

  try {
    const execution = await executeKeepalive(env, request, "manual");
    return toJsonResponse(execution, execution.status_code);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    // eslint-disable-next-line no-console -- Worker: único canal de log
    console.error(`Erro de configuracao/manual trigger: ${reason}`);
    return toJsonResponse({ ok: false, error: reason }, 500);
  }
}
