// Elementos DOM
const leiSelect = document.getElementById('leiSelect');
const artigoInput = document.getElementById('artigoInput');
const buscarBtn = document.getElementById('searchBtn');
const resultadoDiv = document.getElementById('resultado');
const sugestoesDiv = document.getElementById('suggestions');

// Elementos dos radio buttons
const radioCondenacao = document.getElementById('condenacao');
const radioExtincao = document.getElementById('extincao');
const dataOcorrenciaCondenacao = document.getElementById('dataOcorrenciaCondenacao');
const dataOcorrenciaExtincao = document.getElementById('dataOcorrenciaExtincao');

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Evitar erros quando script.js é carregado fora da app principal (ex.: tests/quick-tests.html)
    if (!leiSelect || !artigoInput || !buscarBtn) {
        return;
    }
    popularSelectLeis();
    configurarEventListeners();
    configurarRadioButtons();
    // Foco automático no select de leis para acesso rápido
    leiSelect.focus();
    // Preload do primeiro item para melhor performance
    if (leiSelect.options.length > 1) {
        leiSelect.selectedIndex = 1;
        leiSelect.dispatchEvent(new Event('change'));
    }
});

// Configurar radio buttons para alternar seções de data de ocorrência
function configurarRadioButtons() {
    radioCondenacao.addEventListener('change', function() {
        if (this.checked) {
            dataOcorrenciaCondenacao.style.display = 'block';
            dataOcorrenciaExtincao.style.display = 'none';
        }
    });

    radioExtincao.addEventListener('change', function() {
        if (this.checked) {
            dataOcorrenciaCondenacao.style.display = 'none';
            dataOcorrenciaExtincao.style.display = 'block';
        }
    });
}

// Função para obter o tipo de comunicação selecionado
function obterTipoComunicacao() {
    return radioCondenacao.checked ? 'condenacao' : 'extincao';
}

// Popular o select com as leis disponíveis
function popularSelectLeis() {
    // Limpar opções existentes
    leiSelect.innerHTML = '<option value="">Selecione uma lei...</option>';
    
    // Adicionar opções das leis
    leisDisponiveis.forEach(lei => {
        const option = document.createElement('option');
        option.value = lei.value;
        option.textContent = lei.text;
        leiSelect.appendChild(option);
    });
}

// Configurar event listeners
function configurarEventListeners() {
    // Debounce de sugestões para evitar excesso de renderização
    const debouncedSugestoes = (function () {
        let t;
        return function (v) {
            clearTimeout(t);
            t = setTimeout(() => {
                if (v && v.length > 0) {
                    mostrarSugestoes(v);
                } else {
                    esconderSugestoes();
                }
            }, 220);
        };
    })();
    // Evento de mudança no select de lei
    leiSelect.addEventListener('change', function() {
        if (this.value) {
            artigoInput.disabled = false;
            // Habilitar inputs do artigo builder
            document.getElementById('artigoNum').disabled = false;
            document.getElementById('paragrafoNum').disabled = false;
            document.getElementById('incisoNum').disabled = false;
            document.getElementById('alineaNum').disabled = false;
            document.getElementById('concomitanteNum').disabled = false;
            document.getElementById('insertParagrafoBtn').disabled = false;
            document.getElementById('insertAlineaBtn').disabled = false;
            document.getElementById('insertConcBtn').disabled = false;
            document.getElementById('montarArtigoBtn').disabled = false;
            artigoInput.focus();
        } else {
            artigoInput.disabled = true;
            artigoInput.value = '';
            buscarBtn.disabled = true;
            // Desabilitar inputs do artigo builder
            document.getElementById('artigoNum').disabled = true;
            document.getElementById('paragrafoNum').disabled = true;
            document.getElementById('incisoNum').disabled = true;
            document.getElementById('alineaNum').disabled = true;
            document.getElementById('concomitanteNum').disabled = true;
            document.getElementById('insertParagrafoBtn').disabled = true;
            document.getElementById('insertAlineaBtn').disabled = true;
            document.getElementById('insertConcBtn').disabled = true;
            document.getElementById('montarArtigoBtn').disabled = true;
            limparBusca();
        }
        verificarCamposPreenchidos();
    });

    // Botões para inserir símbolos
    document.getElementById('insertParagrafoBtn').addEventListener('click', function(e) {
        e.preventDefault();
        const paraNum = document.getElementById('paragrafoNum').value;
        if (paraNum) {
            artigoInput.value += `, §${paraNum}º`;
            artigoInput.focus();
            verificarCamposPreenchidos();
            debouncedSugestoes(artigoInput.value.trim());
        }
    });

    document.getElementById('insertAlineaBtn').addEventListener('click', function(e) {
        e.preventDefault();
        const alinea = document.getElementById('alineaNum').value;
        if (alinea) {
            artigoInput.value += `, "${alinea}"`;
            artigoInput.focus();
            verificarCamposPreenchidos();
            debouncedSugestoes(artigoInput.value.trim());
        }
    });

    document.getElementById('insertConcBtn').addEventListener('click', function(e) {
        e.preventDefault();
        const conc = document.getElementById('concomitanteNum').value;
        if (conc) {
            artigoInput.value += ` c/c ${conc}`;
            artigoInput.focus();
            verificarCamposPreenchidos();
            debouncedSugestoes(artigoInput.value.trim());
        }
    });

    // Botão para montar o artigo completo
    document.getElementById('montarArtigoBtn').addEventListener('click', function(e) {
        e.preventDefault();
        const artigo = document.getElementById('artigoNum').value;
        const paragrafo = document.getElementById('paragrafoNum').value;
        const inciso = document.getElementById('incisoNum').value;
        const alinea = document.getElementById('alineaNum').value;
        const concomitante = document.getElementById('concomitanteNum').value;

        if (!artigo) {
            alert('Digite o número do artigo');
            return;
        }

        let artigoMontado = artigo;
        if (paragrafo) artigoMontado += `, §${paragrafo}º`;
        if (inciso) artigoMontado += `, ${inciso}`;
        if (alinea) artigoMontado += `, "${alinea}"`;
        if (concomitante) artigoMontado += ` c/c ${concomitante}`;

        artigoInput.value = artigoMontado;
        artigoInput.focus();
        verificarCamposPreenchidos();
        debouncedSugestoes(artigoInput.value.trim());
    });

    // Evento de input no campo artigo
    artigoInput.addEventListener('input', function() {
        const valorAtual = this.value;
        const valorTrim = valorAtual.trim();

        // Formatação automática durante a digitação (apenas se necessário)
        if (valorTrim && valorTrim.length > 0) {
            const valorFormatado = aplicarFormatacaoAutomatica2(valorTrim);

            // Só atualizar se realmente mudou (evitar formatação repetida)
            if (valorFormatado !== valorTrim) {
                // Preservar posição do cursor
                const posicaoCursor = this.selectionStart;
                this.value = valorFormatado;
                // Restaurar posição do cursor (aproximada)
                const novaPos = Math.min(posicaoCursor + (valorFormatado.length - valorTrim.length), valorFormatado.length);
                this.setSelectionRange(novaPos, novaPos);
            }
        }

        verificarCamposPreenchidos();
        debouncedSugestoes(valorTrim);
    });

    // Evento de clique no botão buscar
    buscarBtn.addEventListener('click', realizarBusca);

    // Evento de tecla Enter nos campos
    leiSelect.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && this.value) {
            artigoInput.focus();
        }
    });

    artigoInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !buscarBtn.disabled) {
            realizarBusca();
        }
    });

    // Atalhos de teclado para acesso rápido
    document.addEventListener('keydown', function(e) {
        // Ctrl+L para focar no select de leis
        if (e.ctrlKey && e.key === 'l') {
            e.preventDefault();
            leiSelect.focus();
        }
        // Ctrl+A para focar no campo artigo
        if (e.ctrlKey && e.key === 'a') {
            e.preventDefault();
            if (!artigoInput.disabled) {
                artigoInput.focus();
            }
        }
        // Ctrl+Enter para buscar rapidamente
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            if (!buscarBtn.disabled) {
                realizarBusca();
            }
        }
        // F1 para alternar entre Condenação e Extinção
        if (e.key === 'F1') {
            e.preventDefault();
            if (radioCondenacao.checked) {
                radioExtincao.checked = true;
                radioExtincao.dispatchEvent(new Event('change'));
            } else {
                radioCondenacao.checked = true;
                radioCondenacao.dispatchEvent(new Event('change'));
            }
         }
     });
}

// Aplicar formatação automática ao artigo
function aplicarFormatacaoAutomatica(valor) {
    // Se o valor for vazio ou falso, retornar como está
    if (!valor || typeof valor !== 'string') {
        return valor;
    }

    let formatado = valor.trim();

    // 1. Normalizar espaços (uma única passagem)
    formatado = formatado.replace(/\s+/g, ' ');

    // 2. Formatar parágrafo: §1 -> §1º (apenas se não tiver º ou °)
    formatado = formatado.replace(/§\s*(\d+)(?![º°])/g, '§$1º');

    // 3. Formatar c/c: cc -> c/c, C/C -> c/c (sem duplicar)
    // Só substitui se não for já c/c
    formatado = formatado.replace(/(?<!\/)(cc|CC|C\/c|c\/C)(?!\/)/g, 'c/c');

    // 4. Normalizar vírgulas e espaços
    formatado = formatado.replace(/\s*,\s*/g, ', ');

    // 5. Formatar alíneas: a -> "a" (evitar duplicação de aspas)
    // Apenas em contextos onde realmente é uma alínea (entre virgulas, espaços ou no final)
    formatado = formatado.replace(/(?<!["\'])([a-z])(?=\s*(?:,|$|\s))/gi, (match, letra) => {
        // Não colocar aspas se já tem aspas
        if (letra.match(/["']/)) return match;
        return `"${letra.toLowerCase()}"`;
    });

    return formatado;
}

// Verificar se ambos os campos estão preenchidos
function verificarCamposPreenchidos() {
    const leiSelecionada = leiSelect.value.trim();
    const artigoDigitado = artigoInput.value.trim();
    
    buscarBtn.disabled = !(leiSelecionada && artigoDigitado);
}

// Realizar busca
function realizarBusca() {
    const leiSelecionada = leiSelect.value.trim();
    const artigoDigitado = artigoInput.value.trim();
    
    if (!leiSelecionada || !artigoDigitado) {
        alert('Por favor, selecione uma lei e digite o artigo.');
        return;
    }

    esconderSugestoes();
    
    // Buscar na tabela de inelegibilidade
    const resultado = buscarInelegibilidadePorLeiEArtigo(leiSelecionada, artigoDigitado);
    
    if (resultado) {
        exibirResultado(resultado);
    } else {
        exibirNaoEncontrado(leiSelecionada, artigoDigitado);
    }
}

// Buscar inelegibilidade por lei e artigo específicos
function buscarInelegibilidadePorLeiEArtigo(codigoLei, numeroArtigo) {
    console.log('🔍 INICIANDO BUSCA:', { codigoLei, numeroArtigo });

    // Rejeitar números de artigo muito curtos (menos de 2 dígitos)
    if (numeroArtigo.trim().length < 2) {
        console.log('❌ Artigo muito curto:', numeroArtigo);
        return null;
    }

    const artigoProcessado = processarArtigoCompleto(numeroArtigo);
    console.log('📝 ARTIGO PROCESSADO:', artigoProcessado);

    let melhorResultado = null;
    let excecoesEncontradas = [];

    // Buscar somente entre itens da lei (índice em memória)
    const candidatos = getItensPorLei(codigoLei);
    for (const item of candidatos) {
        // Verificar se a lei corresponde
        const leiCorresponde = verificarLeiCorresponde(item, codigoLei);

        if (!leiCorresponde) {
            continue;
        }

        // Verificar se o artigo corresponde (considerando formatação completa)
        const artigoCorresponde = verificarArtigoCorresponde(item.norma, artigoProcessado);

        if (artigoCorresponde) {
            console.log('✅ ENCONTRADO!', item);

            // Verificar se há exceções aplicáveis
            const temExcecao = verificarExcecoesAplicaveis2(item, artigoProcessado);

            if (temExcecao) {
                excecoesEncontradas.push({
                    norma: item.norma,
                    excecoes: item.excecoes,
                    crime: item.crime,
                    observacao: item.observacao
                });
                console.log('⚠️ EXCEÇÃO ENCONTRADA:', temExcecao);
            }

            // Retornar o resultado com informações de exceção
            melhorResultado = {
                ...item,
                artigoOriginal: numeroArtigo,
                artigoProcessado: artigoProcessado,
                inelegivel: !temExcecao,
                temExcecao: temExcecao,
                // Exibir somente exceções do mesmo artigo consultado
                excecoes: filtrarExcecoesDoMesmoArtigo(item.excecoes || [], artigoProcessado),
                excecoesDetalhes: excecoesEncontradas
            };

            break; // Encontrou a primeira correspondência exata
        }
    }

    // Se não encontrou correspondência exata, tentar busca flexível
    if (!melhorResultado) {
        melhorResultado = buscarFlexivel(codigoLei, artigoProcessado);
    }

    return melhorResultado;
}

// Busca flexível - procura por correspondências parciais
function buscarFlexivel(codigoLei, artigoProcessado) {
    console.log('🔎 INICIANDO BUSCA FLEXÍVEL...');

    const artigoPrincipal = artigoProcessado.artigo;

    // Rejeitar artigos muito curtos (menos de 2 dígitos) para evitar falsos positivos
    if (artigoPrincipal.length < 2) {
        console.log('❌ Artigo muito curto para busca flexível:', artigoPrincipal);
        return null;
    }

    for (const item of tabelaInelegibilidade) {
        if (!verificarLeiCorresponde(item, codigoLei)) {
            continue;
        }

        // Buscar apenas pelo artigo principal usando extração estruturada
        const artigos = extrairArtigosDoNorma(item.norma);
        if (artigos.includes(artigoPrincipal)) {
            console.log('🔸 ENCONTRADO COM BUSCA FLEXÍVEL:', item.norma, '- Artigos:', artigos);

            const temExcecao = verificarExcecoesAplicaveis2(item, artigoProcessado);

            return {
                ...item,
                artigoProcessado: artigoProcessado,
                inelegivel: !temExcecao,
                temExcecao: temExcecao,
                excecoes: filtrarExcecoesDoMesmoArtigo(item.excecoes || [], artigoProcessado),
                buscaFlexivel: true
            };
        }
    }

    return null;
}

// Verificar exceções aplicáveis de forma mais inteligente
function verificarExcecoesAplicaveis(item, artigoProcessado) {
    return verificarExcecoesAplicaveis2(item, artigoProcessado);
}
function processarArtigoCompleto(artigo) {
    const artigoLimpo = artigo.trim();
    
    // Extrair componentes do artigo
    const resultado = {
        original: artigoLimpo,
        artigo: '',
        paragrafo: '',
        inciso: '',
        alinea: '',
        concomitante: [],
        formatado: ''
    };
    
    // Verificar se há artigos concomitantes (c/c)
    const partesConcomitantes = artigoLimpo.split(/\s+c\/c\s+/i);
    
    if (partesConcomitantes.length > 1) {
        // Processar artigo principal
        const artPrincipal = processarParteArtigo(partesConcomitantes[0]);
        Object.assign(resultado, artPrincipal);
        
        // Processar artigos concomitantes
        for (let i = 1; i < partesConcomitantes.length; i++) {
            resultado.concomitante.push(processarParteArtigo(partesConcomitantes[i]));
        }
        
        resultado.formatado = formatarArtigoCompleto(resultado);
    } else {
        // Processar artigo simples
        const artProcessado = processarParteArtigo(artigoLimpo);
        Object.assign(resultado, artProcessado);
        resultado.formatado = formatarArtigoCompleto(resultado);
    }
    
    return resultado;
}

// Processar uma parte do artigo (artigo, parágrafo, inciso, alínea)
function processarParteArtigo(parte) {
    const resultado = {
        artigo: '',
        paragrafo: '',
        inciso: '',
        alinea: ''
    };
    
    // Verificar se a parte não está vazia
    if (!parte || typeof parte !== 'string') {
        return resultado;
    }
    
    // Remover espaços extras e normalizar
    let texto = parte.trim().replace(/\s+/g, ' ');
    
    // Se o texto está vazio após limpeza, retornar resultado vazio
    if (!texto) {
        return resultado;
    }
    
    // Extrair artigo (número inicial)
    const matchArtigo = texto.match(/^(\d+)/);
    if (matchArtigo) {
        resultado.artigo = matchArtigo[1];
        texto = texto.substring(matchArtigo[0].length).trim();
    }
    
    // Extrair parágrafo (§1º, §2°, etc.)
    const matchParagrafo = texto.match(/[,\s]*§\s*(\d+)[º°]?/i);
    if (matchParagrafo) {
        resultado.paragrafo = matchParagrafo[1];
        texto = texto.replace(matchParagrafo[0], '').trim();
    }
    
    // Extrair inciso (I, II, III, etc.)
    const matchInciso = texto.match(/[,\s]*(I{1,3}|IV|V|VI{0,3}|IX|X{1,3})/i);
    if (matchInciso) {
        resultado.inciso = matchInciso[1].toUpperCase();
        texto = texto.replace(matchInciso[0], '').trim();
    }
    
    // Extrair alínea ('a', 'b', "c", etc.)
    const matchAlinea = texto.match(/[,\s]*['"]?([a-z])['"]?/i);
    if (matchAlinea) {
        resultado.alinea = matchAlinea[1].toLowerCase();
    }
    
    return resultado;
}

// Formatar artigo completo para exibição
function formatarArtigoCompleto(artigo) {
    let formatado = artigo.artigo;
    
    if (artigo.paragrafo) {
        formatado += `, §${artigo.paragrafo}º`;
    }
    
    if (artigo.inciso) {
        formatado += `, ${artigo.inciso}`;
    }
    
    if (artigo.alinea) {
        formatado += `, "${artigo.alinea}"`;
    }
    
    // Adicionar artigos concomitantes
    if (artigo.concomitante && artigo.concomitante.length > 0) {
        const concomitantes = artigo.concomitante.map(c => formatarParteArtigo(c)).join(' c/c ');
        formatado += ` c/c ${concomitantes}`;
    }
    
    return formatado;
}

// Formatar parte do artigo
function formatarParteArtigo(parte) {
    let formatado = parte.artigo;
    
    if (parte.paragrafo) {
        formatado += `, §${parte.paragrafo}º`;
    }
    
    if (parte.inciso) {
        formatado += `, ${parte.inciso}`;
    }
    
    if (parte.alinea) {
        formatado += `, "${parte.alinea}"`;
    }
    
    return formatado;
}

// Extrair todos os artigos de uma string norma
function extrairArtigosDoNorma(normaString) {
    if (!normaString) return [];

    const norma = normaString.toLowerCase();
    const artigos = [];

    // Padrão para encontrar "Art. NNN" ou "Arts. NNN, NNN, ..."
    // Primeiro, remove "Art." ou "Arts." e pega tudo que segue
    const matchArts = norma.match(/art\.?s?\.?\s+([\d\-\s,;"'a-z§º°àáäâãèéëêìíïîòóöôùúüûçñ.e-]+)/gi);

    if (matchArts) {
        for (const match of matchArts) {
            // Remove "art." ou "arts." do início
            const semaRtigo = match.replace(/^art\.?s?\.?\s+/i, '');

            // Extrai todos os números (artigos) da string
            // Padrão: número com opcionais hífen e letra (ex: 123, 123-A, 123-a)
            const numeroMatches = semaRtigo.match(/\b(\d+)(?:-[a-z])?\b/gi);

            if (numeroMatches) {
                for (const num of numeroMatches) {
                    artigos.push(num.match(/\d+/)[0]); // Pega só o número
                }
            }
        }
    }

    return [...new Set(artigos)]; // Remove duplicatas
}

// Verificar se artigo corresponde (considerando formatação completa)
function verificarArtigoCorresponde(artigoTabela, artigoProcessado) {
    // Verificar se os parâmetros são válidos
    if (!artigoTabela || !artigoProcessado || !artigoProcessado.artigo) {
        return false;
    }

    const artigoPrincipal = artigoProcessado.artigo.toLowerCase().trim();

    // Verificar se o artigo principal não está vazio
    if (!artigoPrincipal.trim()) {
        return false;
    }

    // Extrair todos os artigos da tabela
    const artigos = extrairArtigosDoNorma(artigoTabela);

    console.log(`Artigos extraídos de "${artigoTabela}": ${artigos.join(', ')}`);
    console.log(`Procurando por: "${artigoPrincipal}"`);

    // Verificar se o artigo principal está na lista
    return artigos.includes(artigoPrincipal);
}

// Verificar se a lei corresponde ao item da tabela
function verificarLeiCorresponde(item, codigoLei) {
    const codigoNormalizado = item.codigo.toLowerCase();
    
    switch (codigoLei) {
        case 'CP':
            return codigoNormalizado === 'cp';
        case 'CPM':
            return codigoNormalizado === 'cpm';
        case 'CLT':
            return codigoNormalizado === 'clt';
        case 'LEI_FALIMENTAR_ANTIGA':
            return codigoNormalizado === 'lei_falimentar';
        case 'DL_201':
            return codigoNormalizado === 'dl_201';
        case 'LC_105':
            return codigoNormalizado === 'lc_105';
        case 'LEI_1521':
            return codigoNormalizado === 'lei_1521';
        case 'LEI_2889':
            return codigoNormalizado === 'lei_2889';
        case 'LEI_4591':
            return codigoNormalizado === 'lei_4591';
        case 'LEI_4595':
            return codigoNormalizado === 'lei_4595';
        case 'LEI_4728':
            return codigoNormalizado === 'lei_4728';
        case 'CODIGO_ELEITORAL':
            return codigoNormalizado === 'codigo_eleitoral';
        case 'LEI_4898':
            return codigoNormalizado === 'lei_4898';
        case 'LEI_6091':
            return codigoNormalizado === 'lei_6091';
        case 'LEI_6368':
            return codigoNormalizado === 'lei_6368';
        case 'LEI_6385':
            return codigoNormalizado === 'lei_6385';
        case 'LEI_6766':
            return codigoNormalizado === 'lei_6766';
        case 'LEI_6996':
            return codigoNormalizado === 'lei_6996';
        case 'LEI_7492':
            return codigoNormalizado === 'lei_7492';
        case 'LEI_7716':
            return codigoNormalizado === 'lei_7716';
        case 'ECA':
            return codigoNormalizado === 'eca';
        case 'LEI_8137':
            return codigoNormalizado === 'lei_8137';
        case 'LEI_8176':
            return codigoNormalizado === 'lei_8176';
        case 'LEI_8666':
            return codigoNormalizado === 'lei_8666';
        case 'LEI_9455':
            return codigoNormalizado === 'lei_9455';
        case 'LEI_9504':
            return codigoNormalizado === 'lei_9504';
        case 'LEI_9605':
            return codigoNormalizado === 'lei_9605';
        case 'LEI_9613':
            return codigoNormalizado === 'lei_9613';
        case 'LEI_10826':
            return codigoNormalizado === 'lei_10826';
        case 'LEI_11101':
            return codigoNormalizado === 'lei_11101';
        case 'LEI_11343':
            return codigoNormalizado === 'lei_11343';
        case 'LEI_12850':
            return codigoNormalizado === 'lei_12850';
        case 'LEI_13260':
            return codigoNormalizado === 'lei_13260';
        default:
            return false;
    }
}

// Exibir resultado da consulta
function exibirResultado(resultado) {
    const leiInfo = leisDisponiveis.find(l => l.value === resultado.codigo);
    const nomeLei = leiInfo ? leiInfo.descricao : resultado.codigo;

    const statusClass = resultado.inelegivel ? 'inelegivel' : 'elegivel';
    const statusTexto = resultado.inelegivel ? 'INELEGÍVEL' : 'ELEGÍVEL';
    const statusIcon = resultado.inelegivel ? '❌' : '✅';

    // Usar artigo formatado se disponível
    const artigoExibicao = resultado.artigoProcessado ?
        resultado.artigoProcessado.formatado :
        resultado.artigoConsultado;

    let explicacao = '';
    let alertaExcecao = '';

    if (resultado.inelegivel) {
        explicacao = `O artigo ${artigoExibicao} do ${nomeLei} está previsto na coluna "NORMA/INCIDÊNCIA" e gera ineligibilidade.`;

        // Se tem exceções (mesmo que não se apliquem), mostrar alerta
        if (resultado.excecoes && resultado.excecoes.length > 0) {
            alertaExcecao = `
                <div class="alerta-excecao">
                    <span class="alerta-icon">⚠️</span>
                    <div class="alerta-conteudo">
                        <strong>ATENÇÃO - EXCEÇÕES EXISTENTES:</strong>
                        <p class="mt-2">Este artigo possui as seguintes exceções que podem NÃO gerar ineligibilidade caso o condenado se enquadre nelas:</p>
                        <ul class="mt-2 pl-5">
                            ${resultado.excecoes.map(exc => `<li>${exc}</li>`).join('')}
                        </ul>
                        <p class="mt-2 text-sm"><strong>Importante:</strong> Se o caso se enquadrar em uma exceção, o resultado seria <strong>ELEGÍVEL</strong>.</p>
                    </div>
                </div>
            `;
        }
    } else {
        explicacao = `O artigo ${artigoExibicao} do ${nomeLei} está previsto na coluna "NORMA/INCIDÊNCIA", mas uma exceção específica se aplica a este caso, tornando-o elegível.`;

        // Adicionar alerta com a mesma formatação padrão
        if (resultado.temExcecao) {
            alertaExcecao = `
                <div class="alerta-excecao">
                    <span class="alerta-icon">⚠️</span>
                    <div class="alerta-conteudo">
                        <strong>ATENÇÃO - EXCEÇÃO APLICÁVEL:</strong>
                        <p class="mt-2">Este artigo possui uma exceção que se aplica a este caso específico, tornando-o elegível:</p>
                        <ul class="mt-2 pl-5">
                            <li>${resultado.temExcecao}</li>
                        </ul>
                        <p class="mt-2 text-sm"><strong>Importante:</strong> Como o caso se enquadra nesta exceção, o resultado é <strong>ELEGÍVEL</strong>.</p>
                    </div>
                </div>
            `;
        }
    }
    
    // Adicionar detalhes do artigo processado se disponível
    let detalhesArtigo = '';
    if (resultado.artigoProcessado && (resultado.artigoProcessado.paragrafo || 
        resultado.artigoProcessado.inciso || resultado.artigoProcessado.alinea || 
        resultado.artigoProcessado.concomitante.length > 0)) {
        
        detalhesArtigo = '<div class="detalhes-artigo">';
        detalhesArtigo += '<h4>📋 Detalhes do Artigo Consultado:</h4>';
        detalhesArtigo += '<div class="artigo-componentes">';
        
        if (resultado.artigoProcessado.paragrafo) {
            detalhesArtigo += `<span class="componente">Parágrafo: §${resultado.artigoProcessado.paragrafo}º</span>`;
        }
        
        if (resultado.artigoProcessado.inciso) {
            detalhesArtigo += `<span class="componente">Inciso: ${resultado.artigoProcessado.inciso}</span>`;
        }
        
        if (resultado.artigoProcessado.alinea) {
            detalhesArtigo += `<span class="componente">Alínea: "${resultado.artigoProcessado.alinea}"</span>`;
        }
        
        if (resultado.artigoProcessado.concomitante.length > 0) {
            const concomitantes = resultado.artigoProcessado.concomitante
                .map(c => formatarParteArtigo(c))
                .join(', ');
            detalhesArtigo += `<span class="componente concomitante">Concomitante: ${concomitantes}</span>`;
        }
        
        detalhesArtigo += '</div></div>';
    }
    
    // Adicionar informação sobre ASE baseada no resultado e tipo de comunicação (padronizado)
    const tipoComunicacao = obterTipoComunicacao();
    const aseInfo = __genAsePad(tipoComunicacao, resultado.inelegivel);

    // Exibir resultado no modal
    abrirModal(statusClass, (resultado.inelegivel ? '❌' : '✅'), statusTexto, `
        <div class="consulta-header">
            <p class="text-center m-0 text-[0.95rem] text-gray-600"><strong>Consulta:</strong> ${nomeLei}, Artigo ${artigoExibicao}</p>
        </div>
        <div class="modal-resultado-card">
            <div class="modal-resultado-header">
                <span class="modal-resultado-icon">${statusIcon}</span>
                <span class="modal-resultado-status ${statusClass}">${statusTexto}</span>
            </div>
            <div class="modal-resultado-detalhes">
                <p>🧾 <strong>Crime:</strong> ${resultado.crime}</p>
                <p>📘 <strong>Norma/Incidência:</strong> Art. ${artigoExibicao}</p>
                ${aseInfo}
                ${alertaExcecao}
                ${detalhesArtigo}
                ${resultado.observacao ? `<p>📝 <strong>Observação:</strong> ${resultado.observacao}</p>` : ''}
            </div>
        </div>
    `);
}

// Exibir quando não encontrado
function exibirNaoEncontrado(codigoLei, artigo) {
    const leiInfo = leisDisponiveis.find(l => l.value === codigoLei);
    const nomeLei = leiInfo ? leiInfo.descricao : codigoLei;
    const tipoComunicacao = obterTipoComunicacao();
    const interpretacao = tipoComunicacao === 'condenacao'
        ? 'Como o artigo não está listado na coluna "NORMA/INCIDÊNCIA", a condenação por este artigo NÃO gera inelegibilidade conforme ASE 337, razão 7.'
        : 'Como o artigo não está listado na coluna "NORMA/INCIDÊNCIA", a extinção relacionada a este artigo NÃO gera inelegibilidade e não requer ASE 370 ou ASE 540.';

    abrirModal('nao-encontrado', 'ℹ️', 'NÃO ENCONTRADO', `
        <div class="modal-resultado-card">
            <div class="modal-resultado-header">
                <span class="modal-resultado-icon">ℹ️</span>
                <span class="modal-resultado-status nao-encontrado">NÃO ENCONTRADO</span>
            </div>
            <div class="modal-resultado-detalhes">
                <p><strong>Consulta:</strong> ${nomeLei}, Artigo ${artigo}</p>
                <p><strong>Tipo de Comunicação:</strong> ${tipoComunicacao === 'condenacao' ? 'Condenação' : 'Extinção'}</p>
                <p><strong>Resultado:</strong> O artigo consultado não foi encontrado na tabela de inelegibilidade.</p>
                <p><strong>Interpretação:</strong> ${interpretacao}</p>
            </div>
        </div>
    `);
}

// Mostrar sugestões de artigos
function mostrarSugestoes(termo) {
    const leiSelecionada = leiSelect.value;
    if (!leiSelecionada) return;
    
    const sugestoes = obterSugestoesPorLei(leiSelecionada, termo);
    
    if (sugestoes.length > 0) {
        const sugestoesHtml = sugestoes.map(sugestao => 
            `<div class="sugestao-item" onclick="selecionarSugestao('${sugestao}')">${sugestao}</div>`
        ).join('');
        
        sugestoesDiv.innerHTML = sugestoesHtml;
        sugestoesDiv.style.display = 'block';
    } else {
        esconderSugestoes();
    }
}

// Obter sugestões por lei específica com busca inteligente
function obterSugestoesPorLei(codigoLei, termo) {
    const sugestoes = new Set();
    const termoNormalizado = termo.toLowerCase().trim();

    if (!termoNormalizado || termoNormalizado.length === 0) {
        return [];
    }

    tabelaInelegibilidade.forEach(item => {
        if (verificarLeiCorresponde(item, codigoLei)) {
            const artigos = extrairArtigos(item.norma);
            artigos.forEach(artigo => {
                const artigoLower = artigo.toLowerCase();

                // Correspondência exata ou parcial
                if (artigoLower.includes(termoNormalizado) ||
                    artigoLower.startsWith(termoNormalizado) ||
                    termoNormalizado.startsWith(artigo.substring(0, 3))) {
                    sugestoes.add(artigo);
                }
            });
        }
    });

    // Converter para array, ordenar por relevância e limitar a 10 sugestões
    return Array.from(sugestoes)
        .sort((a, b) => {
            const aStarts = a.toLowerCase().startsWith(termoNormalizado) ? 0 : 1;
            const bStarts = b.toLowerCase().startsWith(termoNormalizado) ? 0 : 1;
            return aStarts - bStarts || a.length - b.length;
        })
        .slice(0, 10);
}

// Selecionar sugestão
function selecionarSugestao(artigo) {
    artigoInput.value = artigo;
    esconderSugestoes();
    verificarCamposPreenchidos();
    artigoInput.focus();
}

// Esconder sugestões
function esconderSugestoes() {
    sugestoesDiv.style.display = 'none';
}

// Limpar busca
function limparBusca() {
    leiSelect.value = '';
    artigoInput.value = '';
    artigoInput.disabled = true;
    buscarBtn.disabled = true;
    resultadoDiv.style.display = 'none';
    resultadoDiv.classList.remove('show');
    esconderSugestoes();
    leiSelect.focus();
}

// Copiar resultado
function copiarResultado() {
    const modalBody = document.getElementById('modalBody');
    if (modalBody) {
        const resultado = modalBody.textContent;
        navigator.clipboard.writeText(resultado).then(() => {
            mostrarToast('Resultado copiado para a área de transferência');
        }).catch(() => {
            mostrarToast('Erro ao copiar resultado', true);
        });
    }
}

// Variável global para armazenar o conteúdo atual do modal
let conteudoModalAtual = '';

let __modalTrapHandler = null;
let __lastFocusedElement = null;

// Função para abrir o modal
function abrirModal(tipoResultado, icone, status, conteudo) {
    const modal = document.getElementById('modalResultado');
    const modalContent = modal.querySelector('.modal-content');
    const modalBody = document.getElementById('modalBody');
    
    // Armazenar conteúdo para função de copiar
    conteudoModalAtual = conteudo;
    
    // Definir classe do modal baseada no tipo de resultado
    modalContent.className = `modal-content ${tipoResultado}`;
    
    // Inserir conteúdo no modal
    modalBody.innerHTML = conteudo;
    // Correções pós-injeção para ícones/textos legados (compat com conteúdo antigo)
    try {
        let html = modalBody.innerHTML;
        html = html.replace(/\?\?\s*<strong>Crime:/g, '🧾 <strong>Crime:');
        html = html.replace(/\?\?\s*<strong>Norma\/Incid[�ê]ncia:/g, '📘 <strong>Norma/Incidência:');
        html = html.replace(/\?\?\s*<strong>Observa[��]o:/g, '📝 <strong>Observação:');
        html = html.replace(/\?\?\s*Data de Ocorr[�ê]ncia para ASE 370: decis[ã�]o judicial que declarou a extin[ç��]o/g,
                            '⚠️ Data de Ocorrência para ASE 370: decisão judicial que declarou a extinção');
        modalBody.innerHTML = html;
    } catch(e) {}
    // Ajustar ícone dinamicamente (consistência)
    const iconEl = modalBody.querySelector('.modal-resultado-icon');
    if (iconEl) {
        iconEl.textContent = icone;
    }
    
    // Mostrar modal com animação
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);

    // Prevenir scroll do body
    document.body.style.overflow = 'hidden';

    // Foco e trap de foco para acessibilidade
    __lastFocusedElement = document.activeElement;
    modalContent.setAttribute('tabindex', '-1');
    modalContent.focus();
    const focusableSelectors = 'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const getFocusable = () => Array.from(modalContent.querySelectorAll(focusableSelectors)).filter(el => !el.hasAttribute('disabled'));
    __modalTrapHandler = (e) => {
        if (e.key !== 'Tab') return;
        const els = getFocusable();
        if (els.length === 0) return;
        const first = els[0];
        const last = els[els.length - 1];
        if (e.shiftKey) {
            if (document.activeElement === first) {
                e.preventDefault();
                last.focus();
            }
        } else {
            if (document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    };
    modalContent.addEventListener('keydown', __modalTrapHandler);
}

function mostrarToast(msg, isError = false) {
    const toast = document.createElement('div');
    toast.className = `toast ${isError ? 'error' : ''}`;
    toast.textContent = msg;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// Função para fechar o modal
function fecharModal() {
    const modal = document.getElementById('modalResultado');
    
    // Remover classe show para animação de saída
    modal.classList.remove('show');
    
    // Aguardar animação antes de esconder
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        // Remover trap e restaurar foco
        const modalContent = modal.querySelector('.modal-content');
        if (__modalTrapHandler && modalContent) {
            modalContent.removeEventListener('keydown', __modalTrapHandler);
            __modalTrapHandler = null;
        }
        if (__lastFocusedElement && typeof __lastFocusedElement.focus === 'function') {
            __lastFocusedElement.focus();
        }
    }, 300);
}

// Função para nova consulta (fechar modal e limpar campos)
function novaConsulta() {
    fecharModal();
    limparBusca();
}

// Fechar modal ao pressionar ESC
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modal = document.getElementById('modalResultado');
        if (modal.classList.contains('show')) {
            fecharModal();
        }
    }
});

// Aplicar formatação automática (versão robusta com §/º e diacríticos)
function aplicarFormatacaoAutomatica2(valor) {
    if (!valor || typeof valor !== 'string') return valor;
    let formatado = valor.trim();
    // 1. Normalizar espaços
    formatado = formatado.replace(/\s+/g, ' ');
    // 2. Formatar parágrafo: §1 -> §1º (evita duplicação)
    formatado = formatado
        .replace(/(?:§|\u00A7|\uFFFD)\s*(\d+)(?!\s*(?:º|\u00BA|\uFFFD))/g, '§$1º')
        .replace(/\bpar[aá]grafo\s*(\d+)/i, '§$1º');
    // 3. Normalizar c/c
    formatado = formatado.replace(/(?<!\/)(cc|CC|C\/c|c\/C)(?!\/)/g, 'c/c');
    // 4. Normalizar vírgulas e espaços
    formatado = formatado.replace(/\s*,\s*/g, ', ');
    // 5. Formatar alíneas: a -> "a"
    formatado = formatado.replace(/(?<!["\'])([a-z])(?=\s*(?:,|$|\s))/gi, (match, letra) => {
        if (/["']/.test(letra)) return match;
        return `"${letra.toLowerCase()}"`;
    });
    return formatado;
}

// Nova verificação robusta de exceções, tolerante a diacríticos e símbolos (§/º)
function verificarExcecoesAplicaveis2(item, artigoProcessado) {
    if (!item.excecoes || item.excecoes.length === 0) {
        return null;
    }

    const artigoPrincipal = (artigoProcessado.artigo || '').toLowerCase();
    const paragrafo = artigoProcessado.paragrafo ? String(artigoProcessado.paragrafo).toLowerCase() : null;
    const inciso = artigoProcessado.inciso ? String(artigoProcessado.inciso).toLowerCase() : null;
    const alinea = artigoProcessado.alinea ? String(artigoProcessado.alinea).toLowerCase() : null;

    const normalize = (s) => {
        try { return String(s).normalize('NFD').replace(/\p{Diacritic}/gu, ''); } catch { return String(s); }
    };

    for (const excecao of item.excecoes) {
        const excLower = String(excecao || '').toLowerCase();
        const excNorm = normalize(excLower);

        if (paragrafo || inciso || alinea) {
            let tem = false;

            if (paragrafo && !tem) {
                if (new RegExp(`(§|\\u00a7|\\uFFFD)\\s*${paragrafo}`).test(excLower) ||
                    new RegExp(`paragrafo\\s*${paragrafo}`).test(excNorm)) {
                    tem = true;
                }
            }

            if (inciso && !tem) {
                if (new RegExp(`(^|[\\s,])${inciso}(?=$|[\\s,])`).test(excLower) ||
                    new RegExp(`inciso\\s*${inciso}`).test(excNorm)) {
                    tem = true;
                }
            }

            if (alinea && !tem) {
                if (new RegExp(`"${alinea}"`).test(excLower) ||
                    new RegExp(`alinea\\s*${alinea}`).test(excNorm)) {
                    tem = true;
                }
            }

            if (tem) {
                return excecao;
            }
        } else {
            const temPar = /(§|\\u00a7|\\uFFFD)\\s*\\d|paragrafo/i.test(excNorm);
            const temInc = /,\\s*[ivx]+|inciso/i.test(excNorm);
            const temAli = /"\\w"|alinea/i.test(excNorm);
            if (temPar || temInc || temAli) continue;

            if (excLower.includes(`, ${artigoPrincipal},`) ||
                excLower.includes(`art. ${artigoPrincipal}, caput`) ||
                excLower.includes(`art. ${artigoPrincipal} caput`) ||
                excLower === `art. ${artigoPrincipal}` ||
                excLower === `arts. ${artigoPrincipal}`) {
                return excecao;
            }
        }
    }

    return null;
}

// Filtra a lista de exceções para manter apenas as do MESMO artigo consultado
function filtrarExcecoesDoMesmoArtigo(excecoes, artigoProcessado) {
    if (!Array.isArray(excecoes)) return [];
    const num = (artigoProcessado && artigoProcessado.artigo) ? String(artigoProcessado.artigo) : '';
    if (!num) return [];
    const rx = new RegExp(String.raw`\bart\.?s?\.?\s*${num}(?!-)`, 'i');
    const norm = (s) => { try { return String(s||'').normalize('NFD').replace(/\p{Diacritic}/gu,''); } catch { return String(s||'') } };
    return excecoes.filter((ex) => rx.test(norm(ex)));
}
// Índice em memória por lei para acelerar buscas
let __indicePorLei = null;
function construirIndicePorLei() {
    __indicePorLei = {};
    try {
        leisDisponiveis.forEach(lei => {
            const codigoLei = lei.value;
            const itens = [];
            tabelaInelegibilidade.forEach(it => {
                if (verificarLeiCorresponde(it, codigoLei)) {
                    try { it._artigos = extrairArtigosDoNorma(it.norma); } catch { it._artigos = []; }
                    itens.push(it);
                }
            });
            __indicePorLei[codigoLei] = itens;
        });
    } catch {}
}
function getItensPorLei(codigoLei) {
    if (!__indicePorLei) construirIndicePorLei();
    return __indicePorLei[codigoLei] || [];
}






















function __genAsePad(tipo, inelegivel) {
    if (tipo === 'condenacao') {
        const motivo = inelegivel ? 'Motivo 7' : 'Motivo 2';
        const cls = inelegivel ? 'ase-337-warning' : 'ase-337-success';
        return `
      <p class="ase-card ${cls}">
        <strong>ASE 337 - ${motivo}:</strong> Condenação criminal<br>
        <strong>Data de Ocorrência:</strong> Trânsito em julgado da sentença condenatória
      </p>
    `;
    } else {
        return `
      <p class="ase-card ase-370-info">
        <strong>ASE 370 - Extinção de Punibilidade</strong><br>
        <strong>Data de Ocorrência:</strong> Decisão judicial que declarou a extinção
        ${inelegivel ? '<br><em>Observação:</em> Se resultar em inelegibilidade, gerar automaticamente o ASE 540 (Cancelamento de Inelegibilidade).' : ''}
      </p>
    `;
    }
}



