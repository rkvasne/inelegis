const fs = require('fs');
const path = require('path');

const INPUT_FILE = path.join(__dirname, '../src/data/legal-database.json');
const OUTPUT_FILE = path.join(__dirname, '../public/assets/js/data-search-index.js');

console.log('🔄 Iniciando geração do índice de busca (Fonte: legal-database.json)...');

try {
    // 1. Ler o arquivo fonte limpo
    const content = fs.readFileSync(INPUT_FILE, 'utf8');
    const source = JSON.parse(content);
    const data = source.data; // O array está dentro de .data

    console.log(`📊 Lidos ${data.length} grupos de normas.`);

    // 2. Transformar (Flattening & Indexing)
    const searchIndex = {};
    let totalArticles = 0;

    data.forEach(grupo => {
        const lei = grupo.codigo;

        if (!searchIndex[lei]) {
            searchIndex[lei] = {};
        }

        const artigos = grupo.artigos || []; // Já vem extraído do ETL!

        if (artigos.length === 0) {
            console.warn(`⚠️ Grupo sem artigos mapeados na lei ${lei}: ${grupo.norma}`);
        }

        artigos.forEach(artigoNum => {
            // Normalizar número (lowercase, trim)
            const cleanNum = String(artigoNum).toLowerCase().trim();

            if (searchIndex[lei][cleanNum]) {
                // Merge ou Log? Vamos logar aviso.
                // console.warn(`⚠️ Duplicidade detectada: Lei ${lei}, Art. ${cleanNum}.`);
            }

            searchIndex[lei][cleanNum] = {
                c: grupo.crime,
                n: grupo.norma,
                e: grupo.excecoes || []
            };
            totalArticles++;
        });
    });

    console.log(`✅ Transformação concluída. ${totalArticles} artigos indexados.`);

    // 4. Salvar novo arquivo (Índice Otimizado)
    const outputContent = `
/**
 * ÍNDICE DE BUSCA OTIMIZADO (Gerado automaticamente)
 * Fonte: src/data/legal-database.json
 */
;(function(){
    window.SEARCH_INDEX = ${JSON.stringify(searchIndex, null, 2)};
})();
`;

    fs.writeFileSync(OUTPUT_FILE, outputContent.trim());
    console.log(`💾 Arquivo salvo em: ${OUTPUT_FILE}`);

} catch (error) {
    console.error('❌ Erro fatal:', error.message);
    process.exit(1);
}
