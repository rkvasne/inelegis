;(function(){
  if (!window.App) window.App = {};
  function expose(){
    if (typeof window.buscarInelegibilidadePorLeiEArtigo === 'function'){
      window.App.search = {
        buscarInelegibilidadePorLeiEArtigo: window.buscarInelegibilidadePorLeiEArtigo,
        buscarFlexivel: window.buscarFlexivel
      };
    }
  }
  if (document.readyState === 'loading'){
    window.addEventListener('load', expose);
  } else { expose(); }
})();

