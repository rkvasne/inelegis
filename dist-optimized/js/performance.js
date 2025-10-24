/**
 * Sistema de monitoramento de performance
 */
;(function() {
  'use strict';
  
  const Performance = {
    metrics: new Map(),
    observers: new Map(),
    thresholds: {
      search: 100,      // ms
      render: 16,       // ms (60fps)
      memory: 50,       // MB
      bundle: 500       // KB
    },
    
    init() {
      this.setupPerformanceObserver();
      this.setupMemoryMonitoring();
      this.setupNetworkMonitoring();
      this.setupUserTimingAPI();
      this.startMonitoring();
    },
    
    setupPerformanceObserver() {
      if (!window.PerformanceObserver) return;
      
      // Observar métricas de navegação
      const navObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric('navigation', entry.name, entry.duration);
        }
      });
      
      try {
        navObserver.observe({ entryTypes: ['navigation'] });
        this.observers.set('navigation', navObserver);
      } catch (e) {
        console.warn('Performance Observer não suportado para navigation');
      }
      
      // Observar métricas de recursos
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordResourceMetric(entry);
        }
      });
      
      try {
        resourceObserver.observe({ entryTypes: ['resource'] });
        this.observers.set('resource', resourceObserver);
      } catch (e) {
        console.warn('Performance Observer não suportado para resources');
      }
      
      // Observar métricas de medição
      const measureObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric('measure', entry.name, entry.duration);
        }
      });
      
      try {
        measureObserver.observe({ entryTypes: ['measure'] });
        this.observers.set('measure', measureObserver);
      } catch (e) {
        console.warn('Performance Observer não suportado para measures');
      }
    },
    
    setupMemoryMonitoring() {
      if (!performance.memory) return;
      
      setInterval(() => {
        const memory = performance.memory;
        this.recordMetric('memory', 'used', memory.usedJSHeapSize / 1024 / 1024);
        this.recordMetric('memory', 'total', memory.totalJSHeapSize / 1024 / 1024);
        this.recordMetric('memory', 'limit', memory.jsHeapSizeLimit / 1024 / 1024);
        
        // Alertar se uso de memória for alto
        const usedMB = memory.usedJSHeapSize / 1024 / 1024;
        if (usedMB > this.thresholds.memory) {
          this.warn('memory', `Alto uso de memória: ${usedMB.toFixed(1)}MB`);
        }
      }, 5000);
    },
    
    setupNetworkMonitoring() {
      if (!navigator.connection) return;
      
      const connection = navigator.connection;
      this.recordMetric('network', 'effectiveType', connection.effectiveType);
      this.recordMetric('network', 'downlink', connection.downlink);
      this.recordMetric('network', 'rtt', connection.rtt);
      
      connection.addEventListener('change', () => {
        this.recordMetric('network', 'effectiveType', connection.effectiveType);
        this.recordMetric('network', 'downlink', connection.downlink);
        this.recordMetric('network', 'rtt', connection.rtt);
      });
    },
    
    setupUserTimingAPI() {
      // Wrapper para User Timing API
      window.App = window.App || {};
      window.App.perf = {
        mark: (name) => {
          performance.mark(name);
        },
        
        measure: (name, startMark, endMark) => {
          performance.measure(name, startMark, endMark);
        },
        
        time: (name) => {
          performance.mark(`${name}-start`);
        },
        
        timeEnd: (name) => {
          performance.mark(`${name}-end`);
          performance.measure(name, `${name}-start`, `${name}-end`);
          
          const measure = performance.getEntriesByName(name)[0];
          if (measure) {
            this.recordMetric('timing', name, measure.duration);
            
            // Verificar thresholds
            if (name.includes('search') && measure.duration > this.thresholds.search) {
              this.warn('search', `Busca lenta: ${measure.duration.toFixed(1)}ms`);
            }
            
            if (name.includes('render') && measure.duration > this.thresholds.render) {
              this.warn('render', `Renderização lenta: ${measure.duration.toFixed(1)}ms`);
            }
          }
        }
      };
    },
    
    startMonitoring() {
      // Monitorar Core Web Vitals
      this.measureCoreWebVitals();
      
      // Monitorar FPS
      this.measureFPS();
      
      // Monitorar tamanho do bundle
      this.measureBundleSize();
    },
    
    measureCoreWebVitals() {
      // Largest Contentful Paint (LCP)
      if (window.PerformanceObserver) {
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            this.recordMetric('cwv', 'lcp', lastEntry.startTime);
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
          console.warn('LCP não suportado');
        }
        
        // First Input Delay (FID)
        try {
          const fidObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              this.recordMetric('cwv', 'fid', entry.processingStart - entry.startTime);
            }
          });
          fidObserver.observe({ entryTypes: ['first-input'] });
        } catch (e) {
          console.warn('FID não suportado');
        }
        
        // Cumulative Layout Shift (CLS)
        try {
          let clsValue = 0;
          const clsObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!entry.hadRecentInput) {
                clsValue += entry.value;
              }
            }
            this.recordMetric('cwv', 'cls', clsValue);
          });
          clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
          console.warn('CLS não suportado');
        }
      }
    },
    
    measureFPS() {
      let frames = 0;
      let lastTime = performance.now();
      
      const measureFrame = (currentTime) => {
        frames++;
        
        if (currentTime >= lastTime + 1000) {
          const fps = Math.round((frames * 1000) / (currentTime - lastTime));
          this.recordMetric('performance', 'fps', fps);
          
          if (fps < 30) {
            this.warn('fps', `FPS baixo: ${fps}`);
          }
          
          frames = 0;
          lastTime = currentTime;
        }
        
        requestAnimationFrame(measureFrame);
      };
      
      requestAnimationFrame(measureFrame);
    },
    
    measureBundleSize() {
      // Estimar tamanho do bundle baseado nos recursos carregados
      if (performance.getEntriesByType) {
        const resources = performance.getEntriesByType('resource');
        let totalSize = 0;
        
        resources.forEach(resource => {
          if (resource.transferSize) {
            totalSize += resource.transferSize;
          }
        });
        
        const sizeKB = totalSize / 1024;
        this.recordMetric('bundle', 'size', sizeKB);
        
        if (sizeKB > this.thresholds.bundle) {
          this.warn('bundle', `Bundle grande: ${sizeKB.toFixed(1)}KB`);
        }
      }
    },
    
    recordMetric(category, name, value) {
      const key = `${category}.${name}`;
      
      if (!this.metrics.has(key)) {
        this.metrics.set(key, []);
      }
      
      const metrics = this.metrics.get(key);
      metrics.push({
        value,
        timestamp: Date.now()
      });
      
      // Manter apenas os últimos 100 valores
      if (metrics.length > 100) {
        metrics.shift();
      }
      
      // Log para desenvolvimento
      if (window.App?.config?.DEV?.SHOW_PERFORMANCE_METRICS) {
        console.log(`📊 ${key}: ${typeof value === 'number' ? value.toFixed(2) : value}`);
      }
    },
    
    recordResourceMetric(entry) {
      const category = this.getResourceCategory(entry.name);
      
      this.recordMetric('resource', `${category}.duration`, entry.duration);
      this.recordMetric('resource', `${category}.size`, entry.transferSize || 0);
      
      // Alertar sobre recursos lentos
      if (entry.duration > 1000) {
        this.warn('resource', `Recurso lento: ${entry.name} (${entry.duration.toFixed(1)}ms)`);
      }
    },
    
    getResourceCategory(url) {
      if (url.includes('.css')) return 'css';
      if (url.includes('.js')) return 'js';
      if (url.includes('.png') || url.includes('.jpg') || url.includes('.svg')) return 'image';
      if (url.includes('.woff') || url.includes('.ttf')) return 'font';
      return 'other';
    },
    
    warn(category, message) {
      if (window.App?.logger) {
        window.App.logger.warn('Performance', message, { category });
      } else {
        console.warn(`⚠️ Performance [${category}]: ${message}`);
      }
    },
    
    getMetrics(category) {
      const result = {};
      
      for (const [key, values] of this.metrics) {
        if (!category || key.startsWith(category)) {
          const recentValues = values.slice(-10);
          const numericValues = recentValues.map(v => v.value).filter(v => typeof v === 'number');
          
          if (numericValues.length > 0) {
            result[key] = {
              current: recentValues[recentValues.length - 1]?.value,
              average: numericValues.reduce((a, b) => a + b, 0) / numericValues.length,
              min: Math.min(...numericValues),
              max: Math.max(...numericValues),
              count: values.length
            };
          } else {
            result[key] = {
              current: recentValues[recentValues.length - 1]?.value,
              count: values.length
            };
          }
        }
      }
      
      return result;
    },
    
    generateReport() {
      const report = {
        timestamp: new Date().toISOString(),
        metrics: this.getMetrics(),
        summary: {
          totalMetrics: this.metrics.size,
          categories: [...new Set([...this.metrics.keys()].map(k => k.split('.')[0]))],
          warnings: this.getWarnings()
        }
      };
      
      return report;
    },
    
    getWarnings() {
      const warnings = [];
      const metrics = this.getMetrics();
      
      // Verificar thresholds
      if (metrics['timing.search']?.average > this.thresholds.search) {
        warnings.push(`Busca lenta (média: ${metrics['timing.search'].average.toFixed(1)}ms)`);
      }
      
      if (metrics['memory.used']?.current > this.thresholds.memory) {
        warnings.push(`Alto uso de memória (${metrics['memory.used'].current.toFixed(1)}MB)`);
      }
      
      if (metrics['performance.fps']?.average < 30) {
        warnings.push(`FPS baixo (média: ${metrics['performance.fps'].average.toFixed(1)})`);
      }
      
      return warnings;
    },
    
    cleanup() {
      // Limpar observers
      for (const [name, observer] of this.observers) {
        observer.disconnect();
      }
      this.observers.clear();
      
      // Limpar métricas
      this.metrics.clear();
    }
  };
  
  // Expor globalmente
  window.App = window.App || {};
  window.App.performance = Performance;
  
  // Inicializar automaticamente
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Performance.init());
  } else {
    Performance.init();
  }
  
  // Cleanup ao sair da página
  window.addEventListener('beforeunload', () => Performance.cleanup());
})();