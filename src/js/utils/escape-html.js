/**
 * Utilitário leve para escape HTML (previne XSS em interpolações).
 * Usado por módulos ES; o Sanitizer completo fica em sanitizer.js (classic script).
 *
 * @param {string} text - Texto a ser escapado
 * @returns {string} Texto com caracteres HTML escapados
 */
export function escapeHtml(text) {
  const s = String(text);
  return s.replace(
    /[&<>"'/]/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#x27;",
        "/": "&#x2F;",
      })[c] ?? c,
  );
}
