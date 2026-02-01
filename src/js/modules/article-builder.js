'use strict';

/**
 * Article Builder Module
 * Manages the interactive construction of legal article strings.
 */

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

        this.init();
    }

    init() {
        if (!this.inputs.artigo) return;

        // Add event listeners to all inputs
        Object.values(this.inputs).forEach(input => {
            if (input) {
                input.addEventListener('input', () => this.updatePreview());
            }
        });

        // Enable inputs when Lei is selected (handled via state observer or method)
        // For now, we assume the orchestrator handles enablement, 
        // but we expose a method to reset/enable.
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

    updatePreview() {
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
        if (this.state.artigoInput) {
            // Only update if user is using the builder (naive check: builder has values)
            if (artNum || parNum || incNum || aliNum) {
                this.state.artigoInput.value = result;
            }
        }
    }
}
