'use strict';

/**
 * Search Logic Module
 * Handles the business logic for finding laws and articles.
 */

import { debugLog } from '../utils/core-utils.js';

import { ArtigoFormatter } from '../utils/formatters.js';
import { ExceptionValidator } from '../utils/exceptions.js';

// Dependencies (assuming global or passed) - In a full module system these would be imports
// For now, we wrap access to them
const getDataNormalizer = () => {
    if (typeof window !== 'undefined' && window.DataNormalizer) return window.DataNormalizer;
    return null;
};

// Removed getArtigoFormatter/getExceptionValidator shims as we now import them


/**
 * Filtra a lista de exceções para manter apenas as do MESMO artigo consultado
 */
export function filtrarExcecoesDoMesmoArtigo(excecoes, artigoProcessado) {
    if (!Array.isArray(excecoes)) return [];

    // Se temos formato processado, usamos o número do artigo
    const num = (artigoProcessado && artigoProcessado.artigo) ? String(artigoProcessado.artigo) : '';

    if (!num) return [];

    // Regex aproximado para encontrar referências ao artigo na string da exceção
    const rx = new RegExp(String.raw`\bart\.?s?\.?\s*${num}(?!-)`, 'i');

    const norm = (s) => {
        try {
            return String(s || '').normalize('NFD').replace(/\p{Diacritic}/gu, '');
        } catch {
            return String(s || '');
        }
    };

    return excecoes.filter((ex) => rx.test(norm(ex)));
}

/**
 * Busca inelegibilidade por lei e artigo específicos
 */
export function buscarInelegibilidadePorLeiEArtigo(codigoLei, numeroArtigo) {
    debugLog('INICIANDO BUSCA (Module)', { codigoLei, numeroArtigo });

    if (!numeroArtigo || numeroArtigo.trim().length < 2) {
        debugLog('Artigo muito curto', numeroArtigo);
        return null;
    }

    const DataNormalizer = getDataNormalizer();

    if (!DataNormalizer) {
        console.error('DataNormalizer não disponível');
        return null;
    }

    const artigoProcessado = ArtigoFormatter ? ArtigoFormatter.processar(numeroArtigo) : { artigo: numeroArtigo };
    debugLog('ARTIGO PROCESSADO', artigoProcessado);

    const resultados = DataNormalizer.query({
        lei: codigoLei,
        artigo: artigoProcessado.artigo,
        paragrafo: artigoProcessado.paragrafo,
        inciso: artigoProcessado.inciso,
        alinea: artigoProcessado.alinea
    });

    if (!resultados || resultados.length === 0) {
        return null;
    }

    const item = resultados[0];
    const temExcecao = ExceptionValidator ? ExceptionValidator.verificar(item, artigoProcessado) : false;

    return {
        ...item,
        artigoOriginal: numeroArtigo,
        artigoProcessado: artigoProcessado,
        inelegivel: !temExcecao,
        temExcecao: temExcecao,
        excecoes: filtrarExcecoesDoMesmoArtigo(item.excecoes || [], artigoProcessado),
        excecoesDetalhes: temExcecao ? [{
            norma: item.norma,
            excecoes: item.excecoes,
            crime: item.crime,
            observacao: item.observacao
        }] : []
    };
}

export function buscarFlexivel() {
    return null;
}
