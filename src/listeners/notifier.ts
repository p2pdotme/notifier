import { sendOnFail } from '../helpers/utils';
import { addNotificationJob } from '../queue';
import { logger } from '../helpers/logger';
import { OrderConfig } from '../helpers/types';

const seen = new Map<string, number>();
const DEDUP_TTL_MS = 60_000;

function isDuplicate(key: string): boolean {
    const now = Date.now();
    if (seen.has(key)) return true;
    seen.set(key, now);
    // Prune expired entries to keep the map small
    for (const [k, ts] of seen) {
        if (now - ts > DEDUP_TTL_MS) seen.delete(k);
    }
    return false;
}

// main processor
export async function processLog(eventName: string, payload: any, provider: any, config: OrderConfig) {
    if (!payload) return;

    const txHash = payload.transactionHash ?? payload.log?.transactionHash;
    if (!txHash) return;

    const logIndex = payload.log?.index ?? payload.log?.logIndex ?? '';
    const dedupKey = `${eventName}:${txHash}:${logIndex}`;
    if (isDuplicate(dedupKey)) {
        logger.info(`⏭️ Skipping duplicate ${eventName} tx=${txHash}`);
        return;
    }

    logger.info(`⏩ Processing event: ${eventName} tx=${txHash}`);

    const parsed = {
        args: payload.args,
        transactionHash: txHash,
        name: eventName,
        log: payload.log ?? payload
    };

    try {
        await addNotificationJob(eventName, parsed, config);
        logger.info(`✅ Enqueued job for ${eventName} tx=${txHash}`);
    } catch (err: any) {
        logger.error(`❌ Failed to enqueue job: ${eventName} tx=${txHash}: ${String(err.message)}`);
        await sendOnFail(config, `❌ Queue error for ${eventName} - tx ${txHash}: ${String(err.message)}`);
    }
}
