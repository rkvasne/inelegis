// Components Loader - Carrega todos os componentes na ordem correta
// Este arquivo deve ser incluído em todas as páginas HTML

(function () {
    'use strict';

    console.log('[Components] Iniciando carregamento de componentes...');

    // Lista de componentes a serem carregados (na ordem)
    const components = [
        'header.js',
        'navigation.js',
        'footer.js'
        // results-legend.js é carregado apenas em consulta.html
    ];

    // Caminho base dos componentes
    const basePath = 'components/';

    // Função para carregar um script dinamicamente
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = basePath + src;
            script.async = false; // Garante ordem de execução
            script.onload = () => {
                console.log(`[Components] ✅ ${src} carregado`);
                resolve();
            };
            script.onerror = () => {
                console.error(`[Components] ❌ Erro ao carregar ${src}`);
                reject(new Error(`Failed to load ${src}`));
            };
            document.head.appendChild(script);
        });
    }

    // Carrega todos os componentes em sequência
    async function loadAllComponents() {
        try {
            for (const component of components) {
                await loadScript(component);
            }
            console.log('[Components] ✅ Todos os componentes carregados com sucesso');

            // Dispara evento personalizado quando todos os componentes estiverem prontos
            document.dispatchEvent(new Event('componentsLoaded'));
        } catch (error) {
            console.error('[Components] ❌ Erro ao carregar componentes:', error);
        }
    }

    // Inicia o carregamento quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadAllComponents);
    } else {
        loadAllComponents();
    }
})();
