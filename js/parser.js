;(function(){
  if (!window.App) window.App = {};
  function expose(){
    const api = {};
    if (typeof window.processarArtigoCompleto === 'function') api.processarArtigoCompleto = window.processarArtigoCompleto;
    if (typeof window.processarParteArtigo === 'function') api.processarParteArtigo = window.processarParteArtigo;
    if (typeof window.formatarArtigoCompleto === 'function') api.formatarArtigoCompleto = window.formatarArtigoCompleto;
    if (typeof window.formatarParteArtigo === 'function') api.formatarParteArtigo = window.formatarParteArtigo;
    if (typeof window.extrairArtigosDoNorma === 'function') api.extrairArtigosDoNorma = window.extrairArtigosDoNorma;
    window.App.parser = api;
  }
  if (document.readyState === 'loading'){
    window.addEventListener('load', expose);
  } else { expose(); }
})();

