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

    const ok = await sendTelegramMessage(botToken, channelId, topicId, message);
    if (!ok) {
        throw new Error(`PriceNotify: failed to send Telegram message for ${currency}`);
    }
    return true;
};
