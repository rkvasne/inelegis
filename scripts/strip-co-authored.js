#!/usr/bin/env node
/**
 * Remove linhas Co-authored-by de mensagens de commit (para uso com git filter-branch).
 * Uso: git filter-branch -f --msg-filter "node scripts/strip-co-authored.js" -- --all
 */
import { createInterface } from "readline";

const lines = [];
const rl = createInterface({ input: process.stdin, crlfDelay: Infinity });

for await (const line of rl) {
  if (!line.startsWith("Co-authored-by:")) {
    lines.push(line);
  }
}

console.log(lines.join("\n"));
