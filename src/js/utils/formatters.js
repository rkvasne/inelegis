'use strict';

/**
 * Módulo de formatação de artigos
 * Consolida todas as funções de formatação em um único lugar
 */

const ArtigoFormatter = {
  /**
   * Normaliza texto removendo acentos e caracteres especiais
   */
  normalizar(texto) {
    if (!texto || typeof texto !== 'string') return '';
    try {
      return texto
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .toLowerCase()
        .trim();
    } catch {
      return texto.toLowerCase().trim();
    }
  },

  /**
   * Aplica formatação automática ao artigo
   * Versão consolidada e otimizada
   */
  formatar(valor) {
    if (!valor || typeof valor !== 'string') return valor;
    
    let formatado = valor.trim();
    
    // 1. Normalizar espaços
    formatado = formatado.replace(/\s+/g, ' ');
    
    // 2. Formatar parágrafo: §1 -> §1º
    formatado = formatado.replace(
      /(?:§|\u00A7|\uFFFD)\s*(\d+)(?!\s*(?:º|\u00BA|\uFFFD))/g,
      '§$1º'
    );
    formatado = formatado.replace(/\bpar[aá]grafo\s*(\d+)/gi, '§$1º');
    
    // 3. Normalizar c/c
    formatado = formatado.replace(/(?<!\/)(cc|CC|C\/c|c\/C)(?!\/)/g, 'c/c');
    
    // 4. Normalizar vírgulas
    formatado = formatado.replace(/\s*,\s*/g, ', ');
    
    // 5. Formatar alíneas: a -> "a"
    formatado = formatado.replace(
      /(?<!["\'])([a-z])(?=\s*(?:,|$|\s))/gi,
      (match, letra) => {
        if (/["']/.test(letra)) return match;
        return `"${letra.toLowerCase()}"`;
      }
    );
    
    return formatado;
  },

  /**
   * Processa artigo completo em componentes estruturados
   */
  processar(artigo) {
    const artigoLimpo = String(artigo || '').trim();
    
    const resultado = {
      original: artigoLimpo,
      artigo: '',
      paragrafo: '',
      inciso: '',
      alinea: '',
      concomitante: [],
      formatado: ''
    };

    // Verificar artigos concomitantes (c/c)
    const partesConcomitantes = artigoLimpo.split(/\s+c\/c\s+/i);

    if (partesConcomitantes.length > 1) {
      // Processar artigo principal
      const artPrincipal = this.processarParte(partesConcomitantes[0]);
      Object.assign(resultado, artPrincipal);

      // Processar artigos concomitantes
      for (let i = 1; i < partesConcomitantes.length; i++) {
        resultado.concomitante.push(this.processarParte(partesConcomitantes[i]));
      }
    } else {
      // Processar artigo simples
      const artProcessado = this.processarParte(artigoLimpo);
      Object.assign(resultado, artProcessado);
    }

    resultado.formatado = this.formatarCompleto(resultado);
    return resultado;
  },

  /**
   * Processa uma parte do artigo
   */
  processarParte(parte) {
    const resultado = {
      artigo: '',
      paragrafo: '',
      inciso: '',
      alinea: ''
    };

    if (!parte || typeof parte !== 'string') {
      return resultado;
    }

    let texto = parte.trim().replace(/\s+/g, ' ');
    if (!texto) return resultado;

    // Extrair artigo (número inicial)
    const matchArtigo = texto.match(/^(\d+)/);
    if (matchArtigo) {
      resultado.artigo = matchArtigo[1];
      texto = texto.substring(matchArtigo[0].length).trim();
    }

    // Extrair parágrafo
    const matchParagrafo = texto.match(/[,\s]*§\s*(\d+)[º°]?/i);
    if (matchParagrafo) {
      resultado.paragrafo = matchParagrafo[1];
      texto = texto.replace(matchParagrafo[0], '').trim();
    }

    // Extrair inciso
    const matchInciso = texto.match(/[,\s]*(I{1,3}|IV|V|VI{0,3}|IX|X{1,3})/i);
    if (matchInciso) {
      resultado.inciso = matchInciso[1].toUpperCase();
      texto = texto.replace(matchInciso[0], '').trim();
    }

    // Extrair alínea
    const matchAlinea = texto.match(/[,\s]*['"]?([a-z])['"]?/i);
    if (matchAlinea) {
      resultado.alinea = matchAlinea[1].toLowerCase();
    }

    return resultado;
  },

  /**
   * Formata artigo completo para exibição
   */
  formatarCompleto(artigo) {
    let formatado = artigo.artigo;

    if (artigo.paragrafo) {
      formatado += `, §${artigo.paragrafo}º`;
    }

    if (artigo.inciso) {
      formatado += `, ${artigo.inciso}`;
    }

    if (artigo.alinea) {
      formatado += `, "${artigo.alinea}"`;
    }

    // Adicionar artigos concomitantes
    if (artigo.concomitante && artigo.concomitante.length > 0) {
      const concomitantes = artigo.concomitante
        .map(c => this.formatarParte(c))
        .join(' c/c ');
      formatado += ` c/c ${concomitantes}`;
    }

    return formatado;
  },

  /**
   * Formata parte do artigo
   */
  formatarParte(parte) {
    let formatado = parte.artigo;

    if (parte.paragrafo) {
      formatado += `, §${parte.paragrafo}º`;
    }

    if (parte.inciso) {
      formatado += `, ${parte.inciso}`;
    }

    if (parte.alinea) {
      formatado += `, "${parte.alinea}"`;
    }

    return formatado;
  },

  /**
   * Extrai números de artigos de uma string
   */
  extrairArtigos(texto) {
    if (!texto) return [];

    const norma = texto.toLowerCase();
    const artigos = [];

    // Padrão para encontrar "Art. NNN" ou "Arts. NNN, NNN, ..."
    const matchArts = norma.match(/art\.?s?\.?\s+([\d\-\s,;"'a-z§º°àáäâãèéëêìíïîòóöôùúüûçñ.e-]+)/gi);

    if (matchArts) {
      for (const match of matchArts) {
        const semaRtigo = match.replace(/^art\.?s?\.?\s+/i, '');
        const numeroMatches = semaRtigo.match(/\b(\d+)(?:-[a-z])?\b/gi);

        if (numeroMatches) {
          for (const num of numeroMatches) {
            artigos.push(num.match(/\d+/)[0]);
          }
        }
      }
    }

    return [...new Set(artigos)]; // Remove duplicatas
  }
};

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.ArtigoFormatter = ArtigoFormatter;
}
