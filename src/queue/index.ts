import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import { OrderConfig, PriceConfig } from '../helpers/types';

// Use REDIS_URL for local (e.g. redis://localhost:6379); set REDIS_URL=redis://redis:6379 in Docker/Akash
const REDIS_URL = process.env.REDIS_URL ?? 'redis://redis:6379';

export const connection = new IORedis(REDIS_URL, {
    maxRetriesPerRequest: null,
    retryStrategy(times) {
        return Math.min(times * 2000, 10000); // retry every 2–10s
    },
});

// helper to deep-convert BigInt / BigNumber -> string so bullmq can serialize job data
function normalizeForQueue(value: any, seen = new WeakSet()): any {
    if (value === null || value === undefined) return value;
    if (typeof value === 'bigint') return value.toString();
    if (value && typeof value === 'object' && seen.has(value)) return undefined; // break circular
    if (value && typeof value === 'object') {
        if ((value as any).isBigNumber || (value as any)._isBigNumber === true && typeof (value as any).toString === 'function') {
            return value.toString();
        }
        seen.add(value);
        if (Array.isArray(value)) {
            // Use index loop instead of .map() so a deferred ABI decode error on one element
            // (e.g. ethers v6 Result with a lazy-decode failure) doesn't abort the whole array.
            const arr: any[] = [];
            for (let i = 0; i < value.length; i++) {
                try {
                    arr.push(normalizeForQueue((value as any)[i], seen));
                } catch {
                    arr.push(null);
                }
            }
            return arr;
        }
        const out: any = {};
        for (const k in value) {
            try {
                out[k] = normalizeForQueue((value as any)[k], seen);
            } catch {
                // String(value[k]) could also throw if value[k] is a deferred-error Result element
                try {
                    out[k] = String((value as any)[k]);
                } catch {
                    out[k] = null;
                }
            }
        }
        return out;
    }
    return value;
}

export const notificationQueue = new Queue('notifications', {
    connection,
    defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: { count: 100 },
        attempts: 3,
        backoff: { type: 'exponential', delay: 1000 },
    },
});

// convenience wrapper used by notifier to enqueue safely
export async function addNotificationJob(eventName: string, parsed: any, config: OrderConfig | PriceConfig) {
    const safeParsed = normalizeForQueue(parsed);
    await notificationQueue.add(eventName, {
        eventName,
        parsed: safeParsed,
        config,
    }, {
        jobId: `${eventName}-${safeParsed?.currency ?? Date.now()}`,
    });
}
