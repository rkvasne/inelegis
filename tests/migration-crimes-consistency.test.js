/**
 * Teste de consistência da migration jurídica SSoT.
 * Objetivo:
 * - evitar regressão de artigos com exceção detalhada sem base impeditiva;
 * - validar correções históricas críticas (CP 177/180/184).
 *
 * Execute com: node tests/migration-crimes-consistency.test.js
 */

import fs from "fs";

const assert = {
  ok: (value, message) => {
    if (!value) throw new Error(message);
  },
  equal: (actual, expected, message) => {
    if (actual !== expected) {
      throw new Error(`${message}\nEsperado: ${expected}\nRecebido: ${actual}`);
    }
  },
};

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (error) {
    console.error(`❌ ${name}`);
    console.error(`   ${error.message}`);
    failed++;
  }
}

function splitTupleFields(tupleText) {
  const fields = [];
  let current = "";
  let inQuote = false;

  for (let i = 0; i < tupleText.length; i += 1) {
    const ch = tupleText[i];
    if (ch === "'") {
      inQuote = !inQuote;
      current += ch;
      continue;
    }
    if (ch === "," && !inQuote) {
      fields.push(current.trim());
      current = "";
      continue;
    }
    current += ch;
  }
  if (current.trim()) fields.push(current.trim());
  return fields;
}

function normalizeSqlValue(raw) {
  const v = raw.trim();
  if (v === "NULL") return null;
  if (v === "TRUE") return true;
  if (v === "FALSE") return false;
  if (v.startsWith("'") && v.endsWith("'")) return v.slice(1, -1);
  return v;
}

function extractTuples(valuesBlock) {
  const tuples = [];
  let inQuote = false;
  let depth = 0;
  let current = "";

  for (let i = 0; i < valuesBlock.length; i += 1) {
    const ch = valuesBlock[i];

    if (ch === "'") {
      inQuote = !inQuote;
      if (depth > 0) current += ch;
      continue;
    }

    if (!inQuote && ch === "(") {
      if (depth === 0) {
        current = "";
      } else {
        current += ch;
      }
      depth += 1;
      continue;
    }

    if (!inQuote && ch === ")") {
      depth -= 1;
      if (depth === 0) {
        tuples.push(current.trim());
        current = "";
      } else if (depth > 0) {
        current += ch;
      }
      continue;
    }

    if (depth > 0) {
      current += ch;
    }
  }

  return tuples;
}

function extractRowsFromMigration(sql) {
  const rows = [];
  const marker = "INSERT INTO crimes_inelegibilidade";
  const statements = [];
  let searchFrom = 0;

  while (true) {
    const start = sql.indexOf(marker, searchFrom);
    if (start === -1) break;

    let inQuote = false;
    let end = -1;
    for (let i = start; i < sql.length; i += 1) {
      const ch = sql[i];
      if (ch === "'") {
        inQuote = !inQuote;
      } else if (ch === ";" && !inQuote) {
        end = i;
        break;
      }
    }

    if (end !== -1) {
      statements.push(sql.slice(start, end));
      searchFrom = end + 1;
    } else {
      break;
    }
  }

  for (const statement of statements) {
    const insertMatch = statement.match(
      /INSERT INTO crimes_inelegibilidade\s*\(([\s\S]*?)\)\s*VALUES\s*([\s\S]*)$/i,
    );
    if (!insertMatch) continue;

    const columns = insertMatch[1]
      .split(",")
      .map((c) => c.replace(/\s+/g, " ").trim());
    const valuesBlock = insertMatch[2];

    const tuples = extractTuples(valuesBlock);
    for (const tupleText of tuples) {
      const rawFields = splitTupleFields(tupleText);
      if (rawFields.length === columns.length) {
        const row = {};
        columns.forEach((col, idx) => {
          row[col] = normalizeSqlValue(rawFields[idx]);
        });
        rows.push(row);
      }
    }
  }

  return rows;
}

function getGrouped(rows) {
  const by = new Map();
  for (const r of rows) {
    if (!r.codigo || !r.artigo) continue;
    const key = `${r.codigo}|${r.artigo}`;
    if (!by.has(key)) by.set(key, []);
    by.get(key).push(r);
  }
  return by;
}

function cloneRows(rows) {
  return rows.map((row) => ({ ...row }));
}

function applyEnumeratedNormalization(rows) {
  const cloned = cloneRows(rows);
  const grouped = getGrouped(cloned);

  for (const arr of grouped.values()) {
    const hasBaseNonException = arr.some(
      (r) => r.eh_excecao === false && !r.paragrafo && !r.inciso && !r.alinea,
    );

    if (hasBaseNonException) continue;

    for (const row of arr) {
      const isDetailedNonException =
        row.eh_excecao === false && (row.paragrafo || row.inciso || row.alinea);
      if (!isDetailedNonException) continue;
      row.artigo_inteiro_impeditivo = false;
    }
  }

  return cloned;
}

function normalizeParagrafo(value) {
  if (value == null) return null;
  const str = String(value).trim().toLowerCase();
  if (!str || str === "caput" || str === "cap") return null;
  if (["unico", "único", "paragrafo unico", "parágrafo único"].includes(str)) {
    return "unico";
  }
  return str.replace(/[§º°ª]/g, "").replace(/\s+/g, "");
}

function evaluateFromRows(rows, params) {
  const codigo = String(params.codigo || "")
    .toUpperCase()
    .trim();
  const artigo = String(params.artigo || "").trim();
  const paragrafo = normalizeParagrafo(params.paragrafo);
  const inciso = params.inciso
    ? String(params.inciso).toUpperCase().trim()
    : null;
  const alinea = params.alinea
    ? String(params.alinea).toUpperCase().trim()
    : null;

  const articleRows = rows.filter(
    (r) =>
      String(r.codigo || "").toUpperCase() === codigo &&
      String(r.artigo || "") === artigo,
  );
  if (articleRows.length === 0) return "NAO_CONSTA";

  const exact = articleRows.filter((r) => {
    const p = normalizeParagrafo(r.paragrafo);
    const i = r.inciso ? String(r.inciso).toUpperCase().trim() : null;
    const a = r.alinea ? String(r.alinea).toUpperCase().trim() : null;
    return p === paragrafo && i === inciso && a === alinea;
  });

  if (exact.length > 0) {
    const chosen = exact.sort(
      (a, b) => Number(b.eh_excecao) - Number(a.eh_excecao),
    )[0];
    return chosen.eh_excecao ? "ELEGIVEL" : "INELEGIVEL";
  }

  const hasArtigoInteiroImpeditivo = articleRows.some(
    (r) =>
      r.eh_excecao === false &&
      !r.paragrafo &&
      !r.inciso &&
      !r.alinea &&
      r.artigo_inteiro_impeditivo !== false,
  );

  return hasArtigoInteiroImpeditivo ? "INELEGIVEL" : "ELEGIVEL";
}

console.log(
  "\n🧪 Executando testes de consistência da migration jurídica...\n",
);

const sqlPath = "supabase/migrations/20260225000000_crimes_inelegibilidade.sql";
const sql = fs.readFileSync(sqlPath, "utf8");
const rows = extractRowsFromMigration(sql);
const grouped = getGrouped(rows);

test("Migration deve conter linhas de crimes_inelegibilidade parseáveis", () => {
  assert.ok(rows.length > 0, "Nenhuma linha parseada da migration.");
  assert.ok(
    grouped.size > 0,
    "Nenhum agrupamento (codigo|artigo) encontrado na migration.",
  );
});

test("Trilha de hotfixes de confiabilidade deve existir", () => {
  const required = [
    "supabase/migrations/20260226000300_hotfix_cp_177_180_184_base_impeditiva.sql",
    "supabase/migrations/20260226000400_hotfix_verificar_elegibilidade_failsafe_lacuna_dados.sql",
    "supabase/migrations/20260226000500_hotfix_artigo_inteiro_impeditivo_enumerados.sql",
  ];

  for (const path of required) {
    assert.ok(fs.existsSync(path), `Migration ausente: ${path}`);
  }
});

test("Não deve existir artigo com exceção detalhada sem base impeditiva", () => {
  const offenders = [];

  for (const [key, arr] of grouped.entries()) {
    const hasNonException = arr.some((r) => r.eh_excecao === false);
    const hasDetailedException = arr.some(
      (r) => r.eh_excecao === true && (r.paragrafo || r.inciso || r.alinea),
    );

    if (hasDetailedException && !hasNonException) {
      offenders.push(key);
    }
  }

  assert.equal(
    offenders.length,
    0,
    `Artigos com exceção detalhada sem base impeditiva: ${offenders.join(", ")}`,
  );
});

test("Artigos enumerados sem base devem ser normalizados com artigo_inteiro_impeditivo=FALSE", () => {
  assert.ok(
    sql.includes("SET artigo_inteiro_impeditivo = FALSE"),
    "Migration não contém normalização estruturada de artigo_inteiro_impeditivo.",
  );

  const normalizedRows = applyEnumeratedNormalization(rows);
  const normalizedGrouped = getGrouped(normalizedRows);
  const offenders = [];

  for (const [key, arr] of normalizedGrouped.entries()) {
    const hasBaseNonException = arr.some(
      (r) => r.eh_excecao === false && !r.paragrafo && !r.inciso && !r.alinea,
    );
    if (hasBaseNonException) continue;

    const invalidDetailed = arr.some(
      (r) =>
        r.eh_excecao === false &&
        (r.paragrafo || r.inciso || r.alinea) &&
        r.artigo_inteiro_impeditivo !== false,
    );

    if (invalidDetailed) offenders.push(key);
  }

  assert.equal(
    offenders.length,
    0,
    `Artigos enumerados com flag ambígua: ${offenders.join(", ")}`,
  );
});

test("CP 177/180/184 devem manter base impeditiva + exceção específica", () => {
  const expected = [
    { key: "CP|177", paragrafoExcecao: "2" },
    { key: "CP|180", paragrafoExcecao: "3" },
    { key: "CP|184", paragrafoExcecao: "4" },
  ];

  for (const item of expected) {
    const rowsByArticle = grouped.get(item.key) || [];
    const hasBase = rowsByArticle.some(
      (r) => r.eh_excecao === false && !r.paragrafo && !r.inciso && !r.alinea,
    );
    const hasExpectedException = rowsByArticle.some(
      (r) =>
        r.eh_excecao === true &&
        String(r.paragrafo || "") === item.paragrafoExcecao,
    );

    assert.ok(hasBase, `Base impeditiva ausente em ${item.key}.`);
    assert.ok(
      hasExpectedException,
      `Exceção §${item.paragrafoExcecao} ausente em ${item.key}.`,
    );
  }
});

test("Casos críticos de fallback devem seguir interpretação CRE", () => {
  const normalizedRows = applyEnumeratedNormalization(rows);
  const matrix = [
    { codigo: "CP", artigo: "180", paragrafo: "8", expected: "INELEGIVEL" },
    { codigo: "CP", artigo: "180", paragrafo: "3", expected: "ELEGIVEL" },
    { codigo: "CP", artigo: "163", paragrafo: null, expected: "ELEGIVEL" },
    { codigo: "CP", artigo: "163", paragrafo: "2", expected: "INELEGIVEL" },
    { codigo: "CP", artigo: "149-A", paragrafo: "3", expected: "ELEGIVEL" },
  ];

  for (const item of matrix) {
    const actual = evaluateFromRows(normalizedRows, item);
    assert.equal(
      actual,
      item.expected,
      `Classificação divergente para ${item.codigo} art. ${item.artigo} §${item.paragrafo ?? "caput"}.`,
    );
  }
});

console.log("\n" + "=".repeat(50));
console.log(
  `📊 Resultados Migration Consistency: ${passed} passou, ${failed} falhou`,
);
console.log("=".repeat(50) + "\n");

process.exit(failed > 0 ? 1 : 0);
