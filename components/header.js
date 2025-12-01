// Header Component - Injeta o header em todas as páginas
// Centraliza o HTML do header para evitar duplicação e erros

(function () {
    'use strict';

    // HTML do header (template literal para evitar corrupção)
    const headerHTML = `
        <header class="system-header">
            <div class="container">
                <div class="header-content">
                    <div class="system-brand">
                        <div class="brand-icon">
                            <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3">
                                </path>
                            </svg>
                        </div>
                        <div class="brand-text">
                            <h1>Inelegis</h1>
                            <p>Sistema de Consulta</p>
                        </div>
                    </div>
                    <div class="system-info">
                        <div class="version">v0.0.6</div>
                        <div class="status" role="status" aria-live="polite">
                            <div class="status-dot" aria-hidden="true"></div>
                            Sistema Ativo
                        </div>
                    </div>
                </div>
            </div>
        </header>
    `;

    // Função para injetar o header
    function injectHeader() {
        // Verifica se já existe um header
        const existingHeader = document.querySelector('header.system-header');
        if (existingHeader) {
            console.log('[Header Component] Header já existe, pulando injeção');
            return;
        }

        // Insere o header no início do body
        document.body.insertAdjacentHTML('afterbegin', headerHTML);

        console.log('[Header Component] Header injetado com sucesso');
    }

    // Injeta o header quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectHeader);
    } else {
        injectHeader();
    }
})();
