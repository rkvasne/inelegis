'use strict';

/**
 * Módulo seguro para gerenciamento de localStorage
 * Adiciona validação, expiração e sanitização
 */

const SecureStorage = {
  /**
   * Prefixo para todas as chaves do app
   */
  PREFIX: 'inelegis_',

  /**
   * Tempo de expiração padrão (90 dias)
   */
  DEFAULT_EXPIRY: 90 * 24 * 60 * 60 * 1000,

  /**
   * Salva item com timestamp e validação
   */
  setItem(key, value, expiryMs = this.DEFAULT_EXPIRY) {
    try {
      const data = {
        value: value,
        timestamp: Date.now(),
        expiry: Date.now() + expiryMs,
        version: '0.0.8'
      };
      
      const fullKey = this.PREFIX + key;
      localStorage.setItem(fullKey, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
      return false;
    }
  },

  /**
   * Recupera item com validação de expiração
   */
  getItem(key) {
    try {
      const fullKey = this.PREFIX + key;
      const item = localStorage.getItem(fullKey);
      
      if (!item) {
        return null;
      }

      // Tentar fazer parse do JSON
      let data;
      try {
        data = JSON.parse(item);
      } catch (parseError) {
        // Se não for JSON válido, pode ser um valor legado (string simples)
        // Ignorar silenciosamente e retornar null
        return null;
      }
      
      // Validar estrutura
      if (!data.timestamp || !data.expiry || !data.value) {
        this.removeItem(key);
        return null;
      }

      // Verificar expiração
      if (Date.now() > data.expiry) {
        this.removeItem(key);
        return null;
      }

      return data.value;
    } catch (error) {
      console.error('Erro ao ler do localStorage:', error);
      return null;
    }
  },

  /**
   * Remove item
   */
  removeItem(key) {
    try {
      const fullKey = this.PREFIX + key;
      localStorage.removeItem(fullKey);
      return true;
    } catch (error) {
      console.error('Erro ao remover do localStorage:', error);
      return false;
    }
  },

  /**
   * Limpa todos os itens do app
   */
  clear() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.PREFIX)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.error('Erro ao limpar localStorage:', error);
      return false;
    }
  },

  /**
   * Verifica se item existe e é válido
   */
  hasItem(key) {
    return this.getItem(key) !== null;
  },

  /**
   * Limpa itens expirados
   */
  cleanExpired() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.PREFIX)) {
          const shortKey = key.replace(this.PREFIX, '');
          try {
            this.getItem(shortKey); // Isso remove automaticamente se expirado
          } catch (itemError) {
            // Ignorar erros individuais de itens
            // Pode ser um item legado ou corrompido
          }
        }
      });
    } catch (error) {
      console.error('Erro ao limpar itens expirados:', error);
    }
  }
};

// Limpar itens expirados ao carregar
if (typeof window !== 'undefined') {
  window.SecureStorage = SecureStorage;
  SecureStorage.cleanExpired();
}
