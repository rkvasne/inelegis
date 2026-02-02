/**
 * Testes para Components
 * @version 0.3.0
 */

console.log('🧪 Iniciando testes dos Componentes...\n');

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

function assertContains(str, substring, message) {
    if (!str.includes(substring)) {
        throw new Error(message || `String "${str}" não contém "${substring}"`);
    }
}

// Funções simuladas dos componentes
function renderHeader(currentPage = '') {
    return `<header class="system-header">
        <div class="system-brand">
            <h1>Inelegis</h1>
        </div>
        <button id="themeToggle" class="theme-toggle">
            <svg class="sun-icon"></svg>
            <svg class="moon-icon"></svg>
        </button>
    </header>`;
}

function renderNav(currentPage = '') {
    const pages = [
        { id: 'index', href: './', label: 'Início' },
        { id: 'consulta', href: 'consulta', label: 'Consulta' },
        { id: 'sobre', href: 'sobre', label: 'Sobre' },
        { id: 'faq', href: 'faq', label: 'FAQ' }
    ];

    const navLinks = pages.map(page => {
        const isActive = currentPage === page.id;
        const activeClass = isActive ? ' active' : '';
        return `<a href="${page.href}" class="nav-link${activeClass}">${page.label}</a>`;
    }).join('');

    return `<nav class="nav">${navLinks}</nav>`;
}

function renderFooter() {
    const currentYear = new Date().getFullYear();
    return `<footer class="footer">© ${currentYear} Inelegis</footer>`;
}

function renderCard({ title, subtitle, content, icon, className = '' }) {
    return `<div class="card ${className}">
        ${title ? `<div class="card-header"><h2>${title}</h2>${subtitle ? `<p>${subtitle}</p>` : ''}</div>` : ''}
        ${content ? `<div class="card-body">${content}</div>` : ''}
    </div>`;
}

function renderButton({ text, type = 'primary', icon, disabled = false }) {
    const buttonClass = `btn btn-${type}`;
    const disabledAttr = disabled ? ' disabled' : '';
    return `<button class="${buttonClass}"${disabledAttr}>${text}</button>`;
}

function renderAlert({ type = 'info', title, message }) {
    return `<div class="alert alert-${type}">
        ${title ? `<strong>${title}</strong>` : ''}
        ${message ? `<p>${message}</p>` : ''}
    </div>`;
}

// Testes do Header
test('Header deve conter o título Inelegis', () => {
    const header = renderHeader();
    assertContains(header, 'Inelegis');
});

test('Header deve conter botão de tema', () => {
    const header = renderHeader();
    assertContains(header, 'themeToggle');
    assertContains(header, 'theme-toggle');
});

test('Header deve conter ícones de sol e lua', () => {
    const header = renderHeader();
    assertContains(header, 'sun-icon');
    assertContains(header, 'moon-icon');
});

// Testes da Navegação
test('Nav deve conter link para Início', () => {
    const nav = renderNav();
    assertContains(nav, 'Início');
});

test('Nav deve conter link para Consulta', () => {
    const nav = renderNav();
    assertContains(nav, 'Consulta');
});

test('Nav deve conter link para Sobre', () => {
    const nav = renderNav();
    assertContains(nav, 'Sobre');
});

test('Nav deve conter link para FAQ', () => {
    const nav = renderNav();
    assertContains(nav, 'FAQ');
});

test('Nav deve marcar página ativa corretamente', () => {
    const nav = renderNav('consulta');
    assertContains(nav, 'class="nav-link active">Consulta');
});

test('Nav não deve marcar outras páginas como ativas', () => {
    const nav = renderNav('consulta');
    assert(!nav.includes('class="nav-link active">Início'), 'Início não deve estar ativo');
});

// Testes do Footer
test('Footer deve conter o ano atual', () => {
    const footer = renderFooter();
    const currentYear = new Date().getFullYear();
    assertContains(footer, currentYear.toString());
});

test('Footer deve conter o nome Inelegis', () => {
    const footer = renderFooter();
    assertContains(footer, 'Inelegis');
});

// Testes do Card
test('Card deve renderizar título quando fornecido', () => {
    const card = renderCard({ title: 'Teste' });
    assertContains(card, 'Teste');
    assertContains(card, 'card-header');
});

test('Card deve renderizar subtítulo quando fornecido', () => {
    const card = renderCard({ title: 'Título', subtitle: 'Subtítulo' });
    assertContains(card, 'Subtítulo');
});

test('Card deve renderizar conteúdo quando fornecido', () => {
    const card = renderCard({ content: 'Conteúdo do card' });
    assertContains(card, 'Conteúdo do card');
    assertContains(card, 'card-body');
});

test('Card deve aplicar classe customizada', () => {
    const card = renderCard({ title: 'Teste', className: 'custom-class' });
    assertContains(card, 'custom-class');
});

// Testes do Button
test('Button deve renderizar texto', () => {
    const button = renderButton({ text: 'Clique aqui' });
    assertContains(button, 'Clique aqui');
});

test('Button deve aplicar tipo correto', () => {
    const button = renderButton({ text: 'Teste', type: 'secondary' });
    assertContains(button, 'btn-secondary');
});

test('Button deve aplicar tipo primary por padrão', () => {
    const button = renderButton({ text: 'Teste' });
    assertContains(button, 'btn-primary');
});

test('Button deve aplicar atributo disabled quando necessário', () => {
    const button = renderButton({ text: 'Teste', disabled: true });
    assertContains(button, 'disabled');
});

test('Button não deve ter disabled quando não especificado', () => {
    const button = renderButton({ text: 'Teste' });
    assert(!button.includes('disabled'), 'Button não deve ter disabled');
});

// Testes do Alert
test('Alert deve renderizar título quando fornecido', () => {
    const alert = renderAlert({ title: 'Atenção' });
    assertContains(alert, 'Atenção');
});

test('Alert deve renderizar mensagem quando fornecida', () => {
    const alert = renderAlert({ message: 'Mensagem de teste' });
    assertContains(alert, 'Mensagem de teste');
});

test('Alert deve aplicar tipo correto', () => {
    const alert = renderAlert({ type: 'warning', message: 'Aviso' });
    assertContains(alert, 'alert-warning');
});

test('Alert deve usar tipo info por padrão', () => {
    const alert = renderAlert({ message: 'Info' });
    assertContains(alert, 'alert-info');
});

// Testes de integração
test('Componentes devem ser combinados corretamente', () => {
    const header = renderHeader('index');
    const nav = renderNav('index');
    const footer = renderFooter();
    
    assert(header.length > 0, 'Header deve ter conteúdo');
    assert(nav.length > 0, 'Nav deve ter conteúdo');
    assert(footer.length > 0, 'Footer deve ter conteúdo');
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
