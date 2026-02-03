/**
 * Build Supabase Config
 * Gera o arquivo de configuração do Supabase com as credenciais do .env.local
 * 
 * Uso: node scripts/build-supabase-config.js
 */

const fs = require('fs');
const path = require('path');

// Tentar carregar dotenv se disponível
try {
    require('dotenv').config({ path: path.join(__dirname, '../.env.local') });
} catch (e) {
    // Silencioso se não houver dotenv (pode estar em CI)
}

// 1. Pegar das variáveis de ambiente (carregadas via dotenv ou setadas no OS/Vercel)
let supabaseUrl = process.env['NEXT_PUBLIC_SUPABASE_URL'];
let supabaseAnonKey = process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

// Fallback: parser manual simplificado se dotenv falhou/não existia e variáveis estão vazias
if (!supabaseUrl || !supabaseAnonKey) {
    const envPath = path.join(__dirname, '../.env.local');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        envContent.split(/\r?\n/).forEach(line => {
            const trimmedLine = line.trim();
            if (!trimmedLine || trimmedLine.startsWith('#')) return;

            const [key, ...valueParts] = trimmedLine.split('=');
            const value = valueParts.join('=').trim().replace(/^["'](.*)["']$/, '$1');

            if (key.trim() === 'NEXT_PUBLIC_SUPABASE_URL') supabaseUrl = value;
            if (key.trim() === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') supabaseAnonKey = value;
        });
    }
}

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ ERRO: Variáveis do Supabase não encontradas no .env.local ou no ambiente.');
    console.log('   Siga os seguintes passos:');
    console.log('   1. Verifique se o arquivo .env.local existe na raiz do projeto.');
    console.log('   2. Certifique-se que ele contém as seguintes chaves:');
    console.log('      NEXT_PUBLIC_SUPABASE_URL=seu_url');
    console.log('      NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key');
    console.log('   3. Se estiver em CI/CD, configure as Secret Variables correspondentes.');
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

const outputPath = path.join(__dirname, '../public/assets/js/supabase-config.js');
fs.writeFileSync(outputPath, configContent);

console.log('✅ Supabase config gerado:', outputPath);
console.log('   URL:', supabaseUrl);
console.log('   Key:', supabaseAnonKey.substring(0, 20) + '...');
