const HistoryPage = (() => {
    let historyData = [];
    let filteredHistory = [];
    let stats = null;

    const elements = {};

    function init() {
        cacheElements();
        bindEvents();
        loadData();
    }

    function cacheElements() {
        elements.summary = document.getElementById('historySummary');
        elements.recent = document.getElementById('historyRecentList');
        elements.frequent = document.getElementById('historyFrequentList');
        elements.stats = document.getElementById('historyStats');
        elements.status = document.getElementById('historyStatusMessage');
        elements.loading = document.getElementById('historyLoading');
        elements.tableBody = document.getElementById('historyTableBody');
        elements.tableEmpty = document.getElementById('historyTableEmpty');
        elements.filterInput = document.getElementById('historyFilterInput');
        elements.exportBtn = document.getElementById('historyExportBtn');
        elements.refreshBtn = document.getElementById('historyRefreshBtn');
    }

    function bindEvents() {
        if (elements.filterInput) {
            elements.filterInput.addEventListener('input', handleFilter);
        }

        if (elements.exportBtn) {
            elements.exportBtn.addEventListener('click', exportHistory);
        }

        if (elements.refreshBtn) {
            elements.refreshBtn.addEventListener('click', loadData);
        }
    }

    async function loadData() {
        if (typeof SearchHistory === 'undefined') {
            showStatus('Módulo de histórico indisponível.', true);
            return;
        }

        toggleLoading(true);
        showStatus('Sincronizando com Redis...');

        try {
            const [remoteHistory, remoteStats] = await Promise.all([
                SearchHistory.getAllAsync(),
                SearchHistory.getStatsAsync()
            ]);

            historyData = Array.isArray(remoteHistory) ? remoteHistory : [];
            if (historyData.length === 0) {
                const cached = SearchHistory.getAll();
                historyData = Array.isArray(cached) ? cached : [];
            }

            stats = remoteStats || SearchHistory.getStats();
            filteredHistory = [...historyData];

            renderSummary();
            renderRecent();
            renderFrequent();
            renderStatsSection();
            renderTable();

            showStatus(`${historyData.length} registro(s) carregados.`);
        } catch (error) {
            console.error('HistoryPage load error:', error);
            showStatus('Não foi possível carregar o histórico. Tente novamente.', true);
        } finally {
            toggleLoading(false);
        }
    }

    function handleFilter(event) {
        const term = event.target.value.trim().toLowerCase();

        if (!term) {
            filteredHistory = [...historyData];
        } else {
            filteredHistory = historyData.filter(entry => {
                const lei = entry.lei || '';
                const artigo = entry.artigo || '';
                const resultado = entry.resultado || '';
                return (
                    lei.toLowerCase().includes(term) ||
                    artigo.toLowerCase().includes(term) ||
                    resultado.toLowerCase().includes(term)
                );
            });
        }

        renderTable();
        showStatus(`${filteredHistory.length} registro(s) correspondem ao filtro.`);
    }

    function renderSummary() {
        if (!elements.summary) {
            return;
        }

        const total = historyData.length;
        const inelegiveis = stats?.inelegiveis || 0;
        const elegiveis = stats?.elegiveis || 0;
        const ultimaConsulta = historyData[0]?.timestamp
            ? formatDate(historyData[0].timestamp)
            : 'Sem registros';

        const cards = [
            { key: 'total', label: 'Consultas sincronizadas', value: total },
            { key: 'inelegiveis', label: 'Inelegíveis', value: inelegiveis },
            { key: 'elegiveis', label: 'Elegíveis', value: elegiveis },
            { key: 'ultima', label: 'Última consulta', value: ultimaConsulta, isText: true }
        ];

        const html = cards.map(card => {
            const subtitleClasses = ['history-card-subtitle'];
            if (card.isText) {
                subtitleClasses.push('history-card-subtitle--text');
            } else {
                subtitleClasses.push('history-card-value');
            }

            return `
                <article class="history-summary-card history-card">
                    <div class="history-card-icon" aria-hidden="true">${getSummaryIcon(card.key)}</div>
                    <div class="history-card-info">
                        <h3 class="history-card-title">${card.label}</h3>
                        <p class="${subtitleClasses.join(' ')}">${card.value}</p>
                    </div>
                </article>
            `;
        }).join('');
        if (typeof window !== 'undefined' && window.Sanitizer) {
            window.Sanitizer.safeInnerHTML(elements.summary, html);
        } else {
            elements.summary.innerHTML = html;
        }
    }

    function renderRecent() {
        if (!elements.recent) {
            return;
        }

        const recent = historyData.slice(0, 8);
        renderHistoryList(elements.recent, recent, entry =>
            createMeta('history-date', formatDateTime(entry.timestamp))
        );
    }

    function renderFrequent() {
        if (!elements.frequent) {
            return;
        }

        const freqMap = {};
        historyData.forEach(entry => {
            const key = `${entry.lei || 'N/A'}|${entry.artigo || 'N/A'}`;
            if (!freqMap[key]) {
                freqMap[key] = { ...entry, count: 0 };
            }
            freqMap[key].count += 1;
        });

        const frequent = Object.values(freqMap)
            .sort((a, b) => b.count - a.count)
            .slice(0, 8);

        renderHistoryList(elements.frequent, frequent, entry =>
            createMeta('history-count', `${entry.count}x consultado`)
        );
    }

    function renderStatsSection() {
        if (!elements.stats) {
            return;
        }

        const statsData = stats || { leisMaisConsultadas: {}, artigosMaisConsultados: {} };
        const grid = document.createElement('div');
        grid.className = 'stats-grid';

        grid.appendChild(createStatCard('', statsData.total || 0, 'Total de Consultas'));
        grid.appendChild(createStatCard('inelegivel', statsData.inelegiveis || 0, 'Inelegíveis'));
        grid.appendChild(createStatCard('elegivel', statsData.elegiveis || 0, 'Elegíveis'));

        elements.stats.innerHTML = '';
        elements.stats.appendChild(grid);
        elements.stats.appendChild(createStatsBlock('Leis Mais Consultadas', statsData.leisMaisConsultadas));
        elements.stats.appendChild(createStatsBlock('Artigos em Destaque', statsData.artigosMaisConsultados));
    }

    function renderTable() {
        if (!elements.tableBody || !elements.tableEmpty) {
            return;
        }

        elements.tableBody.innerHTML = '';

        if (!filteredHistory.length) {
            elements.tableEmpty.classList.remove('hidden');
            return;
        }

        elements.tableEmpty.classList.add('hidden');

        const fragment = document.createDocumentFragment();
        filteredHistory.forEach(entry => {
            const row = document.createElement('tr');

            const tdTime = document.createElement('td');
            const divTime = document.createElement('div');
            divTime.className = 'history-table-time';
            divTime.textContent = formatDate(entry.timestamp);
            const smallSub = document.createElement('small');
            smallSub.className = 'history-table-sub';
            smallSub.textContent = formatTime(entry.timestamp);
            tdTime.appendChild(divTime);
            tdTime.appendChild(smallSub);

            const tdLei = document.createElement('td');
            tdLei.textContent = entry.lei || 'N/A';

            const tdArtigo = document.createElement('td');
            tdArtigo.textContent = entry.artigo || 'N/A';

            const tdResultado = document.createElement('td');
            const badge = document.createElement('span');
            badge.className = `history-badge ${entry.resultado === 'inelegivel' ? 'badge-danger' : 'badge-success'}`;
            badge.textContent = entry.resultado ? entry.resultado.toUpperCase() : 'N/A';
            tdResultado.appendChild(badge);

            row.appendChild(tdTime);
            row.appendChild(tdLei);
            row.appendChild(tdArtigo);
            row.appendChild(tdResultado);
            fragment.appendChild(row);
        });

        elements.tableBody.appendChild(fragment);
    }

    function renderHistoryList(container, data, metaFactory) {
        container.innerHTML = '';

        if (!data.length) {
            showEmptyState(container, 'Nenhum registro disponível');
            return;
        }

        const fragment = document.createDocumentFragment();
        data.forEach(entry => {
            const metaNode = typeof metaFactory === 'function' ? metaFactory(entry) : null;
            fragment.appendChild(createHistoryItem(entry, metaNode));
        });

        container.appendChild(fragment);
    }

    function showEmptyState(container, message) {
        const empty = document.createElement('div');
        empty.className = 'empty-state';
        empty.textContent = message;
        container.appendChild(empty);
    }

    function createHistoryItem(entry, metaNode) {
        const item = document.createElement('div');
        const resultClass = entry.resultado === 'inelegivel' ? 'inelegivel' : 'elegivel';
        item.className = `history-item ${resultClass}`;

        const header = document.createElement('div');
        header.className = 'history-item-header';

        const lei = document.createElement('span');
        lei.className = 'history-lei';
        lei.textContent = entry.lei || 'N/A';

        const artigo = document.createElement('span');
        artigo.className = 'history-artigo';
        artigo.textContent = `Art. ${entry.artigo || 'N/A'}`;

        header.appendChild(lei);
        header.appendChild(artigo);

        const body = document.createElement('div');
        body.className = 'history-item-body';

        const resultado = document.createElement('span');
        resultado.className = 'history-resultado';
        resultado.textContent = (entry.resultado || '').toUpperCase();
        body.appendChild(resultado);

        if (metaNode) {
            body.appendChild(metaNode);
        }

        item.appendChild(header);
        item.appendChild(body);

        return item;
    }

    function createMeta(className, text) {
        const span = document.createElement('span');
        span.className = className;
        span.textContent = text;
        return span;
    }

    function createStatCard(modifier, value, label) {
        const card = document.createElement('div');
        card.className = modifier ? `stat-card history-card ${modifier}` : 'stat-card history-card';

        const icon = document.createElement('span');
        icon.className = 'history-card-icon stat-icon';
        const iconHtml = getStatIcon(modifier);
        if (typeof window !== 'undefined' && window.Sanitizer) {
            window.Sanitizer.safeInnerHTML(icon, iconHtml);
        } else {
            icon.innerHTML = iconHtml;
        }

        const content = document.createElement('div');
        content.className = 'history-card-info stat-card-content';

        const statLabel = document.createElement('span');
        statLabel.className = 'history-card-title stat-label';
        statLabel.textContent = label;

        const statValue = document.createElement('strong');
        statValue.className = 'history-card-subtitle history-card-value stat-value';
        statValue.textContent = value;

        content.appendChild(statLabel);
        content.appendChild(statValue);

        card.appendChild(icon);
        card.appendChild(content);
        return card;
    }

    function getStatIcon(modifier) {
        if (modifier === 'inelegivel') {
            return '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728"/></svg>';
        }

        if (modifier === 'elegivel') {
            return '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>';
        }

        return '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4h16v16H4z"/></svg>';
    }

    function getSummaryIcon(key) {
        const icons = {
            total: '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7h18M3 12h18M3 17h18"/></svg>',
            inelegiveis: '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>',
            elegiveis: '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>',
            ultima: '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
        };

        return icons[key] || icons.total;
    }

    function createStatsBlock(title, data) {
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

    function exportHistory() {
        try {
            const text = SearchHistory.exportToText();
            navigator.clipboard.writeText(text).then(() => {
                notify('Histórico copiado para a área de transferência.');
            }).catch(() => {
                downloadTextFile(text, 'historico-inelegis.txt');
                notify('Histórico exportado como arquivo de texto.');
            });
        } catch (error) {
            console.error('History export error:', error);
            notify('Não foi possível exportar o histórico.', true);
        }
    }

    function downloadTextFile(content, filename) {
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    }

    function notify(message, isError = false) {
        if (typeof window.mostrarToast === 'function') {
            window.mostrarToast(message, isError ? 'error' : 'success');
            return;
        }
        alert(message);
    }

    function toggleLoading(show) {
        if (!elements.loading) {
            return;
        }
        elements.loading.classList.toggle('hidden', !show);
    }

    function showStatus(message, isError = false) {
        if (!elements.status) {
            return;
        }
        elements.status.textContent = message;
        elements.status.classList.toggle('error', !!isError);
    }

    function formatDate(timestamp) {
        if (!timestamp) {
            return 'Sem data';
        }
        return new Date(timestamp).toLocaleDateString('pt-BR');
    }

    function formatTime(timestamp) {
        if (!timestamp) {
            return '';
        }
        return new Date(timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }

    function formatDateTime(timestamp) {
        if (!timestamp) {
            return 'Sem data';
        }
        return new Date(timestamp).toLocaleString('pt-BR');
    }

    return {
        init
    };
})();

if (typeof window !== 'undefined') {
    window.HistoryPage = HistoryPage;
}
