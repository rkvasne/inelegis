/**
 * Input Validator
 * Utilitário para validação estrutural de dados antes de chamadas de API.
 * Protege o backend (Supabase) contra inputs malformatados ou inesperados.
 * @version 1.0.0
 */

export const InputValidator = {
    /**
     * Valida um código de norma (ex: "CP", "LEI_64")
     * @param {string} code 
     * @returns {string|null} Código sanitizado ou null se inválido
     */
    validateLawCode(code) {
        if (!code || typeof code !== 'string') return null;
        // Permite apenas letras, números e underscores, max 20 caracteres
        const sanitized = code.trim().toUpperCase();
        return /^[A-Z0-0_]{1,20}$/.test(sanitized) ? sanitized : null;
    },

    /**
     * Valida um número de artigo (ex: "121", "1-A")
     * @param {string|number} article 
     * @returns {string|null} Artigo sanitizado ou null se inválido
     */
    validateArticle(article) {
        if (article === undefined || article === null) return null;
        const sanitized = String(article).trim();
        // Permite números, hífens e letras (ex: "1", "121-A"), max 10 caracteres
        return /^[0-9a-zA-Z-]{1,10}$/.test(sanitized) ? sanitized : null;
    },

    /**
     * Valida parâmetros de busca genéricos
     * @param {string} text 
     * @param {number} maxLength 
     * @returns {string|null} Texto sanitizado ou null
     */
    validateText(text, maxLength = 100) {
        if (!text || typeof text !== 'string') return null;
        const sanitized = text.trim();
        return sanitized.length > 0 && sanitized.length <= maxLength ? sanitized : null;
    }
};

// Exportar para uso global no browser
if (typeof window !== 'undefined') {
    window.InputValidator = InputValidator;
}
