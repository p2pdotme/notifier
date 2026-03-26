import { getHttpProvider, getHttpUrl, getWsUrl, getWsProvider } from '../helpers/provider';
import { DIAMOND_ABI } from '../helpers/abi';
import { processLog } from './notifier';
import { Interface } from 'ethers';
import { logger } from '../helpers/logger';
import { OrderConfig } from '../helpers/types';
import { sendTelegramMessage } from '../helpers/utils';

const iface = new Interface(DIAMOND_ABI);

export async function startListeners(config: OrderConfig) {
    const httpUrl = getHttpUrl(config.alchemyApiKey);
    const httpProvider = getHttpProvider(httpUrl);
    const diamondAddress = config.diamondAddress;

    // hoisted above setup() so recursive calls don't reset it
    let reconnectScheduled = false;

    const events = [
        'OrderPlaced',
        'MerchantsReAssigned',
        'OrderAccepted',
        'BuyOrderPaid',
        'SellOrderUpiSet',
        'OrderCompleted',
        'OrderCancelledBy',
        'OrderDispute',
        'OnlineOfflineToggled',
    ];

    // Pre-compute topic hashes for each event and build a reverse lookup
    const topicToEvent: Record<string, string> = {};
    const topicHashes: string[] = [];
    for (const eventName of events) {
        const eventFragment = iface.getEvent(eventName);
        if (eventFragment) {
            const topicHash = eventFragment.topicHash;
            topicToEvent[topicHash] = eventName;
            topicHashes.push(topicHash);
        }
    }

    const setup = () => {
        const wsUrl = getWsUrl(config.alchemyApiKey);
        const wsProvider = getWsProvider(wsUrl);

        // Listen for raw logs instead of using contract.on() to avoid
        // ethers.js v6 spreading decoded args which throws deferred errors
        // when complex structs (Order, MerchantDetails) can't be fully decoded.
        const filter = {
            address: diamondAddress,
            topics: [topicHashes],
        };

        wsProvider.on(filter, async (log: any) => {
            const topic0 = log.topics?.[0];
            const eventName = topic0 ? topicToEvent[topic0] : undefined;
            if (!eventName) return;

            try {
                // Decode the log ourselves with proper error handling
                let decoded: any;
                try {
                    decoded = iface.parseLog({
                        topics: log.topics,
                        data: log.data,
                    });
                } catch (err: any) {
                    logger.warn(
                        `⚠️ listener: failed to decode ${eventName}: ${String(err.message)}`
                    );
                    return;
                }

                if (!decoded) {
                    logger.warn(`⚠️ listener: null decode for ${eventName}`);
                    return;
                }

                // Safely extract args to avoid deferred errors during
                // JSON serialization (BullMQ). Access each index in a try/catch.
                const safeArgs: Record<string, any> = {};
                for (let i = 0; i < decoded.fragment.inputs.length; i++) {
                    const name = decoded.fragment.inputs[i].name;
                    try {
                        safeArgs[i] = decoded.args[i];
                        if (name) safeArgs[name] = decoded.args[i];
                    } catch (err: any) {
                        logger.warn(
                            `⚠️ listener: deferred error for ${eventName} arg[${i}] (${name}): ${String(err.message)}`
                        );
                        safeArgs[i] = null;
                        if (name) safeArgs[name] = null;
                    }
                }

                const payload = {
                    args: safeArgs,
                    log,
                    transactionHash: log.transactionHash,
                };

                logger.info(`📥 ${eventName}: received log`);
                await processLog(eventName, payload, httpProvider, config);
            } catch (err: any) {
                logger.error(
                    `❌ listener handler failed for event=${eventName}: ${String(
                        err?.message ?? err,
                    )}`,
                );
            }
        });

        logger.info(`✅ listeners attached for diamond: ${diamondAddress}`);

        // notify on startup / reconnect
        void sendTelegramMessage(
            config.telegramOnFailBotToken,
            config.telegramOnFailChannelId,
            config.telegramOnFailTopicId,
            '✅ WS connected: notifiers listeners attached',
        ).catch(() => {});

        // low-level ws handle for reconnect
        const ws: any =
            (wsProvider as any)._websocket ??
            (wsProvider as any).websocket ??
            (wsProvider as any)._ws ??
            null;

        if (!ws) {
            logger.warn(
                '⚠️ notifiers: ws handle not found; reconnect hooks not attached',
            );
            return;
        }

        const scheduleReconnect = (reason: string) => {
            if (reconnectScheduled) return;
            reconnectScheduled = true;

            const msg = `⚠️ notifiers WS issue: ${reason}. Reconnecting in 5s...`;
            logger.error(msg);

            void sendTelegramMessage(
                config.telegramOnFailBotToken,
                config.telegramOnFailChannelId,
                config.telegramOnFailTopicId,
                msg,
            ).catch(() => {});

            // remove all listeners for this provider
            wsProvider.removeAllListeners();

            // minimal cleanup: close old ws + destroy provider
            try {
                if (typeof ws.close === 'function') {
                    ws.close();
                }
            } catch (e) {
                logger.warn(`notifiers: error closing ws: ${String(e)}`);
            }

            try {
                // ethers WebSocketProvider usually has destroy()
                (wsProvider as any).destroy?.();
            } catch (e) {
                logger.warn(`notifiers: error destroying wsProvider: ${String(e)}`);
            }

            setTimeout(() => {
                logger.info('notifiers: reconnecting WS listeners');
                reconnectScheduled = false;
                setup();
            }, 5_000);
        };

        ws.onclose = (evt: any) => {
            const reason = `closed code=${evt?.code} reason=${evt?.reason ?? ''}`;
            scheduleReconnect(reason);
        };

        ws.onerror = (err: any) => {
            const reason = `error=${String(err?.message ?? err)}`;
            scheduleReconnect(reason);
        };
    };

    // initial attach
    setup();
}
