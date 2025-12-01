// Navigation Component - Injeta a navegação em todas as páginas
// Centraliza o HTML da navegação para evitar duplicação e erros

(function () {
    'use strict';

    // Detecta a página atual para marcar o link ativo
    function getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('consulta')) return 'consulta';
        if (path.includes('sobre')) return 'sobre';
        if (path.includes('faq')) return 'faq';
        if (path.includes('landing')) return 'landing';
        return 'index';
    }

    // Gera o HTML da navegação com o link ativo correto
    function getNavHTML() {
        const currentPage = getCurrentPage();

        return `
            <nav class="nav" role="navigation" aria-label="Navegação principal">
                <div class="container">
                    <div class="nav-content">
                        <div class="nav-links">
                            <a href="./" class="nav-link${currentPage === 'index' ? ' active' : ''}"${currentPage === 'index' ? ' aria-current="page"' : ''}>
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6">
                                    </path>
                                </svg>
                                Início
                            </a>
                            <a href="consulta" class="nav-link${currentPage === 'consulta' ? ' active' : ''}"${currentPage === 'consulta' ? ' aria-current="page"' : ''}>
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                                Consulta
                            </a>
                            <a href="sobre" class="nav-link${currentPage === 'sobre' ? ' active' : ''}"${currentPage === 'sobre' ? ' aria-current="page"' : ''}>
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                Sobre
                            </a>
                            <a href="faq" class="nav-link${currentPage === 'faq' ? ' active' : ''}"${currentPage === 'faq' ? ' aria-current="page"' : ''}>
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
                                    </path>
                                </svg>
                                FAQ
                            </a>
                        </div>
                    </div>
                </div>
            </nav>
        `;
    }

    // Função para injetar a navegação
    function injectNav() {
        // Verifica se já existe uma nav
        const existingNav = document.querySelector('nav.nav');
        if (existingNav) {
            console.log('[Nav Component] Navegação já existe, pulando injeção');
            return;
        }

        // Encontra o header para inserir a nav logo após
        const header = document.querySelector('header.system-header');
        if (header) {
            header.insertAdjacentHTML('afterend', getNavHTML());
        } else {
            // Se não houver header, insere no início do body
            document.body.insertAdjacentHTML('afterbegin', getNavHTML());
        }

        console.log('[Nav Component] Navegação injetada com sucesso');
    }

    // Injeta a navegação quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectNav);
    } else {
        injectNav();
    }
})();
