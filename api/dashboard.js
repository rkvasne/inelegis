/**
 * Analytics Dashboard API
 * Retorna estatísticas de uso do Inelegis
 * 
 * Deploy: Vercel Serverless Function
 * Database: Vercel KV (Redis)
 * Acesso: Protegido por token
 */

import { kv } from '@vercel/kv';

// Token de acesso (em produção, usar variável de ambiente)
const ADMIN_TOKEN = process.env.ANALYTICS_ADMIN_TOKEN || 'dev_token_change_me';

/**
 * Valida token de acesso
 */
function validateToken(req) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    return token === ADMIN_TOKEN;
}

/**
 * Obtém estatísticas gerais do Redis
 */
async function getGeneralStats() {
    try {
        const total = await kv.get('analytics:total') || 0;
        const searches = await kv.get('analytics:count:search') || 0;
        const errors = await kv.get('analytics:count:error') || 0;
        const actions = await kv.get('analytics:count:action') || 0;
        
        // Contar usuários únicos (aproximado)
        const searchKeys = await kv.lrange('analytics:list:search', 0, 999);
        const uniqueUsers = new Set();
        
        for (const key of searchKeys.slice(0, 100)) {
            const event = await kv.get(key);
            if (event?.userId) {
                uniqueUsers.add(event.userId);
            }
        }
        
        return {
            totalSearches: searches,
            totalUsers: uniqueUsers.size,
            totalErrors: errors,
            totalActions: actions,
            total,
            period: 'all_time'
        };
    } catch (error) {
        console.error('Erro ao buscar stats gerais:', error);
        return {
            totalSearches: 0,
            totalUsers: 0,
            totalErrors: 0,
            total: 0
        };
    }
}

/**
 * Obtém buscas mais frequentes do Redis
 */
async function getTopSearches() {
    try {
        // Top artigos (sorted set com scores)
        const topArtigos = await kv.zrange('analytics:top:artigos', 0, 9, {
            rev: true,
            withScores: true
        });
        
        const results = [];
        
        for (let i = 0; i < topArtigos.length; i += 2) {
            const [lei, artigo] = topArtigos[i].split(':');
            const count = topArtigos[i + 1];
            
            results.push({
                lei,
                artigo,
                count: Math.round(count)
            });
        }
        
        return results;
    } catch (error) {
        console.error('Erro ao buscar top searches:', error);
        return [];
    }
}

/**
 * Obtém distribuição de resultados do Redis
 */
async function getResultDistribution() {
    try {
        const inelegivel = await kv.get('analytics:resultado:inelegivel') || 0;
        const elegivel = await kv.get('analytics:resultado:elegivel') || 0;
        
        return {
            inelegivel,
            elegivel
        };
    } catch (error) {
        console.error('Erro ao buscar distribuição:', error);
        return {
            inelegivel: 0,
            elegivel: 0
        };
    }
}

/**
 * Obtém erros recentes do Redis
 */
async function getRecentErrors() {
    try {
        const errorKeys = await kv.lrange('analytics:list:error', 0, 9);
        const errors = [];
        
        for (const key of errorKeys) {
            const event = await kv.get(key);
            if (event) {
                errors.push({
                    timestamp: event.timestamp,
                    message: event.message,
                    lei: event.lei,
                    artigo: event.artigo
                });
            }
        }
        
        return errors;
    } catch (error) {
        console.error('Erro ao buscar erros recentes:', error);
        return [];
    }
}

/**
 * Obtém buscas por período do Redis
 */
async function getSearchesByPeriod(days = 7) {
    try {
        const timeline = await kv.hgetall('analytics:timeline') || {};
        const data = [];
        const now = new Date();
        
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            data.push({
                date: dateStr,
                searches: timeline[dateStr] || 0
            });
        }
        
        return data;
    } catch (error) {
        console.error('Erro ao buscar timeline:', error);
        return [];
    }
}

/**
 * Handler principal
 */
export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
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
