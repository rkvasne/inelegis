const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DOCX_PATH = path.join(__dirname, '../docs/references/tabela-oficial.docx');
const TEMP_DIR = path.join(__dirname, '../temp_docx_etl');
const XML_PATH = path.join(TEMP_DIR, 'word/document.xml');
const OUTPUT_PATH = path.join(__dirname, '../src/data/legal-database-docx.json');

console.log('🏗️  Iniciando ETL: DOCX (XML) -> JSON Estruturado...');

try {
    // 1. Extração Automática (Self-Healing)
    // Se o XML não existir, extrai novamente do DOCX
    console.log('📦 Preparando ambiente de extração...');
    if (fs.existsSync(TEMP_DIR)) fs.rmSync(TEMP_DIR, { recursive: true, force: true });

    // Usar PowerShell para unzip (garantido no Windows)
    // Extrai apenas o necessário seria ideal, mas Expand-Archive extrai tudo.
    // Como é rápido, tudo bem.
    const cmd = `powershell -Command "Expand-Archive -Path '${DOCX_PATH}' -DestinationPath '${TEMP_DIR}' -Force"`;
    execSync(cmd, { stdio: 'inherit' });

    if (!fs.existsSync(XML_PATH)) throw new Error('Documento XML não encontrado após extração do DOCX.');

    // 2. Leitura e Parsing
    console.log('📖 Lendo document.xml...');
    const xmlContent = fs.readFileSync(XML_PATH, 'utf8');

    // Separar Rows (<w:tr>)
    const rows = xmlContent.split('<w:tr>');
    rows.shift(); // Header XML

    const tableMatrix = [];
    const lastRowValues = {};

    rows.forEach((rowRaw) => {
        if (!rowRaw.includes('<w:tc>')) return;

        const cells = rowRaw.split('<w:tc>');
        cells.shift();

        const rowData = [];

        cells.forEach((cellRaw, colIndex) => {
            // Lógica de Vertical Merge (vMerge) do Word
            const hasVMerge = cellRaw.includes('w:vMerge');
            const isRestart = cellRaw.includes('w:val="restart"');

            // Extrair Texto puro
            const textMatches = cellRaw.match(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g);
            let cellText = '';

            if (textMatches) {
                cellText = textMatches.map(t => {
                    return t.replace(/<[^>]+>/g, '');
                }).join('');
            }

            // Aplicar Merge
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

        // Filtrar linhas vazias
        if (rowData.length > 0 && rowData.some(t => t)) {
            tableMatrix.push(rowData);
        }
    });

    console.log(`📊 Linhas extraídas: ${tableMatrix.length}`);

    // 3. Mapeamento para JSON Intermediário
    // Ignora cabeçalhos visuais da tabela
    const dataRows = tableMatrix.filter(r =>
        !r[0].includes('NORMA') &&
        !r[1]?.includes('EXCEÇÕES')
    );

    const structured = dataRows.map((row, i) => {
        return {
            _id: i,
            lei_raw: row[0],
            artigos_raw: row[1],
            excecoes_raw: row[2],
            crime_raw: row[3] || ''
        };
    });

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(structured, null, 2));
    console.log(`✅ JSON DOCX Salvo: ${OUTPUT_PATH}`);

    // 4. Limpeza
    console.log('🧹 Limpando arquivos temporários...');
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });
    console.log('✨ Concluído.');

} catch (e) {
    console.error('❌ Erro Fatal:', e.message);
    // Tenta limpar se der erro
    if (fs.existsSync(TEMP_DIR)) {
        try { fs.rmSync(TEMP_DIR, { recursive: true, force: true }); } catch (err) { }
    }
    process.exit(1);
}
