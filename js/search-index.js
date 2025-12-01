'use strict';

/**
 * Índice de busca otimizado
 * Melhora performance de consultas usando cache e índices
 */

const SearchIndex = {
  // Cache de índices
  _cache: {
    porLei: null,
    porArtigo: null,
    lastBuild: null
  },

  /**
   * Constrói índice por lei
   */
  buildLeiIndex(leisDisponiveis, tabelaInelegibilidade) {
    if (this._cache.porLei && this._cache.lastBuild) {
      const age = Date.now() - this._cache.lastBuild;
      // Cache válido por 1 hora
      if (age < 3600000) {
        return this._cache.porLei;
      }
    }

    const index = {};

    leisDisponiveis.forEach(lei => {
      const codigoLei = lei.value;
      const itens = [];

      tabelaInelegibilidade.forEach(item => {
        if (this._verificarLeiCorresponde(item, codigoLei)) {
          // Pré-processar artigos para busca mais rápida
          try {
            if (window.ArtigoFormatter) {
              item._artigos = window.ArtigoFormatter.extrairArtigos(item.norma);
            } else {
              item._artigos = this._extrairArtigosSimples(item.norma);
            }
          } catch {
            item._artigos = [];
          }
          itens.push(item);
        }
      });

      index[codigoLei] = itens;
    });

    this._cache.porLei = index;
    this._cache.lastBuild = Date.now();

    return index;
  },

  /**
   * Obtém itens por lei do índice
   */
  getItensPorLei(codigoLei, leisDisponiveis, tabelaInelegibilidade) {
    const index = this.buildLeiIndex(leisDisponiveis, tabelaInelegibilidade);
    return index[codigoLei] || [];
  },

  /**
   * Busca otimizada com índice
   */
  buscar(codigoLei, numeroArtigo, leisDisponiveis, tabelaInelegibilidade) {
    // Validação básica
    if (!numeroArtigo || numeroArtigo.trim().length < 2) {
      return null;
    }

    // Processar artigo
    const artigoProcessado = window.ArtigoFormatter 
      ? window.ArtigoFormatter.processar(numeroArtigo)
      : { artigo: numeroArtigo.trim() };

    // Buscar em índice
    const candidatos = this.getItensPorLei(codigoLei, leisDisponiveis, tabelaInelegibilidade);

    for (const item of candidatos) {
      // Verificar correspondência
      if (this._verificarArtigoCorresponde(item, artigoProcessado)) {
        // Verificar exceções
        const temExcecao = window.ExceptionValidator
          ? window.ExceptionValidator.verificar(item, artigoProcessado)
          : null;

        return {
          ...item,
          artigoOriginal: numeroArtigo,
          artigoProcessado: artigoProcessado,
          inelegivel: !temExcecao,
          temExcecao: temExcecao,
          excecoes: window.ExceptionValidator
            ? window.ExceptionValidator.filtrarPorArtigo(item.excecoes || [], artigoProcessado)
            : item.excecoes || []
        };
      }
    }

    // Busca flexível se não encontrou
    return this._buscarFlexivel(codigoLei, artigoProcessado, candidatos);
  },

  /**
   * Busca flexível (fallback)
   */
  _buscarFlexivel(codigoLei, artigoProcessado, candidatos) {
    const artigoPrincipal = artigoProcessado.artigo;

    if (artigoPrincipal.length < 2) {
      return null;
    }

    for (const item of candidatos) {
      const artigos = item._artigos || [];
      
      if (artigos.includes(artigoPrincipal)) {
        const temExcecao = window.ExceptionValidator
          ? window.ExceptionValidator.verificar(item, artigoProcessado)
          : null;

        return {
          ...item,
          artigoProcessado: artigoProcessado,
          inelegivel: !temExcecao,
          temExcecao: temExcecao,
          excecoes: window.ExceptionValidator
            ? window.ExceptionValidator.filtrarPorArtigo(item.excecoes || [], artigoProcessado)
            : item.excecoes || [],
          buscaFlexivel: true
        };
      }
    }

    return null;
  },

  /**
   * Verifica se artigo corresponde
   */
  _verificarArtigoCorresponde(item, artigoProcessado) {
    if (!item || !artigoProcessado || !artigoProcessado.artigo) {
      return false;
    }

    const artigoPrincipal = artigoProcessado.artigo.toLowerCase().trim();
    if (!artigoPrincipal) return false;

    const artigos = item._artigos || [];
    return artigos.includes(artigoPrincipal);
  },

  /**
   * Verifica se lei corresponde
   */
  _verificarLeiCorresponde(item, codigoLei) {
    const codigoNormalizado = (item.codigo || '').toLowerCase();
    const leiNormalizada = codigoLei.toLowerCase();
    return codigoNormalizado === leiNormalizada;
  },

  /**
   * Extração simples de artigos (fallback)
   */
  _extrairArtigosSimples(norma) {
    if (!norma) return [];
    
    const matches = norma.match(/\d+/g) || [];
    return [...new Set(matches)];
  },

  /**
   * Limpa cache
   */
  clearCache() {
    this._cache = {
      porLei: null,
      porArtigo: null,
      lastBuild: null
    };
  }
};

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.SearchIndex = SearchIndex;
}
