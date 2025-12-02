/**
 * Reusable Components
 * Componentes reutilizáveis para todas as páginas
 * @version 0.0.7
 */

const Components = (() => {
    /**
     * Renderiza o header do sistema
     * @param {string} currentPage - Página atual para destacar no menu
     */
    function renderHeader(currentPage = '') {
        return `
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
                            <button id="themeToggle" class="theme-toggle" aria-label="Alternar tema">
                                <svg class="sun-icon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                                </svg>
                                <svg class="moon-icon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                                </svg>
                            </button>
                            <div class="version">v0.0.7</div>
                            <div class="status" role="status" aria-live="polite">
                                <div class="status-dot" aria-hidden="true"></div>
                                Sistema Ativo
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        `;
    }

    /**
     * Renderiza a navegação
     * @param {string} currentPage - Página atual para destacar
     */
    function renderNav(currentPage = '') {
        const pages = [
            { id: 'index', href: './', label: 'Início', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
            { id: 'consulta', href: 'consulta', label: 'Consulta', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
            { id: 'sobre', href: 'sobre', label: 'Sobre', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
            { id: 'faq', href: 'faq', label: 'FAQ', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
        ];

        const navLinks = pages.map(page => {
            const isActive = currentPage === page.id;
            const activeClass = isActive ? ' active' : '';
            const ariaCurrent = isActive ? ' aria-current="page"' : '';
            
            return `
                <a href="${page.href}" class="nav-link${activeClass}"${ariaCurrent}>
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${page.icon}"></path>
                    </svg>
                    ${page.label}
                </a>
            `;
        }).join('');

        return `
            <nav class="nav" role="navigation" aria-label="Navegação principal">
                <div class="container">
                    <div class="nav-content">
                        <div class="nav-links">
                            ${navLinks}
                        </div>
                    </div>
                </div>
            </nav>
        `;
    }

    /**
     * Renderiza o footer
     */
    function renderFooter() {
        const currentYear = new Date().getFullYear();
        
        return `
            <footer class="footer">
                <div class="container">
                    <div class="footer-content">
                        <div class="footer-main">
                            <div class="footer-brand">
                                <strong>⚖️ Inelegis</strong>
                                <span class="footer-version">v0.0.8</span>
                            </div>
                            <p class="footer-description">
                                Sistema de Consulta de Inelegibilidade Eleitoral
                            </p>
                        </div>
                        
                        <div class="footer-links">
                            <a href="sobre" class="footer-link">Sobre</a>
                            <a href="faq" class="footer-link">FAQ</a>
                            <a href="https://github.com/rkvasne/ineleg-app/blob/main/CHANGELOG.md" class="footer-link" target="_blank" rel="noopener noreferrer">Changelog</a>
                            <a href="https://github.com/rkvasne/ineleg-app" class="footer-link" target="_blank" rel="noopener noreferrer">GitHub</a>
                        </div>
                        
                        <div class="footer-bottom">
                            <p class="footer-copy">© ${currentYear} Inelegis • Ferramenta auxiliar não oficial</p>
                        </div>
                    </div>
                </div>
            </footer>
        `;
    }

    /**
     * Renderiza um card
     * @param {Object} options - Opções do card
     */
    function renderCard({ title, subtitle, content, icon, className = '' }) {
        return `
            <div class="card ${className}">
                ${title ? `
                    <div class="card-header">
                        ${icon ? `
                            <div class="card-icon">
                                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${icon}"></path>
                                </svg>
                            </div>
                        ` : ''}
                        <div>
                            <h2>${title}</h2>
                            ${subtitle ? `<p>${subtitle}</p>` : ''}
                        </div>
                    </div>
                ` : ''}
                ${content ? `
                    <div class="card-body">
                        ${content}
                    </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * Renderiza um botão
     * @param {Object} options - Opções do botão
     */
    function renderButton({ text, type = 'primary', icon, onClick, disabled = false, className = '' }) {
        const buttonClass = `btn btn-${type} ${className}`;
        const disabledAttr = disabled ? ' disabled' : '';
        const onClickAttr = onClick ? ` onclick="${onClick}"` : '';
        
        return `
            <button class="${buttonClass}"${disabledAttr}${onClickAttr}>
                ${icon ? `
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${icon}"></path>
                    </svg>
                ` : ''}
                ${text}
            </button>
        `;
    }

    /**
     * Renderiza um alerta
     * @param {Object} options - Opções do alerta
     */
    function renderAlert({ type = 'info', title, message, dismissible = false }) {
        const alertClass = `alert alert-${type}`;
        const icons = {
            success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
            warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
            danger: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
            info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
        };

        return `
            <div class="${alertClass}" role="alert">
                <div class="alert-icon">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${icons[type]}"></path>
                    </svg>
                </div>
                <div class="alert-content">
                    ${title ? `<strong>${title}</strong>` : ''}
                    ${message ? `<p>${message}</p>` : ''}
                </div>
                ${dismissible ? `
                    <button class="alert-close" aria-label="Fechar alerta">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                ` : ''}
            </div>
        `;
    }

    /**
     * Inicializa os componentes na página
     * @param {string} currentPage - Página atual
     */
    function init(currentPage = '') {
        // Renderizar header se houver placeholder
        const headerPlaceholder = document.getElementById('header-placeholder');
        if (headerPlaceholder) {
            headerPlaceholder.outerHTML = renderHeader(currentPage);
        }

        // Renderizar nav se houver placeholder
        const navPlaceholder = document.getElementById('nav-placeholder');
        if (navPlaceholder) {
            navPlaceholder.outerHTML = renderNav(currentPage);
        }

        // Renderizar footer se houver placeholder
        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (footerPlaceholder) {
            footerPlaceholder.outerHTML = renderFooter();
        }

        // Inicializar tema após renderizar componentes
        if (typeof ThemeManager !== 'undefined') {
            ThemeManager.init();
        }
    }

    // API pública
    return {
        init,
        renderHeader,
        renderNav,
        renderFooter,
        renderCard,
        renderButton,
        renderAlert
    };
})();

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.Components = Components;
}
