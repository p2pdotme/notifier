import { ethers } from 'ethers';
import { addNotificationJob } from '../../queue';
import { Contract } from 'ethers';
import { PriceConfig } from '../../helpers/types';
import { logger } from '../../helpers/logger';

const toBytes32 = (s: string) => ethers.encodeBytes32String(s.toUpperCase());

export const formatPriceMessage = (currency: string, currentPrices: { buyPrice: any; sellPrice: any }) => {
    if (!currentPrices) return '';
    const buyRaw = parseFloat(String(currentPrices.buyPrice)) / 1e6;
    const sellRaw = parseFloat(String(currentPrices.sellPrice)) / 1e6;
    const buyFixed = buyRaw.toFixed(2);
    const sellFixed = sellRaw.toFixed(2);

    switch (currency) {
        case 'Inr':
            return `🇮🇳 P2P.me INR Price Update: \n\n🟢 BUY USDC @ ₹${buyFixed} \n🔴 SELL USDC @ ₹${sellFixed}`;
        case 'Ars':
            return `🇦🇷 Actualización de Precio P2P.me: \n\n🟢 COMPRA USDC @ $${buyFixed} \n🔴 VENTA USDC @ $${sellFixed}`;
        case 'Brl':
            return `🇧🇷 Atualização de Preço P2P.me: \n\n🟢 COMPRE USDC @ R$${buyFixed} \n🔴 VENDA USDC @ R$${sellFixed}`;
        case 'Idr': {
            const buy = Math.round(buyRaw).toLocaleString('en-US');
            const sell = Math.round(sellRaw).toLocaleString('en-US');
            return `🇮🇩 P2P.me IDR Price Update: \n\n🟢 BUY USDC @ Rp${buy} \n🔴 SELL USDC @ Rp${sell}`;
        }
        case 'Mex':
            return `🇲🇽 Actualización de Precio P2P.me MXN: \n\n🟢 COMPRA USDC @ $${buyFixed} \n🔴 VENTA USDC @ $${sellFixed}`;
        case 'Ven':
            return `🇻🇪 Actualización de Precio P2P.me VES: \n\n🟢 COMPRA USDC @ Bs.${buyFixed} \n🔴 VENTA USDC @ Bs.${sellFixed}`;
        case 'Ngn':
            return `🇳🇬 P2P.me NGN Price Update: \n\n🟢 BUY USDC @ ₦${buyFixed} \n🔴 SELL USDC @ ₦${sellFixed}`;
        case 'Cop':
            return `🇨🇴 Actualización de Precio P2P.me COP: \n\n🟢 COMPRA USDC @ $${buyFixed} \n🔴 VENTA USDC @ $${sellFixed}`;
        default:
            return `📈 ${currency} Price Update: \n\nBUY: ${buyFixed} \nSELL: ${sellFixed}`;
    }
};

export const fetchAndPost = async (
    diamond: Contract,
    currency: string,
    config: PriceConfig
): Promise<boolean> => {
    try {
        if (!diamond || typeof diamond.getPriceConfig !== 'function') {
            throw new Error(
                `price scheduler: diamond invalid or getPriceConfig missing for ${currency}`
            );
        }

        const key = toBytes32(currency);
        const priceConfig: any = await diamond.getPriceConfig(key);

        const buyPrice = priceConfig?.buyPrice;
        const sellPrice = priceConfig?.sellPrice;

        if (buyPrice === undefined || sellPrice === undefined) {
            throw new Error(
                `price scheduler: invalid priceConfig for ${currency} (buyPrice=${String(
                    buyPrice
                )}, sellPrice=${String(sellPrice)})`
            );
        }

        const currentPrices = { buyPrice, sellPrice };
        const message = formatPriceMessage(currency, currentPrices);

        if (!message) {
            throw new Error(`price scheduler: empty message for ${currency}`);
        }

        const botToken = config[`telegram${currency}AlertsBotToken` as keyof PriceConfig];
        const channelId = config[`telegram${currency}PriceUpdatesChannelId` as keyof PriceConfig];
        const topicId = config[`telegram${currency}PriceUpdatesTopicId` as keyof PriceConfig];

        if (!botToken || !channelId || !topicId) {
            throw new Error(`price scheduler: telegram config missing for ${currency}`);
        }

        try {
            await addNotificationJob('PriceNotify', { currency, message }, config as PriceConfig);
            logger.info(`price scheduler: enqueued ${currency} ticker`);
            return true;
        } catch (err: any) {
            const detail = err?.message ?? String(err.message);
            throw new Error(`price scheduler: enqueue failed for ${currency}: ${detail}`);
        }
    } catch (err: any) {
        const msg = err?.message ?? String(err.message);
        logger.error(`price scheduler error for ${currency}:`, msg);
        throw new Error(`price scheduler error for ${currency}: ${msg}`);
    }
};
