/**
 * @file toast.js
 * @description Sistema de notificações toast leves e acessíveis
 * @version 0.3.7
 */

/**
 * Cria e exibe uma notificação toast
 * @param {string} message - Mensagem a ser exibida
 * @param {('success'|'error'|'warning'|'info')} type - Tipo da notificação
 * @param {number} duration - Duração em ms (padrão: 4000)
 */
export function showToast(message, type = "info", duration = 4000) {
  // Container de toasts (cria se não existir)
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container";
    container.setAttribute("role", "region");
    container.setAttribute("aria-live", "polite");
    container.setAttribute("aria-label", "Notificações");
    document.body.appendChild(container);
  }

  // Criar toast
  const toast = document.createElement("div");
  toast.className = `toast toast--${type}`;
  toast.setAttribute("role", "alert");

  // Ícone baseado no tipo
  const icons = {
    success: `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>`,
    error: `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>`,
    warning: `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`,
    info: `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
  };

  toast.innerHTML = `
    <span class="toast__icon">${icons[type] || icons.info}</span>
    <span class="toast__message">${escapeHtml(message)}</span>
    <button class="toast__close" aria-label="Fechar notificação">
      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
    </button>
  `;

  // Botão de fechar
  const closeBtn = toast.querySelector(".toast__close");
  closeBtn.addEventListener("click", () => removeToast(toast));

  // Adicionar ao container
  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add("toast--visible");
  });

  // Auto-remove
  const timeoutId = setTimeout(() => removeToast(toast), duration);

  // Pausar timer no hover
  toast.addEventListener("mouseenter", () => clearTimeout(timeoutId));
  toast.addEventListener("mouseleave", () => {
    setTimeout(() => removeToast(toast), 1500);
  });
}

/**
 * Remove um toast com animação
 * @param {HTMLElement} toast
 */
function removeToast(toast) {
  if (!toast || !toast.parentNode) return;

  toast.classList.remove("toast--visible");
  toast.classList.add("toast--hiding");

  toast.addEventListener(
    "animationend",
    () => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    },
    { once: true },
  );
}

/**
 * Escapa HTML para prevenir XSS
 * @param {string} text
 * @returns {string}
 */
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Expor globalmente para compatibilidade com código legado
if (typeof window !== "undefined") {
  window.showToast = showToast;

  // Alias para compatibilidade com history-page.js
  window.mostrarToast = (message, type = "info") => {
    showToast(message, type === "error" ? "error" : "success");
  };
}

