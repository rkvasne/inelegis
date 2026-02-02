/**
 * Analytics Dashboard API - Supabase Edition
 * Retorna estatísticas de uso do Inelegis
 * 
 * Deploy: Vercel Serverless Function
 * Database: Supabase (PostgreSQL)
 * Acesso: Protegido por token
 * @version 2.0.0
 */

import { createClient } from '@supabase/supabase-js';

// Conectar ao Supabase
let supabase = null;

function getSupabase() {
    if (!supabase) {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Variáveis do Supabase não configuradas');
        }

        supabase = createClient(supabaseUrl, supabaseKey);
    }
    return supabase;
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
    const client = getSupabase();

    const { data, error } = await client.rpc('get_dashboard_stats');

    if (error) throw new Error(error.message);

    const stats = data?.[0] || {
        total_searches: 0,
        total_users: 0,
        total_errors: 0,
        inelegiveis: 0,
        elegiveis: 0
    };

    return {
        totalSearches: stats.total_searches,
        totalUsers: stats.total_users,
        totalErrors: stats.total_errors,
        inelegiveis: stats.inelegiveis,
        elegiveis: stats.elegiveis,
        period: 'all_time'
    };
}

/**
 * Obtém buscas mais frequentes
 */
async function getTopSearches() {
    const client = getSupabase();

    const { data, error } = await client
        .from('analytics_top_artigos')
        .select('*')
        .limit(10);

    if (error) throw new Error(error.message);

    return data.map(item => ({
        lei: item.lei,
        artigo: item.artigo,
        count: item.count
    }));
}

/**
 * Obtém distribuição de resultados
 */
async function getResultDistribution() {
    const client = getSupabase();

    const { data, error } = await client
        .from('analytics_result_distribution')
        .select('*');

    if (error) throw new Error(error.message);

    const distribution = {
        inelegivel: 0,
        elegivel: 0
    };

    data.forEach(item => {
        if (item.resultado === 'inelegivel') distribution.inelegivel = item.count;
        if (item.resultado === 'elegivel') distribution.elegivel = item.count;
    });

    return distribution;
}

/**
 * Obtém erros recentes
 */
async function getRecentErrors() {
    const client = getSupabase();

    const { data, error } = await client
        .from('analytics_events')
        .select('timestamp, data, lei, artigo')
        .eq('type', 'error')
        .order('timestamp', { ascending: false })
        .limit(10);

    if (error) throw new Error(error.message);

    return data.map(item => ({
        timestamp: item.timestamp,
        message: item.data?.message || 'Unknown error',
        lei: item.lei,
        artigo: item.artigo
    }));
}

/**
 * Obtém buscas por período
 */
async function getSearchesByPeriod(days = 7) {
    const client = getSupabase();

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await client
        .from('analytics_events')
        .select('timestamp')
        .eq('type', 'search')
        .gte('timestamp', startDate.toISOString());

    if (error) throw new Error(error.message);

    // Agrupar por dia
    const byDay = {};
    data.forEach(item => {
        const date = new Date(item.timestamp).toISOString().split('T')[0];
        byDay[date] = (byDay[date] || 0) + 1;
    });

    // Preencher dias faltantes
    const result = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        result.push({
            date: dateStr,
            searches: byDay[dateStr] || 0
        });
    }

    return result;
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
