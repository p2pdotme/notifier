import {
    createDiamondContract,
    resolveOrderFromEventOrChain,
    pickTelegramCredentials,
    buildMerchantDisplay,
    collectAssignmentRecipients,
} from '../lib/common';
import { currencyMap, sendTelegramMessage } from '../../helpers/utils';
import { getEventsFromTransaction } from '../lib/utils';
import { logger } from '../../helpers/logger';
import { OrderConfig } from '../../helpers/types';

export const orderPlacedHandler = async (
    parsed: any,
    provider: any,
    config: OrderConfig
): Promise<boolean> => {
    if (!provider || !parsed?.args) {
        throw new Error('❌ OrderPlaced: missing provider or args');
    }

    const diamond = createDiamondContract(provider, config.diamondAddress);

    try {
        const order = await resolveOrderFromEventOrChain(parsed, diamond);
        if (!order) throw new Error('❌ OrderPlaced: cannot resolve order');

        const orderId = String(order.id);
        const currency = currencyMap[String(order.currency)];
        const orderType = Number(order.orderType);
        const orderStatus = Number(order.status);

        const txEvents = await getEventsFromTransaction(
            provider,
            parsed.transactionHash,
            config.diamondAddress
        );

        const { telegramIds, merchantsSeen } = await collectAssignmentRecipients(
            diamond,
            txEvents,
            config,
            orderId,
            currency,
            orderStatus,
            orderType,
            ['MerchantAssignedNewOrder', 'MerchantReAssignedNewOrder']
        );

        if (!telegramIds.length && !merchantsSeen.length) {
            logger.warn(
                `⚠️ OrderPlaced: no MerchantAssignedNewOrder/MerchantReAssignedNewOrder in tx: ${parsed.transactionHash}`
            );
            return true;
        }

        const display = buildMerchantDisplay(telegramIds, merchantsSeen);
        const msg =
            currency === 'Brl'
                ? `Pedido ${orderId} atribuído a ${display}`
                : currency === 'Ars' || currency === 'Mex' || currency === 'Ven'
                    ? `Orden ${orderId} asignada a ${display}`
                    : `Order ${orderId} assigned to ${display}`;

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
                `❌ OrderPlaced: telegram send failed for order ${orderId}: ${String(
                    err?.message ?? err
                )}`
            );
        }
    } catch (err: any) {
        throw new Error(
            `❌ OrderPlaced handler error${
                parsed?.transactionHash ? ' tx=' + parsed.transactionHash : ''
            }: ${err?.message ?? String(err)}`
        );
    }
};
