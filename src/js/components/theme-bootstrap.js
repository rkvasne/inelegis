'use strict';

(function initThemeEarly() {
    const savedTheme = localStorage.getItem('inelegis_theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const theme = savedTheme || systemTheme;

    document.documentElement.classList.remove('dark-theme');
    if (theme === 'dark') {
        document.documentElement.classList.add('dark-theme');
    }
})();
