/**
 * Teste de Integração: UI Analyzer + Toast System
 */

import fs from "fs";
import path from "path";
import vm from "vm";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mock básico de DOM e Dependências
class MockElement {
    constructor(tag) {
        this.value = "";
        this.disabled = false;
        this.innerHTML = "";
        this.classList = { add: () => { }, remove: () => { } };
    }
}

// Sandbox com mocks
const toastCalls = [];
const sandbox = {
    window: {},
    document: {
        getElementById: (id) => new MockElement(id),
        createElement: (tag) => new MockElement(tag)
    },
    console,
    // Mock do serviço de toast que injetamos
    showToast: (msg, type) => {
        toastCalls.push({ msg, type });
    }
};

// Preparar window no sandbox para receber a classe
sandbox.window = sandbox;

// Carregar AnalyzerUI
let uiCode = fs.readFileSync(
    path.join(__dirname, "../src/js/ui/analyzer-ui.js"),
    "utf8"
);

// Mocks simples para imports ES6 para o VM conseguir rodar
uiCode = uiCode.replace(/import\s+.*?;/g, ""); // Remove imports
uiCode = uiCode.replace(/export\s+class/, "window.AnalyzerUI = class"); // Exporta para o sandbox

vm.createContext(sandbox);
vm.runInContext(uiCode, sandbox);
const AnalyzerUI = sandbox.AnalyzerUI;

async function runIntegrationTest() {
    console.log("\n🧪 Executando teste de integração: AnalyzerUI -> Toast...");

    if (!AnalyzerUI) {
        console.error("❌ Falha: Classe AnalyzerUI não foi carregada no Sandbox.");
        process.exit(1);
    }

    const ui = new AnalyzerUI();
    ui.textarea = { value: "" }; // Simular campo vazio

    await ui.analisar();

    if (toastCalls.length > 0 && toastCalls[0].type === "warning") {
        console.log("✅ Sucesso: O aviso de texto vazio disparou o Toast!");
        process.exit(0);
    } else {
        console.error("❌ Falha: O Toast não foi disparado para campo vazio.");
        process.exit(1);
    }
}

runIntegrationTest();
