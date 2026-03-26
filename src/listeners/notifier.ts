import { sendOnFail } from '../helpers/utils';
import { addNotificationJob } from '../queue';
import { logger } from '../helpers/logger';
import { OrderConfig } from '../helpers/types';

// main processor
export async function processLog(eventName: string, payload: any, provider: any, config: OrderConfig) {
    if (!payload) return;

    const txHash = payload.transactionHash ?? payload.log?.transactionHash;
    if (!txHash) return;

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
