/**
 * Testes unitários para Toast Notification System
 * Execute com: node tests/toast.test.js
 */

import fs from "fs";
import path from "path";
import vm from "vm";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simular ambiente DOM mínimo para o sandbox
class MockElement {
    constructor(tag) {
        this.tagName = tag.toUpperCase();
        this.id = "";
        this.className = "";
        this.innerHTML = "";
        this.textContent = "";
        this.attributes = {};
        this.children = [];
        this.parentNode = null;
        this.classList = {
            add: (c) => {
                if (!this.className.includes(c)) this.className += " " + c;
            },
            remove: (c) => {
                this.className = this.className.replace(c, "").trim();
            },
            contains: (c) => this.className.includes(c)
        };
        this.listeners = {};
    }

    setAttribute(name, value) { this.attributes[name] = value; }
    appendChild(child) {
        child.parentNode = this;
        this.children.push(child);
    }
    removeChild(child) {
        const index = this.children.indexOf(child);
        if (index > -1) this.children.splice(index, 1);
    }
    addEventListener(event, callback) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
    }
    querySelector(selector) {
        // Busca simplificada para o botão close
        if (selector === ".toast__close") return new MockElement("button");
        return null;
    }
}

const mockDocument = {
    body: new MockElement("body"),
    getElementById: (id) => {
        if (id === "toast-container") {
            return mockDocument.body.children.find(c => c.id === "toast-container") || null;
        }
        return null;
    },
    createElement: (tag) => new MockElement(tag)
};

const sandbox = {
    document: mockDocument,
    window: {},
    console,
    setTimeout: (fn, ms) => {
        timers.push({ fn, ms });
        return timers.length;
    },
    clearTimeout: (id) => { },
    requestAnimationFrame: (fn) => fn()
};

const timers = [];

// Carregar código do Toast
let toastCode = fs.readFileSync(
    path.join(__dirname, "../src/js/utils/toast.js"),
    "utf8"
);
// Remover export para execução no VM
toastCode = toastCode.replace(/export\s+function/g, "function");

vm.createContext(sandbox);
vm.runInContext(toastCode, sandbox);

const showToast = sandbox.showToast;
const mostrarToast = sandbox.window.mostrarToast;

// Utilitário de assert
const assert = {
    equal: (actual, expected, message) => {
        if (actual !== expected) throw new Error(`${message} | Esperado: ${expected}, Recebido: ${actual}`);
    },
    ok: (val, message) => { if (!val) throw new Error(message); }
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
    } finally {
        // Reset DOM for next test
        mockDocument.body.children = [];
        timers.length = 0;
    }
}

console.log("\n🧪 Executando testes do Toast Notification System...\n");

test("Deve criar o container de toast se não existir", () => {
    showToast("Teste");
    const container = mockDocument.getElementById("toast-container");
    assert.ok(container, "Container deve ser criado");
    assert.equal(container.className, "toast-container", "Classe do container incorreta");
});

test("Deve criar toast com o tipo correto", () => {
    showToast("Sucesso", "success");
    const container = mockDocument.getElementById("toast-container");
    const toast = container.children[0];
    assert.ok(toast.className.includes("toast--success"), "Deve ter classe toast--success");
    assert.ok(toast.className.includes("toast--visible"), "Deve ser visível");
});

test("Deve escapar HTML na mensagem", () => {
    const malicious = "<img src=x onerror=alert(1)>";
    showToast(malicious);
    const container = mockDocument.getElementById("toast-container");
    const toast = container.children[0];
    // No mockElement, textContent -> innerHTML simplificado
    assert.ok(!toast.innerHTML.includes("<img"), "HTML não deve ser injetado diretamente");
});

test("Deve expor mostrarToast global para compatibilidade", () => {
    assert.ok(typeof mostrarToast === "function", "mostrarToast deve ser uma função");
    mostrarToast("Erro Legado", "error");
    const container = mockDocument.getElementById("toast-container");
    const toast = container.children[0];
    assert.ok(toast.className.includes("toast--error"), "Deve converter tipo error corretamente");
});

test("Deve agendar a remoção automática", () => {
    showToast("Auto remove", "info", 3000);
    assert.equal(timers.length, 1, "Deve ter 1 timer agendado");
    assert.equal(timers[0].ms, 3000, "Duração do timer incorreta");
});

console.log("\n" + "=".repeat(50));
console.log(`📊 Resultados: ${passed} passou, ${failed} falhou`);
console.log("=".repeat(50) + "\n");

process.exit(failed > 0 ? 1 : 0);
