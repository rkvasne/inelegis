;(function(){
  const ICONES = {
    alerta: '⚠️', info: 'ℹ️', ok: '✅', erro: '❌', artigo: '📘', crime: '🧾'
  };
  function debounce(fn, wait){ let t; return function(){ clearTimeout(t); const ctx=this, args=arguments; t=setTimeout(()=>fn.apply(ctx,args), wait||200) } }
  function normalizarDiacriticos(str){ try{ return String(str||'').normalize('NFD').replace(/\p{Diacritic}/gu,'') }catch{ return String(str||'') } }
  window.App = window.App || {};
  window.App.utils = { ICONES, debounce, normalizarDiacriticos };
})();

