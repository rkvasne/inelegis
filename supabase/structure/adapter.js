import { spawn } from "child_process";
import dotenv from "dotenv";
import fs from "fs";
import { join } from "path";

/**
 * 🛰️ Hub Structure Adapter (Satellite Bridge)
 * Este script executa a lógica centralizada no Hub mas garante que:
 * 1. O contexto (.env.local) seja o do projeto satélite.
 * 2. O resultado (.json) seja salvo localmente na pasta supabase/structure/.
 */

const scriptType = process.argv[2]; // ex: 'tables', 'functions', 'diagnostico'
const validScripts = [
  "db-structure",
  "tables",
  "functions",
  "rls-policies",
  "triggers",
  "diagnostico",
];

if (!scriptType || !validScripts.includes(scriptType)) {
  console.error(
    `❌ Nome de script inválido. Use um de: ${validScripts.join(", ")}`,
  );
  process.exit(1);
}

const hubPath = join(
  process.cwd(),
  ".agent",
  "hub",
  "system",
  "supabase-structure",
);
const hubScript = join(hubPath, `extract-${scriptType}.js`);
const localOutDir = join(process.cwd(), "supabase", "structure");
const envFiles = [
  join(process.cwd(), ".env.local"),
  join(process.cwd(), ".env"),
];

function buildSatelliteEnv() {
  const childEnv = { ...process.env };

  for (const envFile of envFiles) {
    if (!fs.existsSync(envFile)) continue;

    try {
      const raw = fs.readFileSync(envFile, "utf8");
      const parsed = dotenv.parse(raw);

      for (const [key, value] of Object.entries(parsed)) {
        if (childEnv[key] === undefined) {
          childEnv[key] = value;
        }
      }
    } catch (error) {
      console.warn(`⚠️ [Bridge] Falha ao ler ${envFile}: ${error.message}`);
    }
  }

  return childEnv;
}

const childEnv = buildSatelliteEnv();

console.log(
  `🚀 [Inelegis Bridge] Executando lógica do Hub para: ${scriptType}...`,
);

const child = spawn(
  "node",
  ["--preserve-symlinks", hubScript, "--outDir", localOutDir],
  {
    cwd: process.cwd(),
    env: childEnv,
    stdio: "inherit",
  },
);

child.on("close", (code) => {
  if (code === 0) {
    console.log(`✅ [Bridge] Extração concluída com saída em: ${localOutDir}`);
  } else {
    console.error(
      `❌ [Bridge] O script do Hub encerrou com erro (código ${code}).`,
    );
  }
  process.exit(code ?? 1);
});
