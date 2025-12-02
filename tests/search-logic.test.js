import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { buscarInelegibilidadePorLeiEArtigo, filtrarExcecoesDoMesmoArtigo } from '../src/js/modules/search-logic.js';

// Mocks for dependencies that are currently global in the app
const mockDataNormalizer = {
    query: vi.fn(),
};

const mockArtigoFormatter = {
    processar: vi.fn(),
};

const mockExceptionValidator = {
    verificar: vi.fn(),
};

describe('Search Logic Module', () => {
    beforeEach(() => {
        // Setup globals
        global.window = {
            DataNormalizer: mockDataNormalizer,
            ArtigoFormatter: mockArtigoFormatter,
            ExceptionValidator: mockExceptionValidator,
        };
        global.DataNormalizer = mockDataNormalizer; // In case logic checks global directly
    });

    afterEach(() => {
        vi.clearAllMocks();
        delete global.window;
        delete global.DataNormalizer;
    });

    describe('filtrarExcecoesDoMesmoArtigo', () => {
        it('should filter exceptions related to the article', () => {
            const excecoes = ['Art. 155 - Furto qualificado', 'Art. 121 - Homicídio'];
            const artigoProcessado = { artigo: '155' };

            const result = filtrarExcecoesDoMesmoArtigo(excecoes, artigoProcessado);
            expect(result).toHaveLength(1);
            expect(result[0]).toContain('155');
        });

        it('should return empty if no matches', () => {
            const excecoes = ['Art. 121 - Homicídio'];
            const artigoProcessado = { artigo: '155' };

            const result = filtrarExcecoesDoMesmoArtigo(excecoes, artigoProcessado);
            expect(result).toHaveLength(0);
        });
    });

    describe('buscarInelegibilidadePorLeiEArtigo', () => {
        it('should return null for short article input', () => {
            const result = buscarInelegibilidadePorLeiEArtigo('CP', '1');
            expect(result).toBeNull();
        });

        it('should return inelegivel=true when found and no exception', () => {
            // Setup Mocks
            mockArtigoFormatter.processar.mockReturnValue({ artigo: '155', formatado: '155' });
            mockDataNormalizer.query.mockReturnValue([{
                codigo: 'CP',
                norma: 'CP',
                crime: 'Furto',
                excecoes: []
            }]);
            mockExceptionValidator.verificar.mockReturnValue(false);

            const result = buscarInelegibilidadePorLeiEArtigo('CP', '155');

            expect(mockDataNormalizer.query).toHaveBeenCalled();
            expect(result).not.toBeNull();
            expect(result.inelegivel).toBe(true);
            expect(result.temExcecao).toBe(false);
        });

        it('should return inelegivel=false when exception applies', () => {
            // Setup Mocks
            mockArtigoFormatter.processar.mockReturnValue({ artigo: '155', formatado: '155' });
            mockDataNormalizer.query.mockReturnValue([{
                codigo: 'CP',
                crime: 'Furto',
                excecoes: ['Art. 155 exc']
            }]);
            mockExceptionValidator.verificar.mockReturnValue('Exceção Aplicável');

            const result = buscarInelegibilidadePorLeiEArtigo('CP', '155');

            expect(result.inelegivel).toBe(false);
            expect(result.temExcecao).toBeTruthy();
        });

        it('should return null if not found in DataNormalizer', () => {
            mockArtigoFormatter.processar.mockReturnValue({ artigo: '999' });
            mockDataNormalizer.query.mockReturnValue([]);

            const result = buscarInelegibilidadePorLeiEArtigo('CP', '999');
            expect(result).toBeNull();
        });
    });
});
