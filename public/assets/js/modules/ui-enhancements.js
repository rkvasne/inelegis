/**
 * UI Enhancements Module
 * Header glassmorphism, back-to-top, scroll animations, shortcuts modal
 */

(function() {
    'use strict';

    // ========================================
    // Header Glassmorphism on Scroll
    // ========================================
    function initHeaderScroll() {
        const header = document.querySelector('.header');
        if (!header) return;

        const scrollThreshold = 50;

        function updateHeader() {
            if (window.scrollY > scrollThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        window.addEventListener('scroll', updateHeader, { passive: true });
        updateHeader();
    }

    // ========================================
    // Back to Top Button
    // ========================================
    function initBackToTop() {
        // Create button if not exists
        let btn = document.querySelector('.back-to-top');
        if (!btn) {
            btn = document.createElement('button');
            btn.className = 'back-to-top';
            btn.setAttribute('aria-label', 'Voltar ao topo');
            btn.innerHTML = `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>`;
            document.body.appendChild(btn);
        }

        const scrollThreshold = 300;

        function updateButton() {
            if (window.scrollY > scrollThreshold) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        }

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        window.addEventListener('scroll', updateButton, { passive: true });
        updateButton();
    }

    // ========================================
    // Scroll Animations
    // ========================================
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.scroll-animate, .scroll-animate-left, .scroll-animate-right, .scroll-animate-scale');
        
        if (animatedElements.length === 0) return;

        // Check for reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            animatedElements.forEach(el => el.classList.add('visible'));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => observer.observe(el));
    }

    // ========================================
    // Keyboard Shortcuts Modal
    // ========================================
    function initShortcutsModal() {
        // Create modal HTML
        const modalHTML = `
            <div class="shortcuts-modal-overlay" id="shortcutsModal">
                <div class="shortcuts-modal" role="dialog" aria-labelledby="shortcutsTitle">
                    <div class="shortcuts-modal-header">
                        <h2 class="shortcuts-modal-title" id="shortcutsTitle">Atalhos de Teclado</h2>
                        <button class="shortcuts-modal-close" aria-label="Fechar">
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                    <div class="shortcuts-list">
                        <div class="shortcut-item">
                            <span class="shortcut-description">Mostrar atalhos</span>
                            <div class="shortcut-keys"><kbd class="shortcut-key">?</kbd></div>
                        </div>
                        <div class="shortcut-item">
                            <span class="shortcut-description">Ir para Início</span>
                            <div class="shortcut-keys"><kbd class="shortcut-key">G</kbd><kbd class="shortcut-key">H</kbd></div>
                        </div>
                        <div class="shortcut-item">
                            <span class="shortcut-description">Ir para Consulta</span>
                            <div class="shortcut-keys"><kbd class="shortcut-key">G</kbd><kbd class="shortcut-key">C</kbd></div>
                        </div>
                        <div class="shortcut-item">
                            <span class="shortcut-description">Ir para FAQ</span>
                            <div class="shortcut-keys"><kbd class="shortcut-key">G</kbd><kbd class="shortcut-key">F</kbd></div>
                        </div>
                        <div class="shortcut-item">
                            <span class="shortcut-description">Ir para Sobre</span>
                            <div class="shortcut-keys"><kbd class="shortcut-key">G</kbd><kbd class="shortcut-key">S</kbd></div>
                        </div>
                        <div class="shortcut-item">
                            <span class="shortcut-description">Alternar tema</span>
                            <div class="shortcut-keys"><kbd class="shortcut-key">T</kbd></div>
                        </div>
                        <div class="shortcut-item">
                            <span class="shortcut-description">Voltar ao topo</span>
                            <div class="shortcut-keys"><kbd class="shortcut-key">↑</kbd></div>
                        </div>
                        <div class="shortcut-item">
                            <span class="shortcut-description">Fechar modal</span>
                            <div class="shortcut-keys"><kbd class="shortcut-key">Esc</kbd></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        const modal = document.getElementById('shortcutsModal');
        const closeBtn = modal.querySelector('.shortcuts-modal-close');

        function openModal() {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        
        // Header button click - wait for header to be rendered
        function attachHeaderButton() {
            const headerToggle = document.getElementById('shortcutsToggle');
            if (headerToggle) {
                headerToggle.addEventListener('click', openModal);
            }
        }
        
        // Try immediately and also after a short delay (for dynamic header)
        attachHeaderButton();
        setTimeout(attachHeaderButton, 100);
        setTimeout(attachHeaderButton, 500);
        
        // Also expose globally for manual trigger
        window.openShortcutsModal = openModal;

        // Keyboard navigation
        let gPressed = false;
        let gTimeout;

        document.addEventListener('keydown', (e) => {
            // Ignore if typing in input
            if (e.target.matches('input, textarea, select')) return;

            // ? to open shortcuts
            if (e.key === '?' || (e.shiftKey && e.key === '/')) {
                e.preventDefault();
                openModal();
                return;
            }

            // Escape to close
            if (e.key === 'Escape') {
                closeModal();
                return;
            }

            // T to toggle theme
            if (e.key === 't' || e.key === 'T') {
                const themeToggle = document.getElementById('themeToggle');
                if (themeToggle) themeToggle.click();
                return;
            }

            // Arrow up to scroll to top
            if (e.key === 'ArrowUp' && !e.ctrlKey && !e.metaKey) {
                // Only if not in input
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            // G + key navigation
            if (e.key === 'g' || e.key === 'G') {
                gPressed = true;
                clearTimeout(gTimeout);
                gTimeout = setTimeout(() => { gPressed = false; }, 1000);
                return;
            }

            if (gPressed) {
                gPressed = false;
                clearTimeout(gTimeout);
                
                const routes = {
                    'h': 'index.html',
                    'c': 'consulta.html',
                    'f': 'faq.html',
                    's': 'sobre.html'
                };

                const route = routes[e.key.toLowerCase()];
                if (route) {
                    e.preventDefault();
                    window.location.href = route;
                }
            }
        });
    }

    // ========================================
    // FAQ Search
    // ========================================
    function initFAQSearch() {
        const searchInput = document.getElementById('faqSearch');
        if (!searchInput) return;

        const faqItems = document.querySelectorAll('.faq-item');
        const faqSections = document.querySelectorAll('.faq-section');

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();

            if (!query) {
                // Show all
                faqItems.forEach(item => item.style.display = '');
                faqSections.forEach(section => section.style.display = '');
                return;
            }

            faqItems.forEach(item => {
                const question = item.querySelector('.faq-question-text')?.textContent.toLowerCase() || '';
                const answer = item.querySelector('.faq-answer-content')?.textContent.toLowerCase() || '';
                
                if (question.includes(query) || answer.includes(query)) {
                    item.style.display = '';
                    // Expand if matches
                    if (!item.classList.contains('active')) {
                        item.classList.add('active');
                    }
                } else {
                    item.style.display = 'none';
                }
            });

            // Hide empty sections
            faqSections.forEach(section => {
                const visibleItems = section.querySelectorAll('.faq-item:not([style*="display: none"])');
                section.style.display = visibleItems.length === 0 ? 'none' : '';
            });
        });
    }

    // ========================================
    // Skip to Content
    // ========================================
    function initSkipToContent() {
        const skipLink = document.querySelector('.skip-to-content');
        if (skipLink) return; // Already exists

        const link = document.createElement('a');
        link.href = '#main-content';
        link.className = 'skip-to-content';
        link.textContent = 'Pular para o conteúdo';
        document.body.insertBefore(link, document.body.firstChild);

        // Add id to main if not exists
        const main = document.querySelector('main');
        if (main && !main.id) {
            main.id = 'main-content';
        }
    }

    // ========================================
    // Initialize All
    // ========================================
    function init() {
        initHeaderScroll();
        initBackToTop();
        initScrollAnimations();
        initShortcutsModal();
        initFAQSearch();
        initSkipToContent();
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export for manual use
    window.UIEnhancements = {
        init,
        initHeaderScroll,
        initBackToTop,
        initScrollAnimations,
        initShortcutsModal,
        initFAQSearch
    };
})();
