/**
 * Sistema de logging e monitoramento
 */
;(function() {
  'use strict';
  
  const Logger = {
    levels: {
      ERROR: 0,
      WARN: 1,
      INFO: 2,
      DEBUG: 3
    },
    
    currentLevel: 2, // INFO por padrão
    
    init() {
      // Ajustar nível baseado no ambiente
      if (window.App?.config?.DEBUG) {
        this.currentLevel = this.levels.DEBUG;
      }
      
      // Capturar erros globais
      window.addEventListener('error', (event) => {
        this.error('Global Error', {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          error: event.error
        });
      });
      
      // Capturar promises rejeitadas
      window.addEventListener('unhandledrejection', (event) => {
        this.error('Unhandled Promise Rejection', {
          reason: event.reason
        });
      });
    },
    
    log(level, category, message, data = null) {
      if (level > this.currentLevel) return;
      
      const timestamp = new Date().toISOString();
      const levelName = Object.keys(this.levels)[level];
      
      const logEntry = {
        timestamp,
        level: levelName,
        category,
        message,
        data,
        url: window.location.href,
        userAgent: navigator.userAgent
      };
      
      // Console output
      const consoleMethod = level === 0 ? 'error' : level === 1 ? 'warn' : 'log';
      console[consoleMethod](`[${levelName}] ${category}: ${message}`, data || '');
      
      // Armazenar no localStorage (últimas 100 entradas)
      this.storeLog(logEntry);
      
      // Enviar para servidor em produção (se configurado)
      if (window.App?.config?.ANALYTICS_ENDPOINT && level <= this.levels.WARN) {
        this.sendToServer(logEntry);
      }
    },
    
    error(category, message, data) {
      this.log(this.levels.ERROR, category, message, data);
    },
    
    warn(category, message, data) {
      this.log(this.levels.WARN, category, message, data);
    },
    
    info(category, message, data) {
      this.log(this.levels.INFO, category, message, data);
    },
    
    debug(category, message, data) {
      this.log(this.levels.DEBUG, category, message, data);
    },
    
    storeLog(entry) {
      try {
        const logs = JSON.parse(localStorage.getItem('ineleg_logs') || '[]');
        logs.push(entry);
        
        // Manter apenas as últimas 100 entradas
        if (logs.length > 100) {
          logs.splice(0, logs.length - 100);
        }
        
        localStorage.setItem('ineleg_logs', JSON.stringify(logs));
      } catch (e) {
        console.warn('Não foi possível armazenar log:', e);
      }
    },
    
    getLogs() {
      try {
        return JSON.parse(localStorage.getItem('ineleg_logs') || '[]');
      } catch (e) {
        return [];
      }
    },
    
    clearLogs() {
      localStorage.removeItem('ineleg_logs');
    },
    
    sendToServer(entry) {
      // Implementar envio para servidor de analytics se necessário
      if (navigator.sendBeacon) {
        navigator.sendBeacon(window.App.config.ANALYTICS_ENDPOINT, JSON.stringify(entry));
      }
    },
    
    // Métricas de performance
    startTimer(name) {
      performance.mark(`${name}-start`);
    },
    
    endTimer(name) {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
      
      const measure = performance.getEntriesByName(name)[0];
      this.info('Performance', `${name} took ${measure.duration.toFixed(2)}ms`);
      
      return measure.duration;
    },
    
    // Métricas de uso
    trackEvent(category, action, label, value) {
      this.info('Analytics', `${category}:${action}`, { label, value });
      
      // Integração com Google Analytics se disponível
      if (window.gtag) {
        window.gtag('event', action, {
          event_category: category,
          event_label: label,
          value: value
        });
      }
    }
  };
  
  // Expor globalmente
  window.App = window.App || {};
  window.App.logger = Logger;
  
  // Inicializar automaticamente
  Logger.init();
})();