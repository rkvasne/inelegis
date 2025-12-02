/**
 * Script de correção de tema
 * Execute este script no console do navegador para diagnosticar e corrigir problemas de tema
 */

console.log('🔧 Iniciando diagnóstico de tema...');

// 1. Verificar localStorage
const savedTheme = localStorage.getItem('inelegis_theme');
console.log('📋 Tema salvo no localStorage:', savedTheme);

// 2. Verificar classe no HTML
const html = document.documentElement;
const hasDarkClass = html.classList.contains('dark-theme');
console.log('🎨 Classe dark-theme no <html>:', hasDarkClass);

// 3. Verificar preferência do sistema
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
console.log('🖥️ Sistema prefere dark:', systemPrefersDark);

// 4. Verificar botão de tema
const themeButton = document.getElementById('themeToggle');
console.log('🔘 Botão de tema encontrado:', !!themeButton);

// 5. Verificar se ThemeManager existe
console.log('📦 ThemeManager disponível:', typeof ThemeManager !== 'undefined');

// 6. Diagnóstico
console.log('\n📊 DIAGNÓSTICO:');
if (savedTheme === 'dark' && !hasDarkClass) {
    console.error('❌ PROBLEMA: Tema dark salvo mas classe não aplicada!');
    console.log('💡 SOLUÇÃO: Aplicando classe dark-theme...');
    html.classList.add('dark-theme');
    console.log('✅ Classe aplicada! Verifique se o tema mudou.');
} else if (savedTheme === 'light' && hasDarkClass) {
    console.error('❌ PROBLEMA: Tema light salvo mas classe dark aplicada!');
    console.log('💡 SOLUÇÃO: Removendo classe dark-theme...');
    html.classList.remove('dark-theme');
    console.log('✅ Classe removida! Verifique se o tema mudou.');
} else if (!savedTheme && systemPrefersDark && !hasDarkClass) {
    console.warn('⚠️ Sistema prefere dark mas tema não aplicado');
    console.log('💡 SOLUÇÃO: Aplicando tema dark...');
    html.classList.add('dark-theme');
    localStorage.setItem('inelegis_theme', 'dark');
    console.log('✅ Tema dark aplicado!');
} else if (!savedTheme && !systemPrefersDark && hasDarkClass) {
    console.warn('⚠️ Sistema prefere light mas tema dark aplicado');
    console.log('💡 SOLUÇÃO: Removendo tema dark...');
    html.classList.remove('dark-theme');
    localStorage.setItem('inelegis_theme', 'light');
    console.log('✅ Tema light aplicado!');
} else {
    console.log('✅ Tema está correto!');
    console.log('   Tema atual:', hasDarkClass ? 'Dark' : 'Light');
}

// 7. Testar botão
if (themeButton) {
    console.log('\n🧪 TESTE DO BOTÃO:');
    console.log('Clique no botão de tema para testar a alternância.');
    
    // Adicionar listener temporário para debug
    const testListener = () => {
        setTimeout(() => {
            const newHasDark = html.classList.contains('dark-theme');
            const newSaved = localStorage.getItem('inelegis_theme');
            console.log('🔄 Após clique:');
            console.log('   Classe dark-theme:', newHasDark);
            console.log('   localStorage:', newSaved);
            console.log('   Status:', newHasDark === (newSaved === 'dark') ? '✅ OK' : '❌ ERRO');
        }, 200);
    };
    
    themeButton.addEventListener('click', testListener, { once: true });
} else {
    console.error('❌ Botão de tema não encontrado!');
    console.log('💡 Verifique se o Components.init() foi chamado.');
}

console.log('\n📝 COMANDOS ÚTEIS:');
console.log('Forçar tema light: localStorage.setItem("inelegis_theme", "light"); location.reload();');
console.log('Forçar tema dark: localStorage.setItem("inelegis_theme", "dark"); location.reload();');
console.log('Limpar tema: localStorage.removeItem("inelegis_theme"); location.reload();');
