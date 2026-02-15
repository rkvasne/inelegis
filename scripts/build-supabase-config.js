/**
 * Build Supabase Config
 * Gera o arquivo de configuração do Supabase com as credenciais do .env.local
 *
 * Uso: node scripts/build-supabase-config.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tentar carregar dotenv se disponível com override para garantir que o .env.local vença
try {
  dotenv.config({
    path: path.join(__dirname, "../.env.local"),
    override: true,
  });
} catch (e) {
  // Silencioso se não houver dotenv (pode estar em CI)
}

// 1. Pegar das variáveis de ambiente (carregadas via dotenv ou setadas no OS/Vercel)
let supabaseUrl = process.env["NEXT_PUBLIC_SUPABASE_URL"];
let supabaseAnonKey = process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"];

// Fallback: parser manual simplificado se dotenv falhou/não existia e variáveis estão vazias
if (!supabaseUrl || !supabaseAnonKey) {
  const envPath = path.join(__dirname, "../.env.local");
  if (fs.existsSync(envPath)) {
    let envContent = fs.readFileSync(envPath, "utf8");

    // Remover BOM se presente (pode causar erro no primeiro caractere do arquivo)
    if (envContent.charCodeAt(0) === 0xfeff) {
      envContent = envContent.slice(1);
    }

    envContent.split(/\r?\n/).forEach((line) => {
      const trimmedLine = line.trim();
      if (!trimmedLine || trimmedLine.startsWith("#")) return;

      const [key, ...valueParts] = trimmedLine.split("=");
      if (!key) return;

      const value = valueParts
        .join("=")
        .trim()
        .replace(/^["'](.*)["']$/, "$1");

      const cleanKey = key.trim();
      if (cleanKey === "NEXT_PUBLIC_SUPABASE_URL") supabaseUrl = value;
      if (cleanKey === "NEXT_PUBLIC_SUPABASE_ANON_KEY") supabaseAnonKey = value;
    });
  }
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "❌ ERRO: Variáveis do Supabase não encontradas no .env.local ou no ambiente.",
  );
  console.log("   Diagnóstico:");
  console.log(`   - CWD: ${process.cwd()}`);
  console.log(
    `   - .env.local existe: ${fs.existsSync(path.join(__dirname, "../.env.local"))}`,
  );
  console.log(`   - URL encontrada: ${supabaseUrl ? "SIM" : "NÃO"}`);
  console.log(`   - Key encontrada: ${supabaseAnonKey ? "SIM" : "NÃO"}`);
  console.log("\n   Siga os seguintes passos:");
  console.log(
    "   1. Verifique se o arquivo .env.local existe na raiz do projeto.",
  );
  console.log("   2. Certifique-se que ele contém as seguintes chaves:");
  console.log("      NEXT_PUBLIC_SUPABASE_URL=seu_url");
  console.log("      NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key");
  console.log(
    "   3. Se estiver em CI/CD, configure as Secret Variables correspondentes.",
  );
  process.exit(1);
}

const configContent = `/**
 * Supabase Configuration (Auto-generated)
 * Gerado em: ${new Date().toISOString()}
 * NÃO EDITE MANUALMENTE - use: npm run build:supabase-config
 */

window.__SUPABASE_CONFIG__ = {
    url: '${supabaseUrl}',
    anonKey: '${supabaseAnonKey}'
};

console.log('[Supabase] Configurado para:', window.__SUPABASE_CONFIG__.url);
`;

const outputPath = path.join(
  __dirname,
  "../public/assets/js/supabase-config.js",
);

// Garantir que a pasta exista
const outputDir = path.dirname(outputPath);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputPath, configContent);

console.log("✅ Supabase config gerado:", outputPath);
console.log("   URL:", supabaseUrl);
console.log("   Key:", supabaseAnonKey.substring(0, 20) + "...");
