import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { Contract } from 'ethers';
import { fetchAndPost } from './lib/common';
import { PriceConfig } from '../helpers/types';
import { logger } from '../helpers/logger';
import { withTimeout } from '../helpers/provider';

const CURRENCIES = ['Inr', 'Idr', 'Brl', 'Ars', 'Mex', 'Ven'] as const;
const EVERY_HOUR_MS = 60 * 60 * 1000; // 1 hour

const PRICE_QUEUE_NAME = 'price-schedulers';

const redisUrl = process.env.REDIS_URL ?? 'redis://redis:6379';
const connection = new IORedis(redisUrl, {
    maxRetriesPerRequest: null,
});

let priceQueue: Queue<any> | undefined;
let workerStarted = false;

function initPriceQueue(): Queue<any> {
    if (!priceQueue) {
        priceQueue = new Queue<any>(PRICE_QUEUE_NAME, {
            connection,
            defaultJobOptions: {
                removeOnComplete: true,
                attempts: 3,
                backoff: { type: 'exponential', delay: 1000 },
            },
        });
        logger.info(`queue: ${PRICE_QUEUE_NAME} initialised`);
    }
    return priceQueue;
}

function startPriceWorker(diamond: Contract, config: PriceConfig) {
    if (workerStarted) return;
    workerStarted = true;

    const worker = new Worker(
        PRICE_QUEUE_NAME,
        async (job) => {
            const currency = job.data.currency as (typeof CURRENCIES)[number];

            try {
                logger.info(
                    `price-scheduler-worker: processing currency=${currency} jobId=${job.id}`,
                );

                const ok = await withTimeout(fetchAndPost(diamond, currency, config));
                if (!ok) {
                    logger.warn(
                        `price-scheduler-worker: fetchAndPost returned false for ${currency}`,
                    );
                }
            } catch (err: any) {
                logger.error(
                    `❌ price-scheduler-worker: error for currency=${currency} jobId=${job.id}: ${String(
                        err?.message ?? err,
                    )}`,
                );
                throw err;
            }
        },
        {
            connection,
            concurrency: 1,
            lockDuration: 120_000,
        },
    );

    worker.on('error', (err) =>
        logger.error(`❌ price-scheduler-worker: worker error: ${err?.message}`),
    );

    worker.on('completed', (job) =>
        logger.info(
            `✅ price-scheduler-worker: completed jobId=${job.id} ${job.name}`,
        ),
    );

    worker.on('failed', (job, err) =>
        logger.warn(
            `❌ price-scheduler-worker: failed jobId=${job?.id} ${job?.name}: ${err?.message}`,
        ),
    );

    logger.info('price-scheduler-worker: started');
}

export async function processPriceSchedulers(diamond: Contract, config: PriceConfig) {
    logger.info(`price schedulers starting for ${CURRENCIES.join(', ')}`);

    const queue = initPriceQueue();
    startPriceWorker(diamond, config);

    // register repeatable jobs first — must complete before app is considered started
    for (const currency of CURRENCIES) {
        await queue.add(
            'PriceUpdate',
            { currency },
            {
                jobId: `price-${currency}`,
                repeat: { every: EVERY_HOUR_MS },
            },
        );
    }
    logger.info('price schedulers registered (BullMQ repeat every 1h for each currency)');

    // run once at startup (best-effort)
    for (const currency of CURRENCIES) {
        try {
            await fetchAndPost(diamond, currency, config);
        } catch (err: any) {
            logger.warn(
                `❌ price scheduler: initial fetch failed ${currency}: ${String(err?.message ?? err)}`,
            );
        }
    }
}
