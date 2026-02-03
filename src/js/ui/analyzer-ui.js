import { validatorService } from '../services/validator-service.js';

/**
 * Controller para Análise de Dispositivo de Sentença.
 * Extrai artigos de texto e realiza validação em lote.
 */
export class AnalyzerUI {
    constructor() {
        this.textarea = document.getElementById('dispositivoText');
        this.btnAnalisar = document.getElementById('btnAnalisarDispositivo');
        this.resultsContainer = document.getElementById('analyzer-results');
        this.tbody = document.getElementById('analyzer-tbody');
        this.statsText = document.getElementById('analyzer-stats');
    }

    init() {
        if (!this.btnAnalisar) return;

        this.btnAnalisar.addEventListener('click', () => this.analisar());
    }

    /**
     * Executa a análise do texto fornecido
     */
    async analisar() {
        const texto = this.textarea.value.trim();
        if (!texto) {
            alert('Por favor, insira o texto do dispositivo da sentença.');
            return;
        }

        // Mostrar loading
        this.btnAnalisar.disabled = true;
        this.btnAnalisar.innerHTML = '<span class="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span> Analisando...';

        try {
            const extraidos = this.extrairArtigosCompletos(texto);

            if (extraidos.length === 0) {
                alert('Não conseguimos identificar nenhuma citação de artigo/lei no texto. Verifique o formato.');
                return;
            }

            this.resultsContainer.classList.remove('hidden');
            this.tbody.innerHTML = '';

            let totalInelegivel = 0;

            for (const item of extraidos) {
                // Lookup pretty name if possible
                const lawInfo = (await validatorService.getLaws()).find(l => l.codigo === item.lei);
                const lawDisplayName = lawInfo ? lawInfo.nome : item.lei;

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="p-4">
                        <div class="flex flex-col">
                            <span class="font-bold text-neutral-800 text-sm">${lawDisplayName}</span>
                            <span class="text-xs text-neutral-500 font-mono">Art. ${item.artigo}</span>
                        </div>
                    </td>
                    <td class="p-4" id="status-${item.uid}">
                        <div class="flex items-center gap-2">
                            <div class="w-4 h-4 rounded-full border-2 border-neutral-200 border-t-neutral-400 animate-spin"></div>
                            <span class="text-neutral-400 text-sm">Verificando...</span>
                        </div>
                    </td>
                    <td class="p-4" id="ase-${item.uid}">
                        <span class="text-neutral-300">-</span>
                    </td>
                    <td class="p-4 text-right">
                        <button class="btn btn-secondary btn-sm" onclick="window.viewDetails('${item.lei}', '${item.artigo}')" title="Ver detalhes completos">
                            Ver
                        </button>
                    </td>
                `;
                this.tbody.appendChild(row);

                // Validar (Poderia ser em lote no futuro, mas por enquanto mantemos a RPC individual)
                this.validarIndividual(item);
            }

            this.statsText.textContent = `Identificamos ${extraidos.length} dispositivos legais citados.`;
            this.resultsContainer.scrollIntoView({ behavior: 'smooth' });

        } finally {
            this.btnAnalisar.disabled = false;
            this.btnAnalisar.innerHTML = `
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                Analisar Dispositivo
            `;
        }
    }

    /**
     * Valida um item individualmente e atualiza a linha
     */
    async validarIndividual(item) {
        const result = await validatorService.verifyEligibility(item.lei, item.artigo);
        const statusCell = document.getElementById(`status-${item.uid}`);
        const aseCell = document.getElementById(`ase-${item.uid}`);

        if (!statusCell || !aseCell) return;

        // Análise de ASE (Prioridade para ASE 370 se houver indício no contexto ou resultado)
        const textoInabilitacao = /inabilitação|suspensão.*direitos|suspensos.*direitos/gi;
        const temIndicador370 = textoInabilitacao.test(item.contexto || '') ||
            textoInabilitacao.test(this.textarea.value);

        if (result.resultado === 'INELEGIVEL') {
            statusCell.innerHTML = '<span class="analyzer-badge danger">INELEGÍVEL</span>';
            const itemE = result.item_alinea_e || '?';
            const tipoCrime = result.tipo_crime ? `<div class="text-xs text-neutral-800 font-medium mt-1 border-t border-neutral-100 pt-1">${result.tipo_crime}</div>` : '';

            if (temIndicador370) {
                aseCell.innerHTML = `
                    <div class="flex flex-col">
                        <span class="font-bold text-danger-700 text-sm">ASE 370 / 337</span>
                        <span class="text-xs text-neutral-500">Motivo 7 + Inabilitação</span>
                        ${tipoCrime}
                    </div>`;
            } else {
                aseCell.innerHTML = `
                    <div class="flex flex-col">
                        <span class="font-bold text-danger-700 text-sm">ASE 337 (Motivo 7)</span>
                        <div class="text-xs text-neutral-500">Alínea "e", Item ${itemE}</div>
                        ${tipoCrime}
                    </div>`;
            }
        } else if (result.resultado === 'ELEGIVEL') {
            statusCell.innerHTML = '<span class="analyzer-badge success">ELEGÍVEL</span>';
            aseCell.textContent = temIndicador370 ? 'ASE 370 (Suspensão)' : 'Não gera restrição';
        } else {
            statusCell.innerHTML = '<span class="analyzer-badge warning">NÃO CONSTA</span>';
            aseCell.innerHTML = temIndicador370 ?
                '<span class="text-warning-700 font-medium">ASE 370?</span><br><small>Verificar se há condenação criminal</small>' :
                'Verificar Manualmente';
        }

        // Registrar no Histórico e Analytics (Análise Automática)
        if (typeof SearchHistory !== 'undefined') {
            SearchHistory.add({
                lei: item.lei,
                artigo: item.artigo,
                resultado: result.resultado.toLowerCase(),
                tipoCrime: result.tipo_crime,
                observacoes: `[Análise Automática] ${result.observacoes || result.motivo || ''}`
            });
        }

        if (typeof Analytics !== 'undefined') {
            Analytics.trackSearch({
                lei: item.lei,
                artigo: item.artigo,
                resultado: result.resultado.toLowerCase(),
                temExcecao: result.resultado === 'ELEGIVEL',
                context: 'sentence_analyzer'
            });
        }
    }

    /**
     * Extrai artigos e tenta identificar a lei correspondente de forma robusta.
     * @param {string} texto 
     */
    extrairArtigosCompletos(texto) {
        const resultados = [];

        // Mapeamento de termos para códigos da base
        const lawKeywords = {
            'cp': 'CP', 'código penal': 'CP', 'penal': 'CP',
            'ce': 'CE', 'código eleitoral': 'CE', 'eleitoral': 'CE',
            'lc 64': 'LC_64_90', 'lei das inelegibilidades': 'LC_64_90', 'lei 64': 'LC_64_90',
            'ctb': 'lei_9503_97', 'trânsito': 'lei_9503_97',
            '9.504': 'lei_9504_97', 'lei das eleicoes': 'lei_9504_97',
            'lei das eleitas': 'lei_9504_97',
            'cpm': 'CPM', 'militar': 'CPM',
            'eca': 'ECA', 'estatuto da crianca': 'ECA'
        };

        // Identificar lei prevalente no texto (global)
        let primaryLaw = 'CP';
        const textoLower = texto.toLowerCase();
        for (const [key, code] of Object.entries(lawKeywords)) {
            if (textoLower.includes(key)) {
                primaryLaw = code;
                break;
            }
        }

        // Regex para blocos de artigos (Art. 1, 2 e 3 ou Art. 1 c/c Art. 2)
        // Captura o artigo e um "clipping" do contexto posterior para identificar a lei próxima
        const regexBloco = /(?:art\.?s?\.?\s+)([\d\-\.]+)(?:\s*,?\s*([\d\-\.]+))?(?:\s*,?\s*([\d\-\.]+))?([^.;\n]{0,100})/gi;

        let match;
        while ((match = regexBloco.exec(texto)) !== null) {
            const contexto = match[4].toLowerCase();

            // Tenta achar a lei no contexto imediato (clipping)
            let leiDoBloco = null;
            for (const [key, code] of Object.entries(lawKeywords)) {
                if (contexto.includes(key)) {
                    leiDoBloco = code;
                    break;
                }
            }

            const currentLaw = leiDoBloco || primaryLaw;

            // Processar os 3 possíveis grupos de captura de números (limitado a 3 por regex por performance/simplicidade)
            [match[1], match[2], match[3]].forEach(artValue => {
                if (artValue) {
                    const sanitizedArt = artValue.replace(/\.$/, '').trim();
                    if (/^\d/.test(sanitizedArt)) {
                        resultados.push({
                            lei: currentLaw,
                            artigo: sanitizedArt,
                            uid: Math.random().toString(36).substring(2, 9),
                            contexto: contexto
                        });
                    }
                }
            });
        }

        // Post-process: remoção de duplicatas exatas (Lei+Artigo)
        return resultados.filter((v, i, a) =>
            a.findIndex(t => (t.artigo === v.artigo && t.lei === v.lei)) === i
        );
    }
}

// Funções globais para suporte ao HTML
window.switchTab = function (mode) {
    const simpleBtn = document.getElementById('tab-simple');
    const advancedBtn = document.getElementById('tab-advanced');
    const simpleContent = document.getElementById('simple-mode-content');
    const advancedContent = document.getElementById('advanced-mode-content');

    if (mode === 'simple') {
        simpleBtn.classList.add('active');
        advancedBtn.classList.remove('active');
        simpleContent.classList.remove('hidden');
        advancedContent.classList.add('hidden');
    } else {
        simpleBtn.classList.remove('active');
        advancedBtn.classList.add('active');
        simpleContent.classList.add('hidden');
        advancedContent.classList.remove('hidden');
    }
};

window.viewDetails = function (lei, artigo) {
    // Alternar para aba simples e preencher
    window.switchTab('simple');
    const leiSelect = document.getElementById('leiSelect');
    if (leiSelect) {
        leiSelect.value = lei;
        leiSelect.dispatchEvent(new Event('change'));

        // Aguardar popular artigos
        setTimeout(() => {
            const artigoSelect = document.getElementById('artigoSelect');
            if (artigoSelect) {
                artigoSelect.value = artigo;
                artigoSelect.dispatchEvent(new Event('change'));
            }
        }, 500);
    }
};
