/**
 * Theme Manager
 * Gerencia tema claro/escuro com persistência
 * @version 0.3.0
 */

const THEME_DEBUG_ENABLED = (() => {
  if (typeof globalThis === "undefined") {
    return false;
  }
  if (globalThis.INelegisDebug === true) {
    return true;
  }
  if (
    globalThis.process &&
    globalThis.process.env &&
    globalThis.process.env.INELEGIS_DEBUG === "true"
  ) {
    return true;
  }
  return false;
})();

function themeDebugLog(...args) {
  if (THEME_DEBUG_ENABLED) {
    console.debug("[ThemeManager]", ...args);
  }
}

const ThemeManager = (() => {
  const STORAGE_KEY = "inelegis_theme";
  const THEME_DARK = "dark";
  const THEME_LIGHT = "light";
  const IMAGE_BASE_PATH = "/assets/images/";

  /**
   * Inicializa o gerenciador de tema
   */
  function init() {
    themeDebugLog("init");

    // Carregar tema salvo ou detectar preferência do sistema
    const savedTheme = getSavedTheme();
    const systemTheme = getSystemTheme();
    const theme = savedTheme || systemTheme;

    themeDebugLog("Saved theme", savedTheme);
    themeDebugLog("System theme", systemTheme);
    themeDebugLog("Selected theme", theme);

    applyTheme(theme);
    attachEventListeners();
    watchSystemTheme();
  }

  /**
   * Obtém o tema salvo no localStorage
   * @returns {string|null} Tema salvo ou null
   */
  function getSavedTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      console.error("Erro ao obter tema salvo:", error);
      return null;
    }
  }

  /**
   * Obtém a preferência de tema do sistema
   * @returns {string} Tema do sistema (dark ou light)
   */
  function getSystemTheme() {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return THEME_DARK;
    }
    return THEME_LIGHT;
  }

  /**
   * Aplica o tema
   * @param {string} theme - Tema a ser aplicado (dark ou light)
   */
  function applyTheme(theme) {
    const html = document.documentElement;

    themeDebugLog("Applying theme", theme);
    themeDebugLog("Classes before", html.className);

    // IMPORTANTE: Sempre remover a classe primeiro
    html.classList.remove("dark-theme");

    // Adicionar apenas se for dark
    if (theme === THEME_DARK) {
      html.classList.add("dark-theme");
    }

    themeDebugLog("Classes after", html.className);

    // Salvar no localStorage
    try {
      localStorage.setItem(STORAGE_KEY, theme);
      themeDebugLog("Theme saved to localStorage", theme);
    } catch (error) {
      console.error("Erro ao salvar tema:", error);
    }

    // Atualizar ícone do botão
    updateToggleButton(theme);

    // Atualizar logo conforme tema
    updateLogo(theme);

    // Atualizar favicon conforme tema
    updateFavicon(theme);
  }

  /**
   * Alterna entre temas
   */
  function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.classList.contains("dark-theme")
      ? THEME_DARK
      : THEME_LIGHT;
    const newTheme = currentTheme === THEME_DARK ? THEME_LIGHT : THEME_DARK;

    applyTheme(newTheme);
  }

  /**
   * Atualiza o ícone do botão de toggle
   * @param {string} theme - Tema atual
   */
  function updateToggleButton(theme) {
    const button =
      document.getElementById("themeToggle") ||
      document.getElementById("theme-toggle");
    if (!button) return;

    const sunIcon = button.querySelector(".sun-icon");
    const moonIcon = button.querySelector(".moon-icon");

    if (theme === THEME_DARK) {
      sunIcon?.classList.add("active");
      moonIcon?.classList.remove("active");
    } else {
      sunIcon?.classList.remove("active");
      moonIcon?.classList.add("active");
    }
  }

  /**
   * Atualiza o logo conforme o tema
   * @param {string} theme - Tema atual
   */
  function updateLogo(theme) {
    const logoSrc = `${IMAGE_BASE_PATH}${theme === THEME_DARK ? "logo-claro.png" : "logo-dark.png"}`;

    // Atualizar logo do header
    const headerLogo = document.getElementById("header-logo");
    if (headerLogo && headerLogo.dataset.logoLock !== "true") {
      headerLogo.src = logoSrc;
    }

    // Atualizar outros logos conscientes do tema (ex: footer)
    const themeLogos = document.querySelectorAll(".theme-aware-logo");
    themeLogos.forEach((logo) => {
      logo.src = logoSrc;
    });
  }

  /**
   * Atualiza o favicon conforme o tema
   * @param {string} theme - Tema atual
   */
  function updateFavicon(theme) {
    // logo-dark.ico = escudo escuro (para tema claro)
    // logo-claro.ico = escudo claro (para tema escuro)
    const faviconFilename = "logo-dark.ico";
    const faviconSrc = `${IMAGE_BASE_PATH}${faviconFilename}`;

    // Atualizar favicon existente
    let favicon = document.querySelector('link[rel="icon"]');
    let shortcutIcon = document.querySelector('link[rel="shortcut icon"]');

    // Se não existir, criar
    if (!favicon) {
      favicon = document.createElement("link");
      favicon.rel = "icon";
      favicon.type = "image/x-icon";
      document.head.appendChild(favicon);
    }

    if (!shortcutIcon) {
      shortcutIcon = document.createElement("link");
      shortcutIcon.rel = "shortcut icon";
      shortcutIcon.type = "image/x-icon";
      document.head.appendChild(shortcutIcon);
    }

    // Forçar atualização adicionando timestamp para evitar cache
    const cacheBuster = "?v=" + Date.now();
    favicon.href = faviconSrc + cacheBuster;
    shortcutIcon.href = faviconSrc + cacheBuster;

    themeDebugLog("Favicon updated", faviconSrc);
  }

  /**
   * Anexa event listeners
   */
  function attachEventListeners() {
    // Usar setTimeout para garantir que o DOM está pronto
    setTimeout(() => {
      const button =
        document.getElementById("themeToggle") ||
        document.getElementById("theme-toggle");
      if (button) {
        button.addEventListener("click", toggleTheme);
        themeDebugLog("Theme toggle button attached");
      } else {
        console.warn("⚠️ Theme toggle button not found");
      }
    }, 100);
  }

  /**
   * Observa mudanças na preferência de tema do sistema
   */
  function watchSystemTheme() {
    if (!window.matchMedia) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    // Listener para mudanças
    mediaQuery.addEventListener("change", (e) => {
      // Só aplicar se não houver tema salvo manualmente
      const savedTheme = getSavedTheme();
      if (!savedTheme) {
        const newTheme = e.matches ? THEME_DARK : THEME_LIGHT;
        applyTheme(newTheme);
      }
    });
  }

  /**
   * Obtém o tema atual
   * @returns {string} Tema atual (dark ou light)
   */
  function getCurrentTheme() {
    return document.documentElement.classList.contains("dark-theme")
      ? THEME_DARK
      : THEME_LIGHT;
  }

  // API pública
  return {
    init,
    toggle: toggleTheme,
    getCurrent: getCurrentTheme,
    apply: applyTheme,
  };
})();

// Exportar para uso global
if (typeof window !== "undefined") {
  window.ThemeManager = ThemeManager;
}
