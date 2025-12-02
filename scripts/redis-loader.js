require('dotenv').config();
const fs = require('fs');
const path = require('path');
const Redis = require('ioredis');

const DATA_PATH = path.join(__dirname, '../src/data/legal-database.json');

// Configuração Redis
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

async function loadData() {
    console.log('🔌 Conectando ao Redis...');
    const redis = new Redis(REDIS_URL);

    try {
        console.log('📖 Lendo base de dados...');
        const raw = fs.readFileSync(DATA_PATH, 'utf8');
        const db = JSON.parse(raw);
        const data = db.data; // Array de grupos

        console.log(`📊 Processando ${data.length} grupos de normas...`);

        const pipeline = redis.pipeline();

        // 1. Limpar dados antigos (opcional, mas recomendado para reload total)
        // Cuidado em produção! Aqui vamos deletar chaves padrão 'ineleg:norma:*'
        // Mas o scan pode ser lento. Se for base pequena, ok. 
        // Vamos apenas sobrescrever chaves.

        let totalArtigos = 0;

        // 2. Iterar e criar comandos
        data.forEach(grupo => {
            const lei = grupo.codigo;

            const artigos = grupo.estruturado && grupo.estruturado.artigos ? grupo.estruturado.artigos : [];

            artigos.forEach(artigo => {
                const key = `ineleg:norma:${lei}:${artigo.toLowerCase().trim()}`;

                // Payload
                const payload = {
                    lei: lei,
                    artigo: artigo,
                    crime: grupo.crime,
                    norma_original: grupo.norma,
                    excecoes: JSON.stringify(grupo.excecoes || []) // Redis Hash values must be strings
                };

                pipeline.hset(key, payload);
                totalArtigos++;
            });
        });

        // 3. Metadata
        pipeline.set('ineleg:metadata:updated_at', new Date().toISOString());
        pipeline.set('ineleg:metadata:total_articles', totalArtigos);

        console.log(`📤 Enviando ${totalArtigos} artigos para o Redis...`);

        await pipeline.exec();

        console.log('✅ Carga completa com sucesso!');

    } catch (err) {
        console.error('❌ Erro no Loader:', err);
    } finally {
        redis.disconnect();
        console.log('🔌 Desconectado.');
    }
}

loadData();
