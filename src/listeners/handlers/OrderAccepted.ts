import {
    getOrderContext,
    pickTelegramCredentials,
    buildMerchantDisplay,
} from '../lib/common';
import { sendTelegramMessage } from '../../helpers/utils';
import { OrderConfig } from '../../helpers/types';

export const orderAcceptedHandler = async (
    parsed: any,
    provider: any,
    config: OrderConfig
): Promise<boolean> => {
    if (!provider || !parsed?.args) {
        throw new Error('❌ OrderAccepted: missing provider or args');
    }

    try {
        const {
            orderId,
            merchant,
            currency,
            orderType,
            telegramId,
        } = await getOrderContext(parsed, provider, config, {
            // prefer event.merchant if present
            merchantFromEventKey: 'merchant',
        });

        const display = buildMerchantDisplay(
            telegramId ? [String(telegramId)] : [],
            [String(merchant)]
        );

        const msg =
            currency === 'Brl'
                ? `Pedido ${orderId} aceito por ${display}`
                : currency === 'Ars' || currency === 'Mex' || currency === 'Ven'
                ? `Orden ${orderId} aceptada por ${display}`
                : `Order ${orderId} accepted by ${display}`;

        const { botToken, channelId, topicId } = pickTelegramCredentials(
            config,
            currency,
            orderType
        );

        try {
            await sendTelegramMessage(botToken, channelId, topicId, msg);
            return true;
        } catch (err: any) {
            throw new Error(
                `❌ OrderAccepted: telegram send failed for order ${orderId}: ${String(
                    err?.message ?? err
                )}`
            );
        }
    } catch (err: any) {
        throw new Error(
            `❌ OrderAccepted handler error${
                parsed?.transactionHash ? ' tx=' + parsed.transactionHash : ''
            }: ${err?.message ?? String(err)}`
        );
    }
};
