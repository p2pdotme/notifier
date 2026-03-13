import {
    getOrderContext,
    pickTelegramCredentials,
    buildMerchantDisplay,
} from '../lib/common';
import { sendTelegramMessage } from '../../helpers/utils';
import { sendNotification } from '../lib/utils';
import { OrderConfig } from '../../helpers/types';

export const buyOrderPaidHandler = async (
    parsed: any,
    provider: any,
    config: OrderConfig
): Promise<boolean> => {
    try {
        const {
            orderId,
            merchant,
            currency,
            orderType,
            orderStatus,
            telegramId,
            fcmTokens,
        } = await getOrderContext(parsed, provider, config);

        // push notification (shared logic)
        if (Array.isArray(fcmTokens) && fcmTokens.length) {
            await sendNotification(
                fcmTokens,
                merchant,
                orderId,
                currency,
                config.pushNotifXSecretKey,
                orderStatus,
                orderType,
                config.pushNotifBaseUrl,
                config.pushNotifImageUrl,
                config.pushNotifLandingUrl,
            );
        }

        // human display
        const display = buildMerchantDisplay(
            telegramId ? [telegramId] : [],
            [String(merchant)]
        );

        const msg =
            currency === 'Brl'
                ? `${display} Usuário pagou pelo Pedido ${orderId}`
                : currency === 'Ars' || currency === 'Mex' || currency === 'Ven'
                    ? `${display} El usuario pagó la Orden ${orderId}`
                    : `${display} User paid for Order ${orderId}`;

        const { botToken, channelId, topicId } = pickTelegramCredentials(
            config,
            currency,
            orderType
        );

        if (!botToken || !channelId || !topicId) {
            throw new Error(`❌ BuyOrderPaid: missing telegram credentials for order ${orderId}`);
        }

        try {
            await sendTelegramMessage(botToken, channelId, topicId, msg);
            return true;
        } catch (err: any) {
            throw new Error(
                `❌ BuyOrderPaid: telegram send failed for order ${orderId}: ${String(
                    err?.message
                )}`
            );
        }
    } catch (err: any) {
        throw new Error(
            `❌ BuyOrderPaid handler error${parsed?.transactionHash ? ' tx=' + parsed.transactionHash : ''}: ${String(err?.message)}`
        );
    }
};
