#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...walk(p));
    else if (e.isFile() && p.endsWith('.html')) files.push(p);
  }
  return files;
}

function isExternal(url) {
  return /^https?:\/\//i.test(url);
}

function normalizeTarget(htmlFile, rawUrl) {
  const url = String(rawUrl).split('#')[0].split('?')[0];
  if (!url || url.trim() === '') return null;
  if (isExternal(url)) return null;
  if (String(rawUrl).startsWith('#')) return { type: 'anchor', value: String(rawUrl).slice(1) };
  if (url.startsWith('/')) return { type: 'file', value: path.join(publicDir, url.replace(/^\//, '')) };
  return { type: 'file', value: path.resolve(path.dirname(htmlFile), url) };
}

function extractAll(content) {
  const attrs = [];
  const patterns = [
    /<a[^>]+href=["']([^"']+)["']/gi,
    /<link[^>]+href=["']([^"']+)["']/gi,
    /<script[^>]+src=["']([^"']+)["']/gi,
    /<img[^>]+src=["']([^"']+)["']/gi
  ];
  for (const rx of patterns) {
    let m;
    while ((m = rx.exec(content)) !== null) attrs.push(m[1]);
  }
  return attrs;
}

function hasId(content, id) {
  const rx = new RegExp(`id=["']${id}["']`, 'i');
  return rx.test(content);
}

function main() {
  const htmlFiles = walk(publicDir);
  let broken = 0;
  const issues = [];

  for (const file of htmlFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const urls = extractAll(content);
    for (const url of urls) {
      const target = normalizeTarget(file, url);
      if (!target) continue;
      if (target.type === 'file') {
        if (!fs.existsSync(target.value)) {
          broken++;
          issues.push({ file, url, reason: 'arquivo não encontrado', target: target.value });
        }
      } else if (target.type === 'anchor') {
        if (!hasId(content, target.value)) {
          broken++;
          issues.push({ file, url: `#${target.value}`, reason: 'âncora não encontrada' });
        }
      }
    }
  }

  console.log('=== Verificação de Links (public) ===');
  console.log(`Arquivos HTML: ${htmlFiles.length}`);
  console.log(`Links quebrados: ${broken}`);
  if (issues.length) {
    console.log('\nExemplos (até 10):');
    issues.slice(0, 10).forEach((it, i) => {
      console.log(`${i + 1}. ${path.relative(publicDir, it.file)} -> ${it.url} (${it.reason})`);
    });
  }
  process.exit(broken > 0 ? 1 : 0);
}

if (require.main === module) {
  main();
}
