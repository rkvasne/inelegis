#!/usr/bin/env node

/**
 * Gerador de Token de Admin para Analytics Dashboard
 * 
 * Gera um token seguro para configurar o Redis/Analytics.
 * NÃO cria ou modifica nenhum arquivo.
 * Apenas exibe o token para você copiar e configurar manualmente.
 * 
 * Uso: npm run generate-token
 */

const crypto = require('crypto');

/**
 * Gera token seguro usando crypto
 * Formato: inelegis_admin_YYYY_[64 caracteres hex]
 */
function generateSecureToken() {
    const prefix = 'inelegis_admin';
    const year = new Date().getFullYear();
    const randomBytes = crypto.randomBytes(32).toString('hex');

    return `${prefix}_${year}_${randomBytes}`;
}

/**
 * Main
 */
function main() {
    console.log('');
    console.log('═'.repeat(70));
    console.log('🔐 GERADOR DE TOKEN - INELEGIS ANALYTICS');
    console.log('═'.repeat(70));
    console.log('');

    // Gerar token
    const token = generateSecureToken();

    console.log('✅ Token gerado com sucesso!');
    console.log('');
    console.log('┌' + '─'.repeat(68) + '┐');
    console.log('│ ' + token.padEnd(66) + ' │');
    console.log('└' + '─'.repeat(68) + '┘');
    console.log('');
    console.log('📊 Informações:');
    console.log('   • Comprimento: ' + token.length + ' caracteres');
    console.log('   • Entropia: 256 bits');
    console.log('   • Algoritmo: crypto.randomBytes(32)');
    console.log('');
    console.log('═'.repeat(70));
    console.log('📝 COMO CONFIGURAR');
    console.log('═'.repeat(70));
    console.log('');
    console.log('🌐 VERCEL (Produção):');
    console.log('   1. Acesse: https://vercel.com/dashboard');
    console.log('   2. Selecione o projeto: inelegis-app');
    console.log('   3. Vá em: Settings → Environment Variables');
    console.log('   4. Clique em: Add New');
    console.log('   5. Name: ANALYTICS_ADMIN_TOKEN');
    console.log('   6. Value: ' + token);
    console.log('   7. Environment: Production, Preview, Development');
    console.log('   8. Clique em: Save');
    console.log('');
    console.log('💻 DESENVOLVIMENTO LOCAL (.env.local):');
    console.log('   1. Crie o arquivo: .env.local');
    console.log('   2. Adicione a linha:');
    console.log('      ANALYTICS_ADMIN_TOKEN=' + token);
    console.log('   3. Salve o arquivo');
    console.log('   4. Execute: npm run dev');
    console.log('');
    console.log('═'.repeat(70));
    console.log('🔒 SEGURANÇA');
    console.log('═'.repeat(70));
    console.log('');
    console.log('   ⚠️  NUNCA commite este token no git');
    console.log('   ⚠️  Guarde em local seguro (gerenciador de senhas)');
    console.log('   ⚠️  Rotacione periodicamente (a cada 3-6 meses)');
    console.log('   ⚠️  Não compartilhe por email ou chat');
    console.log('');
    console.log('═'.repeat(70));
    console.log('📚 DOCUMENTAÇÃO');
    console.log('═'.repeat(70));
    console.log('');
    console.log('   • Setup Redis: docs/SETUP-REDIS.md');
    console.log('   • Variáveis: docs/VARIAVEIS-AMBIENTE.md');
    console.log('   • Analytics: docs/ANALYTICS.md');
    console.log('');
}

main();
