"use strict";

/**
 * Módulo de validação de exceções
 * Consolida lógica de verificação de exceções aplicáveis
 */

const ExceptionValidator = {
  /**
   * Normaliza texto para comparação
   */
  normalizar(texto) {
    try {
      return String(texto || "")
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase();
    } catch {
      return String(texto || "").toLowerCase();
    }
  },

  /**
   * Verifica se há exceções aplicáveis ao artigo consultado
   * Versão consolidada e otimizada
   */
  verificar(item, artigoProcessado) {
    if (
      !item.excecoes ||
      !Array.isArray(item.excecoes) ||
      item.excecoes.length === 0
    ) {
      return null;
    }

    const artigoPrincipal = (artigoProcessado.artigo || "").toLowerCase();
    const paragrafo = artigoProcessado.paragrafo
      ? String(artigoProcessado.paragrafo).toLowerCase()
      : null;
    const inciso = artigoProcessado.inciso
      ? String(artigoProcessado.inciso).toLowerCase()
      : null;
    const alinea = artigoProcessado.alinea
      ? String(artigoProcessado.alinea).toLowerCase()
      : null;

    for (const excecao of item.excecoes) {
      const excLower = String(excecao || "").toLowerCase();
      const excNorm = this.normalizar(excLower);

      // Se o artigo consultado tem parágrafo, inciso ou alínea
      if (paragrafo || inciso || alinea) {
        let corresponde = false;

        // Verificar parágrafo
        if (paragrafo && !corresponde) {
          const regexParagrafo = new RegExp(
            `(§|\\u00a7|\\uFFFD)\\s*${paragrafo}`,
          );
          const regexParagrafoTexto = new RegExp(`paragrafo\\s*${paragrafo}`);

          if (
            regexParagrafo.test(excLower) ||
            regexParagrafoTexto.test(excNorm)
          ) {
            corresponde = true;
          }
        }

        // Verificar inciso
        if (inciso && !corresponde) {
          const regexInciso = new RegExp(`(^|[\\s,])${inciso}(?=$|[\\s,])`);
          const regexIncisoTexto = new RegExp(`inciso\\s*${inciso}`);

          if (regexInciso.test(excLower) || regexIncisoTexto.test(excNorm)) {
            corresponde = true;
          }
        }

        // Verificar alínea
        if (alinea && !corresponde) {
          const regexAlinea = new RegExp(`"${alinea}"`);
          const regexAlineaTexto = new RegExp(`alinea\\s*${alinea}`);

          if (regexAlinea.test(excLower) || regexAlineaTexto.test(excNorm)) {
            corresponde = true;
          }
        }

        if (corresponde) {
          return excecao;
        }
      } else {
        // Artigo sem especificações (caput)
        // Verificar se a exceção tem especificações
        const temParagrafo = /(§|\\u00a7|\\uFFFD)\s*\d|paragrafo/i.test(
          excNorm,
        );
        const temInciso = /,\s*[ivx]+|inciso/i.test(excNorm);
        const temAlinea = /"\w"|alinea/i.test(excNorm);

        // Se a exceção tem especificações, não se aplica ao caput
        if (temParagrafo || temInciso || temAlinea) {
          continue;
        }

        // Verificar se é o artigo caput
        const patterns = [
          `, ${artigoPrincipal},`,
          `art. ${artigoPrincipal}, caput`,
          `art. ${artigoPrincipal} caput`,
          `art. ${artigoPrincipal}`,
          `arts. ${artigoPrincipal}`,
        ];

        for (const pattern of patterns) {
          if (excLower.includes(pattern) || excLower === pattern.trim()) {
            return excecao;
          }
        }
      }
    }

    return null;
  },

  /**
   * Filtra exceções para manter apenas as do mesmo artigo consultado
   */
  filtrarPorArtigo(excecoes, artigoProcessado) {
    if (!Array.isArray(excecoes)) return [];

    const numeroArtigo =
      artigoProcessado && artigoProcessado.artigo
        ? String(artigoProcessado.artigo)
        : "";

    if (!numeroArtigo) return [];

    const regex = new RegExp(
      String.raw`\bart\.?s?\.?\s*${numeroArtigo}(?!-)`,
      "i",
    );

    return excecoes.filter((excecao) => {
      const excNorm = this.normalizar(excecao);
      return regex.test(excNorm);
    });
  },
};

// Exportar para uso global
if (typeof window !== "undefined") {
  window.ExceptionValidator = ExceptionValidator;
}

