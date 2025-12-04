#!/usr/bin/env node
const fs=require('fs');
const path=require('path');

const xmlPath=path.join(__dirname,'../docs/references/tabela-oficial.xml');
const outJsPath=path.join(__dirname,'../public/assets/js/normalizado.data.js');

function readXml(p){return fs.readFileSync(p,'utf8');}
function stripTags(s){return String(s||'').replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();}
function parseRows(xml){const rows=[];const trRx=/<TR>([\s\S]*?)<\/TR>/gi;let m;while((m=trRx.exec(xml))){const tr=m[1];if(/<TH>/i.test(tr)) continue;const tds=[];const tdRx=/<TD[^>]*>([\s\S]*?)<\/TD>/gi;let c;while((c=tdRx.exec(tr))){tds.push(stripTags(c[1]));}if(tds.length>=3){rows.push({norma:tds[0],excecoes:tds[1],crime:tds[2]});}}return rows;}
function deriveCodigo(norma){const s=String(norma||'').toLowerCase();if(/c[oó]digo penal|decreto-?lei\s*2\.848\/40/i.test(s)) return 'CP';if(/cpm|c[oó]digo penal militar/i.test(s)) return 'CPM';const m=s.match(/lei\s*(\d{1,5})(?:\/(\d{2}))?/i);if(m){const num=m[1];return `LEI_${num}`;}return 'LEI_DESCONHECIDA';}
function splitExcecoes(txt){const s=String(txt||'').trim();if(!s) return[];return s.split(/\s*[,;]\s*|\s+e\s+/i).map(x=>x.trim()).filter(Boolean);
}
function extrairArtigosDoNorma(n){if(!n) return[];const s=String(n).toLowerCase();const r=s.match(/art\.?s?\.?\s+([\d\-\s,;"'a-z§º°àáäâãèéëêìíïîòóöôùúüûçñ.e-]+)/gi);const a=[];if(r){for(const m of r){const t=m.replace(/^art\.?s?\.?\s+/i,'');const ns=t.match(/\b(\d+)(?:-[a-z])?\b/gi);if(ns){for(const x of ns){a.push(x.match(/\d+/)[0]);}}}}return Array.from(new Set(a));}
function normalizeRow(row){const artigos=extrairArtigosDoNorma(row.norma);return{codigo:deriveCodigo(row.norma),norma:row.norma,excecoes:splitExcecoes(row.excecoes),crime:row.crime,observacao:'',estruturado:{artigos}};}

function build(){const xml=readXml(xmlPath);const rows=parseRows(xml);const items=rows.map(normalizeRow);const js=`;(function(){window.__INELEG_NORMALIZADO__=${JSON.stringify(items)};})();\n`;fs.writeFileSync(outJsPath,js,'utf8');console.log('Gerado:',path.relative(process.cwd(),outJsPath),'Itens:',items.length);}

build();
