const fs = require('fs');
const path = require('path');

const SOURCE_PATH = path.join(__dirname, '../src/data/legal-database-docx.json');
const OUTPUT_PATH = path.join(__dirname, '../src/data/legal-database.json'); // Substituindo o oficial diretamente

console.log('🔄 Transformando DOCX JSON para Formato do App...');

const rawData = require(SOURCE_PATH);

function normalizeCodigo(leiText) {
    const t = leiText.toUpperCase();
    if (t.includes('CÓDIGO PENAL MILITAR')) return 'CPM';
    if (t.includes('CÓDIGO PENAL')) return 'CP';
    if (t.includes('ELEITORAL')) return 'CE'; // Código Eleitoral
    if (t.includes('CLT')) return 'CLT';

    // Leis numéricas: "Lei 11.343" -> LEI_11343
    const leiMatch = t.match(/LEI\s.*?(\d[\d\.]*)/);
    if (leiMatch) {
        return 'LEI_' + leiMatch[1].replace(/\./g, '');
    }

    // Decreto Lei
    const dlMatch = t.match(/DECRETO-LEI\s.*?(\d[\d\.]*)/);
    if (dlMatch) {
        return 'DL_' + dlMatch[1].replace(/\./g, '');
    }

    return 'OUTROS';
}

function parseArtigos(text) {
    if (!text) return [];

    // Remover termos comuns para facilitar limpeza
    let clean = text.replace(/Arts?\./gi, '').replace(/parágrafo único/gi, '').replace(/incisos?/gi, '');

    // Identificar ranges: "121 a 127"
    // Regex: (\d+[A-Z]?) a (\d+[A-Z]?)
    const ranges = [];
    clean = clean.replace(/(\d+[A-Z]?)\s+a\s+(\d+[A-Z]?)/g, (match, start, end) => {
        // Expandir range
        const s = parseInt(start.replace(/\D/g, ''));
        const e = parseInt(end.replace(/\D/g, ''));
        if (!isNaN(s) && !isNaN(e) && e > s) {
            for (let i = s; i <= e; i++) {
                ranges.push(String(i));
            }
        }
        return ''; // Remove do texto original para não duplicar
    });

    // Extrair números restantes (121, 121-A, 122)
    // Regex para pegar número seguido opcionalmente de -Letra
    const numbers = clean.match(/(\d+(?:-[A-Z])?)/g) || [];

    // Juntar e unificar
    const all = [...ranges, ...numbers];
    return [...new Set(all)].sort((a, b) => parseInt(a) - parseInt(b)); // Unicos e ordenados
}

function extractObs(crimeRaw) {
    if (!crimeRaw) return { crime: '', obs: '' };
    const parts = crimeRaw.split(/Obs\.:/i);
    return {
        crime: parts[0].trim(),
        obs: parts[1] ? parts[1].trim() : ''
    };
}

const finalData = rawData.map(item => {
    const info = extractObs(item.crime_raw);

    // Exceções: Quebrar por "Art." se houver múltiplos
    const excecoes = item.excecoes_raw
        ? item.excecoes_raw.split(/(?=Art\.)/g).map(s => s.trim()).filter(s => s)
        : [];

    return {
        codigo: normalizeCodigo(item.lei_raw),
        norma: item.artigos_raw || '', // Texto original dos artigos
        excecoes: excecoes,
        crime: info.crime,
        observacao: info.obs,
        estruturado: {
            artigos: parseArtigos(item.artigos_raw)
        }
        // Campos legados do source anterior que talvez não usemos mas mal não faz
        // id: item._id
    };
});

// Envelopar conforme esperado pelo app (Meta + Data)?
// O arquivo source-legal-data.json era um array direto de objetos?
// O legal-database.json (produzido pelo ETL antigo) tinha { meta:..., data: [...] }
// O app consome legal-database.json. O ETL antigo lia source-legal-data.json (Array) e gerava { meta, data }.
// Como estou substituindo o PROCESSO de ETL, vou gerar o formato FINAL do App aqui.

const output = {
    meta: {
        version: "2.0.0",
        date: new Date().toISOString(),
        source: "DOCX Oficial (Recuperado)",
        total_entries: finalData.length
    },
    data: finalData
};

fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));
console.log(`✅ Base JSON Final Gerada: ${finalData.length} registros.`);
console.log(`💾 Salvo em: ${OUTPUT_PATH}`);

// Validação
const cp = finalData.find(d => d.codigo === 'CP');
console.log('Amostra CP:', JSON.stringify(cp, null, 2));
