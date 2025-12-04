#!/usr/bin/env node
/*
  Verificador de consistência para data.js
  Uso: node scripts/verify-data.js
*/

const fs = require('fs');
const vm = require('vm');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'public', 'assets', 'js', 'normalizado.data.js');

function loadDataJs(file) {
  const code = fs.readFileSync(file, 'utf8');
  const sandbox = { console: { log() {} }, window: {} };
  vm.createContext(sandbox);
  vm.runInContext(code + '\n;this.__NORMALIZADO = window.__INELEG_NORMALIZADO__;', sandbox, {
    filename: 'normalizado.data.js',
  });
  return sandbox.__NORMALIZADO || [];
}

function hasSuspectChars(str) {
  return /�/.test(str);
}

function normalize(str) {
  try { return str.normalize('NFD').replace(/\p{Diacritic}/gu, ''); } catch { return str; }
}

function main() {
  const items = loadDataJs(dataPath);
  const problems = [];

  // 1) Campos obrigatórios e caracteres suspeitos
  let suspectCount = 0;
  items.forEach((item, idx) => {
    const ctx = `item #${idx + 1}`;
    if (!item || typeof item !== 'object') problems.push({ type: 'invalid_item', ctx });
    if (!item.norma) problems.push({ type: 'missing_field', field: 'norma', ctx });
    if (!item.crime) problems.push({ type: 'missing_field', field: 'crime', ctx });
    if (!item.codigo) problems.push({ type: 'missing_field', field: 'codigo', ctx });
    const text = [item.norma, item.crime, item.observacao || ''].join(' | ');
    if (hasSuspectChars(text)) suspectCount++;
  });

  // 2) Duplicatas por (codigo, norma)
  const key = (it) => `${(it.codigo || '').toLowerCase()}|${normalize((it.norma || '').toLowerCase())}`;
  const seen = new Map();
  const dups = [];
  items.forEach((it) => {
    const k = key(it);
    if (seen.has(k)) dups.push({ a: seen.get(k), b: it });
    else seen.set(k, it);
  });

  // 3) Exceções com formato suspeito
  const badExceptions = [];
  items.forEach((it) => {
    if (!Array.isArray(it.excecoes)) return;
    it.excecoes.forEach((ex) => {
      if (typeof ex !== 'string' || ex.trim() === '') {
        badExceptions.push({ codigo: it.codigo, norma: it.norma, excecao: ex, reason: 'não é string ou vazia' });
        return;
      }
      const exNorm = normalize(ex.toLowerCase());
      // Deve conter "art" e algum dígito, minimamente
      if (!/art/.test(exNorm) || !/\d/.test(exNorm)) {
        badExceptions.push({ codigo: it.codigo, norma: it.norma, excecao: ex, reason: 'não contém padrão mínimo (art + número)' });
      }
    });
  });

  // 4) Verificar "c.c." vs "c/c"
  let ccDots = 0;
  items.forEach((it) => {
    const txt = `${it.norma} ${Array.isArray(it.excecoes) ? it.excecoes.join(' | ') : ''}`;
    if (/c\.c\./i.test(txt)) ccDots++;
  });

  // Saída
  const summary = {
    totalNormas: items.length,
    suspectCharEntries: suspectCount,
    duplicates: dups.length,
    badExceptions: badExceptions.length,
    occurrencesCcDot: ccDots,
    problems,
  };

  // Relatório amigável
  console.log('=== Verificação normalizado.data.js ===');
  console.log(`Normas: ${summary.totalNormas}`);
  console.log(`Entradas com caracteres suspeitos (�): ${summary.suspectCharEntries}`);
  console.log(`Duplicatas (codigo|norma): ${summary.duplicates}`);
  console.log(`Exceções com formato suspeito: ${summary.badExceptions}`);
  console.log(`Ocorrências de "c.c.": ${summary.occurrencesCcDot}`);

  if (summary.duplicates) {
    console.log('\n-- Duplicatas (exemplo de 5) --');
    dups.slice(0, 5).forEach((d, i) => {
      console.log(`#${i + 1} [${d.a.codigo}] ${d.a.norma}`);
    });
  }
  if (summary.badExceptions) {
    console.log('\n-- Exceções suspeitas (exemplo de 5) --');
    badExceptions.slice(0, 5).forEach((e, i) => {
      console.log(`#${i + 1} [${e.codigo}] ${e.norma} :: ${e.excecao} -> ${e.reason}`);
    });
  }

  console.log('\nOK - Verificação concluída.');
}

try {
  main();
} catch (e) {
  console.error('Falha ao verificar normalizado.data.js:', e.message);
  process.exit(1);
}
