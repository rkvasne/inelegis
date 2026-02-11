function extrairArtigosCompletos(texto) {
  const resultados = [];
  const clausulas = texto.split(/[;\n]+/);
  clausulas.forEach((clausula) => {
    if (!clausula.trim()) return;
    const regexArt =
      /(?:art\.?s?\.?\s+)([\d\w\-\.]+)(?:\s*(?:,|e|ou|c\/c)\s*([\d\w\-\.]+))?(?:\s*(?:,|e|ou|c\/c)\s*([\d\w\-\.]+))?/gi;
    let m;
    while ((m = regexArt.exec(clausula)) !== null) {
      const start = regexArt.lastIndex;
      const preview = clausula.slice(start);
      const nextArtMatch = preview.match(/art\.?s?\.?/i);
      const contextEnd = nextArtMatch ? nextArtMatch.index : preview.length;
      const context = preview.slice(0, contextEnd).toLowerCase();

      const extractMulti = (ctx, single, plural, valuePattern) => {
        const allMarkers = (plural + "|" + single)
          .split("|")
          .sort((a, b) => b.length - a.length)
          .map((m) => m.replace(".", "\\."));
        const pattern = `(?:${allMarkers.join("|")})\\s*((?:${valuePattern})(?:\\s*(?:,|e|ou)\\s*(?:${valuePattern}))*)`;
        const regex = new RegExp(pattern, "i");
        const matchVal = ctx.match(regex);
        if (!matchVal) return [null];
        const clean = matchVal[1]
          .split(/\s*(?:,|e|ou)\s*/)
          .map((v) => v.replace(/[º°ª'"'']/g, "").trim())
          .filter((v) => v);
        return clean.length > 0 ? clean : [null];
      };

      const paragrafos = extractMulti(
        context,
        "§|parágrafo|paragrafo|par",
        "§§|parágrafos|paragrafos",
        "\\d+|único|unico",
      );
      const incisos = extractMulti(
        context,
        "inciso|inc",
        "incisos|incs",
        "[ivxlcdm]+|\\d+",
      );
      const alineas = extractMulti(
        context,
        "alínea|alinea|al",
        "alíneas|alineas|als",
        "['\"]?[a-z]['\"]?",
      );

      const articlesFound = [m[1], m[2], m[3]]
        .filter((v) => v)
        .map((v) => v.replace(/\.$/, "").trim());

      articlesFound.forEach((art) => {
        paragrafos.forEach((p) => {
          incisos.forEach((inc) => {
            alineas.forEach((al) => {
              resultados.push({
                artigo: art,
                paragrafo: p,
                inciso: inc,
                alinea: al,
              });
            });
          });
        });
      });
    }
  });
  return resultados;
}

const tests = [
  "Art. 121, §§ 1, 2 e 3",
  "Arts. 1, 2 e 3; inciso I, alínea 'e'",
  "Art. 121, § 3º e Art. 129, § 2º",
];
tests.forEach((t) => {
  console.log(`\nInput: ${t}`);
  console.log(JSON.stringify(extrairArtigosCompletos(t), null, 2));
});
