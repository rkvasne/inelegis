const fs = require('fs');
const { execSync } = require('child_process');

const DOCX_PATH = 'docs/references/tabela-oficial.docx';
const TEMP_DIR = 'temp_debug_etl';

// Cleanup
if (fs.existsSync(TEMP_DIR)) fs.rmSync(TEMP_DIR, { recursive: true });

// Extract
execSync(`powershell -Command "Expand-Archive -Path '${DOCX_PATH}' -DestinationPath '${TEMP_DIR}' -Force"`, { stdio: 'ignore' });

// Analyze
const xmlContent = fs.readFileSync(TEMP_DIR + '/word/document.xml', 'utf8');

// Parse rows
const rows = xmlContent.split('<w:tr>');
rows.shift();

const columnCounts = {};

rows.forEach((rowRaw, index) => {
    if (!rowRaw.includes('<w:tc>')) return;

    const cells = rowRaw.split('<w:tc>');
    cells.shift();
    const rowData = [];

    cells.forEach((cellRaw) => {
        const textMatches = cellRaw.match(/<w:t[^>]*>([^<]*)<\/w:t>/g);
        let cellText = textMatches
            ? textMatches.map(t => t.replace(/<[^>]+>/g, '')).join('')
            : '';
        rowData.push(cellText.trim());
    });

    const numCols = rowData.length;
    columnCounts[numCols] = (columnCounts[numCols] || 0) + 1;

    // Mostrar linhas com menos de 4 colunas
    if (numCols < 4 && numCols >= 1) {
        console.log(`[Linha ${index}] ${numCols} colunas: "${rowData.join(' | ').substring(0, 100)}..."`);
    }
});

console.log('\n📊 Distribuição de colunas:');
Object.keys(columnCounts).sort((a, b) => b - a).forEach(k => {
    console.log(`   ${k} colunas: ${columnCounts[k]} linhas`);
});

// Cleanup
fs.rmSync(TEMP_DIR, { recursive: true });
