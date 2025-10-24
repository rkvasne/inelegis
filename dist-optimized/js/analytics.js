/**
 * Sistema de analytics e métricas de uso
 */
;(function() {
  'use strict';
  
  const Analytics = {
    sessionId: null,
    startTime: Date.now(),
    
    init() {
      this.sessionId = this.generateSessionId();
      this.trackPageView();
      this.setupEventTracking();
      this.trackPerformance();
    },
    
    generateSessionId() {
      return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },
    
    trackPageView() {
      this.track('page_view', {
        url: window.location.href,
        referrer: document.referrer,
        timestamp: new Date().toISOString(),
        session_id: this.sessionId
      });
    },
    
    setupEventTracking() {
      // Rastrear buscas
      const originalRealizarBusca = window.realizarBusca;
      if (originalRealizarBusca) {
        window.realizarBusca = () => {
          const lei = document.getElementById('leiSelect')?.value;
          const artigo = document.getElementById('artigoInput')?.value;
          const tipo = document.querySelector('input[name="tipoComunicacao"]:checked')?.value;
          
          this.track('search_performed', {
            lei,
            artigo_length: artigo?.length || 0,
            tipo_comunicacao: tipo,
            timestamp: new Date().toISOString()
          });
          
          return originalRealizarBusca.apply(this, arguments);
        };
      }
      
      // Rastrear seleção de sugestões
      const originalSelecionarSugestao = window.selecionarSugestao;
      if (originalSelecionarSugestao) {
        window.selecionarSugestao = (artigo) => {
          this.track('suggestion_selected', {
            artigo,
            timestamp: new Date().toISOString()
          });
          
          return originalSelecionarSugestao.apply(this, arguments);
        };
      }
      
      // Rastrear cópia de resultados
      const originalCopiarResultado = window.copiarResultado;
      if (originalCopiarResultado) {
        window.copiarResultado = () => {
          this.track('result_copied', {
            timestamp: new Date().toISOString()
          });
          
          return originalCopiarResultado.apply(this, arguments);
        };
      }
      
      // Rastrear mudanças de lei
      document.getElementById('leiSelect')?.addEventListener('change', (e) => {
        this.track('lei_changed', {
          lei: e.target.value,
          timestamp: new Date().toISOString()
        });
      });
      
      // Rastrear tipo de comunicação
      document.querySelectorAll('input[name="tipoComunicacao"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
          this.track('tipo_comunicacao_changed', {
            tipo: e.target.value,
            timestamp: new Date().toISOString()
          });
        });
      });
    },
    
    trackPerformance() {
      // Rastrear tempo de carregamento
      window.addEventListener('load', () => {
        const loadTime = Date.now() - this.startTime;
        this.track('page_load_time', {
          load_time_ms: loadTime,
          timestamp: new Date().toISOString()
        });
      });
      
      // Rastrear tempo de sessão ao sair
      window.addEventListener('beforeunload', () => {
        const sessionTime = Date.now() - this.startTime;
        this.track('session_end', {
          session_duration_ms: sessionTime,
          timestamp: new Date().toISOString()
        });
      });
    },
    
    track(event, data = {}) {
      const eventData = {
        event,
        session_id: this.sessionId,
        user_agent: navigator.userAgent,
        screen_resolution: `${screen.width}x${screen.height}`,
        viewport_size: `${window.innerWidth}x${window.innerHeight}`,
        ...data
      };
      
      // Log local
      if (window.App?.logger) {
        window.App.logger.info('Analytics', event, eventData);
      }
      
      // Armazenar localmente para análise
      this.storeEvent(eventData);
      
      // Enviar para servidor se configurado
      if (window.App?.config?.ANALYTICS_ENDPOINT) {
        this.sendToServer(eventData);
      }
    },
    
    storeEvent(eventData) {
      try {
        const events = JSON.parse(localStorage.getItem('ineleg_analytics') || '[]');
        events.push(eventData);
        
        // Manter apenas os últimos 500 eventos
        if (events.length > 500) {
          events.splice(0, events.length - 500);
        }
        
        localStorage.setItem('ineleg_analytics', JSON.stringify(events));
      } catch (e) {
        console.warn('Não foi possível armazenar evento de analytics:', e);
      }
    },
    
    sendToServer(eventData) {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          window.App.config.ANALYTICS_ENDPOINT,
          JSON.stringify(eventData)
        );
      } else {
        // Fallback para fetch
        fetch(window.App.config.ANALYTICS_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(eventData),
          keepalive: true
        }).catch(() => {}); // Ignorar erros silenciosamente
      }
    },
    
    getAnalytics() {
      try {
        return JSON.parse(localStorage.getItem('ineleg_analytics') || '[]');
      } catch (e) {
        return [];
      }
    },
    
    generateReport() {
      const events = this.getAnalytics();
      const report = {
        total_events: events.length,
        searches: events.filter(e => e.event === 'search_performed').length,
        suggestions_used: events.filter(e => e.event === 'suggestion_selected').length,
        results_copied: events.filter(e => e.event === 'result_copied').length,
        most_searched_leis: {},
        session_durations: []
      };
      
      // Análise de leis mais buscadas
      events.filter(e => e.event === 'search_performed').forEach(e => {
        const lei = e.lei || 'unknown';
        report.most_searched_leis[lei] = (report.most_searched_leis[lei] || 0) + 1;
      });
      
      // Análise de duração de sessões
      events.filter(e => e.event === 'session_end').forEach(e => {
        if (e.session_duration_ms) {
          report.session_durations.push(e.session_duration_ms);
        }
      });
      
      return report;
    },
    
    clearAnalytics() {
      localStorage.removeItem('ineleg_analytics');
    }
  };
  
  // Expor globalmente
  window.App = window.App || {};
  window.App.analytics = Analytics;
  
  // Inicializar automaticamente
  Analytics.init();
})();