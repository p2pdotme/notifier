import {
    getOrderContext,
    pickTelegramCredentials,
    buildMerchantDisplay,
    decodeEventArgs,
} from '../lib/common';
import { sendTelegramMessage } from '../../helpers/utils';
import { OrderConfig } from '../../helpers/types';
import { ethers } from 'ethers';
import { logger } from '../../helpers/logger';
import { getEventsFromTransaction } from '../lib/utils';

export const orderCancelledByHandler = async (
    parsed: any,
    provider: any,
    config: OrderConfig
): Promise<boolean> => {
    if (!provider || !parsed) {
        throw new Error('❌ OrderCancelledBy: missing provider or event');
    }

    // Always work from decoded args, not raw parsed.args
    const decoded = decodeEventArgs(parsed);

    const orderIdArg =
        decoded?.orderId ??
        decoded?.[0] ??
        parsed.args?.orderId ??
        parsed.args?.[0];

    const cancelledByRaw =
        decoded?.cancelledBy ??
        decoded?.by ??
        decoded?.[1] ??
        parsed.args?.cancelledBy ??
        parsed.args?.by ??
        null;

    if (!orderIdArg) {
        throw new Error('❌ OrderCancelledBy: orderId missing in event');
    }

    try {
        const {
            orderId,
            merchant,
            user,
            currency,
            orderType,
            telegramId,
        } = await getOrderContext(parsed, provider, config);

        const cancelledBy = cancelledByRaw ? String(cancelledByRaw) : null;
        const cancelledByLower = cancelledBy ? cancelledBy.toLowerCase() : null;
        logger.info(
            `OrderCancelledBy: orderId=${orderId} cancelledBy=${cancelledBy} cancelledByLower=${cancelledByLower}`
        );

        let autoCancel = true;
        let cancelledByUser = false;
        let cancelledByMerchant = false;

        const merchantLower = merchant.toLowerCase();
        const userLower = user.toLowerCase();

        if (cancelledByLower && cancelledByLower === merchantLower) {
            cancelledByMerchant = true;
            autoCancel = false;
        } else if (cancelledByLower && cancelledByLower === userLower) {
            cancelledByUser = true;
            autoCancel = false;
        }

        const isZeroAddress = merchant.toLowerCase() === ethers.ZeroAddress.toLowerCase();

        const display = buildMerchantDisplay(
            telegramId && !isZeroAddress ? [String(telegramId)] : [],
            !isZeroAddress ? [String(merchant)] : []
        );

        let msg = '';
        logger.debug(`autoCancel=${autoCancel} cancelledByUser=${cancelledByUser} cancelledByMerchant=${cancelledByMerchant}`);

        let txEvents: any[] = [];
        try {
            txEvents = await getEventsFromTransaction(provider, parsed.transactionHash, config.diamondAddress);
        } catch (err) {
            logger.warn(`⚠️ OrderCancelledBy: getEventsFromTransaction failed: ${String(err)}`);
        }
        const hasOrderDispute = (txEvents || []).some((e: any) => e.name === 'OrderDispute');

        if (autoCancel && !hasOrderDispute) {
            const prefix = display ? `${display} ` : '';
            msg =
                currency === 'Brl'
                    ? `${prefix} Pedido ${orderId} foi cancelado automaticamente (inatividade)`
                    : currency === 'Ars' || currency === 'Mex' || currency === 'Ven'
                    ? `${prefix} La Orden ${orderId} fue cancelada automáticamente (inactividad)`
                    : `${prefix} Order ${orderId} was auto-cancelled due to inactivity`;
        } else if (hasOrderDispute) {
            msg =
                currency === 'Brl'
                    ? `${display} Disputa resolvida para o Pedido ${orderId}. Pedido cancelado automaticamente.`
                    : currency === 'Ars' || currency === 'Mex' || currency === 'Ven'
                    ? `${display} Disputa resuelta para la Orden ${orderId}. Orden cancelada automáticamente.`
                    : `${display} Dispute resolved for Order ${orderId}. Order auto-cancelled`;
        } else if (cancelledByUser) {
            msg =
                currency === 'Brl'
                    ? `${display} Pedido ${orderId} foi cancelado pelo Usuário`
                    : currency === 'Ars' || currency === 'Mex' || currency === 'Ven'
                    ? `${display} La Orden ${orderId} fue cancelada por el usuario`
                    : `${display} Order ${orderId} cancelled by User`;
        } else if (cancelledByMerchant) {
            msg =
                currency === 'Brl'
                    ? `Pedido ${orderId} foi cancelado por ${display}`
                    : currency === 'Ars' || currency === 'Mex' || currency === 'Ven'
                    ? `La Orden ${orderId} fue cancelada por ${display}`
                    : `Order ${orderId} cancelled by ${display}`;
        }

        const { botToken, channelId, topicId } = pickTelegramCredentials(
            config,
            currency,
            orderType
        );

        if (!botToken || !channelId || !topicId) {
            throw new Error(
                `❌ OrderCancelledBy: missing telegram credentials for order ${orderId}`
            );
        }

        try {
            await sendTelegramMessage(botToken, channelId, topicId, msg);
            return true;
        } catch (err: any) {
            throw new Error(
                `❌ OrderCancelledBy: telegram send failed for order ${orderId}: ${String(
                    err?.message ?? err
                )}`
            );
        }
    } catch (err: any) {
        throw new Error(
            `❌ OrderCancelledBy handler error${
                parsed?.transactionHash ? ' tx=' + parsed.transactionHash : ''
            }: ${String(err?.message)}`
        );
    }
};
