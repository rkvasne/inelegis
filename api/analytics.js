/**
 * Analytics API Endpoint - Supabase Edition
 * Recebe e armazena dados de uso do Inelegis
 *
 * Deploy: Vercel Serverless Function
 * Database: Supabase (PostgreSQL)
 * @version 2.0.0
 */

import { createClient } from "@supabase/supabase-js";

// Conectar ao Supabase
let supabase = null;

function getSupabase() {
  if (!supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Variáveis do Supabase não configuradas");
    }

    supabase = createClient(supabaseUrl, supabaseKey);
  }
  return supabase;
}

// Configuração
const ALLOWED_ORIGINS = [
  "https://inelegis.vercel.app",
  "http://localhost:3000",
  "http://localhost:8080",
];

/**
 * Valida origem da requisição (CORS)
 */
function validateOrigin(origin) {
  const isProd = process.env.NODE_ENV === "production";
  if (isProd) {
    return origin === "https://inelegis.vercel.app";
  }
  return ALLOWED_ORIGINS.includes(origin) || !origin;
}

/**
 * Valida estrutura do evento
 */
function validateEvent(event) {
  if (!event.type || !event.userId || !event.timestamp) {
    return false;
  }

  if (!["search", "error", "action"].includes(event.type)) {
    return false;
  }

  if (event.type === "search") {
    if (
      !event.data ||
      !event.data.lei ||
      !event.data.artigo ||
      !event.data.resultado
    ) {
      return false;
    }
  }
  if (event.type === "error") {
    if (!event.data || !event.data.message) {
      return false;
    }
  }
  if (event.type === "action") {
    if (!event.data || !event.data.action) {
      return false;
    }
  }

  return true;
}

/**
 * Processa evento de busca
 */
function processSearchEvent(event) {
  return {
    type: "search",
    user_id: event.userId,
    lei: event.data.lei,
    artigo: event.data.artigo,
    resultado: event.data.resultado,
    tem_excecao: event.data.temExcecao || false,
    tempo_resposta: event.data.tempoResposta,
    browser: event.browser?.userAgent || "unknown",
    version: event.version,
  };
}

/**
 * Processa evento de erro
 */
function processErrorEvent(event) {
  return {
    type: "error",
    user_id: event.userId,
    lei: event.data.lei,
    artigo: event.data.artigo,
    browser: event.browser?.userAgent || "unknown",
    version: event.version,
    data: {
      message: event.data.message,
      stack: event.data.stack?.substring(0, 500),
    },
  };
}

/**
 * Processa evento de ação
 */
function processActionEvent(event) {
  return {
    type: "action",
    user_id: event.userId,
    browser: event.browser?.userAgent || "unknown",
    version: event.version,
    data: event.data,
  };
}

/**
 * Salva eventos no Supabase
 */
async function saveEvents(events) {
  const client = getSupabase();
  let saved = 0;

  // Inserir em batch
  const { data, error } = await client
    .from("analytics_events")
    .insert(events)
    .select();

  if (error) {
    console.error("Erro ao salvar analytics:", error);
    throw new Error(`Supabase error: ${error.message}`);
  }

  saved = data?.length || 0;
  console.log(`✅ Salvos ${saved} eventos no Supabase`);

  return { success: true, saved };
}

/**
 * Handler principal
 */
export default async function handler(req, res) {
  // CORS
  const origin = req.headers.origin;

  if (validateOrigin(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Apenas POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { events, timestamp } = req.body;

    // Validar
    if (!Array.isArray(events) || events.length === 0) {
      return res.status(400).json({ error: "Invalid events array" });
    }

    // Processar eventos
    const processedEvents = [];

    for (const event of events) {
      if (!validateEvent(event)) {
        console.warn("⚠️ Evento inválido:", event);
        continue;
      }

      let processed;

      switch (event.type) {
        case "search":
          processed = processSearchEvent(event);
          break;
        case "error":
          processed = processErrorEvent(event);
          break;
        case "action":
          processed = processActionEvent(event);
          break;
        default:
          continue;
      }

      processedEvents.push(processed);
    }

    // Salvar
    const result = await saveEvents(processedEvents);

    return res.status(200).json({
      success: true,
      received: events.length,
      processed: processedEvents.length,
      saved: result.saved,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Erro ao processar analytics:", error);

    return res.status(500).json({
      error: "Internal server error",
      message: "Falha ao registrar métricas de uso.",
    });
  }
}
