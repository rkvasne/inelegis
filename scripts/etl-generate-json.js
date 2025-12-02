const fs = require('fs');
const path = require('path');

const XML_PATH = path.join(__dirname, '../src/data/source-legal-data.json'); // Usando JSON recuperado como fonte
const OUTPUT_PATH = path.join(__dirname, '../src/data/legal-database.json');

console.log('🏗️  Iniciando ETL: Base Recuperada -> JSON Estruturado...');

// --- HELPERS ---

function deriveCodigo(norma) {
    const s = String(norma || '').toLowerCase();
    if (s.includes('manual_patch')) return 'PATCH'; // Exemplo
    // ... lógica anterior pode ser útil se o codigo vier errado, mas o recuperado já tem 'codigo'
    if (/cpm|c[oó]digo penal militar/i.test(s)) return 'CPM';
    if (/c[oó]digo penal/i.test(s)) return 'CP';
    if (/c[oó]digo eleitoral/i.test(s)) return 'CODIGO_ELEITORAL';
    if (/clt|consolida[çc][ãa]o das leis do trabalho/i.test(s)) return 'CLT';
    if (/eca|estatuto da crian[çc]a/i.test(s)) return 'ECA';

    // Tenta extrair número da lei
    const m = s.match(/(?:lei|decreto-?lei|lei\s*complementar)\s*(\d{1,5}(?:\.\d{3})*)(?:\/(\d{2,4}))?/i);
    if (m) {
        const num = m[1].replace(/\./g, '');
        return `LEI_${num}`;
    }

    return 'LEI_OUTRAS'; // Fallback melhor que DESCONHECIDA
}

function expandirIntervalo(inicio, fim) {
    const arr = [];
    const i = parseInt(inicio);
    const f = parseInt(fim);
    if (!isNaN(i) && !isNaN(f) && i <= f) {
        for (let x = i; x <= f; x++) arr.push(String(x));
    }
    return arr;
}

function extrairArtigos(texto) {
    if (!texto) return [];

    // 1. Limpeza inicial
    let t = texto.toLowerCase()
        .replace(/\n/g, ' ')
        // Remove prefixos comuns de artigos
        .replace(/^art\.?s?\.?\s+/i, '')
        // Remove parágrafos que podem confundir regex de números (Ex: § 1º)
        .replace(/(?:§|par[áa]grafo)\s*\d+(?:[º°]|\s+a\s+\d+[º°]?)?/gi, '')
        .trim();

    const artigos = new Set();

    // 2. Normalizar separadores "e" -> ","
    const cleaned = t.replace(/\s+e\s+/g, ', ');

    // 3. Processar partes
    const parts = cleaned.split(',');

    parts.forEach(p => {
        p = p.trim();

        // Intervalos "123 a 127"
        if (/\s+a\s+/.test(p)) {
            const [start, end] = p.split(/\s+a\s+/);
            const sNum = start.match(/(\d+)/); // Pega apenas números
            const eNum = end.match(/(\d+)/);
            if (sNum && eNum) {
                expandirIntervalo(sNum[1], eNum[1]).forEach(a => artigos.add(a));
            }
        }
        // Número isolado ou com letra "121-A"
        else {
            const match = p.match(/^(\d+(?:-[a-z]+)?)/i);
            if (match) {
                artigos.add(match[1]);
            }
        }
    });

    return Array.from(artigos).sort((a, b) => parseInt(a) - parseInt(b));
}

function splitExcecoes(txt) {
    if (!txt) return [];
    // Split inteligente usando "Art." ou "Arts." como âncora
    // Substitui "Art." por "|||Art." apenas se não estiver no início da string
    let temp = txt.replace(/(?<!^)(Arts?\.)/g, '|||$1');
    return temp.split('|||').map(s => s.trim()).filter(Boolean);
}

// --- PROCESSOR ---

function processData() {
    const raw = fs.readFileSync(XML_PATH, 'utf8');
    const sourceData = JSON.parse(raw);
    const rows = [];

    sourceData.forEach(item => {
        // Recalcular artigos para garantir que intervalos sejam preenchidos
        const artigos = extrairArtigos(item.norma);

        const entry = {
            codigo: item.codigo, // Confiar no codigo recuperado
            norma: item.norma,
            excecoes: item.excecoes || [],
            crime: item.crime,
            artigos: artigos.length > 0 ? artigos : (item.estruturado?.artigos || [])
        };

        rows.push(entry);
    });

    return rows;
}

// --- EXECUÇÃO ---

try {
    const data = processData();

    // Validação básica
    const totalArtigos = data.reduce((acc, item) => acc + item.artigos.length, 0);

    const output = {
        metadata: {
            generated_at: new Date().toISOString(),
            source: 'tabela-recuperada.json',
            total_groups: data.length,
            total_articles_mapped: totalArtigos
        },
        data: data
    };

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));

    console.log(`✅ Sucesso!`);
    console.log(`   Grupos processados: ${data.length}`);
    console.log(`   Artigos mapeados: ${totalArtigos}`);
    console.log(`   Arquivo salvo em: src/data/legal-database.json`);

} catch (e) {
    console.error('❌ Falha no ETL:', e);
    process.exit(1);
}
