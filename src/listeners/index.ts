import { getHttpProvider, getHttpUrl, getWsUrl, getWsProvider } from '../helpers/provider';
import { DIAMOND_ABI } from '../helpers/abi';
import { processLog } from './notifier';
import { Interface } from 'ethers';
import { logger } from '../helpers/logger';
import { OrderConfig } from '../helpers/types';
import { sendTelegramMessage } from '../helpers/utils';

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

    const setup = () => {
        const wsUrl = getWsUrl(config.alchemyApiKey);
        const wsProvider = getWsProvider(wsUrl);
        const iface = new Interface(DIAMOND_ABI);

        for (const eventName of events) {
            let topicHash: string;
            try {
                topicHash = iface.getEvent(eventName)!.topicHash;
            } catch {
                logger.warn(`⚠️ notifiers: no event fragment for ${eventName}, skipping`);
                continue;
            }

            // Use raw log subscription instead of contract.on() to avoid ethers v6 spreading
            // decoded args to the callback. When a complex struct (e.g. Order with strings/arrays)
            // has a deferred ABI decode error, ethers accesses result[N] while building the spread
            // call BEFORE the callback body runs — so our try-catch never fires and it becomes an
            // unhandledRejection. Raw log subscriptions receive the Log object directly with no
            // arg spreading, and we decode manually under our own error handling.
            wsProvider.on({ address: diamondAddress, topics: [topicHash] }, async (rawLog: any) => {
                try {
                    if (!rawLog || !rawLog.transactionHash) {
                        logger.warn(`❌ listener: unexpected log shape for ${eventName}`);
                        return;
                    }

                    // Try to decode args. A deferred decode error here is caught and args falls
                    // back to null. Handlers that need args re-decode via decodeEventArgs() which
                    // reads from log.topics + log.data.
                    let decodedArgs: any = null;
                    try {
                        const decoded = iface.parseLog(rawLog);
                        if (decoded) decodedArgs = decoded.args;
                    } catch (decodeErr) {
                        logger.warn(`⚠️ listener: parseLog failed for ${eventName}: ${String(decodeErr)}`);
                    }

                    const payload = { args: decodedArgs, log: rawLog };

                    logger.info(`📥 ${eventName}: received log`);
                    await processLog(eventName, payload, httpProvider, config);
                } catch (err: any) {
                    logger.error(
                        `❌ listener handler failed for event=${eventName}: ${String(err?.message ?? err)}`,
                    );
                }
            });
        }

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

            // remove raw log listeners for this provider
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
