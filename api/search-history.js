/**
 * Search History API Endpoint
 * Gerencia histórico de buscas no Redis
 * 
 * Deploy: Vercel Serverless Function
 * Database: Redis (via ioredis)
 */

import Redis from 'ioredis';

// Conectar ao Redis
let redis = null;

function getRedis() {
    if (!redis) {
        const redisUrl = process.env.REDIS_URL;
        if (!redisUrl) {
            throw new Error('REDIS_URL não configurada');
        }
        redis = new Redis(redisUrl);
    }
    return redis;
}

// Configuração
const MAX_HISTORY_PER_USER = parseInt(process.env.REDIS_MAX_HISTORY || '100', 10);
const HISTORY_TTL = parseInt(process.env.REDIS_HISTORY_TTL || String(60 * 60 * 24 * 365), 10);

const ALLOWED_ORIGINS = [
    'https://inelegis.vercel.app',
    'http://localhost:3000',
    'http://localhost:8080'
];

/**
 * Valida origem da requisição (CORS)
 */
function validateOrigin(origin) {
    return ALLOWED_ORIGINS.includes(origin) || process.env.NODE_ENV === 'development';
}

/**
 * Configura headers CORS
 */
function setCorsHeaders(res, origin) {
    if (validateOrigin(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

/**
 * Adiciona busca ao histórico do usuário
 */
async function addToHistory(userId, search) {
    const client = getRedis();
    const key = `history:${userId}`;
    const timestamp = Date.now();
    
    const entry = {
        ...search,
        timestamp: search.timestamp || new Date().toISOString(),
        id: `${timestamp}-${Math.random().toString(36).substr(2, 9)}`
    };
    
    // Adicionar ao início da lista
    await client.lpush(key, JSON.stringify(entry));
    
    // Limitar tamanho da lista
    await client.ltrim(key, 0, MAX_HISTORY_PER_USER - 1);
    
    // Definir TTL
    await client.expire(key, HISTORY_TTL);
    
    // Atualizar contadores globais
    await client.incr('history:total');
    await client.hincrby('history:stats:leis', search.lei, 1);
    await client.hincrby('history:stats:resultados', search.resultado, 1);
    
    return { success: true, entry };
}

/**
 * Obtém histórico do usuário
 */
async function getHistory(userId, limit = 50) {
    const client = getRedis();
    const key = `history:${userId}`;
    
    // Buscar lista do Redis
    const items = await client.lrange(key, 0, limit - 1);
    
    // Parse dos itens
    const history = items.map(item => {
        try {
            return JSON.parse(item);
        } catch {
            return null;
        }
    }).filter(Boolean);
    
    return history;
}

/**
 * Obtém estatísticas do histórico
 */
async function getStats(userId) {
    const history = await getHistory(userId, MAX_HISTORY_PER_USER);
    
    const stats = {
        total: history.length,
        inelegiveis: 0,
        elegiveis: 0,
        leisMaisConsultadas: {},
        artigosMaisConsultados: {}
    };
    
    history.forEach(search => {
        if (search.resultado === 'inelegivel') {
            stats.inelegiveis++;
        } else if (search.resultado === 'elegivel') {
            stats.elegiveis++;
        }
        
        stats.leisMaisConsultadas[search.lei] = 
            (stats.leisMaisConsultadas[search.lei] || 0) + 1;
        
        const key = `${search.lei} - Art. ${search.artigo}`;
        stats.artigosMaisConsultados[key] = 
            (stats.artigosMaisConsultados[key] || 0) + 1;
    });
    
    // Ordenar e limitar
    stats.leisMaisConsultadas = Object.entries(stats.leisMaisConsultadas)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
    
    stats.artigosMaisConsultados = Object.entries(stats.artigosMaisConsultados)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
    
    return stats;
}

/**
 * Handler principal
 */
export default async function handler(req, res) {
    const origin = req.headers.origin;
    setCorsHeaders(res, origin);
    
    // Preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    try {
        // GET - Obter histórico
        if (req.method === 'GET') {
            const { userId, limit, stats } = req.query;
            
            if (!userId) {
                return res.status(400).json({ error: 'userId is required' });
            }
            
            if (stats === 'true') {
                const statsData = await getStats(userId);
                return res.status(200).json({ success: true, stats: statsData });
            }
            
            const history = await getHistory(userId, parseInt(limit) || 50);
            return res.status(200).json({ success: true, history });
        }
        
        // POST - Adicionar ao histórico
        if (req.method === 'POST') {
            const { userId, search } = req.body;
            
            if (!userId || !search) {
                return res.status(400).json({ error: 'userId and search are required' });
            }
            
            if (!search.lei || !search.artigo || !search.resultado) {
                return res.status(400).json({ error: 'search must have lei, artigo, and resultado' });
            }
            
            const result = await addToHistory(userId, search);
            return res.status(200).json(result);
        }
        
        return res.status(405).json({ error: 'Method not allowed' });
        
    } catch (error) {
        console.error('❌ Erro na API de histórico:', error);
        return res.status(500).json({ 
            error: 'Internal server error',
            message: error.message 
        });
    }
}
