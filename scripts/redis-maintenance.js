const Redis = require('ioredis');
const fs = require('fs');
const path = require('path');

const ENV_CANDIDATES = ['.env.local', '.env'];
for (const candidate of ENV_CANDIDATES) {
    const envPath = path.resolve(process.cwd(), candidate);
    if (fs.existsSync(envPath)) {
        require('dotenv').config({ path: envPath });
        break;
    }
}

const DEFAULT_RETENTION_DAYS = parseInt(process.env.REDIS_RETENTION_DAYS || '30', 10);
const DEFAULT_MAX_HISTORY = parseInt(process.env.REDIS_MAX_HISTORY || '100', 10);
const DEFAULT_HISTORY_TTL_SECONDS = parseInt(process.env.REDIS_HISTORY_TTL || String(60 * 60 * 24 * 365), 10);
const DEFAULT_METRICS_TTL_DAYS = parseInt(process.env.REDIS_METRICS_TTL_DAYS || '120', 10);
const WEEKLY_METRICS_KEY = process.env.REDIS_WEEKLY_METRICS_KEY || 'history:metrics:weekly';

function requireRedisUrl(customUrl) {
    const redisUrl = customUrl || process.env.REDIS_URL;
    if (!redisUrl) {
        throw new Error('REDIS_URL não configurada. Configure no .env ou passe via parâmetro.');
    }
    return redisUrl;
}

async function scanKeys(client, pattern) {
    let cursor = '0';
    const keys = [];

    do {
        const [nextCursor, batch] = await client.scan(cursor, 'MATCH', pattern, 'COUNT', 200);
        cursor = nextCursor;
        keys.push(...batch);
    } while (cursor !== '0');

    return keys;
}

function parseInfoValue(info, label) {
    const match = info.match(new RegExp(`${label}:(.+)`));
    return match ? match[1].trim() : null;
}

async function collectMemoryStats(client) {
    const memoryInfo = await client.info('memory');
    const usedMemoryBytes = Number(parseInfoValue(memoryInfo, 'used_memory')) || 0;

    return {
        usedMemoryBytes,
        usedMemoryHuman: parseInfoValue(memoryInfo, 'used_memory_human') || `${(usedMemoryBytes / (1024 * 1024)).toFixed(2)}M`,
        peakMemoryHuman: parseInfoValue(memoryInfo, 'used_memory_peak_human') || 'n/a',
        fragmentationRatio: parseFloat(parseInfoValue(memoryInfo, 'mem_fragmentation_ratio')) || 0,
        dbsize: await client.dbsize()
    };
}

function formatWeekId(date) {
    const utcDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    const dayNum = utcDate.getUTCDay() || 7;
    utcDate.setUTCDate(utcDate.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(((utcDate - yearStart) / 86400000 + 1) / 7);
    return `${utcDate.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

async function storeWeeklyMetrics(client, metricsKey, metrics, metricsTtlDays) {
    const now = new Date();
    const weekId = formatWeekId(now);
    const payload = {
        weekId,
        recordedAt: now.toISOString(),
        ...metrics
    };

    await client.hset(metricsKey, weekId, JSON.stringify(payload));
    if (metricsTtlDays > 0) {
        await client.expire(metricsKey, metricsTtlDays * 24 * 60 * 60);
    }

    return { weekId, metricsKey };
}

async function cleanupHistoryLists(client, options) {
    const { retentionDays, maxHistory, ttlSeconds } = options;
    const retentionMs = retentionDays * 24 * 60 * 60 * 1000;
    const cutoffTimestamp = Date.now() - retentionMs;

    const keys = await scanKeys(client, 'history:*');
    const summary = {
        keysProcessed: keys.length,
        entriesScanned: 0,
        entriesRemoved: 0,
        keysPruned: 0,
        expiredKeys: 0
    };

    for (const key of keys) {
        const entries = await client.lrange(key, 0, -1);
        if (!entries.length) {
            await client.del(key);
            summary.expiredKeys++;
            continue;
        }

        const filtered = [];
        let changed = false;

        for (const rawEntry of entries) {
            summary.entriesScanned++;
            let keep = true;

            try {
                const parsed = JSON.parse(rawEntry);
                if (parsed?.timestamp) {
                    const entryTime = new Date(parsed.timestamp).getTime();
                    if (Number.isFinite(entryTime) && entryTime < cutoffTimestamp) {
                        keep = false;
                    }
                }
            } catch (error) {
                // Entradas inválidas são descartadas
                keep = false;
            }

            if (keep) {
                filtered.push(rawEntry);
            } else {
                changed = true;
                summary.entriesRemoved++;
            }
        }

        if (filtered.length > maxHistory) {
            summary.entriesRemoved += filtered.length - maxHistory;
            filtered.splice(maxHistory);
            changed = true;
        }

        if (filtered.length === 0) {
            await client.del(key);
            summary.expiredKeys++;
            continue;
        }

        if (changed) {
            summary.keysPruned++;
            const pipeline = client.multi();
            pipeline.del(key);
            pipeline.rpush(key, ...filtered);
            pipeline.expire(key, ttlSeconds);
            await pipeline.exec();
        } else {
            await client.expire(key, ttlSeconds);
        }
    }

    return summary;
}

async function runMaintenance(customOptions = {}) {
    const redisUrl = requireRedisUrl(customOptions.redisUrl);
    const client = new Redis(redisUrl);

    const options = {
        retentionDays: customOptions.retentionDays || DEFAULT_RETENTION_DAYS,
        maxHistory: customOptions.maxHistory || DEFAULT_MAX_HISTORY,
        ttlSeconds: customOptions.ttlSeconds || DEFAULT_HISTORY_TTL_SECONDS,
        metricsTtlDays: customOptions.metricsTtlDays || DEFAULT_METRICS_TTL_DAYS,
        metricsKey: customOptions.metricsKey || WEEKLY_METRICS_KEY
    };

    try {
        const cleanupSummary = await cleanupHistoryLists(client, options);
        const memoryStats = await collectMemoryStats(client);
        const { weekId, metricsKey } = await storeWeeklyMetrics(
            client,
            options.metricsKey,
            { ...cleanupSummary, ...memoryStats },
            options.metricsTtlDays
        );

        return {
            ...cleanupSummary,
            memory: memoryStats,
            metricsKey,
            weekId
        };
    } finally {
        await client.quit();
    }
}

if (require.main === module) {
    runMaintenance()
        .then(result => {
            console.log('🧹 Redis maintenance concluída com sucesso');
            console.table({
                keysProcessados: result.keysProcessed,
                entradasRemovidas: result.entriesRemoved,
                memoria: result.memory.usedMemoryHuman,
                semana: result.weekId
            });
            process.exit(0);
        })
        .catch(error => {
            console.error('❌ Falha na manutenção do Redis:', error.message);
            process.exit(1);
        });
}

module.exports = { runMaintenance };
