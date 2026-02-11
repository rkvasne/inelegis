/**
 * Supabase Client
 * Cliente centralizado para todas as operações Supabase
 * @version 0.3.7
 */

// Configuração via variáveis de ambiente
const SUPABASE_URL =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SUPABASE_URL) ||
  (typeof window !== "undefined" && window.__SUPABASE_CONFIG__?.url) ||
  "";

const SUPABASE_ANON_KEY =
  (typeof process !== "undefined" &&
    process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
  (typeof window !== "undefined" && window.__SUPABASE_CONFIG__?.anonKey) ||
  "";

/**
 * Cliente Supabase simplificado para o frontend
 * (sem dependência do @supabase/supabase-js para manter bundle leve)
 */
export const supabaseClient = {
  url: SUPABASE_URL,
  anonKey: SUPABASE_ANON_KEY,

  /**
   * Faz uma requisição REST à API do Supabase
   * @param {string} table - Nome da tabela
   * @param {object} options - Opções da query
   * @returns {Promise<object>}
   */
  async from(table, options = {}) {
    if (!this.isConfigured()) throw new Error("Supabase Client not configured");
    const { select = "*", filter = {}, limit, order } = options;

    let url = `${this.url}/rest/v1/${table}?select=${encodeURIComponent(select)}`;

    // Adicionar filtros
    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url += `&${key}=eq.${encodeURIComponent(value)}`;
      }
    });

    if (limit) url += `&limit=${limit}`;
    if (order) url += `&order=${order}`;

    const response = await fetch(url, {
      headers: {
        apikey: this.anonKey,
        Authorization: `Bearer ${this.anonKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Supabase error: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  },

  /**
   * Insere dados em uma tabela
   * @param {string} table - Nome da tabela
   * @param {object|array} data - Dados a inserir
   * @returns {Promise<object>}
   */
  async insert(table, data) {
    if (!this.isConfigured()) throw new Error("Supabase Client not configured");
    const url = `${this.url}/rest/v1/${table}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        apikey: this.anonKey,
        Authorization: `Bearer ${this.anonKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Supabase insert error: ${error}`);
    }

    return response.json();
  },

  /**
   * Atualiza ou insere dados (Upsert)
   * @param {string} table - Nome da tabela
   * @param {object} data - Dados a inserir/atualizar
   * @returns {Promise<object>}
   */
  async upsert(table, data) {
    if (!this.isConfigured()) throw new Error("Supabase Client not configured");
    const url = `${this.url}/rest/v1/${table}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        apikey: this.anonKey,
        Authorization: `Bearer ${this.anonKey}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=representation",
      },
      body: JSON.stringify(data),
    });

    if (!response.status.toString().startsWith("2")) {
      const error = await response.text();
      throw new Error(`Supabase upsert error: ${error}`);
    }

    return response.json();
  },

  /**
   * Chama uma função RPC (stored procedure)
   * @param {string} functionName - Nome da função
   * @param {object} params - Parâmetros da função
   * @returns {Promise<object>}
   */
  async rpc(functionName, params = {}) {
    if (!this.isConfigured()) throw new Error("Supabase Client not configured");
    const url = `${this.url}/rest/v1/rpc/${functionName}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        apikey: this.anonKey,
        Authorization: `Bearer ${this.anonKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Supabase RPC error: ${error}`);
    }

    return response.json();
  },

  /**
   * Verifica se o cliente está configurado
   * @returns {boolean}
   */
  isConfigured() {
    return !!(this.url && this.anonKey);
  },
};

// Exportar para uso global no browser
if (typeof window !== "undefined") {
  window.supabaseClient = supabaseClient;
}

export default supabaseClient;
