/**
 * Analytics API Endpoint
 * Recebe e armazena dados de uso do Inelegis
 * 
 * Deploy: Vercel Serverless Function
 * Database: Vercel KV (Redis)
 */

import { createClient } from '@vercel/kv';

// Conectar ao Redis usando REDIS_URL
const kv = createClient({
    url: process.env.REDIS_URL || process.env.KV_REST_API_URL,
    token: process.env.REDIS_TOKEN || process.env.KV_REST_API_TOKEN
});

// Configuração
const ALLOWED_ORIGINS = [
    'https://inelegis.vercel.app',
    'http://localhost:3000',
    'http://localhost:8080'
];

/**
 * Valida origem da requisição (CORS)
 */
function validateOrigin(origin) {
    return ALLOWED_ORIGINS.includes(origin) || 
           origin?.includes('inelegis') ||
           process.env.NODE_ENV === 'development';
}

/**
 * Valida estrutura do evento
 */
function validateEvent(event) {
    if (!event.type || !event.userId || !event.timestamp) {
        return false;
    }
    
    if (!['search', 'error', 'action'].includes(event.type)) {
        return false;
    }
    
    return true;
}

/**
 * Processa evento de busca
 */
function processSearchEvent(event) {
    return {
        type: 'search',
        userId: event.userId,
        timestamp: event.timestamp,
        lei: event.data.lei,
        artigo: event.data.artigo,
        resultado: event.data.resultado,
        temExcecao: event.data.temExcecao,
        tempoResposta: event.data.tempoResposta,
        browser: event.browser?.userAgent || 'unknown',
        version: event.version
    };
}

/**
 * Processa evento de erro
 */
function processErrorEvent(event) {
    return {
        type: 'error',
        userId: event.userId,
        timestamp: event.timestamp,
        message: event.data.message,
        stack: event.data.stack?.substring(0, 500), // Limitar tamanho
        lei: event.data.lei,
        artigo: event.data.artigo,
        browser: event.browser?.userAgent || 'unknown',
        version: event.version
    };
}

/**
 * Processa evento de ação
 */
function processActionEvent(event) {
    return {
        type: 'action',
        userId: event.userId,
        timestamp: event.timestamp,
        action: event.data.action,
        data: event.data,
        browser: event.browser?.userAgent || 'unknown',
        version: event.version
    };
}

/**
 * Salva eventos no Redis (Vercel KV)
 */
async function saveEvents(events) {
    try {
        const timestamp = Date.now();
        let saved = 0;
        
        for (const event of events) {
            const key = `analytics:${event.type}:${timestamp}:${saved}`;
            
            // Salvar evento individual
            await kv.set(key, event, { ex: 60 * 60 * 24 * 90 }); // 90 dias
            
            // Adicionar à lista por tipo
            await kv.lpush(`analytics:list:${event.type}`, key);
            
            // Limitar tamanho da lista (manter últimos 10000)
            await kv.ltrim(`analytics:list:${event.type}`, 0, 9999);
            
            // Incrementar contadores
            await kv.incr('analytics:total');
            await kv.incr(`analytics:count:${event.type}`);
            
            // Contadores por lei (para buscas)
            if (event.type === 'search') {
                await kv.zincrby('analytics:top:leis', 1, event.lei);
                await kv.zincrby('analytics:top:artigos', 1, `${event.lei}:${event.artigo}`);
                await kv.incr(`analytics:resultado:${event.resultado}`);
            }
            
            // Adicionar à timeline (por dia)
            const date = new Date(event.timestamp).toISOString().split('T')[0];
            await kv.hincrby('analytics:timeline', date, 1);
            
            saved++;
        }
        
        console.log(`✅ Salvos ${saved} eventos no Redis`);
        
        return {
            success: true,
            saved
        };
        
    } catch (error) {
        console.error('❌ Erro ao salvar no Redis:', error);
        throw error;
    }
}

/**
 * Handler principal
 */
export default async function handler(req, res) {
    // CORS
    const origin = req.headers.origin;
    
    if (validateOrigin(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // Apenas POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const { events, timestamp } = req.body;
        
        // Validar
        if (!Array.isArray(events) || events.length === 0) {
            return res.status(400).json({ error: 'Invalid events array' });
        }
        
        // Processar eventos
        const processedEvents = [];
        
        for (const event of events) {
            if (!validateEvent(event)) {
                console.warn('⚠️ Evento inválido:', event);
                continue;
            }
            
            let processed;
            
            switch (event.type) {
                case 'search':
                    processed = processSearchEvent(event);
                    break;
                case 'error':
                    processed = processErrorEvent(event);
                    break;
                case 'action':
                    processed = processActionEvent(event);
                    break;
                default:
                    continue;
            }
            
            processedEvents.push(processed);
        }
        
        // Salvar
        const result = await saveEvents(processedEvents);
        
        // Responder
        return res.status(200).json({
            success: true,
            received: events.length,
            processed: processedEvents.length,
            saved: result.saved,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('❌ Erro ao processar analytics:', error);
        
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}
