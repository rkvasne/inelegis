const fs = require('fs');
const path = require('path');

// Caminhos
const dataJsPath = path.join(__dirname, '../src/js/data.js');
const dataNormalizadoPath = path.join(__dirname, '../public/assets/js/data-normalizado.js');

// Função para extrair artigos (simulada do ArtigoFormatter)
function extrairArtigos(texto) {
    if (!texto) return [];

    const norma = texto.toLowerCase();
    const artigos = [];

    // Regex para capturar números de artigos
    // Ex: "Arts. 121, 121-A, 122..."
    // Captura sequências de números e letras (ex: 121-A)
    
    // 1. Remover referências a parágrafos para evitar falsos positivos (ex: "§ 1º a 7º")
    // Remove § 1º, §1, parágrafo 1, etc.
    let semParagrafos = norma.replace(/(?:§|par[áa]grafo)\s*\d+(?:[º°]|\s+a\s+\d+[º°]?)?/gi, '');
    
    // 1b. Remover incisos romanos comuns para evitar confusão (opcional, mas bom)
    // Mas cuidado para não remover artigos que usam romanos (raro, mas existe?)
    // Melhor focar nos parágrafos que causaram o erro "1 a 7".

    // 2. Remover prefixos comuns para limpar a string
    let limpo = semParagrafos.replace(/^art\.?s?\.?\s*/i, '');
    
    // 3. Encontrar todos os tokens que parecem artigos (números, faixas, listas)
    
    // Regex para encontrar intervalos "X a Y"
    // Agora que removemos parágrafos, "1 a 7" não deve aparecer se vinha de "§1 a §7"
    const intervalos = limpo.match(/(\d+(?:-[a-z])?)\s+a\s+(\d+(?:-[a-z])?)/gi);
    if (intervalos) {
        intervalos.forEach(intervalo => {
            const parts = intervalo.split(/\s+a\s+/i);
            const inicio = parseInt(parts[0]);
            const fim = parseInt(parts[1]);
            if (!isNaN(inicio) && !isNaN(fim)) {
                for (let i = inicio; i <= fim; i++) {
                    artigos.push(String(i));
                }
            }
        });
    }
    
    // Regex para encontrar números individuais
    // Evitar capturar números de leis (ex: Lei 2.848) se estiverem no texto
    // Mas no campo "norma" da tabelaInelegibilidade, geralmente começa com "Arts..."
    
    // Estratégia melhor: Tokenizar por vírgula e processar cada parte
    const partes = limpo.split(/,| e /);
    partes.forEach(parte => {
        parte = parte.trim();
        
        // Verificar intervalo na parte
        if (/\s+a\s+/.test(parte)) {
             const parts = parte.split(/\s+a\s+/i);
             // Pega o número final do primeiro (pode ter sufixo) e inicial do segundo
             const inicioStr = parts[0].match(/(\d+)/);
             const fimStr = parts[1].match(/(\d+)/);
             
             if (inicioStr && fimStr) {
                 const inicio = parseInt(inicioStr[1]);
                 const fim = parseInt(fimStr[1]);
                 for (let i = inicio; i <= fim; i++) {
                     artigos.push(String(i));
                 }
             }
        } else {
            // Tenta extrair número isolado
            const match = parte.match(/^(\d+(?:-[A-Za-z])?)/);
            if (match) {
                artigos.push(match[1]);
            }
        }
    });

    return [...new Set(artigos)].sort((a, b) => {
        const numA = parseInt(a);
        const numB = parseInt(b);
        return numA - numB;
    });
}

// Ler src/js/data.js
const dataJsContent = fs.readFileSync(dataJsPath, 'utf8');

// Extrair tabelaInelegibilidade
// Usar eval é perigoso, mas aqui estamos em ambiente controlado de build e o arquivo é nosso
// Vamos usar uma regex para extrair o array
const matchTabela = dataJsContent.match(/const tabelaInelegibilidade = (\[[\s\S]*?\]);/);

if (!matchTabela) {
    console.error('Não foi possível encontrar tabelaInelegibilidade em data.js');
    process.exit(1);
}

let tabelaRaw;
try {
    // Avaliar o array como JS
    tabelaRaw = eval(matchTabela[1]);
} catch (e) {
    console.error('Erro ao avaliar tabelaInelegibilidade:', e);
    process.exit(1);
}

// Processar dados
const dadosNormalizados = tabelaRaw.map(item => {
    const artigos = extrairArtigos(item.norma);
    return {
        codigo: item.codigo,
        norma: item.norma,
        excecoes: item.excecoes || [],
        crime: item.crime,
        observacao: item.observacao || "",
        estruturado: {
            artigos: artigos
        }
    };
});

// Gerar conteúdo do arquivo
const fileContent = `;(function(){window.__INELEG_NORMALIZADO__=${JSON.stringify(dadosNormalizados)}})();`;

// Escrever arquivo
fs.writeFileSync(dataNormalizadoPath, fileContent);

console.log(`Sucesso! ${dadosNormalizados.length} itens processados e salvos em ${dataNormalizadoPath}`);
