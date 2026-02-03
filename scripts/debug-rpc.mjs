
import 'dotenv/config';
import { supabaseClient } from '../src/js/services/supabase-client.js';

// Manually configuring because the module expects NEXT_PUBLIC_... environment variables
// preventing issues if dotenv doesn't auto-inject into the complex logic in supabase-client
if (!process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_URL) {
    process.env.NEXT_PUBLIC_SUPABASE_URL = process.env.SUPABASE_URL;
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && process.env.SUPABASE_ANON_KEY) {
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
}

// Re-evaluate configuration manually if needed, or rely on the import re-reading process.env
// effectively, we might need to overwrite the properties if they were initialized empty
supabaseClient.url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
supabaseClient.anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

console.log('Testing RPC verify_eligibility...');
console.log('URL:', supabaseClient.url ? 'Configured' : 'Missing');
console.log('Key:', supabaseClient.anonKey ? 'Configured' : 'Missing');

async function testRpc() {
    try {
        const params = {
            p_codigo_norma: 'CP',
            p_artigo: '121',
            p_paragrafo: null,
            p_inciso: null,
            p_alinea: null
        };

        console.log('Calling RPC with params:', params);
        const result = await supabaseClient.rpc('verificar_elegibilidade', params);
        console.log('Result:', JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('RPC Error:', error);
    }
}

testRpc();
