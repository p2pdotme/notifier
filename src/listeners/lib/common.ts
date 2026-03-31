import { Contract, JsonRpcProvider, Interface } from 'ethers';
import { DIAMOND_ABI } from '../../helpers/abi';
import { logger } from '../../helpers/logger';
import { OrderConfig } from '../../helpers/types';
import { currencyMap } from '../../helpers/utils';
import { sendNotification } from './utils';

const iface = new Interface(DIAMOND_ABI);

const isAddressLike = (v: unknown): boolean =>
    typeof v === 'string' && /^0x[0-9a-fA-F]{40}$/.test(v);

/**
 * Decode args from the raw log using the ABI.
 * This avoids any BullMQ / JSON mangling of `args` / `_order`.
 * Safely wraps each arg access in try/catch to avoid ethers.js v6
 * deferred errors when complex structs can't be fully decoded.
 */
export const decodeEventArgs = (parsed: ParsedEvent): any => {
    const log = parsed.log as any;

    if (log && log.topics && log.data) {
        try {
            const decoded = iface.parseLog({
                topics: log.topics,
                data: log.data,
            });
            if (decoded?.args) {
                // Safely extract each arg to avoid deferred errors
                const safeArgs: Record<string, any> = {};
                for (let i = 0; i < decoded.fragment.inputs.length; i++) {
                    const name = decoded.fragment.inputs[i].name;
                    try {
                        safeArgs[i] = decoded.args[i];
                        if (name) safeArgs[name] = decoded.args[i];
                    } catch (err: any) {
                        logger.warn(
                            `decodeEventArgs: deferred error at arg[${i}] (${name}): ${String(err.message)}`
                        );
                        safeArgs[i] = null;
                        if (name) safeArgs[name] = null;
                    }
                }
                return safeArgs;
            }
        } catch (err: any) {
            logger.warn(
                `decodeEventArgs: parseLog failed: ${String(err.message)}; falling back to parsed.args`
            );
        }
    }

    return parsed.args;
};

/**
 * Extract orderId from decoded args:
 *  - prefer named .orderId
 *  - else first non-address positional (0 or 1)
 */
const extractOrderIdFromArgs = (args: any): any => {
    if (!args) return undefined;

    if (args.orderId !== undefined && args.orderId !== null) {
        return args.orderId;
    }

    const first = args[0];
    const second = args[1];

    if (first !== undefined && first !== null && !isAddressLike(first)) {
        return first;
    }
    if (second !== undefined && second !== null && !isAddressLike(second)) {
        return second;
    }

    return undefined;
};

/**
 * Try to pull the order struct from decoded args:
 *  - prefer named _order / order
 *  - else last positional object
 */
const extractOrderStructFromArgs = (args: any): any => {
    if (!args) return undefined;

    if (args._order) return args._order;
    if (args.order) return args.order;

    const keys = Object.keys(args).filter((k) => /^\d+$/.test(k));
    if (keys.length === 0) return undefined;

    const sorted = keys.map(Number).sort((a, b) => b - a);
    for (const idx of sorted) {
        const v = (args as any)[idx];
        if (v && typeof v === 'object') {
            return v;
        }
    }

    return undefined;
};

// Create diamond contract instance using provided provider.
export const createDiamondContract = (
    provider: JsonRpcProvider,
    diamondAddress: string
): Contract => {
    return new Contract(diamondAddress, DIAMOND_ABI, provider) as Contract;
};

/**
 * Prefer order struct from event.
 * Only call getOrdersById(orderId) if event does NOT carry an order struct.
 */
export const resolveOrderFromEventOrChain = async (
    parsed: { args?: any; name?: string; log?: any },
    diamond: Contract
): Promise<any | null> => {
    const eventName =
        parsed.name ??
        parsed.log?.eventName ??
        parsed.log?.name ??
        'unknown_event';

    const decodedArgs = decodeEventArgs(parsed);

    // Try order struct from decoded event (_order / order / last positional object)
    const fromEvent = extractOrderStructFromArgs(decodedArgs);
    if (fromEvent && typeof fromEvent === 'object') {
        logger.info(
            `resolveOrderFromEventOrChain: using order struct from event ${eventName}`
        );
        return fromEvent;
    }

    // Fallback: fetch from chain by orderId
    const id = extractOrderIdFromArgs(decodedArgs);

    if (id === undefined || id === null) {
        logger.warn(
            `resolveOrderFromEventOrChain: no usable orderId in event ${eventName}`
        );
        return null;
    }

    try {
        const order = await diamond.getOrdersById(id);
        logger.info(
            `resolveOrderFromEventOrChain: fetched order from chain for currency=${currencyMap[String(order.currency)]} id=${id}`
        );
        return order;
    } catch (err: any) {
        logger.warn(
            `⚠️ resolveOrderFromEventOrChain: getOrdersById(${String(
                id
            )}) failed: ${String(err.message)}`
        );
        return null;
    }
};

export const fetchMerchantConfig = async (
    diamond: Contract,
    merchant: string
) => {
    try {
        const cfg = await diamond.getMerchantConfig(merchant);
        return { telegramId: String(cfg?.telegramId) };
    } catch (err: any) {
        logger.warn(
            `⚠️ fetchMerchantConfig: getMerchantConfig failed: ${String(err.message)}`
        );
        return { telegramId: null };
    }
};

export const fetchMerchantConfigAndFcmTokens = async (
    diamond: Contract,
    merchant: string
) => {
    try {
        const [cfg, fcmRaw] = await Promise.all([
            diamond.getMerchantConfig(merchant).catch(() => null),
            diamond.getFcmTokens(merchant).catch((err: any) => {
                logger.warn(`⚠️ getFcmTokens failed for ${merchant}: ${String(err?.message ?? err)} — skipping push`);
                return [];
            }),
        ]);
        const telegramId = cfg?.telegramId ?? null;
        const fcmTokens = Array.isArray(fcmRaw)
            ? fcmRaw.map((t: unknown) => String(t))
            : [];
        return { telegramId, fcmTokens };
    } catch (err: any) {
        logger.warn(
            `⚠️ fetchMerchantConfigAndFcmTokens failed: ${String(err.message)}`
        );
        return { telegramId: null, fcmTokens: [] };
    }
};

export const pickTelegramCredentials = (
    config: OrderConfig,
    currency: string,
    orderType: number,
    topicOverride?: string
) => {
    const botToken =
        orderType === 0
            ? config[`telegram${currency}BuyOrderBotToken` as keyof OrderConfig]
            : orderType === 1
                ? config[`telegram${currency}SellOrderBotToken` as keyof OrderConfig]
                : orderType === 2
                    ? config[`telegram${currency}PayOrderBotToken` as keyof OrderConfig]
                    : config[`telegram${currency}AlertsBotToken` as keyof OrderConfig];

    const channelId =
        config[`telegram${currency}OrderUpdatesChannelId` as keyof OrderConfig];
    const topicId =
        topicOverride ??
        config[`telegram${currency}OrderUpdatesTopicId` as keyof OrderConfig];

    return { botToken, channelId, topicId };
};

export const pickTelegramCredentialsForReport = (
    config: OrderConfig,
    currency: string
) => {
    const botToken =
        config[`telegram${currency}ReportBotToken` as keyof OrderConfig];
    const channelId =
        config[`telegram${currency}OrderUpdatesChannelId` as keyof OrderConfig];
    const topicId = config[`telegram${currency}ReportTopicId` as keyof OrderConfig];
    return { botToken, channelId, topicId };
};

export const buildMerchantDisplay = (
    telegramIds: string[],
    merchantsSeen: string[]
): string => {
    if (telegramIds.length > 0) {
        return telegramIds
            .map((id) => (id.startsWith('@') ? id : `@${id}`))
            .join(', ');
    }

    if (merchantsSeen.length > 0) {
        return merchantsSeen
            .map((m) => (m.startsWith('@') ? m : `@${m}`))
            .join(', ');
    }

    return '';
};

export interface ParsedEvent {
    args?: any;
    transactionHash?: string;
    name?: string;
    log?: any;
}

export interface OrderContext {
    diamond: Contract;
    order: any;
    orderId: string;
    user: string;
    merchant: string;
    currency: string;
    orderType: number;
    orderStatus: number;
    telegramId: string | null;
    fcmTokens: string[] | null;
}

/**
 * Shared helper used by multiple handlers:
 *  - builds diamond
 *  - decodes event with Interface
 *  - uses order struct from event when present
 *  - otherwise calls getOrdersById(orderId)
 *  - maps merchant, currency, type, status
 *  - fetches telegramId + fcmTokens
 */
export const getOrderContext = async (
    parsed: ParsedEvent,
    provider: JsonRpcProvider,
    config: OrderConfig,
    opts?: { merchantFromEventKey?: string }
): Promise<OrderContext> => {
    if (!provider) throw new Error('getOrderContext: provider required');
    if (!parsed) throw new Error('getOrderContext: parsed event missing');

    const eventName =
        parsed.name ??
        parsed.log?.eventName ??
        parsed.log?.name ??
        'unknown_event';

    const diamond = createDiamondContract(provider, config.diamondAddress);

    const order = await resolveOrderFromEventOrChain(parsed, diamond);
    if (!order) {
        throw new Error(
            `getOrderContext: cannot resolve order for event ${eventName}`
        );
    }

    const decodedArgs = decodeEventArgs(parsed);
    const merchantFromEventKey = opts?.merchantFromEventKey;

    const extractedId = extractOrderIdFromArgs(decodedArgs);
    const orderId = String(
        extractedId !== undefined && extractedId !== null ? extractedId : order.id
    );

    const merchantRaw =
        merchantFromEventKey && decodedArgs[merchantFromEventKey]
            ? decodedArgs[merchantFromEventKey]
            : order.acceptedMerchant;

    const merchant = String(merchantRaw);
    const user = String(order.user);

    const currency = currencyMap[String(order.currency)];
    if (!currency) {
        throw new Error(
            `getOrderContext: unknown currency=${String(order.currency)} for orderId=${orderId}`
        );
    }

    const orderType = Number(order.orderType);
    const orderStatus = Number(order.status);
    logger.info(`getOrderContext: currency=${currency} orderId=${orderId} orderType=${orderType} orderStatus=${orderStatus}`);

    const { telegramId, fcmTokens } = await fetchMerchantConfigAndFcmTokens(
        diamond,
        merchant
    );

    return {
        diamond,
        order,
        orderId,
        user,
        merchant,
        currency,
        orderType,
        orderStatus,
        telegramId: telegramId ? String(telegramId) : null,
        fcmTokens,
    };
};

/**
 * Shared helper used by OrderPlaced / MerchantsReAssigned:
 *  - filters assignment-related events
 *  - collects telegramIds + merchant addresses
 *  - sends push notifications (FCM) per merchant
 */
export const collectAssignmentRecipients = async (
    diamond: Contract,
    txEvents: any[],
    config: OrderConfig,
    orderId: string,
    currency: string,
    orderStatus: number,
    orderType: number,
    eventNames: string[]
): Promise<{ telegramIds: string[]; merchantsSeen: string[] }> => {
    const merchantEvents = (txEvents || []).filter((e: any) =>
        eventNames.includes(e.name)
    );

    const telegramIds: string[] = [];
    const merchantsSeen: string[] = [];

    for (const me of merchantEvents) {
        const merchantArg = me.args?.merchant;
        if (!merchantArg) continue;

        try {
            const { telegramId, fcmTokens } =
                await fetchMerchantConfigAndFcmTokens(diamond, merchantArg);

            if (Array.isArray(fcmTokens) && fcmTokens.length) {
                await sendNotification(
                    fcmTokens,
                    merchantArg,
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

            if (telegramId) {
                telegramIds.push(String(telegramId));
            } else {
                merchantsSeen.push(String(merchantArg));
            }
        } catch (err: any) {
            logger.warn(`⚠️ collectAssignmentRecipients: failed for merchant ${merchantArg}: ${String(err?.message ?? err)} — continuing`);
        }
    }

    return { telegramIds, merchantsSeen };
};
