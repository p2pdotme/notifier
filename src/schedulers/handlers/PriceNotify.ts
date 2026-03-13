import { sendTelegramMessage } from '../../helpers/utils';
import { logger } from '../../helpers/logger';
import { PriceConfig } from '../../helpers/types';

export const priceNotifyHandler = async (
    parsed: any,
    _provider: any,
    config: PriceConfig
): Promise<boolean> => {
    if (!parsed || !parsed.currency || !parsed.message) {
        const msg = 'PriceNotify: missing parsed data';
        logger.warn(msg);
        throw new Error(msg);
    }

    const currency = String(parsed.currency);
    const message = String(parsed.message);

    const botToken = config[`telegram${currency}AlertsBotToken` as keyof PriceConfig];
    const channelId = config[`telegram${currency}PriceUpdatesChannelId` as keyof PriceConfig];
    const topicId = config[`telegram${currency}PriceUpdatesTopicId` as keyof PriceConfig];

    if (!botToken || !channelId || !topicId) {
        const msg = `PriceNotify: telegram config missing for ${currency}`;
        logger.warn(msg);
        throw new Error(msg);
    }

    try {
        await sendTelegramMessage(botToken, channelId, topicId, message);
        return true;
    } catch (err: any) {
        const base = `PriceNotify: error sending message for ${currency}`;
        const detail = err?.message ?? String(err);
        logger.error(`${base}:`, detail);
        throw new Error(`${base}: ${detail}`);
    }
};
