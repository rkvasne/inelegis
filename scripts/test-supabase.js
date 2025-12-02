/**
 * Test Supabase Connection
 * Verifica se a conexão com Supabase está funcionando
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
            if ((value.startsWith('"') && value.endsWith('"')) ||
                (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }
            envVars[key] = value;
        }
    });
}

const SUPABASE_URL = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const SUPABASE_KEY = envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

console.log('🔍 Testando conexão com Supabase...\n');
console.log('URL:', SUPABASE_URL);
console.log('Key:', SUPABASE_KEY ? SUPABASE_KEY.substring(0, 30) + '...' : '❌ NÃO CONFIGURADA');

if (!SUPABASE_URL || !SUPABASE_KEY || SUPABASE_URL.includes('seu-projeto')) {
    console.log('\n❌ ERRO: Variáveis do Supabase não estão configuradas corretamente no .env.local');
    console.log('   Edite o arquivo e preencha com suas credenciais reais.');
    process.exit(1);
}

async function testConnection() {
    try {
        // Testar listando as normas
        const response = await fetch(`${SUPABASE_URL}/rest/v1/normas?select=codigo,nome_curto&limit=5`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`HTTP ${response.status}: ${error}`);
        }

        const data = await response.json();

        console.log('\n✅ CONEXÃO SUPABASE OK!');
        console.log('\n📊 Normas encontradas:', data.length);

        if (data.length > 0) {
            console.log('\n📋 Primeiras normas:');
            data.forEach(n => console.log(`   - ${n.codigo}: ${n.nome_curto}`));
        } else {
            console.log('\n⚠️  Nenhuma norma encontrada. Verifique se as migrations 002-005 foram executadas.');
        }

        // Testar tabela historico_consultas
        console.log('\n🔍 Verificando tabela historico_consultas...');
        const histResponse = await fetch(`${SUPABASE_URL}/rest/v1/historico_consultas?select=id&limit=1`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });

        if (histResponse.ok) {
            console.log('✅ Tabela historico_consultas existe!');
        } else {
            console.log('⚠️  Tabela historico_consultas não encontrada. Execute a migration 006.');
        }

        // Testar função RPC
        console.log('\n🔍 Testando função verificar_elegibilidade...');
        const rpcResponse = await fetch(`${SUPABASE_URL}/rest/v1/rpc/verificar_elegibilidade`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                p_codigo_norma: 'CP',
                p_artigo: '121'
            })
        });

        if (rpcResponse.ok) {
            const result = await rpcResponse.json();
            console.log('✅ Função RPC funcionando!');
            if (result.length > 0) {
                console.log('   Resultado teste (CP Art. 121):', result[0].resultado);
            }
        } else {
            const err = await rpcResponse.text();
            console.log('⚠️  Função RPC não encontrada:', err.substring(0, 100));
        }

        console.log('\n🎉 TESTES CONCLUÍDOS!');

    } catch (error) {
        console.error('\n❌ ERRO na conexão:', error.message);
        process.exit(1);
    }
}

testConnection();
