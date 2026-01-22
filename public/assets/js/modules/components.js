/**
 * Reusable Components
 * Componentes reutilizáveis para todas as páginas
 * @version 0.2.0
 */

const Components = (() => {
    const IMAGE_BASE_PATH = '/assets/images/';
    /**
     * Renderiza o header do sistema com menu integrado
     * @param {string} currentPage - Página atual para destacar no menu
     */
    function renderHeader(currentPage = '') {
        // Verificar se termos foram aceitos
        const termosAceitos = (typeof window !== 'undefined' && window.SecureStorage && window.SecureStorage.getItem('termos_aceitos') === true) || (typeof localStorage !== 'undefined' && localStorage.getItem('ineleg_termos_aceitos') === 'true');
        
        const pages = [
            { id: 'index', href: './', label: 'Início', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
            { id: 'consulta', href: 'consulta', label: 'Consulta', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', requiresTerms: true },
            { id: 'sobre', href: 'sobre', label: 'Sobre', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
            { id: 'faq', href: 'faq', label: 'FAQ', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
        ];

        const navLinks = pages.map(page => {
            const isActive = currentPage === page.id;
            const activeClass = isActive ? ' active' : '';
            const ariaCurrent = isActive ? ' aria-current="page"' : '';
            const isDisabled = page.requiresTerms && !termosAceitos;
            const disabledClass = isDisabled ? ' disabled' : '';
            const disabledAttr = isDisabled ? ' aria-disabled="true" onclick="event.preventDefault(); if(window.showCheckboxArrow) { window.showCheckboxArrow(); } else { sessionStorage.setItem(\'ineleg_redirect_reason\', \'terms_not_accepted\'); window.location.href=\'./\'; }"' : '';
            
            return `
                <a href="${page.href}" class="header-nav-link${activeClass}${disabledClass}"${ariaCurrent}${disabledAttr}>
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${page.icon}"></path>
                    </svg>
                    <span>${page.label}</span>
                </a>
            `;
        }).join('');

        const isLandingPage = currentPage === 'landing';
        const isDarkTheme = document.documentElement.classList.contains('dark-theme');
        const logoSrc = isLandingPage ? `${IMAGE_BASE_PATH}${isDarkTheme ? 'logo-claro.png' : 'logo-dark.png'}` : `${IMAGE_BASE_PATH}logo-dark.png`;
        const logoLockAttr = isLandingPage ? '' : ' data-logo-lock="true"';

        const wrapperClass = isLandingPage ? 'header-wrapper landing-nav' : 'header-wrapper';
        return `
            <header class="system-header">
                <div class="${wrapperClass}">
                    <div class="system-brand">
                        <div class="brand-icon">
                            <img id="header-logo"${logoLockAttr} src="${logoSrc}" alt="Inelegis Logo" width="32" height="32" loading="lazy" style="border-radius: 4px;">
                        </div>
                        <div class="brand-text">
                            <h1>Inelegis <span class="version-badge">v0.2.0</span></h1>
                            <p>Consulta de Inelegibilidade Eleitoral</p>
                        </div>
                    </div>
                    
                    <nav class="header-nav" role="navigation" aria-label="Navegação principal">
                        <div class="header-nav-links">
                            ${navLinks}
                        </div>
                    </nav>
                    
                    <div class="header-actions">
                        <button id="themeToggle" class="theme-toggle" aria-label="Alternar tema" title="Alternar tema">
                            <svg class="sun-icon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                            </svg>
                            <svg class="moon-icon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </header>
        `;
    }



    /**
     * Renderiza o footer
     */
    function renderFooter(currentPage = '') {
        const currentYear = new Date().getFullYear();
        const isLandingPage = currentPage === 'landing';
        const isDarkTheme = document.documentElement.classList.contains('dark-theme');
        const logoSrc = `${IMAGE_BASE_PATH}${isDarkTheme ? 'logo-claro.png' : 'logo-dark.png'}`;
        
        return `
            <footer class="main-footer">
                <div class="footer-content">
                    <div class="footer-brand">
                        <div class="brand">
                            <img src="${logoSrc}" alt="Inelegis Logo" class="brand-icon" width="32" height="32" loading="lazy">
                            <div class="logo">Inelegis</div>
                        </div>
                        <p>Consulta de Inelegibilidade Eleitoral</p>
                    </div>
                    <div class="footer-links">
                        <h4>Links Rápidos</h4>
                        <ul class="link-list">
                            <li><a href="./">Início</a></li>
                            <li><a href="consulta">Consulta</a></li>
                            <li><a href="faq">FAQ</a></li>
                        </ul>
                    </div>
                    <div class="footer-social">
                        <div class="footer-social-wrapper">
                            <h4>Transparência</h4>
                            <div class="social-icons">
                                <a href="https://github.com/rkvasne/inelegis" target="_blank" rel="noopener noreferrer" aria-label="Código Fonte" title="Código Fonte">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                                    </svg>
                                </a>
                                <a href="https://github.com/rkvasne/inelegis/blob/main/CHANGELOG.md" target="_blank" rel="noopener noreferrer" aria-label="Histórico de Versões" title="Histórico de Versões">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                        <polyline points="14 2 14 8 20 8"></polyline>
                                        <line x1="16" y1="13" x2="8" y2="13"></line>
                                        <line x1="16" y1="17" x2="8" y2="17"></line>
                                    </svg>
                                </a>
                                <a href="https://github.com/rkvasne/inelegis/issues" target="_blank" rel="noopener noreferrer" aria-label="Reportar Problema" title="Reportar Problema">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="12" y1="8" x2="12" y2="12"></line>
                                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="footer-bottom">
                    <p>© ${currentYear}&nbsp;Inelegis • <a href="https://github.com/rkvasne/inelegis" target="_blank" rel="noopener noreferrer">GitHub</a></p>
                    <p>Consulta de Inelegibilidade Eleitoral</p>
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
                    <button class="alert-close" aria-label="Fechar alerta" title="Fechar alerta">
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

        // Renderizar footer se houver placeholder
        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (footerPlaceholder) {
            footerPlaceholder.outerHTML = renderFooter(currentPage);
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
