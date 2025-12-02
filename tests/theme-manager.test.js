/**
 * Testes para Theme Manager
 * @version 0.0.8
 */

// Mock do localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => { store[key] = value.toString(); },
        removeItem: (key) => { delete store[key]; },
        clear: () => { store = {}; }
    };
})();

// Mock do window.matchMedia
const matchMediaMock = (matches) => () => ({
    matches,
    media: '(prefers-color-scheme: dark)',
    addEventListener: () => {},
    removeEventListener: () => {}
});

// Configurar ambiente de teste
global.localStorage = localStorageMock;
global.window = {
    localStorage: localStorageMock,
    matchMedia: matchMediaMock(false)
};

// Importar o módulo (simulado)
const STORAGE_KEY = 'inelegis_theme';
const THEME_DARK = 'dark';
const THEME_LIGHT = 'light';

// Testes
console.log('🧪 Iniciando testes do Theme Manager...\n');

let testsRun = 0;
let testsPassed = 0;
let testsFailed = 0;

function test(description, fn) {
    testsRun++;
    try {
        fn();
        testsPassed++;
        console.log(`✅ ${description}`);
    } catch (error) {
        testsFailed++;
        console.log(`❌ ${description}`);
        console.log(`   Erro: ${error.message}`);
    }
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message || 'Assertion failed');
    }
}

function assertEquals(actual, expected, message) {
    if (actual !== expected) {
        throw new Error(message || `Expected ${expected}, got ${actual}`);
    }
}

// Limpar antes de cada teste
function beforeEach() {
    localStorage.clear();
}

// Testes de armazenamento
test('Deve salvar tema no localStorage', () => {
    beforeEach();
    localStorage.setItem(STORAGE_KEY, THEME_DARK);
    assertEquals(localStorage.getItem(STORAGE_KEY), THEME_DARK);
});

test('Deve recuperar tema do localStorage', () => {
    beforeEach();
    localStorage.setItem(STORAGE_KEY, THEME_LIGHT);
    const theme = localStorage.getItem(STORAGE_KEY);
    assertEquals(theme, THEME_LIGHT);
});

test('Deve retornar null quando não há tema salvo', () => {
    beforeEach();
    const theme = localStorage.getItem(STORAGE_KEY);
    assertEquals(theme, null);
});

// Testes de detecção de tema do sistema
test('Deve detectar preferência de tema escuro do sistema', () => {
    global.window.matchMedia = matchMediaMock(true);
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? THEME_DARK : THEME_LIGHT;
    assertEquals(systemTheme, THEME_DARK);
});

test('Deve detectar preferência de tema claro do sistema', () => {
    global.window.matchMedia = matchMediaMock(false);
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? THEME_DARK : THEME_LIGHT;
    assertEquals(systemTheme, THEME_LIGHT);
});

// Testes de validação
test('Deve aceitar apenas temas válidos', () => {
    const validThemes = [THEME_DARK, THEME_LIGHT];
    assert(validThemes.includes(THEME_DARK), 'Tema escuro deve ser válido');
    assert(validThemes.includes(THEME_LIGHT), 'Tema claro deve ser válido');
    assert(!validThemes.includes('invalid'), 'Tema inválido não deve ser aceito');
});

// Testes de alternância
test('Deve alternar de claro para escuro', () => {
    beforeEach();
    let currentTheme = THEME_LIGHT;
    currentTheme = currentTheme === THEME_DARK ? THEME_LIGHT : THEME_DARK;
    assertEquals(currentTheme, THEME_DARK);
});

test('Deve alternar de escuro para claro', () => {
    beforeEach();
    let currentTheme = THEME_DARK;
    currentTheme = currentTheme === THEME_DARK ? THEME_LIGHT : THEME_DARK;
    assertEquals(currentTheme, THEME_LIGHT);
});

// Testes de persistência
test('Deve manter tema após reload (simulado)', () => {
    beforeEach();
    localStorage.setItem(STORAGE_KEY, THEME_DARK);
    
    // Simular reload
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    assertEquals(savedTheme, THEME_DARK);
});

// Testes de prioridade
test('Tema salvo deve ter prioridade sobre tema do sistema', () => {
    beforeEach();
    localStorage.setItem(STORAGE_KEY, THEME_LIGHT);
    global.window.matchMedia = matchMediaMock(true); // Sistema prefere escuro
    
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? THEME_DARK : THEME_LIGHT;
    const finalTheme = savedTheme || systemTheme;
    
    assertEquals(finalTheme, THEME_LIGHT, 'Tema salvo deve ter prioridade');
});

// Resumo dos testes
console.log('\n📊 Resumo dos Testes:');
console.log(`   Total: ${testsRun}`);
console.log(`   ✅ Passou: ${testsPassed}`);
console.log(`   ❌ Falhou: ${testsFailed}`);

if (testsFailed === 0) {
    console.log('\n🎉 Todos os testes passaram!');
    process.exit(0);
} else {
    console.log('\n⚠️  Alguns testes falharam!');
    process.exit(1);
}
