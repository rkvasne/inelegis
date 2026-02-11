"use strict";

/**
 * Módulo de sanitização para prevenir XSS
 * Alternativa leve ao DOMPurify para este projeto
 */

const Sanitizer = {
  /**
   * Escapa caracteres HTML perigosos
   */
  escapeHtml(text) {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#x27;",
      "/": "&#x2F;",
    };
    return String(text).replace(/[&<>"'/]/g, (char) => map[char]);
  },

  /**
   * Cria elemento de texto seguro
   */
  createTextNode(text) {
    return document.createTextNode(String(text));
  },

  /**
   * Insere HTML de forma segura usando template
   */
  safeInnerHTML(element, htmlString) {
    // Remove todo conteúdo anterior
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }

    // Cria template e clona conteúdo
    const template = document.createElement("template");
    template.innerHTML = htmlString.trim();

    // Valida e remove scripts
    const clone = template.content.cloneNode(true);
    const scripts = clone.querySelectorAll("script");
    scripts.forEach((script) => script.remove());

    // Insere conteúdo sanitizado
    element.appendChild(clone);
  },

  /**
   * Valida e sanitiza atributos perigosos
   */
  sanitizeAttributes(element) {
    const dangerousAttrs = ["onclick", "onerror", "onload", "onmouseover"];
    dangerousAttrs.forEach((attr) => {
      if (element.hasAttribute(attr)) {
        element.removeAttribute(attr);
      }
    });

    // Sanitiza href e src
    if (element.hasAttribute("href")) {
      const href = element.getAttribute("href");
      if (href.startsWith("javascript:")) {
        element.removeAttribute("href");
      }
    }

    if (element.hasAttribute("src")) {
      const src = element.getAttribute("src");
      if (src.startsWith("javascript:")) {
        element.removeAttribute("src");
      }
    }
  },
};

// Exportar para uso global
if (typeof window !== "undefined") {
  window.Sanitizer = Sanitizer;
}

