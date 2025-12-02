const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// -- CONFIG --
const DOCX_PATH = path.join(__dirname, '../docs/references/tabela-oficial.docx');
const TEMP_DIR = path.join(__dirname, '../temp_etl_unified');
const XML_PATH = path.join(TEMP_DIR, 'word/document.xml');
const JSON_OUTPUT_PATH = path.join(__dirname, '../src/data/legal-database.json');
const JS_OUTPUT_PATH = path.join(__dirname, '../public/assets/js/data-normalizado.js');

console.log('🚀 Iniciando ETL Unificado: DOCX -> App (JSON/JS)...\n');

try {
    // ==========================================
    // FASE 1: EXTRAÇÃO DO DOCX (UNZIP)
    // ==========================================
    console.log('[1/3] Extraindo dados brutos do DOCX...');

    if (fs.existsSync(TEMP_DIR)) fs.rmSync(TEMP_DIR, { recursive: true, force: true });

    // Unzip via PowerShell
    const cmd = `powershell -Command "Expand-Archive -Path '${DOCX_PATH}' -DestinationPath '${TEMP_DIR}' -Force"`;
    execSync(cmd, { stdio: 'ignore' }); // Silent

    if (!fs.existsSync(XML_PATH)) throw new Error('Falha na extração: document.xml não encontrado.');

    // Leitura do XML
    const xmlContent = fs.readFileSync(XML_PATH, 'utf8');

    // Cleanup imediato
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });

    // ==========================================
    // FASE 2: PARSING XML & EXTRAÇÃO DE TEXTO
    // ==========================================
    console.log('[2/3] Processando tabela e normalizando normas...');

    const rows = xmlContent.split('<w:tr>');
    rows.shift(); // Remove header XML

    const rawData = [];
    const lastRowValues = {};

    rows.forEach((rowRaw) => {
        if (!rowRaw.includes('<w:tc>')) return;

        const cells = rowRaw.split('<w:tc>');
        cells.shift();
        const rowData = [];

        cells.forEach((cellRaw, colIndex) => {
            // Lógica de Vertical Merge Simplificada
            const hasVMerge = cellRaw.includes('w:vMerge');
            const isRestart = cellRaw.includes('w:val="restart"');

            // Extração de Texto
            const textMatches = cellRaw.match(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g);
            let cellText = textMatches
                ? textMatches.map(t => t.replace(/<[^>]+>/g, '')).join('')
                : '';

            if (hasVMerge) {
                if (isRestart) {
                    lastRowValues[colIndex] = cellText;
                } else {
                    cellText = lastRowValues[colIndex] || '';
                }
            } else {
                lastRowValues[colIndex] = cellText;
            }

            rowData.push(cellText.trim());
        });

        // Aceitar linhas com 3 ou 4 colunas (algumas leis não têm exceções)
        if (rowData.length >= 3 && rowData.some(t => t)) {
            // Ignora cabeçalhos visuais
            const isHeader = rowData[0].includes('NORMA') ||
                rowData[0].includes('EXCEÇÕES') ||
                rowData[1]?.includes('EXCEÇÕES') ||
                rowData[0].includes('CRIMES');

            if (!isHeader) {
                // Estrutura: Lei | Artigos | Exceções (opcional) | Crime
                // Se só tem 3 colunas, assume que Exceções está vazia
                const lei_raw = rowData[0];
                const artigos_raw = rowData[1];
                let excecoes_raw = '';
                let crime_raw = '';

                if (rowData.length >= 4) {
                    excecoes_raw = rowData[2];
                    crime_raw = rowData[3];
                } else if (rowData.length === 3) {
                    // Sem coluna de exceções
                    crime_raw = rowData[2];
                }

                rawData.push({
                    lei_raw,
                    artigos_raw,
                    excecoes_raw,
                    crime_raw
                });
            }
        }
    });

    // ==========================================
    // FASE 3: INTELIGÊNCIA & NORMALIZAÇÃO
    // ==========================================

    // Helpers de Normalização
    function normalizeCodigo(leiText) {
        const t = (leiText || '').toUpperCase();
        if (t.includes('CÓDIGO PENAL MILITAR')) return 'CPM';
        if (t.includes('CÓDIGO PENAL')) return 'CP';
        if (t.includes('ELEITORAL')) return 'CE';
        if (t.includes('CLT')) return 'CLT';

        const leiMatch = t.match(/LEI\s.*?(\d[\d\.]*)/);
        if (leiMatch) return 'LEI_' + leiMatch[1].replace(/\./g, '');

        return 'OUTROS';
    }

    function parseArtigos(text) {
        if (!text) return [];
        let clean = text.replace(/Arts?\./gi, '').replace(/parágrafo único/gi, '').replace(/incisos?/gi, '');

        const ranges = [];
        clean = clean.replace(/(\d+[A-Z]?)\s+a\s+(\d+[A-Z]?)/g, (match, start, end) => {
            const s = parseInt(start.replace(/\D/g, ''));
            const e = parseInt(end.replace(/\D/g, ''));
            if (!isNaN(s) && !isNaN(e) && e > s) {
                for (let i = s; i <= e; i++) ranges.push(String(i));
            }
            return '';
        });

        const numbers = clean.match(/(\d+(?:-[A-Z])?)/g) || [];
        return [...new Set([...ranges, ...numbers])]
            .sort((a, b) => parseInt(a) - parseInt(b));
    }

    // Processamento Final
    const finalData = rawData.map((item, index) => {
        const obsParts = (item.crime_raw || '').split(/Obs\.:/i);
        const crime = obsParts[0].trim();
        const obs = obsParts[1] ? obsParts[1].trim() : '';

        const excecoes = item.excecoes_raw
            ? item.excecoes_raw.split(/(?=Art\.)/g).map(s => s.trim()).filter(s => s)
            : [];

        return {
            id: index, // Útil para React keys se necessário
            codigo: normalizeCodigo(item.lei_raw),
            lei_nome: item.lei_raw ? item.lei_raw.trim() : '',
            norma: item.artigos_raw || '',
            excecoes: excecoes,
            crime: crime,
            observacao: obs,
            estruturado: {
                artigos: parseArtigos(item.artigos_raw)
            }
        };
    });

    // ==========================================
    // OUTPUT
    // ==========================================
    console.log(`[3/3] Gerando artefatos finais (${finalData.length} registros)...`);

    // 1. JSON Canonical (Backend)
    const canonicalOutput = {
        meta: {
            version: "2.1.0",
            date: new Date().toISOString(),
            generator: "etl-complete.js",
            source: "DOCX Oficial"
        },
        data: finalData
    };
    fs.writeFileSync(JSON_OUTPUT_PATH, JSON.stringify(canonicalOutput, null, 2));

    // 2. JS Asset (Frontend)
    const jsContent = `;(function(){ window.__INELEG_NORMALIZADO__ = ${JSON.stringify(finalData)}; })();`;
    fs.writeFileSync(JS_OUTPUT_PATH, jsContent);

    console.log(`\n✅ SUCESSO!`);
    console.log(`   📄 JSON DB: ${JSON_OUTPUT_PATH}`);
    console.log(`   🌐 JS Asset: ${JS_OUTPUT_PATH}`);

} catch (e) {
    console.error('\n❌ ERRO FATAL:', e.message);
    process.exit(1);
}
