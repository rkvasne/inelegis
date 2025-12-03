/**
 * Analytics Dashboard API
 * Retorna estatísticas de uso do Inelegis
 * 
 * Deploy: Vercel Serverless Function
 * Database: Redis (via ioredis)
 * Acesso: Protegido por token
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

// Token de acesso
const ADMIN_TOKEN = process.env.ANALYTICS_ADMIN_TOKEN;

const ALLOWED_ORIGINS = [
    'https://inelegis.vercel.app',
    'http://localhost:3000',
    'http://localhost:8080'
];

function validateOrigin(origin) {
    return ALLOWED_ORIGINS.includes(origin) || process.env.NODE_ENV === 'development';
}

/**
 * Valida token de acesso
 */
function validateToken(req) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    return token === ADMIN_TOKEN;
}

/**
 * Obtém estatísticas gerais
 */
async function getGeneralStats() {
    const client = getRedis();
    
    const total = await client.get('analytics:total') || 0;
    const searches = await client.get('analytics:count:search') || 0;
    const errors = await client.get('analytics:count:error') || 0;
    const actions = await client.get('analytics:count:action') || 0;
    
    // Contar usuários únicos (aproximado)
    const searchKeys = await client.lrange('analytics:list:search', 0, 99);
    const uniqueUsers = new Set();
    
    for (const key of searchKeys) {
        const eventStr = await client.get(key);
        if (eventStr) {
            try {
                const event = JSON.parse(eventStr);
                if (event?.userId) {
                    uniqueUsers.add(event.userId);
                }
            } catch {}
        }
    }
    
    return {
        totalSearches: parseInt(searches) || 0,
        totalUsers: uniqueUsers.size,
        totalErrors: parseInt(errors) || 0,
        totalActions: parseInt(actions) || 0,
        total: parseInt(total) || 0,
        period: 'all_time'
    };
}

/**
 * Obtém buscas mais frequentes
 */
async function getTopSearches() {
    const client = getRedis();
    
    // Top artigos (sorted set com scores)
    const topArtigos = await client.zrevrange('analytics:top:artigos', 0, 9, 'WITHSCORES');
    
    const results = [];
    
    for (let i = 0; i < topArtigos.length; i += 2) {
        const [lei, artigo] = topArtigos[i].split(':');
        const count = topArtigos[i + 1];
        
        results.push({
            lei,
            artigo,
            count: parseInt(count) || 0
        });
    }
    
    return results;
}

/**
 * Obtém distribuição de resultados
 */
async function getResultDistribution() {
    const client = getRedis();
    
    const inelegivel = await client.get('analytics:resultado:inelegivel') || 0;
    const elegivel = await client.get('analytics:resultado:elegivel') || 0;
    
    return {
        inelegivel: parseInt(inelegivel) || 0,
        elegivel: parseInt(elegivel) || 0
    };
}

/**
 * Obtém erros recentes
 */
async function getRecentErrors() {
    const client = getRedis();
    
    const errorKeys = await client.lrange('analytics:list:error', 0, 9);
    const errors = [];
    
    for (const key of errorKeys) {
        const eventStr = await client.get(key);
        if (eventStr) {
            try {
                const event = JSON.parse(eventStr);
                errors.push({
                    timestamp: event.timestamp,
                    message: event.message,
                    lei: event.lei,
                    artigo: event.artigo
                });
            } catch {}
        }
    }
    
    return errors;
}

/**
 * Obtém buscas por período
 */
async function getSearchesByPeriod(days = 7) {
    const client = getRedis();
    
    const timeline = await client.hgetall('analytics:timeline') || {};
    const data = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        data.push({
            date: dateStr,
            searches: parseInt(timeline[dateStr]) || 0
        });
    }
    
    return data;
}

/**
 * Handler principal
 */
export default async function handler(req, res) {
    const origin = req.headers.origin;
    if (validateOrigin(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // Apenas GET
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    // Validar token
    if (!validateToken(req)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    try {
        const { type, days } = req.query;
        
        let data;
        
        switch (type) {
            case 'general':
                data = await getGeneralStats();
                break;
            case 'top-searches':
                data = await getTopSearches();
                break;
            case 'distribution':
                data = await getResultDistribution();
                break;
            case 'errors':
                data = await getRecentErrors();
                break;
            case 'timeline':
                data = await getSearchesByPeriod(parseInt(days) || 7);
                break;
            case 'all':
                data = {
                    general: await getGeneralStats(),
                    topSearches: await getTopSearches(),
                    distribution: await getResultDistribution(),
                    errors: await getRecentErrors(),
                    timeline: await getSearchesByPeriod(7)
                };
                break;
            default:
                return res.status(400).json({ error: 'Invalid type parameter' });
        }
        
        return res.status(200).json({
            success: true,
            data,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('❌ Erro ao buscar dashboard:', error);
        
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}
