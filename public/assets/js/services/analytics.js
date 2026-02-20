/**
 * Analytics Service - Cliente de Telemetria
 * Coleta e envia eventos de uso para o backend do Inelegis
 * @version 0.3.15
 */

const Analytics = (() => {
  const ANALYTICS_ENDPOINT = "/api/analytics";
  const USER_ID_KEY = "inelegis_uid";
  const QUEUE_FLUSH_INTERVAL = 30000; // 30 segundos
  const MAX_QUEUE_SIZE = 10;

  let eventQueue = [];
  let flushTimer = null;
  let initialized = false;

  /**
   * Obtém ou gera o ID único do usuário
   * Implementação autônoma para evitar recursão com SearchHistory.getUserId
   */
  function getUserId() {
    let uid = null;

    if (typeof document !== "undefined") {
      const match = document.cookie.match(
        new RegExp("(?:^|; )" + USER_ID_KEY + "=([^;]*)"),
      );
      uid = match ? decodeURIComponent(match[1]) : null;
    }

    if (!uid && typeof localStorage !== "undefined") {
      uid = localStorage.getItem(USER_ID_KEY);
    }

    if (!uid) {
      const randomPart = Math.random().toString(36).substring(2, 11);
      const timePart = Date.now().toString(36);
      uid = `user_${timePart}_${randomPart}`;

      // Persistir (cookie + localStorage para consistência com SearchHistory)
      if (typeof document !== "undefined") {
        document.cookie = `${USER_ID_KEY}=${encodeURIComponent(uid)}; path=/; max-age=${60 * 60 * 24 * 365}`;
      }
      if (typeof localStorage !== "undefined") {
        try {
          localStorage.setItem(USER_ID_KEY, uid);
        } catch (e) {
          /* modo privado */
        }
      }
    }

    return uid;
  }

  /**
   * Envia a fila de eventos para o servidor
   */
  async function flush() {
    if (eventQueue.length === 0) return;

    const eventsToSend = [...eventQueue];
    eventQueue = [];

    try {
      const response = await fetch(ANALYTICS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          events: eventsToSend,
          timestamp: new Date().toISOString(),
          version: "0.3.24",
        }),
      });

      if (!response.ok) {
        throw new Error(`Analytics flush failed: ${response.status}`);
      }

      console.log(`[Analytics] ${eventsToSend.length} eventos enviados`);
    } catch (error) {
      console.warn("[Analytics] Falha ao enviar telemetria:", error.message);
      // Re-enfileirar eventos em caso de falha (limitar para não crescer infinitamente)
      if (eventQueue.length < 50) {
        eventQueue = [...eventsToSend, ...eventQueue].slice(0, 50);
      }
    }
  }

  /**
   * Adiciona um evento à fila
   */
  function trackEvent(type, data = {}) {
    const event = {
      type,
      userId: getUserId(),
      timestamp: new Date().toISOString(),
      version: "0.3.24",
      browser: {
        userAgent:
          typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
        language:
          typeof navigator !== "undefined" ? navigator.language : "unknown",
      },
      data,
    };

    eventQueue.push(event);

    // Enviar imediatamente se a fila atingir o limite
    if (eventQueue.length >= MAX_QUEUE_SIZE) {
      flush();
    }
  }

  /**
   * Rastrea uma busca
   */
  function trackSearch(searchData) {
    trackEvent("search", searchData);
  }

  /**
   * Rastrea um erro
   */
  function trackError(errorData) {
    trackEvent("error", errorData);
  }

  /**
   * Rastrea uma ação do usuário
   */
  function trackAction(actionName, metadata = {}) {
    trackEvent("action", { action: actionName, ...metadata });
  }

  /**
   * Inicializa o serviço
   */
  function init() {
    if (initialized) return;

    console.log("[Analytics] Inicializando serviço de telemetria...");

    // Configurar timer de envio periódico
    flushTimer = setInterval(() => flush(), QUEUE_FLUSH_INTERVAL);

    // Enviar eventos restantes antes de fechar a página
    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", () => flush());
    }

    initialized = true;
  }

  return {
    init,
    trackSearch,
    trackError,
    trackAction,
    getUserId,
    flush,
  };
})();

// Exportar para uso global
if (typeof window !== "undefined") {
  window.Analytics = Analytics;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = Analytics;
}
