#!/usr/bin/env node

/**
 * Gerador de Token de Admin para Analytics Dashboard
 *
 * Gera um token seguro para configurar o Analytics (Supabase).
 * NÃO cria ou modifica nenhum arquivo.
 * Apenas exibe o token para você copiar e configurar manualmente.
 *
 * Uso: npm run generate-token
 */

import crypto from "crypto";

const MAX_TOKENS = 10;
const DEFAULT_TOKENS = 1;

function parseRequestedCount() {
  const lifecycle = process.env.npm_lifecycle_event || "";
  const lifecycleSuffix = lifecycle.includes(":")
    ? lifecycle.split(":").pop()
    : null;
  const args = process.argv.slice(2);

  const candidates = [];

  if (lifecycleSuffix && /^\d+$/.test(lifecycleSuffix)) {
    candidates.push(parseInt(lifecycleSuffix, 10));
  }

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (/^--?count=\d+$/.test(arg)) {
      candidates.push(parseInt(arg.split("=")[1], 10));
    } else if (
      (arg === "--count" || arg === "-c") &&
      /^\d+$/.test(args[i + 1] || "")
    ) {
      candidates.push(parseInt(args[i + 1], 10));
    } else if (/^\d+$/.test(arg)) {
      candidates.push(parseInt(arg, 10));
    }
  }

  const requested = candidates.find((n) => Number.isInteger(n) && n > 0);
  if (!requested) return DEFAULT_TOKENS;
  return Math.min(requested, MAX_TOKENS);
}

/**
 * Gera token seguro usando crypto
 * Formato: inelegis_admin_YYYY_[64 caracteres hex]
 */
function generateSecureToken() {
  const prefix = "inelegis_admin";
  const year = new Date().getFullYear();
  const randomBytes = crypto.randomBytes(32).toString("hex");

  return `${prefix}_${year}_${randomBytes}`;
}

/**
 * Main
 */
function main() {
  const count = parseRequestedCount();
  console.log("");
  console.log("═".repeat(70));
  console.log("🔐 GERADOR DE TOKEN - INELEGIS ANALYTICS");
  console.log("═".repeat(70));
  console.log("");
  console.log("🛠️  Formas de uso:");
  console.log("   • npm run generate-token              # gera 1 token");
  console.log("   • npm run generate-token -- 2         # gera 2 tokens");
  console.log("   • npm run generate-token -- --count=3 # gera 3 tokens");
  console.log("   • npm run generate-token -- -c 4      # gera 4 tokens");
  console.log(
    "   • npm run generate-token -- 10        # máximo permitido (10)",
  );
  console.log("");

  const tokens = Array.from({ length: count }, () => generateSecureToken());

  console.log(
    `✅ ${count === 1 ? "Token gerado" : `${count} tokens gerados`} com sucesso!`,
  );
  console.log("");
  tokens.forEach((token, index) => {
    console.log(`TOKEN_${index + 1} = ${token}`);
  });
  console.log("");
  console.log("📊 Informações:");
  console.log("   • Cada token tem " + tokens[0].length + " caracteres");
  console.log("   • Entropia: 256 bits");
  console.log("   • Algoritmo: crypto.randomBytes(32)");
  console.log("");
  console.log("═".repeat(70));
  console.log("📝 COMO CONFIGURAR");
  console.log("═".repeat(70));
  console.log("");
  console.log("🌐 VERCEL (Produção):");
  console.log("   1. Acesse: https://vercel.com/dashboard");
  console.log("   2. Selecione o projeto: inelegis-app");
  console.log("   3. Vá em: Settings → Environment Variables");
  console.log("   4. Clique em: Add New");
  console.log("   5. Name: ANALYTICS_ADMIN_TOKEN (ou variável desejada)");
  console.log("   6. Value: copie um dos TOKEN_n gerados acima");
  console.log("   7. Environment: Production, Preview, Development");
  console.log("   8. Clique em: Save");
  console.log("");
  console.log("💻 DESENVOLVIMENTO LOCAL (.env.local):");
  console.log("   1. Crie o arquivo: .env.local");
  console.log("   2. Adicione a linha:");
  console.log("      ANALYTICS_ADMIN_TOKEN=TOKEN_1");
  console.log("   3. Salve o arquivo");
  console.log("   4. Execute: npm run dev");
  console.log("");
  console.log("═".repeat(70));
  console.log("🔒 SEGURANÇA");
  console.log("═".repeat(70));
  console.log("");
  console.log("   ⚠️  NUNCA commite este token no git");
  console.log("   ⚠️  Guarde em local seguro (gerenciador de senhas)");
  console.log("   ⚠️  Rotacione periodicamente (a cada 3-6 meses)");
  console.log("   ⚠️  Não compartilhe por email ou chat");
  console.log("   ⚠️  Apague da tela após copiar (use gerenciador de senhas)");
  console.log("");
  console.log("═".repeat(70));
  console.log("📚 DOCUMENTAÇÃO");
  console.log("═".repeat(70));
  console.log("");
  console.log("   • Setup Supabase: docs/guides/setup-supabase.md");
  console.log("   • Variáveis: docs/guides/VARIAVEIS-AMBIENTE.md");
  console.log("   • Analytics: docs/operations/ANALYTICS.md");
  console.log("");
}

main();
