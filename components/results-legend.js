// Results Legend Component - Componente da Legenda de Resultados
// Esta é a seção que estava causando problemas de corrupção

(function () {
    'use strict';

    // HTML da legenda de resultados (template literal para evitar corrupção)
    const legendHTML = `
        <!-- INÍCIO: Legenda de Resultados (Componente) -->
        <div class="results-legend">
            <h3>Legenda de Resultados</h3>
            <div class="legend-items">
                <div class="legend-item ineligible">
                    <div class="legend-icon">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clip-rule="evenodd"></path>
                        </svg>
                    </div>
                    <div class="legend-content">
                        <span class="legend-title">INELEGÍVEL</span>
                        <span class="legend-description">Enseja anotação de inelegibilidade</span>
                    </div>
                </div>
                <div class="legend-item eligible">
                    <div class="legend-icon">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clip-rule="evenodd"></path>
                        </svg>
                    </div>
                    <div class="legend-content">
                        <span class="legend-title">ELEGÍVEL</span>
                        <span class="legend-description">Não enseja anotação de inelegibilidade</span>
                    </div>
                </div>
                <div class="legend-item not-found">
                    <div class="legend-icon">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                clip-rule="evenodd"></path>
                        </svg>
                    </div>
                    <div class="legend-content">
                        <span class="legend-title">NÃO ENCONTRADO</span>
                        <span class="legend-description">Artigo não encontrado na base de dados</span>
                    </div>
                </div>
            </div>
        </div>
        <!-- FIM: Legenda de Resultados (Componente) -->
    `;

    // Função para injetar a legenda
    function injectLegend() {
        // Verifica se já existe uma legenda
        const existingLegend = document.querySelector('.results-legend');
        if (existingLegend) {
            console.log('[Legend Component] Legenda já existe, pulando injeção');
            return;
        }

        // Encontra o elemento pai onde a legenda deve ser inserida
        // Procura pelo card de "Guia de Uso"
        const guideCard = document.querySelector('.card .usage-guide');
        if (guideCard) {
            // Insere a legenda após o guia de uso, dentro do mesmo card-body
            const cardBody = guideCard.closest('.card-body');
            if (cardBody) {
                cardBody.insertAdjacentHTML('beforeend', legendHTML);
                console.log('[Legend Component] Legenda injetada com sucesso');
                return;
            }
        }

        console.warn('[Legend Component] Não foi possível encontrar o local para injetar a legenda');
    }

    // Injeta a legenda quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectLegend);
    } else {
        injectLegend();
    }
})();
