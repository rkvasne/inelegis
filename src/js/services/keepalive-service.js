/**
 * Keepalive Service
 * Responsável por manter o banco de dados do Supabase ativo
 * @version 0.3.9 (Hub Keepalive Pattern)
 */

import supabaseClient from "./supabase-client.js";

export const keepaliveService = {
    project_slug: "inelegis",
    environment: "prod",
    interval_ms: 5 * 60 * 1000, // 5 minutos
    timer: null,

    /**
     * Inicializa o serviço de keepalive
     * Adiciona um heartbeat periódico e um manual ao carregar a página
     */
    init() {
        if (this.timer) return;

        // Primeiro heartbeat imediato
        this.heartbeat("client-init");

        // Configurar intervalo
        this.timer = setInterval(() => {
            this.heartbeat("client-timer");
        }, this.interval_ms);

        console.log(
            `[Keepalive] Serviço inicializado (Intervalo: ${this.interval_ms / 1000}s)`,
        );
    },

    /**
     * Envia um sinal de vida para o Supabase
     * @param {string} source - Origem do sinal (init, timer, etc)
     */
    async heartbeat(source = "unknown") {
        if (!supabaseClient.isConfigured()) return;

        const now = new Date().toISOString();
        const startTime = performance.now();

        try {
            // 1. Atualizar Singleton (Keepalive Status)
            await supabaseClient.upsert("keepalive", {
                id: 1,
                project_slug: this.project_slug,
                environment: this.environment,
                source: source,
                last_ping_at: now,
                last_success_at: now,
                schema_version: 1,
            });

            const endTime = performance.now();
            const latency = Math.round(endTime - startTime);

            // 2. Registrar Evento Histórico
            await supabaseClient.insert("keepalive_events", {
                project_slug: this.project_slug,
                environment: this.environment,
                source: source,
                ping_at: now,
                status: "ok",
                latency_ms: latency,
            });
        } catch (error) {
            console.warn("[Keepalive] Falha no heartbeat:", error.message);

            // Tentar registrar falha se possível
            try {
                await supabaseClient.insert("keepalive_events", {
                    project_slug: this.project_slug,
                    environment: this.environment,
                    source: source,
                    ping_at: now,
                    status: "error",
                    error: error.message,
                });
            } catch (innerError) {
                // Falha total de conexão
            }
        }
    },
};

// Auto-inicialização se estiver no browser
if (typeof window !== "undefined") {
    window.keepaliveService = keepaliveService;
}

export default keepaliveService;
