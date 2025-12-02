import maintenanceModule from '../scripts/redis-maintenance.js';

const { runMaintenance } = maintenanceModule;
const CRON_SECRET = process.env.CRON_SECRET;

function getAuthToken(req) {
    const headerToken = req.headers['x-cron-secret'] || req.headers['x-api-key'];
    const bearerToken = req.headers.authorization?.replace('Bearer ', '');
    return req.query.token || headerToken || bearerToken;
}

export default async function handler(req, res) {
    if (req.method !== 'GET' && req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (CRON_SECRET) {
        const token = getAuthToken(req);
        if (token !== CRON_SECRET) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    }

    try {
        const result = await runMaintenance();
        return res.status(200).json({ success: true, ...result });
    } catch (error) {
        console.error('❌ Erro na manutenção do Redis:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
}
