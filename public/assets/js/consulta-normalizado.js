;(function(){
  var data = Array.isArray(window.__INELEG_NORMALIZADO__) ? window.__INELEG_NORMALIZADO__ : [];
  function cleanNorma(n){
    var s = String(n || '');
    var idx = s.toLowerCase().search(/\barts?\.?/);
    if (idx > -1) {
      s = s.slice(0, idx).trim();
      s = s.replace(/[\s\-–—]+$/, '').trim();
    }
    return s;
  }

  function uniqCodes(){
    var m = new Map();
    for (var i=0;i<data.length;i++){ var it=data[i]; if(!m.has(it.codigo)) m.set(it.codigo, cleanNorma(it.norma)); }
    var out=[]; m.forEach(function(norma,codigo){ out.push({ value: codigo, text: norma }); });
    return out;
  }
  function getItensPorLei(codigo){ return data.filter(function(it){ return it.codigo===codigo; }); }
  function getSugestoesPorLei(codigo, termo){
    var t = String(termo||'').toLowerCase(); if(!t) return [];
    var itens = getItensPorLei(codigo);
    var arts = [];
    for (var i=0;i<itens.length;i++){
      var a = (itens[i].estruturado && Array.isArray(itens[i].estruturado.artigos)) ? itens[i].estruturado.artigos : [];
      for (var j=0;j<a.length;j++){ var s=String(a[j]); if(s.toLowerCase().startsWith(t)) arts.push(s); }
    }
    var seen = new Set(); var out=[];
    for (var k=0;k<arts.length;k++){ var s=arts[k]; if(!seen.has(s)){ seen.add(s); out.push('Art. '+s); } }
    return out.slice(0,20);
  }
  function query(q){
    var lei = q && q.lei; var art = q && q.artigo ? String(q.artigo) : '';
    var res = data.filter(function(it){
      if (lei && it.codigo!==lei) return false;
      var arts = (it.estruturado && Array.isArray(it.estruturado.artigos)) ? it.estruturado.artigos : [];
      if (art && arts.indexOf(String(art))===-1) return false;
      return true;
    });
    return res;
  }
  window.DataNormalizer = {
    getLeis: uniqCodes,
    getItensPorLei: getItensPorLei,
    getSugestoesPorLei: getSugestoesPorLei,
    query: query
  };
  try { window.leisDisponiveis = uniqCodes(); } catch(e){}
})();
