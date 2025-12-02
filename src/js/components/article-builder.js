import { ArtigoFormatter } from '../utils/formatters.js';

export class ArticleBuilder {
    constructor(state) {
        this.state = state;
        this.inputs = {
            artigo: document.getElementById('artigoNum'),
            paragrafo: document.getElementById('paragrafoNum'),
            inciso: document.getElementById('incisoNum'),
            alinea: document.getElementById('alineaNum'),
            concomitante: document.getElementById('concomitanteNum')
        };
        this.preview = document.getElementById('previewArtigo');
        this.isUpdatingFromMain = false;

        this.init();
    }

    init() {
        if (!this.inputs.artigo) return;

        // Add event listeners to builder inputs
        Object.values(this.inputs).forEach(input => {
            if (input) {
                input.addEventListener('input', () => this.updatePreview());
            }
        });

        // Add listener to Main Input for reverse sync
        if (this.state.artigoInput) {
            this.state.artigoInput.addEventListener('input', () => this.syncFromMainInput());
        }
    }

    enable() {
        Object.values(this.inputs).forEach(input => input.disabled = false);
    }

    disable() {
        Object.values(this.inputs).forEach(input => {
            input.disabled = true;
            input.value = '';
        });
        if (this.preview) this.preview.textContent = 'Art. , , , do ...';
    }

    syncFromMainInput() {
        if (!this.state.artigoInput) return;

        const value = this.state.artigoInput.value;
        // Avoid cycle if this input triggered by updatePreview
        if (document.activeElement !== this.state.artigoInput) return;

        this.isUpdatingFromMain = true;

        try {
            const parsed = ArtigoFormatter.processar(value);

            if (this.inputs.artigo) this.inputs.artigo.value = parsed.artigo || '';
            if (this.inputs.paragrafo) this.inputs.paragrafo.value = parsed.paragrafo || '';
            if (this.inputs.inciso) this.inputs.inciso.value = parsed.inciso || '';
            if (this.inputs.alinea) this.inputs.alinea.value = parsed.alinea || '';
            // Basic handling for concomitante (taking the first one number if exists)
            if (this.inputs.concomitante && parsed.concomitante && parsed.concomitante.length > 0) {
                this.inputs.concomitante.value = parsed.concomitante[0].artigo || '';
            } else if (this.inputs.concomitante) {
                this.inputs.concomitante.value = '';
            }

            // Update preview text, but DO NOT write back to main input
            this.updatePreview(true);
        } catch (e) {
            console.error('Error parsing main input:', e);
        } finally {
            this.isUpdatingFromMain = false;
        }
    }

    updatePreview(skipMainUpdate = false) {
        const parts = [];

        // 1. Lei (from global state)
        const leiCode = this.state.leiSelect ? this.state.leiSelect.value : '...';

        // 2. Artigo
        const artNum = this.inputs.artigo.value.trim();
        if (artNum) parts.push(`Art. ${artNum}`);
        else parts.push('Art. ');

        // 3. Parágrafo
        const parNum = this.inputs.paragrafo.value.trim();
        if (parNum) {
            // Auto-format § if missing
            const fmtPar = parNum.includes('§') ? parNum : `§ ${parNum}º`;
            parts.push(fmtPar);
        }

        // 4. Inciso
        const incNum = this.inputs.inciso.value.trim();
        if (incNum) parts.push(incNum.toUpperCase());

        // 5. Alínea
        const aliNum = this.inputs.alinea.value.trim();
        if (aliNum) {
            const fmtAli = aliNum.startsWith('"') ? aliNum : `"${aliNum}"`;
            parts.push(fmtAli);
        }

        // 6. Concomitante
        const concNum = this.inputs.concomitante.value.trim();
        if (concNum) parts.push(`c/c ${concNum}`);

        const result = `${parts.join(', ')} do ${leiCode}`;

        // Update Preview
        if (this.preview) this.preview.textContent = result;

        // Update Main Input (Synced)
        if (!skipMainUpdate && this.state.artigoInput && !this.isUpdatingFromMain) {
            this.state.artigoInput.value = result;
        }
    }
}
