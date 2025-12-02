/**
 * History UI Component
 * Interface para exibição e interação com histórico de consultas
 * @version 0.0.6
 */

const HistoryUI = (() => {
    let isOpen = false;
    let currentView = 'recent'; // recent, frequent, stats

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
                <button id="clearHistory" class="btn-danger">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    Limpar
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

        // Limpar
        document.getElementById('clearHistory')?.addEventListener('click', clearHistory);

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
            container.innerHTML = '<div class="empty-state">Nenhuma consulta recente</div>';
            return;
        }

        container.innerHTML = recent.map((search, index) => {
            const date = new Date(search.timestamp);
            const resultClass = search.resultado === 'inelegivel' ? 'inelegivel' : 'elegivel';
            
            return `
                <div class="history-item ${resultClass}">
                    <div class="history-item-header">
                        <span class="history-lei">${search.lei}</span>
                        <span class="history-artigo">Art. ${search.artigo}</span>
                    </div>
                    <div class="history-item-body">
                        <span class="history-resultado">${search.resultado.toUpperCase()}</span>
                        <span class="history-date">${date.toLocaleString('pt-BR')}</span>
                    </div>
                    <button class="history-remove" data-index="${index}" aria-label="Remover">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M6 18L18 6M6 6l12 12" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </button>
                </div>
            `;
        }).join('');

        // Adicionar listeners para remover
        container.querySelectorAll('.history-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                removeItem(index);
            });
        });
    }

    /**
     * Renderiza consultas frequentes
     * @param {HTMLElement} container - Container para renderizar
     */
    function renderFrequent(container) {
        const frequent = SearchHistory.getFrequent();

        if (frequent.length === 0) {
            container.innerHTML = '<div class="empty-state">Nenhuma consulta frequente</div>';
            return;
        }

        container.innerHTML = frequent.map(search => {
            const resultClass = search.resultado === 'inelegivel' ? 'inelegivel' : 'elegivel';
            
            return `
                <div class="history-item ${resultClass}">
                    <div class="history-item-header">
                        <span class="history-lei">${search.lei}</span>
                        <span class="history-artigo">Art. ${search.artigo}</span>
                    </div>
                    <div class="history-item-body">
                        <span class="history-resultado">${search.resultado.toUpperCase()}</span>
                        <span class="history-count">${search.count}x consultado</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * Renderiza estatísticas
     * @param {HTMLElement} container - Container para renderizar
     */
    function renderStats(container) {
        const stats = SearchHistory.getStats();

        container.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value">${stats.total}</div>
                    <div class="stat-label">Total de Consultas</div>
                </div>
                <div class="stat-card inelegivel">
                    <div class="stat-value">${stats.inelegiveis}</div>
                    <div class="stat-label">Inelegíveis</div>
                </div>
                <div class="stat-card elegivel">
                    <div class="stat-value">${stats.elegiveis}</div>
                    <div class="stat-label">Elegíveis</div>
                </div>
            </div>

            <div class="stats-section">
                <h4>Leis Mais Consultadas</h4>
                <div class="stats-list">
                    ${Object.entries(stats.leisMaisConsultadas).map(([lei, count]) => `
                        <div class="stats-item">
                            <span>${lei}</span>
                            <span class="stats-count">${count}x</span>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="stats-section">
                <h4>Artigos Mais Consultados</h4>
                <div class="stats-list">
                    ${Object.entries(stats.artigosMaisConsultados).map(([artigo, count]) => `
                        <div class="stats-item">
                            <span>${artigo}</span>
                            <span class="stats-count">${count}x</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    /**
     * Remove um item do histórico
     * @param {number} index - Índice do item
     */
    function removeItem(index) {
        if (confirm('Deseja remover esta consulta do histórico?')) {
            SearchHistory.remove(index);
            renderView(currentView);
        }
    }

    /**
     * Exporta o histórico
     */
    function exportHistory() {
        const text = SearchHistory.exportToText();
        
        navigator.clipboard.writeText(text).then(() => {
            alert('Histórico copiado para área de transferência!');
        }).catch(err => {
            console.error('Erro ao copiar:', err);
            alert('Erro ao copiar histórico.');
        });
    }

    /**
     * Limpa todo o histórico
     */
    function clearHistory() {
        if (confirm('Deseja limpar todo o histórico? Esta ação não pode ser desfeita.')) {
            SearchHistory.clear();
            renderView(currentView);
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