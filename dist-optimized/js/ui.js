;(function(){
  if (!window.App) window.App = {};
  function expose(){
    const api = {};
    if (typeof window.abrirModal === 'function') api.abrirModal = window.abrirModal;
    if (typeof window.fecharModal === 'function') api.fecharModal = window.fecharModal;
    if (typeof window.exibirResultado === 'function') api.exibirResultado = window.exibirResultado;
    if (typeof window.exibirNaoEncontrado === 'function') api.exibirNaoEncontrado = window.exibirNaoEncontrado;
    window.App.ui = api;
  }
  if (document.readyState === 'loading'){
    window.addEventListener('load', expose);
  } else { expose(); }
})();

