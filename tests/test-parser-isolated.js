function testParser(texto) {
  const resultados = [];
  const textoLower = texto.toLowerCase();
  // Regex original simplificada para o teste
  const regexBloco = /(?:art\.?s?\.?\s+)([\d\-\.]+)([^.;\n]{0,150})/gi;

  let match;
  while ((match = regexBloco.exec(texto)) !== null) {
    const contextoTotal = (match[2] || "").toLowerCase();

    // A REGEX QUE ESTÁ NO ANALYZER-UI.JS AGORA:
    const paragrafoMatch = contextoTotal.match(
      /(?:§|parágrafo|paragrafo|par\b\.?)\s*([\w\-]+)/i,
    );
    const paragrafo = paragrafoMatch
      ? paragrafoMatch[1].replace(/[º°ª]/g, "")
      : null;

    resultados.push({
      artigo: match[1],
      paragrafo: paragrafo,
    });
  }
  return resultados;
}

const inputs = [
  "art. 121, codigo penal, paragrafo 3",
  "art. 121 § 3º cp",
  "art. 121 par. 3 cp",
  "art. 121 cp (parágrafo unico)",
];

inputs.forEach((i) => {
  console.log(`Input: "${i}" -> Res:`, JSON.stringify(testParser(i)));
});
