/**
 * Search History API Endpoint - Supabase Edition
 * Gerencia histórico de buscas no Supabase
 * 
 * Deploy: Vercel Serverless Function
 * Database: Supabase (PostgreSQL)
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

// Configuração
const MAX_HISTORY_PER_USER = 100;

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
    const client = getSupabase();

    const { data, error } = await client
        .from('historico_consultas')
        .insert({
            user_id: userId,
            lei: search.lei,
            artigo: search.artigo,
            resultado: search.resultado,
            tipo_crime: search.tipoCrime || null,
            observacoes: search.observacoes || null
        })
        .select()
        .single();

    if (error) {
        throw new Error(`Supabase insert error: ${error.message}`);
    }

    return { success: true, entry: data };
}

/**
 * Obtém histórico do usuário
 */
async function getHistory(userId, limit = 50) {
    const client = getSupabase();

    const { data, error } = await client
        .from('historico_consultas')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(limit);

    if (error) {
        throw new Error(`Supabase query error: ${error.message}`);
    }

    // Mapear para formato do frontend
    return data.map(item => ({
        lei: item.lei,
        artigo: item.artigo,
        resultado: item.resultado,
        timestamp: item.timestamp,
        tipoCrime: item.tipo_crime,
        observacoes: item.observacoes
    }));
}

/**
 * Obtém estatísticas do histórico
 */
async function getStats(userId) {
    const client = getSupabase();

    // Usar RPC para estatísticas
    const { data, error } = await client
        .rpc('get_user_stats', { p_user_id: userId });

    if (error) {
        throw new Error(`Supabase stats error: ${error.message}`);
    }

    if (data && data.length > 0) {
        const stats = data[0];
        return {
            total: stats.total,
            inelegiveis: stats.inelegiveis,
            elegiveis: stats.elegiveis,
            naoConsta: stats.nao_consta,
            primeiraConsulta: stats.primeira_consulta,
            ultimaConsulta: stats.ultima_consulta
        };
    }

    return {
        total: 0,
        inelegiveis: 0,
        elegiveis: 0,
        naoConsta: 0
    };
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
