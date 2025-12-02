// Registro do Service Worker para cache
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => console.log('SW registrado:', registration.scope))
            .catch(err => console.log('Falha no SW:', err));
    });
}

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

// Verificar se está na página Consulta e se checkbox foi marcado
function verificarAcessoConsulta() {
    if (window.location.pathname.includes('consulta') || window.location.href.includes('consulta')) {
        const confirmacaoCheckbox = localStorage.getItem('inelegis_confirmacao');
        if (!confirmacaoCheckbox) {
            window.location.href = './';
            return false;
        }
    }
    return true;
}

// Inicialização
document.addEventListener('DOMContentLoaded', function () {
    // Verificar acesso à página Consulta
    if (!verificarAcessoConsulta()) {
        return;
    }
    
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
    radioCondenacao.addEventListener('change', function () {
        if (this.checked) {
            dataOcorrenciaCondenacao.style.display = 'block';
            dataOcorrenciaExtincao.style.display = 'none';
        }
    });

    radioExtincao.addEventListener('change', function () {
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
    // Botão de histórico
    const historyBtn = document.getElementById('historyBtn');
    if (historyBtn) {
        historyBtn.addEventListener('click', function() {
            HistoryUI.open();
        });
    }

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
    leiSelect.addEventListener('change', function () {
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

            // Função para atualizar o preview do artigo em tempo real
            const atualizarPreview = () => {
                const artigoCompleto = artigoInput.value.trim();
                const leiSelecionada = leiSelect.options[leiSelect.selectedIndex].text;

                // Se o campo "Artigo Completo" tiver conteúdo, mostrar ele no preview
                if (artigoCompleto) {
                    // Adicionar "Art. " se não começar com isso
                    const artigoFormatado = artigoCompleto.toLowerCase().startsWith('art.')
                        ? artigoCompleto
                        : `Art. ${artigoCompleto}`;
                    document.getElementById('previewArtigo').textContent = `${artigoFormatado} do ${leiSelecionada}`;
                    return;
                }

                // Caso contrário, mostrar o preview do construtor
                const artigo = document.getElementById('artigoNum').value.trim();
                const paragrafo = document.getElementById('paragrafoNum').value.trim();
                const inciso = document.getElementById('incisoNum').value.trim();
                const alinea = document.getElementById('alineaNum').value.trim();
                const concomitante = document.getElementById('concomitanteNum').value.trim();

                let preview = 'Art. ';
                if (artigo) preview += artigo;
                if (paragrafo) preview += `, §${paragrafo}º`;
                if (inciso) preview += `, ${inciso}`;
                if (alinea) preview += `, "${alinea}"`;
                if (concomitante) preview += ` c/c ${concomitante}`;
                preview += ` do ${leiSelecionada}`;

                document.getElementById('previewArtigo').textContent = preview;
            };

            // Adicionar event listeners para atualizar o preview
            artigoInput.addEventListener('input', atualizarPreview);
            document.getElementById('artigoNum').addEventListener('input', atualizarPreview);
            document.getElementById('paragrafoNum').addEventListener('input', atualizarPreview);
            document.getElementById('incisoNum').addEventListener('input', atualizarPreview);
            document.getElementById('alineaNum').addEventListener('input', atualizarPreview);
            document.getElementById('concomitanteNum').addEventListener('input', atualizarPreview);

            // Atualizar preview inicial
            atualizarPreview();

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
            // Limpar campos do builder
            document.getElementById('artigoNum').value = '';
            document.getElementById('paragrafoNum').value = '';
            document.getElementById('incisoNum').value = '';
            document.getElementById('alineaNum').value = '';
            document.getElementById('concomitanteNum').value = '';
            // Resetar preview
            document.getElementById('previewArtigo').textContent = 'Art. , , , do';
            limparBusca();
        }
        verificarCamposPreenchidos();
    });

    // Botões para inserir símbolos
    document.getElementById('insertParagrafoBtn').addEventListener('click', function (e) {
        e.preventDefault();
        const paraNum = document.getElementById('paragrafoNum').value;
        if (paraNum) {
            artigoInput.value += `, §${paraNum}º`;
            artigoInput.focus();
            verificarCamposPreenchidos();
            debouncedSugestoes(artigoInput.value.trim());
        }
    });

    document.getElementById('insertAlineaBtn').addEventListener('click', function (e) {
        e.preventDefault();
        const alinea = document.getElementById('alineaNum').value;
        if (alinea) {
            artigoInput.value += `, "${alinea}"`;
            artigoInput.focus();
            verificarCamposPreenchidos();
            debouncedSugestoes(artigoInput.value.trim());
        }
    });

    document.getElementById('insertConcBtn').addEventListener('click', function (e) {
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
    document.getElementById('montarArtigoBtn').addEventListener('click', function (e) {
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
    artigoInput.addEventListener('input', function () {
        const valorAtual = this.value;
        const valorTrim = valorAtual.trim();

        // Formatação automática durante a digitação (apenas se necessário)
        if (valorTrim && valorTrim.length > 0) {
            const valorFormatado = ArtigoFormatter.formatar(valorTrim);

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
    leiSelect.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && this.value) {
            artigoInput.focus();
        }
    });

    artigoInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !buscarBtn.disabled) {
            realizarBusca();
        }
    });

    // Atalhos de teclado para acesso rápido
    document.addEventListener('keydown', function (e) {
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

    const artigoProcessado = ArtigoFormatter.processar(numeroArtigo);
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
            const temExcecao = ExceptionValidator.verificar(item, artigoProcessado);

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

            const temExcecao = ExceptionValidator.verificar(item, artigoProcessado);

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

    // Salvar no histórico local
    if (typeof HistoryUI !== 'undefined') {
        const artigoParaHistorico = resultado.artigoProcessado?.formatado || 
                                    resultado.artigoOriginal || 
                                    'N/A';
        HistoryUI.addSearch({
            lei: resultado.codigo,
            artigo: artigoParaHistorico,
            resultado: resultado.inelegivel ? 'inelegivel' : 'elegivel',
            timestamp: new Date().toISOString()
        });
    }

    // Enviar analytics (anônimo)
    if (typeof Analytics !== 'undefined' && Analytics.isEnabled()) {
        const artigoParaAnalytics = resultado.artigoProcessado?.formatado || 
                                     resultado.artigoOriginal || 
                                     'N/A';
        Analytics.trackSearch({
            lei: resultado.codigo,
            artigo: artigoParaAnalytics,
            resultado: resultado.inelegivel ? 'inelegivel' : 'elegivel',
            temExcecao: resultado.excecoes && resultado.excecoes.length > 0,
            tempoResposta: null // Pode adicionar medição de tempo
        });
    }

    // Usar artigo formatado se disponível
    const artigoExibicao = resultado.artigoProcessado ?
        resultado.artigoProcessado.formatado :
        resultado.artigoConsultado;

    // Construir seção de exceções
    let secaoExcecoes = '';
    if (resultado.inelegivel && resultado.excecoes && resultado.excecoes.length > 0) {
        secaoExcecoes = `
            <div class="modal-section modal-warning">
                <div class="section-header">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                    </svg>
                    <span>Atenção: Exceções Existentes</span>
                </div>
                <div class="section-content">
                    <p class="section-intro">Este artigo possui exceções que podem <strong>NÃO gerar inelegibilidade</strong> caso o condenado se enquadre em uma delas:</p>
                    <ul class="exception-list">
                            ${resultado.excecoes.map(exc => `<li>${exc}</li>`).join('')}
                        </ul>
                    <div class="section-note">
                        <strong>Importante:</strong> Se o caso se enquadrar em uma exceção, o resultado seria <strong>ELEGÍVEL</strong>.
                    </div>
                    </div>
                </div>
            `;
    } else if (!resultado.inelegivel && resultado.temExcecao) {
        secaoExcecoes = `
            <div class="modal-section modal-success">
                <div class="section-header">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                    </svg>
                    <span>Exceção Aplicável</span>
                </div>
                <div class="section-content">
                    <p class="section-intro">Este artigo possui uma exceção que se aplica a este caso específico:</p>
                    <ul class="exception-list">
                            <li>${resultado.temExcecao}</li>
                        </ul>
                    <div class="section-note">
                        <strong>Resultado:</strong> Como o caso se enquadra nesta exceção, o resultado é <strong>ELEGÍVEL</strong>.
                    </div>
                    </div>
                </div>
            `;
    }

    // Construir detalhes do artigo
    let detalhesArtigo = '';
    if (resultado.artigoProcessado && (resultado.artigoProcessado.paragrafo ||
        resultado.artigoProcessado.inciso || resultado.artigoProcessado.alinea ||
        resultado.artigoProcessado.concomitante.length > 0)) {

        const componentes = [];
        if (resultado.artigoProcessado.paragrafo) {
            componentes.push(`<span class="detail-badge">§${resultado.artigoProcessado.paragrafo}º</span>`);
        }
        if (resultado.artigoProcessado.inciso) {
            componentes.push(`<span class="detail-badge">Inciso ${resultado.artigoProcessado.inciso}</span>`);
        }
        if (resultado.artigoProcessado.alinea) {
            componentes.push(`<span class="detail-badge">Alínea "${resultado.artigoProcessado.alinea}"</span>`);
        }
        if (resultado.artigoProcessado.concomitante.length > 0) {
            const conc = resultado.artigoProcessado.concomitante
                .map(c => formatarParteArtigo(c))
                .join(', ');
            componentes.push(`<span class="detail-badge badge-conc">c/c ${conc}</span>`);
        }

        detalhesArtigo = `
            <div class="modal-section modal-info">
                <div class="section-header">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                        <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"></path>
                    </svg>
                    <span>Componentes do Artigo</span>
                </div>
                <div class="section-content">
                    <div class="detail-badges">
                        ${componentes.join('')}
                    </div>
                </div>
            </div>
        `;
    }

    // Informação ASE
    const tipoComunicacao = obterTipoComunicacao();
    const aseInfo = __genAsePad(tipoComunicacao, resultado.inelegivel);

    // Atualizar header do modal
    document.getElementById('modalTitle').textContent = 'Resultado da Consulta';
    document.getElementById('modalSubtitle').textContent = `${nomeLei} • Art. ${artigoExibicao}`;

    // Montar modal com novo design
    abrirModal(statusClass, statusTexto, `
        <div class="modal-status-card ${statusClass}">
            <div class="status-icon-wrapper">
                <svg width="28" height="28" fill="currentColor" viewBox="0 0 20 20">
                    ${resultado.inelegivel ?
            '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>' :
            '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>'
        }
                </svg>
            </div>
            <div class="status-text-wrapper">
                <span class="status-label">Resultado</span>
                <span class="status-value">${statusTexto}</span>
            </div>
        </div>

        <div class="modal-info-grid">
            <div class="info-item">
                <span class="info-label">Crime/Delito</span>
                <span class="info-value">${resultado.crime}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Norma/Incidência</span>
                <span class="info-value">Art. ${artigoExibicao}</span>
            </div>
        </div>

        ${aseInfo ? `<div class="modal-ase-info">${aseInfo}</div>` : ''}
        ${secaoExcecoes}
                ${detalhesArtigo}
        ${resultado.observacao ? `
            <div class="modal-section modal-note">
                <div class="section-header">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                    </svg>
                    <span>Observação</span>
            </div>
                <div class="section-content">
                    <p>${resultado.observacao}</p>
        </div>
            </div>
        ` : ''}
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

    // Atualizar header do modal
    document.getElementById('modalTitle').textContent = 'Artigo Não Encontrado';
    document.getElementById('modalSubtitle').textContent = `${nomeLei} • Art. ${artigo}`;

    abrirModal('nao-encontrado', 'NÃO ENCONTRADO', `
        <div class="modal-status-card nao-encontrado">
            <div class="status-icon-wrapper">
                <svg width="28" height="28" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                </svg>
            </div>
            <div class="status-text-wrapper">
                <span class="status-label">Status</span>
                <span class="status-value">NÃO ENCONTRADO</span>
            </div>
        </div>

        <div class="modal-section modal-info">
            <div class="section-header">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                </svg>
                <span>Informações da Consulta</span>
            </div>
            <div class="section-content">
                <div class="modal-info-grid">
                    <div class="info-item">
                        <span class="info-label">Tipo de Comunicação</span>
                        <span class="info-value">${tipoComunicacao === 'condenacao' ? 'Condenação' : 'Extinção da Punibilidade'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Base de Dados</span>
                        <span class="info-value">TRE-SP (Out/2024)</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal-section modal-success">
            <div class="section-header">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                <span>Interpretação Jurídica</span>
            </div>
            <div class="section-content">
                <p class="section-intro">${interpretacao}</p>
                <div class="section-note">
                    <strong>Conclusão:</strong> O artigo consultado não consta na tabela oficial de inelegibilidade, portanto <strong>não gera impedimento eleitoral</strong>.
                </div>
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
            `<div class="sugestao-item" onclick="selecionarSugestao('${sugestao}')">
                <div class="flex items-center gap-3">
                    <div class="w-2 h-2 bg-primary-500 rounded-full"></div>
                    <span class="font-medium">${sugestao}</span>
                </div>
            </div>`
        ).join('');

        sugestoesDiv.innerHTML = sugestoesHtml;
        sugestoesDiv.classList.add('show');
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
    sugestoesDiv.classList.remove('show');
    setTimeout(() => {
        sugestoesDiv.innerHTML = '';
    }, 200);
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

// Função para abrir o modal (usa ModalManager)
function abrirModal(tipoResultado, status, conteudo) {
    ModalManager.open(tipoResultado, status, conteudo);
}

function mostrarToast(msg, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    // Ícones modernos para cada tipo
    const icons = {
        success: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>',
        error: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>',
        warning: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path></svg>',
        info: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
    };

    // Estrutura moderna do toast
    toast.innerHTML = `
        <div class="toast-content">
            <div class="toast-icon">
                ${icons[type] || icons.info}
            </div>
            <div class="toast-message">${msg}</div>
        </div>
    `;

    document.body.appendChild(toast);

    // Animar entrada com bounce
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    // Auto-remover com animação suave
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 400);
    }, 4000);

    // Permitir fechar clicando no toast
    toast.addEventListener('click', () => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 400);
    });
}

// Função para exportar resultado (usa ModalManager)
function exportarResultado() {
    const texto = ModalManager.exportContent();
    if (texto) {
        navigator.clipboard.writeText(texto).then(() => {
            mostrarToast('✅ Resultado copiado para área de transferência!', 'success');
        }).catch(err => {
            console.error('Erro ao copiar:', err);
            mostrarToast('❌ Erro ao copiar. Tente novamente.', 'error');
        });
    }
}

// Função para mostrar toast de feedback
function mostrarToast(mensagem, tipo = 'success') {
    // Criar elemento de toast
    const toast = document.createElement('div');
    toast.className = `toast toast-${tipo}`;
    toast.textContent = mensagem;
    toast.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: ${tipo === 'success' ? 'var(--success-500)' : 'var(--danger-500)'};
        color: var(--text-on-primary, #fff);
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: var(--shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1));
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        font-size: 0.875rem;
        font-weight: 500;
    `;

    // Adicionar ao body
    document.body.appendChild(toast);

    // Remover após 3 segundos
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Função para fechar o modal (usa ModalManager)
function fecharModal() {
    ModalManager.close();
}

// Função para nova consulta (fechar modal e limpar campos)
function novaConsulta() {
    fecharModal();
    limparBusca();
}

// Fechar modal ao pressionar ESC
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        const modal = document.getElementById('modalResultado');
        if (modal.classList.contains('show')) {
            fecharModal();
        }
    }
});

// Filtra a lista de exceções para manter apenas as do MESMO artigo consultado
function filtrarExcecoesDoMesmoArtigo(excecoes, artigoProcessado) {
    if (!Array.isArray(excecoes)) return [];
    const num = (artigoProcessado && artigoProcessado.artigo) ? String(artigoProcessado.artigo) : '';
    if (!num) return [];
    const rx = new RegExp(String.raw`\bart\.?s?\.?\s*${num}(?!-)`, 'i');
    const norm = (s) => { try { return String(s || '').normalize('NFD').replace(/\p{Diacritic}/gu, ''); } catch { return String(s || '') } };
    return excecoes.filter((ex) => rx.test(norm(ex)));
}
// Usar SearchIndex para busca otimizada
function getItensPorLei(codigoLei) {
    return SearchIndex.getItensPorLei(codigoLei, leisDisponiveis, tabelaInelegibilidade);
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

// Navegação por teclado aprimorada
document.addEventListener('keydown', function (e) {
    // Ctrl/Cmd + K: Focar na busca
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (artigoInput) artigoInput.focus();
    }

    // Esc: Fechar modal
    if (e.key === 'Escape') {
        const modal = document.getElementById('resultModal');
        if (modal && modal.classList.contains('show')) {
            fecharModal();
        }
    }

    // Enter no campo de artigo: Buscar
    if (e.key === 'Enter' && document.activeElement === artigoInput) {
        e.preventDefault();
        if (buscarBtn && !buscarBtn.disabled) {
            buscarBtn.click();
        }
    }
});

// Trap de foco no modal para acessibilidade
function trapFocusInModal(modalElement) {
    const focusableElements = modalElement.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    modalElement.addEventListener('keydown', function (e) {
        if (e.key === 'Tab') {
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    });
}

