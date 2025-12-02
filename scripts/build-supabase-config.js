/**
 * Build Supabase Config
 * Gera o arquivo de configuração do Supabase com as credenciais do .env.local
 * 
 * Uso: node scripts/build-supabase-config.js
 */

const fs = require('fs');
const path = require('path');

// Carregar .env.local
const envPath = path.join(__dirname, '../.env.local');
const envVars = {};

if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const match = line.match(/^([^#=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            let value = match[2].trim();
            // Remover aspas
            if ((value.startsWith('"') && value.endsWith('"')) ||
                (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }
            envVars[key] = value;
        }
    });
}

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL'] || '';
const supabaseAnonKey = envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY'] || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ ERRO: Variáveis do Supabase não encontradas no .env.local');
    console.log('   Adicione:');
    console.log('   NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co');
    console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...');
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
