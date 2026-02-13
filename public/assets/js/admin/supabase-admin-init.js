/**
 * supabase-admin-init.js
 * Inicializa o cliente Supra oficial para o painel administrativo.
 */

(function () {
    if (!window.supabase) {
        console.error('Supabase SDK not loaded. Dashboard will not function.');
        return;
    }

    const { url, anonKey } = window.__SUPABASE_CONFIG__ || {};

    if (!url || !anonKey) {
        console.error('Supabase config missing. Run build:supabase-config first.');
        return;
    }

    // Inicializa o cliente oficial globalmente
    window.supabaseAdmin = window.supabase.createClient(url, anonKey);

    // Para facilitar o uso nos scripts internos
    window.supabase = window.supabaseAdmin;
})();
