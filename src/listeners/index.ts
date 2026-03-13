import { getHttpProvider, getHttpUrl, getWsUrl, getWsProvider } from '../helpers/provider';
import { DIAMOND_ABI } from '../helpers/abi';
import { processLog } from './notifier';
import { Contract } from 'ethers';
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
        const contract = new Contract(diamondAddress, DIAMOND_ABI, wsProvider);

        for (const eventName of events) {
            contract.on(eventName, async (...args: any[]) => {
                const payload = args[args.length - 1];

                try {
                    if (!payload || typeof payload !== 'object') {
                        logger.warn(`❌ listener: unexpected payload shape: ${eventName}`);
                        return;
                    }

                    logger.info(`📥 ${eventName}: received log`);
                    await processLog(eventName, payload, httpProvider, config);
                } catch (err: any) {
                    logger.error(
                        `❌ listener handler failed for event=${eventName}: ${String(
                            err?.message ?? err,
                        )}`,
                    );
                    if (err?.errors) {
                        logger.error(`❌ inner errors: ${String(err.errors)}`);
                    }
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

            // remove contract listeners for this provider
            contract.removeAllListeners();

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
