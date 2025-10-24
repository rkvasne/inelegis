// Lista de leis/códigos disponíveis para o select
const leisDisponiveis = [
    {
        value: "CP",
        text: "Código Penal (Decreto-Lei 2.848/40)",
        descricao: "Código Penal"
    },
    {
        value: "CPM", 
        text: "Código Penal Militar (Decreto-Lei nº 1.001/69)",
        descricao: "Código Penal Militar"
    },
    {
        value: "CLT",
        text: "Decreto-Lei 5.452/43 (CLT)",
        descricao: "Consolidação das Leis do Trabalho"
    },
    {
        value: "LEI_FALIMENTAR_ANTIGA",
        text: "Decreto-Lei 7.661/45 (Lei Falimentar - Revogada)",
        descricao: "Lei Falimentar Antiga"
    },
    {
        value: "DL_201",
        text: "Decreto-Lei 201/67 (Crimes de responsabilidade dos Prefeitos)",
        descricao: "Crimes de Prefeitos"
    },
    {
        value: "LC_105",
        text: "Lei Complementar 105/01",
        descricao: "Sigilo Bancário"
    },
    {
        value: "LEI_1521",
        text: "Lei 1.521/51 (Crimes contra a economia popular)",
        descricao: "Economia Popular"
    },
    {
        value: "LEI_2889",
        text: "Lei 2.889/56 (Crimes de genocídio)",
        descricao: "Genocídio"
    },
    {
        value: "LEI_4591",
        text: "Lei 4.591/64 (Condomínios e incorporações)",
        descricao: "Condomínios"
    },
    {
        value: "LEI_4595",
        text: "Lei 4.595/64 (Sistema Financeiro)",
        descricao: "Sistema Financeiro"
    },
    {
        value: "LEI_4728",
        text: "Lei 4.728/65 (Mercado de Capitais)",
        descricao: "Mercado de Capitais"
    },
    {
        value: "CODIGO_ELEITORAL",
        text: "Lei 4.737/65 (Código Eleitoral)",
        descricao: "Código Eleitoral"
    },
    {
        value: "LEI_4898",
        text: "Lei 4.898/65 (Abuso de autoridade)",
        descricao: "Abuso de Autoridade"
    },
    {
        value: "LEI_6091",
        text: "Lei 6.091/74 (Transporte de eleitores)",
        descricao: "Transporte Eleitores"
    },
    {
        value: "LEI_6368",
        text: "Lei 6.368/76 (Lei de Drogas - Revogada)",
        descricao: "Lei de Drogas Antiga"
    },
    {
        value: "LEI_6385",
        text: "Lei 6.385/76 (CVM)",
        descricao: "CVM"
    },
    {
        value: "LEI_6766",
        text: "Lei 6.766/79 (Parcelamento do solo urbano)",
        descricao: "Parcelamento Solo"
    },
    {
        value: "LEI_6996",
        text: "Lei 6.996/82 (Processamento eletrônico eleitoral)",
        descricao: "Processamento Eletrônico"
    },
    {
        value: "LEI_7492",
        text: "Lei 7.492/86 (Lei do Colarinho Branco)",
        descricao: "Colarinho Branco"
    },
    {
        value: "LEI_7716",
        text: "Lei 7.716/89 (Crimes de racismo)",
        descricao: "Racismo"
    },
    {
        value: "ECA",
        text: "Lei 8.069/90 (Estatuto da Criança e do Adolescente)",
        descricao: "ECA"
    },
    {
        value: "LEI_8137",
        text: "Lei 8.137/90 (Crimes contra a ordem tributária)",
        descricao: "Ordem Tributária"
    },
    {
        value: "LEI_8176",
        text: "Lei 8.176/91 (Ordem econômica)",
        descricao: "Ordem Econômica"
    },
    {
        value: "LEI_8666",
        text: "Lei 8.666/93 (Licitações e Contratos)",
        descricao: "Licitações"
    },
    {
        value: "LEI_9455",
        text: "Lei 9.455/97 (Tortura)",
        descricao: "Tortura"
    },
    {
        value: "LEI_9504",
        text: "Lei 9.504/97 (Lei Eleitoral)",
        descricao: "Lei Eleitoral"
    },
    {
        value: "LEI_9605",
        text: "Lei 9.605/98 (Lei Ambiental)",
        descricao: "Lei Ambiental"
    },
    {
        value: "LEI_9613",
        text: "Lei 9.613/98 (Lavagem de dinheiro)",
        descricao: "Lavagem de Dinheiro"
    },
    {
        value: "LEI_10826",
        text: "Lei 10.826/03 (Armas de Fogo)",
        descricao: "Armas de Fogo"
    },
    {
        value: "LEI_11101",
        text: "Lei 11.101/05 (Lei Falimentar)",
        descricao: "Lei Falimentar"
    },
    {
        value: "LEI_11343",
        text: "Lei 11.343/06 (Lei de Drogas)",
        descricao: "Lei de Drogas"
    },
    {
        value: "LEI_12850",
        text: "Lei 12.850/13 (Organização Criminosa)",
        descricao: "Organização Criminosa"
    },
    {
        value: "LEI_13260",
        text: "Lei 13.260/16 (Terrorismo)",
        descricao: "Terrorismo"
    }
];

// Dados estruturados da Tabela de Inelegibilidade - TRE-SP - Outubro 2024
const tabelaInelegibilidade = [
    // CÓDIGO PENAL (Decreto-Lei 2.848/40)
    {
        norma: "Arts. 121, 121-A, 122, §1º a § 7º, 123 a 127",
        excecoes: ["Art. 121, § 3º", "Art. 122, caput"],
        crime: "Crimes contra a vida (9)",
        codigo: "CP"
    },
    {
        norma: "Art.129, § 2º c.c. § 12 e Art.129, § 3º c.c. § 12",
        excecoes: [],
        crime: "Crime hediondo (7)",
        codigo: "CP",
        observacao: "crime definido como hediondo pela Lei 13.142, de 06/07/2015 e pela Lei 14.811/2024, de 12/01/24"
    },
    {
        norma: "Art.148, § 1º, IV",
        excecoes: [],
        crime: "Crime hediondo (7)",
        codigo: "CP",
        observacao: "crime definido como hediondo pela Lei 13.142, de 06/07/2015 e pela Lei 14.811/2024, de 12/01/24"
    },
    {
        norma: "Art.149",
        excecoes: [],
        crime: "Crime de redução à condição análoga à de escravo e contra dignidade sexual (8 e 9)",
        codigo: "CP"
    },
    {
        norma: "Art. 149-A, caput, I a V, c.c. § 1º, II",
        excecoes: [],
        crime: "Crime hediondo (7)",
        codigo: "CP",
        observacao: "crime definido como hediondo pela Lei 14.811/2024, de 12/01/24"
    },
    {
        norma: "Arts. 155, 157, 158, 159, 160, 162, 163, 168, 168-A, 171, 172, 173, 174, 175, 177, 178, 180, 180-A e 184",
        excecoes: ["Art. 163, caput", "Art. 163, parágrafo único, IV", "Art. 175, caput, e 175, I e II", "Art. 177, § 2º", "Art. 180, § 3º", "Art. 184, §4º"],
        crime: "Crimes contra o patrimônio (1 e 2)",
        codigo: "CP",
        observacao: "entendimento firmado pelo TSE no Recurso Especial Eleitoral nº 145-94.2016.6.24.0074/SC"
    },
    {
        norma: "Arts. 213 a 220, 223, 227 a 231-A",
        excecoes: ["Art. 216-A", "Art. 216-B"],
        crime: "Crimes contra a dignidade sexual (9)",
        codigo: "CP",
        observacao: "Arts. 214, 216, 217, 219, 220, 223, 231 e 231-A revogados pela Lei 11.106, de 28/03/2005, Lei 12.015, de 07/08/2009, Lei 13.344/16, de 06/10/2016"
    },
    {
        norma: "Arts. 267, 270, 271, 272, 273, 274, 275, 276, 277, 278 e 280",
        excecoes: ["Art. 267, § 2º", "Art. 270, § 2º", "Art. 271, parágrafo único", "Art. 272, § 2º", "Art. 273, § 2º", "Art. 278, parágrafo único", "Art. 280, parágrafo único"],
        crime: "Crimes contra a saúde pública (3)",
        codigo: "CP"
    },
    {
        norma: "Art. 288 e 288-A",
        excecoes: [],
        crime: "Crimes praticados por quadrilha ou bando (10)",
        codigo: "CP"
    },
    {
        norma: "Arts. 289, 290, 291, 293, 294, 296 a 300, 303, 304, 305, 306, 309, 310, 311 e 311-A",
        excecoes: ["Art. 289, § 2º", "Art. 293, § 4º", "Art. 304, nas figuras dos arts. 301 e 302"],
        crime: "Crimes contra a fé pública (1)",
        codigo: "CP"
    },
    {
        norma: "Arts. 312, 313, 313-A, 314, 316, 317, 318, 322, 323, 325, 328, 332, 333, 334, 334-A, 337, 337-A, 337-B, 337-C, 338, 339, 342, 343, 344, 347, parágrafo único, 351, 353, 355, 356, 357, 359-C, 359-D, 359-G e 359-H",
        excecoes: ["Art. 312, § 2º", "Art. 317, § 2º", "Art. 323, caput e § 1º", "Art. 325, caput e § 1º", "Art. 328, caput", "Art. 347, caput", "Art. 351, caput e § 4º"],
        crime: "Crimes contra a administração pública (1)",
        codigo: "CP"
    },

    // CÓDIGO PENAL MILITAR (Decreto-Lei nº 1.001/69)
    {
        norma: "Arts. 205 e 207",
        excecoes: [],
        crime: "Crimes contra a vida (9)",
        codigo: "CPM",
        observacao: "o conceito de crime de menor potencial ofensivo não se aplica a estes crimes, conforme dispõe o art. 90-A, da Lei 9.099/95"
    },
    {
        norma: "Art. 208",
        excecoes: [],
        crime: "Crimes hediondos (7)",
        codigo: "CPM"
    },
    {
        norma: "Arts. 232 a 235, 238 e 239",
        excecoes: [],
        crime: "Crimes contra a dignidade sexual (9)",
        codigo: "CPM"
    },
    {
        norma: "Arts. 240 a 254, 257 a 267",
        excecoes: ["Arts. 262, 263, 264 e 265 quando combinados com o art. 266"],
        crime: "Crimes contra o patrimônio (1 e 2)",
        codigo: "CPM"
    },
    {
        norma: "Arts. 290 a 297",
        excecoes: ["Art. 292, § 2º", "Art. 293, § 3º", "Art. 294, parágrafo único", "Art. 295, parágrafo único", "Art. 296, parágrafo único"],
        crime: "Crimes contra o meio ambiente e a saúde pública (3)",
        codigo: "CPM"
    },
    {
        norma: "Arts. 298 a 322 e 324 a 354",
        excecoes: ["Art. 303, § 3º", "Art. 332, § 2º", "Art. 352, parágrafo único"],
        crime: "Crimes contra a administração pública e a fé pública (1)",
        codigo: "CPM"
    },
    {
        norma: "Art. 400",
        excecoes: [],
        crime: "Crimes contra a vida (9)",
        codigo: "CPM"
    },
    {
        norma: "Arts. 401 e 402",
        excecoes: [],
        crime: "Crimes contra a dignidade sexual (9)",
        codigo: "CPM"
    },
    {
        norma: "Arts. 404 a 406",
        excecoes: [],
        crime: "Crimes contra o patrimônio (1 e 2)",
        codigo: "CPM"
    },
    {
        norma: "Arts. 407 e 408",
        excecoes: [],
        crime: "Crimes hediondos (7)",
        codigo: "CPM"
    },

    // OUTRAS LEIS
    {
        norma: "Decreto-Lei 5.452/43 -art. 49 (CLT)",
        excecoes: [],
        crime: "Crimes contra a fé pública (1)",
        codigo: "CLT"
    },
    {
        norma: "Decreto-Lei 7.661/45 -arts. 186 a 189 (Lei Falimentar)",
        excecoes: [],
        crime: "Crimes previstos na lei que regula a falência (2)",
        codigo: "LEI_FALIMENTAR_ANTIGA",
        observacao: "Lei revogada pela Lei 11.101, de 09/02/2005"
    },
    {
        norma: "Decreto-Lei 201/67 – art. 1º (Crimes de responsabilidade dos Prefeitos)",
        excecoes: [],
        crime: "Crimes contra a administração pública (1)",
        codigo: "DL_201"
    },
    {
        norma: "Lei Complementar 105/01 – art. 10",
        excecoes: [],
        crime: "Crimes contra o sistema financeiro (2)",
        codigo: "LC_105"
    },
    {
        norma: "Lei 1.521/51 -art. 3º",
        excecoes: [],
        crime: "Crimes contra a economia popular (1)",
        codigo: "LEI_1521"
    },
    {
        norma: "Lei 2.889/56 -arts. 1º, 2º e 3º (Define crimes de genocídio)",
        excecoes: ["Art. 2º, caput, quando se referir ao art. 1º, alínea 'e'", "Art. 3º, caput, quando se referir ao art. 1º, alínea 'e'"],
        crime: "Crimes hediondos (7)",
        codigo: "LEI_2889"
    },
    {
        norma: "Lei 4.591/64 -art. 65 (Condomínios e incorporações)",
        excecoes: [],
        crime: "Crimes contra a economia popular (1)",
        codigo: "LEI_4591"
    },
    {
        norma: "Lei 4.595/64 – art. 34",
        excecoes: [],
        crime: "Crimes contra o sistema financeiro (2)",
        codigo: "LEI_4595"
    },
    {
        norma: "Lei 4.728/65 – arts. 66-B, 73 e 74",
        excecoes: [],
        crime: "Crimes contra o mercado de capitais (2)",
        codigo: "LEI_4728"
    },
    {
        norma: "Lei 4.737/65 – arts. 289, 291, 298, 299, 301, 302, 307 a 309, 315 a 317, 339, 340, 348 a 350, 352 a 354-A (Código Eleitoral)",
        excecoes: [],
        crime: "Crimes eleitorais (4)",
        codigo: "CODIGO_ELEITORAL"
    },
    {
        norma: "Lei 4.898/65 – art. 6º, §º 3º, 'c'",
        excecoes: [],
        crime: "Crimes de abuso de autoridade (5)",
        codigo: "LEI_4898"
    },
    {
        norma: "Lei 6.091/74 – art. 11, incisos III e IV (Lei Eleitoral – Transporte de eleitores)",
        excecoes: [],
        crime: "Crimes eleitorais (4)",
        codigo: "LEI_6091"
    },
    {
        norma: "Lei 6.368/76 – arts. 12, 13 e 14 (Lei de Drogas)",
        excecoes: [],
        crime: "Crimes de tráfico de entorpecentes (7)",
        codigo: "LEI_6368",
        observacao: "Lei revogada pela Lei 11.343, de 23/08/2006"
    },
    {
        norma: "Lei 6.385/76 – arts. 27-C e 27-D (Criação da CVM)",
        excecoes: [],
        crime: "Crimes contra o mercado de capitais (2)",
        codigo: "LEI_6385"
    },
    {
        norma: "Lei 6.766/79 – arts. 50 e 51 (Parcelamento do solo urbano)",
        excecoes: [],
        crime: "Crimes contra a administração pública (1)",
        codigo: "LEI_6766"
    },
    {
        norma: "Lei 6.996/82 – art. 15 (Lei Eleitoral – Processamento eletrônico nos serv.eleitorais)",
        excecoes: [],
        crime: "Crimes eleitorais (4)",
        codigo: "LEI_6996"
    },
    {
        norma: "Lei 7.492/86 – arts. 2º a 23 (Lei do Colarinho Branco)",
        excecoes: [],
        crime: "Crimes contra o sistema financeiro (2)",
        codigo: "LEI_7492"
    },
    {
        norma: "Lei 7.716/89 – arts. 2°-A, 3º a 14 e 20",
        excecoes: [],
        crime: "Crimes de racismo (7)",
        codigo: "LEI_7716"
    },
    {
        norma: "Lei 8.069/90 -arts. 240 a 241-D e 244-A (Estatuto da Criança e do Adolescente)",
        excecoes: [],
        crime: "Crimes contra a dignidade sexual (9)",
        codigo: "ECA"
    },
    {
        norma: "Lei 8.137/90 -arts. 1º, 3º a 7º (Define crimes contra a ordem tributária)",
        excecoes: ["Art. 7º, parágrafo único"],
        crime: "Crimes contra a economia popular (1)",
        codigo: "LEI_8137",
        observacao: "arts. 5º e 6º revogados pelas Lei 12.529, de 30/11/2011"
    },
    {
        norma: "Lei 8.176/91 – arts. 1º e 2º (Ordem econômica)",
        excecoes: [],
        crime: "Crimes contra a economia popular e contra o patrimônio (1)",
        codigo: "LEI_8176"
    },
    {
        norma: "Lei 8.666/93 – arts. 89, 90, 92, 94, 95 e 96 (Licitações e Contratos)",
        excecoes: [],
        crime: "Crimes contra a administração pública (1)",
        codigo: "LEI_8666"
    },
    {
        norma: "Lei 9.455/97 – art. 1º",
        excecoes: [],
        crime: "Crimes de tortura (7)",
        codigo: "LEI_9455"
    },
    {
        norma: "Lei 9.504/97 – arts. 57-H, § 1º e 72 (Lei Eleitoral)",
        excecoes: [],
        crime: "Crimes eleitorais (4)",
        codigo: "LEI_9504"
    },
    {
        norma: "Lei 9.605/98 – arts. 30, 33, 34, 35, 38, 38-A, 39, 40, 41, 42, 50-A ,54, 56, 61, 62, 63, 66, 67, 68, 69, 69-A (Lei Ambiental)",
        excecoes: ["Art. 38, parágrafo único", "Art. 38-A, parágrafo único", "Art. 40, § 3º", "Art. 41, parágrafo único", "Art. 54, § 1º", "Art. 56, § 3º", "Art. 62, parágrafo único", "Art. 67, parágrafo único", "Art. 68, parágrafo único", "Art. 69-A, § 1º"],
        crime: "Crimes contra o meio ambiente (3)",
        codigo: "LEI_9605"
    },
    {
        norma: "Lei 9.613/98 – art. 1º",
        excecoes: [],
        crime: "Crimes de lavagem ou ocultação de bens, direitos e valores (6)",
        codigo: "LEI_9613"
    },
    {
        norma: "Lei 10.826/03 – art. 16, caput c.c. §2º, Art. 16, § 1º c.c. § 2º e arts. 17 e 18 (Armas de Fogo)",
        excecoes: [],
        crime: "Crime hediondo (7)",
        codigo: "LEI_10826",
        observacao: "alterações promovidas pela Lei nº 13964/2019 -de 24/12/2019"
    },
    {
        norma: "Lei 11.101/05 – arts. 168 a 177 (Lei Falimentar)",
        excecoes: [],
        crime: "Crimes previstos na lei que regula a falência (2)",
        codigo: "LEI_11101"
    },
    {
        norma: "Lei 11.343/06 – arts. 33 a 37 (Lei de Drogas)",
        excecoes: ["Art. 33, § 3º"],
        crime: "Crimes de tráfico de entorpecentes (7)",
        codigo: "LEI_11343"
    },
    {
        norma: "Lei 12.850/13",
        excecoes: [],
        crime: "Crimes Praticados por Organização Criminosa (10)",
        codigo: "LEI_12850"
    },
    {
        norma: "Lei 13.260/16 – arts. 2º a 6º",
        excecoes: [],
        crime: "Crimes de terrorismo",
        codigo: "LEI_13260"
    }
];

// Função para normalizar texto para busca
function normalizarTexto(texto) {
    return texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .replace(/[^\w\s]/g, ' ') // Remove pontuação
        .replace(/\s+/g, ' ') // Remove espaços extras
        .trim();
}

// Função para extrair números de artigos
function extrairArtigos(texto) {
    const regex = /(?:art\.?\s*|artigo\s*)(\d+(?:-[A-Z])?)/gi;
    const matches = [];
    let match;
    while ((match = regex.exec(texto)) !== null) {
        matches.push(match[1]);
    }
    return matches;
}

// Função para buscar na tabela
function buscarInelegibilidade(termoBusca) {
    const termoNormalizado = normalizarTexto(termoBusca);
    const artigosBusca = extrairArtigos(termoBusca);
    
    const resultados = [];
    
    for (const item of tabelaInelegibilidade) {
        let pontuacao = 0;
        let matchExato = false;
        
        // Busca por artigos específicos
        const artigosItem = extrairArtigos(item.norma);
        for (const artigo of artigosBusca) {
            if (artigosItem.includes(artigo)) {
                pontuacao += 10;
                matchExato = true;
            }
        }
        
        // Busca textual na norma
        const normaNormalizada = normalizarTexto(item.norma);
        if (normaNormalizada.includes(termoNormalizado)) {
            pontuacao += 5;
        }
        
        // Busca por lei específica
        if (termoNormalizado.includes('lei') && normaNormalizada.includes(termoNormalizado)) {
            pontuacao += 8;
        }
        
        // Busca por código
        if (termoNormalizado.includes('cp') && item.codigo === 'CP') {
            pontuacao += 3;
        }
        if (termoNormalizado.includes('cpm') && item.codigo === 'CPM') {
            pontuacao += 3;
        }
        
        if (pontuacao > 0) {
            resultados.push({
                ...item,
                pontuacao,
                matchExato
            });
        }
    }
    
    // Ordena por pontuação (maior primeiro) e depois por match exato
    return resultados.sort((a, b) => {
        if (a.matchExato && !b.matchExato) return -1;
        if (!a.matchExato && b.matchExato) return 1;
        return b.pontuacao - a.pontuacao;
    });
}

// Função para verificar se há exceções aplicáveis
function verificarExcecoes(item, termoBusca) {
    if (!item.excecoes || item.excecoes.length === 0) {
        return false;
    }
    
    const termoNormalizado = normalizarTexto(termoBusca);
    const artigosBusca = extrairArtigos(termoBusca);
    
    for (const excecao of item.excecoes) {
        const excecaoNormalizada = normalizarTexto(excecao);
        const artigosExcecao = extrairArtigos(excecao);
        
        // Verifica se algum artigo da busca está nas exceções
        for (const artigo of artigosBusca) {
            if (artigosExcecao.includes(artigo)) {
                return true;
            }
        }
        
        // Verifica busca textual nas exceções
        if (excecaoNormalizada.includes(termoNormalizado) || termoNormalizado.includes(excecaoNormalizada)) {
            return true;
        }
    }
    
    return false;
}

// Função para obter sugestões de busca
function obterSugestoes(termoBusca) {
    if (!termoBusca || termoBusca.length < 2) {
        return [];
    }
    
    const termoNormalizado = normalizarTexto(termoBusca);
    const sugestoes = new Set();
    
    for (const item of tabelaInelegibilidade) {
        const normaNormalizada = normalizarTexto(item.norma);
        
        if (normaNormalizada.includes(termoNormalizado)) {
            // Extrai partes relevantes da norma
            const partes = item.norma.split(/[,;]/);
            for (const parte of partes) {
                const parteNormalizada = normalizarTexto(parte.trim());
                if (parteNormalizada.includes(termoNormalizado)) {
                    sugestoes.add(parte.trim());
                }
            }
        }
    }
    
    return Array.from(sugestoes).slice(0, 10);
}