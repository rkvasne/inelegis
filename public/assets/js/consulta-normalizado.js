(function() {
  const base = (window.__INELEG_NORMALIZADO__ && Array.isArray(window.__INELEG_NORMALIZADO__.itens))
    ? window.__INELEG_NORMALIZADO__
    : { itens: [] };

  const state = { leiMap: null };

  function getItens() { return Array.isArray(base.itens) ? base.itens : []; }

  function buildLeiMap() {
    const map = {};
    for (const it of getItens()) {
      const cod = String(it.codigo || '').trim();
      if (!cod || map[cod]) continue;
      const norma = String(it.norma || '');
      let nome = '';
      let desc = '';
      const mLei = norma.match(/Lei\s+[^–\-\(]+/i);
      if (mLei) nome = mLei[0].trim();
      const mDesc = norma.match(/\(([^\)]+)\)/);
      if (mDesc) desc = mDesc[1].trim();
      const label = nome || cod;
      map[cod] = { codigo: cod, nome: label, descricao: desc, label: desc ? label + ' - ' + desc : label };
    }
    state.leiMap = map;
    return map;
  }

  function getLeiInfo(codigoLei) { if (!state.leiMap) buildLeiMap(); const cod = String(codigoLei || '').trim(); return state.leiMap[cod] || { codigo: cod, nome: cod, descricao: '', label: cod }; }
  function getLeiDescricao(codigoLei) { return getLeiInfo(codigoLei).label; }
  function getLeis() { if (!state.leiMap) buildLeiMap(); return Object.values(state.leiMap); }
  function getItensPorLei(codigoLei) { const cod = String(codigoLei || '').trim(); if (!cod) return []; return getItens().filter(it => String(it.codigo || '').trim() === cod); }
  function getSugestoesPorLei(codigoLei) { const itens = getItensPorLei(codigoLei); const out = []; for (const it of itens) { if (Array.isArray(it.sugestoes)) { for (const s of it.sugestoes) out.push(String(s)); } } return out; }
  function query(params) { const cod = String((params && params.lei) || '').trim(); const texto = String((params && params.artigoTexto) || '').trim(); const lista = getItensPorLei(cod); if (!texto) return lista; const norm = texto.toLowerCase(); return lista.filter(it => { const n = String(it.norma || '').toLowerCase(); const a = String(it.artigo || '').toLowerCase(); return n.includes(norm) || a.includes(norm); }); }

  window.DataNormalizer = { getItens, getItensPorLei, getSugestoesPorLei, getLeiInfo, getLeiDescricao, getLeis, query };
})();

