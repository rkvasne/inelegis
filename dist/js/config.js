/**
 * Configurações centralizadas da aplicação
 */
;(function() {
  'use strict';
  
  const CONFIG = {
    // Informações da aplicação
    APP: {
      NAME: 'Ineleg-App',
      VERSION: '0.0.2',
      DESCRIPTION: 'Sistema de Consulta de Inelegibilidade Eleitoral',
      AUTHOR: 'Justiça Eleitoral',
      BUILD_DATE: new Date().toISOString()
    },
    
    // Configurações de UI
    UI: {
      DEBOUNCE_DELAY: 220,
      MAX_SUGGESTIONS: 10,
      MODAL_ANIMATION_DELAY: 300,
      TOAST_DURATION: 2500,
      THEME: 'modern',
      ENABLE_ANIMATIONS: true,
      ENABLE_GLASSMORPHISM: true,
      ENABLE_DARK_MODE: false
    },
    
    // Configurações de busca
    SEARCH: {
      MIN_SEARCH_LENGTH: 2,
      ENABLE_FLEXIBLE_SEARCH: true,
      ENABLE_SUGGESTIONS: true,
      ENABLE_FUZZY_SEARCH: false,
      MAX_RESULTS: 50,
      HIGHLIGHT_MATCHES: true
    },
    
    // Configurações de formatação
    FORMAT: {
      AUTO_FORMAT: true,
      PRESERVE_CURSOR: true,
      NORMALIZE_SPACES: true,
      SMART_QUOTES: true,
      AUTO_COMPLETE: true
    },
    
    // Configurações de cache
    CACHE: {
      ENABLE_INDEX_CACHE: true,
      REBUILD_INDEX_ON_STARTUP: false,
      CACHE_DURATION: 3600000, // 1 hora
      ENABLE_LOCAL_STORAGE: true,
      MAX_CACHE_SIZE: 5 * 1024 * 1024 // 5MB
    },
    
    // Configurações de acessibilidade
    A11Y: {
      FOCUS_TRAP_MODAL: true,
      ANNOUNCE_RESULTS: true,
      KEYBOARD_SHORTCUTS: true,
      HIGH_CONTRAST_MODE: false,
      SCREEN_READER_SUPPORT: true,
      REDUCED_MOTION: false
    },
    
    // Configurações de performance
    PERFORMANCE: {
      ENABLE_LAZY_LOADING: true,
      ENABLE_VIRTUAL_SCROLLING: false,
      DEBOUNCE_SEARCH: true,
      OPTIMIZE_IMAGES: true,
      PRELOAD_CRITICAL_DATA: true
    },
    
    // Configurações de analytics
    ANALYTICS: {
      ENABLED: false,
      TRACK_SEARCHES: true,
      TRACK_ERRORS: true,
      TRACK_PERFORMANCE: true,
      PRIVACY_MODE: true,
      ENDPOINT: null
    },
    
    // Configurações de desenvolvimento
    DEV: {
      ENABLE_LOGGING: true,
      LOG_LEVEL: 'info',
      ENABLE_DEBUG_PANEL: false,
      SHOW_PERFORMANCE_METRICS: false,
      ENABLE_HOT_RELOAD: true
    },
    
    // Configurações de PWA
    PWA: {
      ENABLED: true,
      ENABLE_OFFLINE: true,
      CACHE_STRATEGY: 'cache-first',
      UPDATE_STRATEGY: 'auto',
      SHOW_INSTALL_PROMPT: true
    },
    
    // Configurações de segurança
    SECURITY: {
      ENABLE_CSP: true,
      SANITIZE_INPUT: true,
      VALIDATE_DATA: true,
      RATE_LIMITING: false,
      SECURE_HEADERS: true
    },
    
    // URLs e endpoints
    URLS: {
      BASE_URL: window.location.origin,
      API_BASE: '/api',
      DOCUMENTATION: '/sobre.html',
      SUPPORT: 'mailto:suporte@tre.jus.br',
      GITHUB: 'https://github.com/rkvasne/ineleg-app'
    },
    
    // Configurações de dados
    DATA: {
      AUTO_VALIDATE: true,
      ENABLE_BACKUP: true,
      COMPRESSION: false,
      ENCRYPTION: false,
      SYNC_INTERVAL: 0 // 0 = desabilitado
    }
  };
  
  // Expor configurações globalmente
  window.App = window.App || {};
  window.App.config = CONFIG;
  
  // Configurações de desenvolvimento
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    CONFIG.DEBUG = true;
    CONFIG.VERBOSE_LOGGING = true;
  }
})();