/**
 * Theme Manager
 * Gerencia tema claro/escuro com persistência
 * @version 0.0.7
 */

const ThemeManager = (() => {
    const STORAGE_KEY = 'inelegis_theme';
    const THEME_DARK = 'dark';
    const THEME_LIGHT = 'light';

    /**
     * Inicializa o gerenciador de tema
     */
    function init() {
        console.log('🚀 ThemeManager.init() called');
        
        // Carregar tema salvo ou detectar preferência do sistema
        const savedTheme = getSavedTheme();
        const systemTheme = getSystemTheme();
        const theme = savedTheme || systemTheme;

        console.log('📋 Saved theme:', savedTheme);
        console.log('🖥️ System theme:', systemTheme);
        console.log('✅ Selected theme:', theme);

        applyTheme(theme);
        attachEventListeners();
        watchSystemTheme();
    }

    /**
     * Obtém o tema salvo no localStorage
     * @returns {string|null} Tema salvo ou null
     */
    function getSavedTheme() {
        try {
            return localStorage.getItem(STORAGE_KEY);
        } catch (error) {
            console.error('Erro ao obter tema salvo:', error);
            return null;
        }
    }

    /**
     * Obtém a preferência de tema do sistema
     * @returns {string} Tema do sistema (dark ou light)
     */
    function getSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return THEME_DARK;
        }
        return THEME_LIGHT;
    }

    /**
     * Aplica o tema
     * @param {string} theme - Tema a ser aplicado (dark ou light)
     */
    function applyTheme(theme) {
        const html = document.documentElement;
        
        console.log('🎨 Applying theme:', theme);
        console.log('📋 Current classes before:', html.className);
        
        // IMPORTANTE: Sempre remover a classe primeiro
        html.classList.remove('dark-theme');
        
        // Adicionar apenas se for dark
        if (theme === THEME_DARK) {
            html.classList.add('dark-theme');
        }
        
        console.log('✅ Current classes after:', html.className);

        // Salvar no localStorage
        try {
            localStorage.setItem(STORAGE_KEY, theme);
            console.log('💾 Theme saved to localStorage:', theme);
        } catch (error) {
            console.error('Erro ao salvar tema:', error);
        }

        // Atualizar ícone do botão
        updateToggleButton(theme);
    }

    /**
     * Alterna entre temas
     */
    function toggleTheme() {
        const html = document.documentElement;
        const currentTheme = html.classList.contains('dark-theme') ? THEME_DARK : THEME_LIGHT;
        const newTheme = currentTheme === THEME_DARK ? THEME_LIGHT : THEME_DARK;
        
        applyTheme(newTheme);
    }

    /**
     * Atualiza o ícone do botão de toggle
     * @param {string} theme - Tema atual
     */
    function updateToggleButton(theme) {
        const button = document.getElementById('themeToggle');
        if (!button) return;

        const sunIcon = button.querySelector('.sun-icon');
        const moonIcon = button.querySelector('.moon-icon');

        if (theme === THEME_DARK) {
            sunIcon?.classList.add('active');
            moonIcon?.classList.remove('active');
        } else {
            sunIcon?.classList.remove('active');
            moonIcon?.classList.add('active');
        }
    }

    /**
     * Anexa event listeners
     */
    function attachEventListeners() {
        // Usar setTimeout para garantir que o DOM está pronto
        setTimeout(() => {
            const button = document.getElementById('themeToggle');
            if (button) {
                button.addEventListener('click', toggleTheme);
                console.log('✅ Theme toggle button attached');
            } else {
                console.warn('⚠️ Theme toggle button not found');
            }
        }, 100);
    }

    /**
     * Observa mudanças na preferência de tema do sistema
     */
    function watchSystemTheme() {
        if (!window.matchMedia) return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        // Listener para mudanças
        mediaQuery.addEventListener('change', (e) => {
            // Só aplicar se não houver tema salvo manualmente
            const savedTheme = getSavedTheme();
            if (!savedTheme) {
                const newTheme = e.matches ? THEME_DARK : THEME_LIGHT;
                applyTheme(newTheme);
            }
        });
    }

    /**
     * Obtém o tema atual
     * @returns {string} Tema atual (dark ou light)
     */
    function getCurrentTheme() {
        return document.documentElement.classList.contains('dark-theme') ? THEME_DARK : THEME_LIGHT;
    }

    // API pública
    return {
        init,
        toggle: toggleTheme,
        getCurrent: getCurrentTheme,
        apply: applyTheme
    };
})();

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.ThemeManager = ThemeManager;
}
