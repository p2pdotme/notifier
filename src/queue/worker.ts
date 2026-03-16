import { Worker } from 'bullmq';
import { handlers } from './handlers';
import { sendOnFail } from '../helpers/utils';
import { getHttpProvider, getHttpUrl, withTimeout } from '../helpers/provider';
import { connection, notificationQueue as queue } from './index';
import { logger } from '../helpers/logger';
import { CommonConfig } from '../helpers/types';

const QUEUE_NAME = 'notifications';
const LOCK_DURATION_MS = 60_000;            // 1 minute — BullMQ lock TTL
const LOCK_RENEW_TIME_MS = 15_000;          // renew lock every 15s
const HANDLER_TIMEOUT_MS = 45_000;          // 45s hard deadline — handlers only do 3-4 RPC calls + one TG send (which has its own 30s timeout)
const STUCK_MS = LOCK_DURATION_MS + 15_000; // watchdog threshold: lock expired + 15s grace
const WATCHDOG_PAGE_SIZE = 100;
const WATCHDOG_INTERVAL_MS = 15 * 1000; // 15s

export function startWorker(config: CommonConfig) {
    // create a default provider once per worker
    const defaultProvider = config?.alchemyApiKey
        ? getHttpProvider(getHttpUrl(config.alchemyApiKey))
        : null;

    const worker = new Worker(
        QUEUE_NAME,
        async (job) => {
            const { eventName, parsed, config } = job.data;
            const jobId = job.id;
            const tx = parsed?.transactionHash;
            const handler = handlers[eventName];
            if (!handler) {
                await sendOnFail(config, `No handler registered for event: ${eventName}`);
                return;
            }

            // choose provider: prefer defaultProvider, fallback to config.alchemyApiKey if provided and different
            let provider = defaultProvider;
            if (!provider && config?.alchemyApiKey) {
                provider = getHttpProvider(getHttpUrl(config.alchemyApiKey));
            }

            const isLastAttempt = job.attemptsMade >= (job.opts?.attempts ?? 1) - 1;

            const txLabel = tx ? ` tx=${tx}` : '';
            try {
                logger.info(`⏩ processing job id=${jobId} handler=${eventName}${txLabel}`);
                const ok = await withTimeout(handler(parsed, provider, config), HANDLER_TIMEOUT_MS);
                if (!ok) {
                    // handler returned false = job completes (no retry), so always alert immediately
                    await sendOnFail(
                        config,
                        `Handler returned false: ${eventName}${txLabel}`
                    );
                } else {
                    logger.info(`✅ handler ok id=${jobId} event=${eventName}${txLabel}`);
                }
            } catch (err: any) {
                const reason = err?.stack ?? err?.message;
                logger.error(`❌ Worker error id=${jobId} event=${eventName}${txLabel}:`, reason);
                if (isLastAttempt) {
                    await sendOnFail(config, `Worker error\nEvent: ${eventName}${tx ? `\nTx: ${tx}` : ''}\n\n${reason}`);
                }
                throw err;
            }
        },
        {
            connection,
            concurrency: 3,
            lockDuration: LOCK_DURATION_MS,
            lockRenewTime: LOCK_RENEW_TIME_MS,
        }
    );

    worker.on('error', (err) => logger.error(`❌ Worker error: ${String(err)}`));
    worker.on('completed', (job) => logger.info(`✅ job completed: ${job.id}`));
    worker.on('failed', (job, err) => logger.warn(`❌ job failed: ${job?.id}: ${String(err)}`));

    logger.info('worker started');

    // watchdog: fail stuck active jobs (paginated)
    const watchdog = setInterval(async () => {
        try {
            let start = 0;
            while (true) {
                const end = start + WATCHDOG_PAGE_SIZE - 1;
                const activeJobs = await queue.getJobs(['active'], start, end);
                if (!activeJobs || activeJobs.length === 0) break;

                const now = Date.now();
                for (const j of activeJobs) {
                    const processedOn = (j as any).processedOn ?? j.timestamp;
                    if (!processedOn) continue;

                    if (now - processedOn > STUCK_MS) {
                        logger.warn(
                            `⚠️ watchdog: job ${j.id} stuck for ${now - processedOn}ms — failing it`
                        );
                        try {
                            await (j as any).moveToFailed({ message: 'watchdog: job stuck' }, false);
                        } catch (err: any) {
                            const msg = String(err?.message);
                            if (msg.includes('Missing lock')) {
                                // harmless race condition → downgrade to debug
                                logger.debug(`watchdog: lock already gone for job ${j.id} (safe to ignore)`);
                            } else {
                                logger.warn(`⚠️ watchdog: moveToFailed failed: ${msg}`);
                            }
                        }
                    }
                }

                if (activeJobs.length < WATCHDOG_PAGE_SIZE) break;
                start += WATCHDOG_PAGE_SIZE;
            }
        } catch (err) {
            logger.warn(`❌ watchdog: error scanning jobs: ${String(err)}`);
        }
    }, WATCHDOG_INTERVAL_MS);

    const stop = async () => {
        clearInterval(watchdog);
        try { await worker.close(); } catch { }
        try { await queue.close(); } catch { }
    };
    process.on('SIGINT', stop);
    process.on('SIGTERM', stop);
}
