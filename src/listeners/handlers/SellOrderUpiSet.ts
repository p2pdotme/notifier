import {
    pickTelegramCredentials,
    buildMerchantDisplay,
    getOrderContext,
} from '../lib/common';
import { currencyMap, sendTelegramMessage } from '../../helpers/utils';
import { sendNotification } from '../lib/utils';
import { OrderConfig } from '../../helpers/types';

export const sellOrderUpiSetHandler = async (
    parsed: any,
    provider: any,
    config: OrderConfig
): Promise<boolean> => {
    if (!provider || !parsed?.args) {
        throw new Error('❌ SellOrderUpiSet: missing provider or args');
    }

    try {
        const ctx = await getOrderContext(parsed, provider, config);
        const {
            orderId,
            merchant,
            currency,
            orderType,
            orderStatus,
            telegramId,
            fcmTokens,
        } = ctx;

        // push notification (if merchant has FCM tokens)
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

        const display = buildMerchantDisplay(
            telegramId ? [telegramId] : [],
            [String(merchant)]
        );

        let msg = '';
        switch (currency) {
            case 'Brl':
                msg = `${display} Agora você pode enviar ${currency} para o usuário pelo Pedido ${orderId}`;
                break;
            case 'Ars':
                msg = `${display} Ahora podés enviar Ars al usuario para la Orden ${orderId}`;
                break;
            case 'Mex':
                msg = `${display} Ahora podés enviar Mxn al usuario para la Orden ${orderId}`;
                break;
            case 'Ven':
                msg = `${display} Ahora podés enviar Ves al usuario para la Orden ${orderId}`;
                break;
            default:
                msg = `${display} You can now send ${currency} to user for Order ${orderId}`;
                break;
        }

        const { botToken, channelId, topicId } = pickTelegramCredentials(
            config,
            currency,
            orderType
        );

        if (!botToken || !channelId || !topicId) {
            throw new Error(`❌ SellOrderUpiSet: missing telegram credentials for order ${orderId}`);
        }

        try {
            await sendTelegramMessage(botToken, channelId, topicId, msg);
            return true;
        } catch (err: any) {
            throw new Error(
                `❌ SellOrderUpiSet: telegram send failed for order ${orderId}: ${String(
                    err?.message
                )}`
            );
        }
    } catch (err: any) {
        throw new Error(
            `❌ SellOrderUpiSet handler error${parsed?.transactionHash ? ' tx=' + parsed.transactionHash : ''
            }: ${String(err?.message)}`
        );
    }
};
