/**
 * Script para testar conexão com Redis
 * Uso: node scripts/test-redis.js
 */

require('dotenv').config({ path: '.env.local' });
const Redis = require('ioredis');

async function testConnection() {
    const redisUrl = process.env.REDIS_URL;
    
    if (!redisUrl) {
        console.error('❌ REDIS_URL não encontrada no .env.local');
        process.exit(1);
    }
    
    console.log('🔄 Conectando ao Redis...');
    console.log(`   URL: ${redisUrl.replace(/:[^:@]+@/, ':***@')}`);
    
    const redis = new Redis(redisUrl);
    
    try {
        // Testar conexão
        const pong = await redis.ping();
        console.log(`✅ Conexão OK! PING: ${pong}`);
        
        // Listar algumas keys
        const keys = await redis.keys('*');
        console.log(`\n📊 Keys no banco: ${keys.length}`);
        
        if (keys.length > 0) {
            console.log('\n🔑 Primeiras 10 keys:');
            keys.slice(0, 10).forEach(key => console.log(`   - ${key}`));
            
            // Mostrar contadores se existirem
            const total = await redis.get('analytics:total');
            const searches = await redis.get('analytics:count:search');
            
            if (total || searches) {
                console.log('\n📈 Estatísticas:');
                console.log(`   Total de eventos: ${total || 0}`);
                console.log(`   Total de buscas: ${searches || 0}`);
            }
        } else {
            console.log('\n⚠️  Banco vazio - nenhum dado ainda');
        }
        
        await redis.quit();
        console.log('\n✅ Teste concluído com sucesso!');
        
    } catch (error) {
        console.error('❌ Erro ao conectar:', error.message);
        process.exit(1);
    }
}

testConnection();
