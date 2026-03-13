import {
    createDiamondContract,
    resolveOrderFromEventOrChain,
    pickTelegramCredentials,
    buildMerchantDisplay,
    collectAssignmentRecipients,
} from '../lib/common';
import { getEventsFromTransaction } from '../lib/utils';
import { currencyMap, sendTelegramMessage } from '../../helpers/utils';
import { OrderConfig } from '../../helpers/types';
import { logger } from '../../helpers/logger';

export const merchantsReAssignedHandler = async (
    parsed: any,
    provider: any,
    config: OrderConfig
): Promise<boolean> => {
    if (!provider || !parsed?.args) {
        throw new Error('❌ MerchantsReAssigned: missing provider or args');
    }

    const diamond = createDiamondContract(provider, config.diamondAddress);

    try {
        const order = await resolveOrderFromEventOrChain(parsed, diamond);
        if (!order) throw new Error('❌ MerchantsReAssigned: cannot resolve order');

        const orderId = String(order.id);
        const currency = currencyMap[order.currency];
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
            ['MerchantReAssignedNewOrder', 'MerchantAssignedNewOrder']
        );

        if (!telegramIds.length && !merchantsSeen.length) {
            logger.warn(
                `⚠️ MerchantsReAssigned: no MerchantReAssignedNewOrder/MerchantAssignedNewOrder in tx: ${parsed.transactionHash}`
            );
            return true;
        }

        const display = buildMerchantDisplay(telegramIds, merchantsSeen);
        const msg =
            currency === 'Brl'
                ? `Pedido ${orderId} reatribuído a ${display}`
                : currency === 'Ars' || currency === 'Mex' || currency === 'Ven'
                    ? `Orden ${orderId} reasignada a ${display}`
                    : `Order ${orderId} re assigned to ${display}`;

        const { botToken, channelId, topicId } = pickTelegramCredentials(
            config,
            currency,
            orderType
        );

        if (!botToken || !channelId || !topicId) {
            throw new Error(`❌ MerchantsReAssigned: missing telegram credentials for order ${orderId}`);
        }

        try {
            await sendTelegramMessage(botToken, channelId, topicId, msg);
            return true;
        } catch (err: any) {
            throw new Error(
                `❌ MerchantsReAssigned: telegram send failed for order ${orderId}: ${String(
                    err?.message
                )}`
            );
        }
    } catch (err: any) {
        throw new Error(
            `❌ MerchantsReAssigned handler error${parsed?.transactionHash ? ' tx=' + parsed.transactionHash : ''}: ${String(err?.message)}`
        );
    }
};
