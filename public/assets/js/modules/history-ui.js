/**
 * History UI Component
 * Interface para exibição e interação com histórico de consultas
 * @version 0.0.9
 */

const HistoryUI = (() => {
    let isOpen = false;
    let currentView = 'recent'; // recent, frequent, stats

    function showEmptyState(container, message) {
        container.innerHTML = '';
        const empty = document.createElement('div');
        empty.className = 'empty-state';
        empty.textContent = message;
        container.appendChild(empty);
    }

    function createHistoryItem(search, metaNode) {
        const item = document.createElement('div');
        const resultClass = search.resultado === 'inelegivel' ? 'inelegivel' : 'elegivel';
        item.className = `history-item ${resultClass}`;

        const header = document.createElement('div');
        header.className = 'history-item-header';

        const lei = document.createElement('span');
        lei.className = 'history-lei';
        lei.textContent = search.lei || 'N/A';

        const artigo = document.createElement('span');
        artigo.className = 'history-artigo';
        artigo.textContent = `Art. ${search.artigo || 'N/A'}`;

        header.appendChild(lei);
        header.appendChild(artigo);

        const body = document.createElement('div');
        body.className = 'history-item-body';

        const resultado = document.createElement('span');
        resultado.className = 'history-resultado';
        resultado.textContent = (search.resultado || '').toUpperCase();

        body.appendChild(resultado);
        if (metaNode) {
            body.appendChild(metaNode);
        }

        item.appendChild(header);
        item.appendChild(body);

        return item;
    }

    function createMetaSpan(className, text) {
        const span = document.createElement('span');
        span.className = className;
        span.textContent = text;
        return span;
    }

    function createStatCard(className, value, label) {
        const card = document.createElement('div');
        card.className = className ? `stat-card ${className}` : 'stat-card';

        const statValue = document.createElement('div');
        statValue.className = 'stat-value';
        statValue.textContent = value;

        const statLabel = document.createElement('div');
        statLabel.className = 'stat-label';
        statLabel.textContent = label;

        card.appendChild(statValue);
        card.appendChild(statLabel);
        return card;
    }

    function createStatsSection(title, data) {
        const section = document.createElement('div');
        section.className = 'stats-section';

        const heading = document.createElement('h4');
        heading.textContent = title;
        section.appendChild(heading);

        const list = document.createElement('div');
        list.className = 'stats-list';

        const entries = Object.entries(data || {});
        if (entries.length === 0) {
            const emptyItem = document.createElement('div');
            emptyItem.className = 'stats-item';
            emptyItem.textContent = 'Sem dados suficientes';
            list.appendChild(emptyItem);
        } else {
            entries.forEach(([key, value]) => {
                const item = document.createElement('div');
                item.className = 'stats-item';

                const label = document.createElement('span');
                label.textContent = key;

                const count = document.createElement('span');
                count.className = 'stats-count';
                count.textContent = `${value}x`;

                item.appendChild(label);
                item.appendChild(count);
                list.appendChild(item);
            });
        }

        section.appendChild(list);
        return section;
    }

    /**
     * Inicializa o componente de histórico
     */
    function init() {
        createPanel();
        attachEventListeners();
    }

    /**
     * Cria o painel de histórico no DOM
     */
    function createPanel() {
        // Criar overlay
        const overlay = document.createElement('div');
        overlay.id = 'historyOverlay';
        overlay.className = 'history-overlay';
        document.body.appendChild(overlay);

        // Criar painel
        const panel = document.createElement('div');
        panel.id = 'historyPanel';
        panel.className = 'history-panel';
        panel.style.display = 'none';
        
        panel.innerHTML = `
            <div class="history-header">
                <h3>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    Histórico de Consultas
                </h3>
                <button id="closeHistory" class="close-btn" aria-label="Fechar histórico">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M6 18L18 6M6 6l12 12" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </button>
            </div>

            <div class="history-tabs">
                <button class="tab-btn active" data-view="recent">Recentes</button>
                <button class="tab-btn" data-view="frequent">Frequentes</button>
                <button class="tab-btn" data-view="stats">Estatísticas</button>
            </div>

            <div class="history-content">
                <div id="historyList" class="history-list"></div>
            </div>

            <div class="history-footer">
                <button id="exportHistory" class="btn-secondary">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    Exportar
                </button>
            </div>
        `;

        document.body.appendChild(panel);
    }

    /**
     * Anexa event listeners
     */
    function attachEventListeners() {
        // Fechar painel
        document.getElementById('closeHistory')?.addEventListener('click', close);

        // Tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.target.dataset.view;
                switchView(view);
            });
        });

        // Exportar
        document.getElementById('exportHistory')?.addEventListener('click', exportHistory);

        // Fechar com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isOpen) {
                close();
            }
        });

        // Fechar ao clicar no overlay
        const overlay = document.getElementById('historyOverlay');
        if (overlay) {
            overlay.addEventListener('click', close);
        }
    }

    /**
     * Abre o painel de histórico
     */
    function open() {
        const panel = document.getElementById('historyPanel');
        const overlay = document.getElementById('historyOverlay');
        if (!panel) return;

        panel.style.display = 'block';
        requestAnimationFrame(() => {
            panel.classList.add('show');
            if (overlay) {
                overlay.classList.add('show');
            }
        });

        isOpen = true;
        renderView(currentView);
    }

    /**
     * Fecha o painel de histórico
     */
    function close() {
        const panel = document.getElementById('historyPanel');
        const overlay = document.getElementById('historyOverlay');
        if (!panel) return;

        panel.classList.remove('show');
        if (overlay) {
            overlay.classList.remove('show');
        }
        
        setTimeout(() => {
            panel.style.display = 'none';
        }, 300);

        isOpen = false;
    }

    /**
     * Alterna entre visualizações
     * @param {string} view - Nome da visualização
     */
    function switchView(view) {
        currentView = view;

        // Atualizar tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });

        renderView(view);
    }

    /**
     * Renderiza a visualização atual
     * @param {string} view - Nome da visualização
     */
    function renderView(view) {
        const container = document.getElementById('historyList');
        if (!container) return;

        switch (view) {
            case 'recent':
                renderRecent(container);
                break;
            case 'frequent':
                renderFrequent(container);
                break;
            case 'stats':
                renderStats(container);
                break;
        }
    }

    /**
     * Renderiza consultas recentes
     * @param {HTMLElement} container - Container para renderizar
     */
    function renderRecent(container) {
        const recent = SearchHistory.getRecent();
        if (recent.length === 0) {
            showEmptyState(container, 'Nenhuma consulta recente');
            return;
        }

        container.innerHTML = '';
        recent.forEach(search => {
            const date = new Date(search.timestamp);
            const meta = createMetaSpan('history-date', date.toLocaleString('pt-BR'));
            container.appendChild(createHistoryItem(search, meta));
        });
    }

    /**
     * Renderiza consultas frequentes
     * @param {HTMLElement} container - Container para renderizar
     */
    function renderFrequent(container) {
        const frequent = SearchHistory.getFrequent();

        if (frequent.length === 0) {
            showEmptyState(container, 'Nenhuma consulta frequente');
            return;
        }

        container.innerHTML = '';
        frequent.forEach(search => {
            const meta = createMetaSpan('history-count', `${search.count}x consultado`);
            container.appendChild(createHistoryItem(search, meta));
        });
    }

    /**
     * Renderiza estatísticas
     * @param {HTMLElement} container - Container para renderizar
     */
    function renderStats(container) {
        const stats = SearchHistory.getStats();

        container.innerHTML = '';

        const grid = document.createElement('div');
        grid.className = 'stats-grid';
        grid.appendChild(createStatCard('', stats.total, 'Total de Consultas'));
        grid.appendChild(createStatCard('inelegivel', stats.inelegiveis, 'Inelegíveis'));
        grid.appendChild(createStatCard('elegivel', stats.elegiveis, 'Elegíveis'));
        container.appendChild(grid);

        container.appendChild(createStatsSection('Leis Mais Consultadas', stats.leisMaisConsultadas));
        container.appendChild(createStatsSection('Artigos Mais Consultados', stats.artigosMaisConsultados));
    }

    /**
     * Exporta o histórico
     */
    function exportHistory() {
        const text = SearchHistory.exportToText();
        
        navigator.clipboard.writeText(text).then(() => {
            notifyHistory('Histórico copiado para área de transferência!', 'success');
        }).catch(err => {
            console.error('Erro ao copiar:', err);
            notifyHistory('Erro ao copiar histórico.', 'error');
        });
    }

    function notifyHistory(message, type = 'info') {
        if (typeof window !== 'undefined' && typeof window.mostrarToast === 'function') {
            window.mostrarToast(message, type);
        } else {
            alert(message);
        }
    }

    /**
     * Adiciona uma consulta ao histórico
     * @param {Object} search - Dados da consulta
     */
    function addSearch(search) {
        SearchHistory.add(search);
    }

    // API pública
    return {
        init,
        open,
        close,
        addSearch
    };
})();

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.HistoryUI = HistoryUI;
}