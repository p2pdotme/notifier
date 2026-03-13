import {
    getOrderContext,
    pickTelegramCredentials,
    buildMerchantDisplay,
} from '../lib/common';
import { sendTelegramMessage } from '../../helpers/utils';
import { OrderConfig } from '../../helpers/types';
import { getEventsFromTransaction } from '../lib/utils';
import { logger } from '../../helpers/logger';

export const orderCompletedHandler = async (
    parsed: any,
    provider: any,
    config: OrderConfig
): Promise<boolean> => {
    if (!provider || !parsed?.args) {
        throw new Error('❌ OrderCompleted: missing provider or args');
    }

    try {
        const {
            orderId,
            merchant,
            currency,
            orderType,
            telegramId,
        } = await getOrderContext(parsed, provider, config);

        const display = buildMerchantDisplay(
            telegramId ? [String(telegramId)] : [],
            [String(merchant)]
        );

        let txEvents: any[] = [];
        try {
            txEvents = await getEventsFromTransaction(provider, parsed.transactionHash, config.diamondAddress);
        } catch (err) {
            logger.warn(`⚠️ OrderCompleted: getEventsFromTransaction failed: ${String(err)}`);
        }
        const hasOrderDispute = (txEvents || []).some((e: any) => e.name === 'OrderDispute');

        let msg = '';
        if (hasOrderDispute) {
            msg =
                currency === 'Brl'
                    ? `${display} Disputa resolvida para o Pedido ${orderId}. Pedido auto-concluído.`
                    : currency === 'Ars' || currency === 'Mex' || currency === 'Ven'
                        ? `${display} Disputa resuelta para la Orden ${orderId}. Orden auto-concluida.`
                        : `${display} Dispute resolved for Order ${orderId}. Order auto-completed`;
        } else {
            msg =
                currency === 'Brl'
                    ? `Pedido ${orderId} concluído por ${display}`
                    : currency === 'Ars' || currency === 'Mex' || currency === 'Ven'
                        ? `Orden ${orderId} completada por ${display}`
                        : `Order ${orderId} completed by ${display}`;
        }

        const { botToken, channelId, topicId } = pickTelegramCredentials(
            config,
            currency,
            orderType
        );

        if (!botToken || !channelId || !topicId) {
            throw new Error(`❌ OrderCompleted: missing telegram credentials for order ${orderId}`);
        }

        try {
            await sendTelegramMessage(botToken, channelId, topicId, msg);
            return true;
        } catch (err: any) {
            throw new Error(
                `❌ OrderCompleted: telegram send failed for order ${orderId}: ${String(
                    err?.message
                )}`
            );
        }
    } catch (err: any) {
        throw new Error(
            `❌ OrderCompleted handler error${parsed?.transactionHash ? ' tx=' + parsed.transactionHash : ''
            }: ${String(err?.message)}`
        );
    }
};
