import {
    pickTelegramCredentials,
    buildMerchantDisplay,
    getOrderContext,
} from '../lib/common';
import { sendTelegramMessage } from '../../helpers/utils';
import { OrderConfig } from '../../helpers/types';
import { logger } from '../../helpers/logger';

export const orderDisputeHandler = async (
    parsed: any,
    provider: any,
    config: OrderConfig
): Promise<boolean> => {
    if (!provider || !parsed?.args) {
        throw new Error('❌ OrderDispute: missing provider or args');
    }

    try {
        // shared context: diamond, order, ids, merchant, currency, etc.
        const ctx = await getOrderContext(parsed, provider, config);
        const { order, orderId, merchant, currency, orderType, telegramId } = ctx;

        const disputeStatus = Number(order.disputeInfo.status);
        const display = buildMerchantDisplay(
            telegramId ? [telegramId] : [],
            [String(merchant)]
        );

        logger.info(`🔍 OrderDispute: disputeStatus=${disputeStatus} for orderId= ${orderId}`);

        let msg = '';
        if (disputeStatus === 2) {
            if (currency === "Brl") {
                msg = `${display} Disputa resolvida para o Pedido ${orderId}`;
            } else if (currency === "Ars" || currency === "Mex" || currency === "Ven") {
                msg = `${display} Disputa resuelta para la Orden ${orderId}`;
            } else {
                msg = `${display} Dispute resolved for Order ${orderId}`;
            }
        } else {
            if (currency === "Brl") {
                msg = `${display} Disputa levantada para o Pedido ${orderId} pelo usuário`;
            } else if (currency === "Ars" || currency === "Mex" || currency === "Ven") {
                msg = `${display} Disputa abierta para la Orden ${orderId} por el usuario`;
            } else {
                msg = `${display} Dispute raised for Order ${orderId} by user`;
            }
        }

        // dispute uses a special topic override
        const topicOverride =
            config[`telegram${currency}DisputeTopicId` as keyof OrderConfig] as string | undefined;

        const { botToken, channelId, topicId } = pickTelegramCredentials(
            config,
            currency,
            orderType,
            topicOverride
        );

        if (!botToken || !channelId || !topicId) {
            throw new Error(`❌ OrderDispute: missing telegram credentials for order ${orderId}`);
        }

        try {
            await sendTelegramMessage(botToken, channelId, topicId, msg);
            return true;
        } catch (err: any) {
            throw new Error(
                `❌ OrderDispute: telegram send failed for order ${orderId}: ${String(
                    err?.message
                )}`
            );
        }
    } catch (err: any) {
        throw new Error(
            `❌ OrderDispute handler error${parsed?.transactionHash ? ' tx=' + parsed.transactionHash : ''
            }: ${String(err?.message)}`
        );
    }
};
