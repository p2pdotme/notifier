import { Interface, keccak256, toUtf8Bytes } from 'ethers';
import { DIAMOND_ABI } from '../../helpers/abi';
import {
    createDiamondContract,
    fetchMerchantConfig,
    pickTelegramCredentialsForReport,
} from '../lib/common';
import { getEventsFromTransaction } from '../lib/utils';
import { sendTelegramMessage, currencyMap } from '../../helpers/utils';
import { logger } from '../../helpers/logger';
import { OrderConfig } from '../../helpers/types';

const diamondIface = new Interface(DIAMOND_ABI);

// build selector -> name map once
const selectorMap: Record<string, string> = (() => {
    const map: Record<string, string> = {};
    for (const f of diamondIface.fragments) {
        if (f.type === 'function') {
            const formatted = (f as any).format?.() ?? String(f);
            const sig = formatted.replace(/^function\s+/, '').trim();
            const hash = keccak256(toUtf8Bytes(sig));
            const selector = '0x' + hash.slice(2, 10);
            map[selector] = (f as any).name;
        }
    }
    return map;
})();

export const onlineOfflineToggledHandler = async (
    parsed: any,
    provider: any,
    config: OrderConfig
): Promise<boolean> => {
    if (!parsed || !parsed.transactionHash) {
        throw new Error('❌ OnlineOfflineToggled: missing parsed or txHash');
    }

    const txHash = parsed.transactionHash;
    const merchantRaw = parsed.args?.[0] ?? null;
    if (!merchantRaw) throw new Error('❌ OnlineOfflineToggled: merchant missing in event');

    const merchant = String(merchantRaw).toLowerCase();
    const merchantConfig = parsed.args?.[1] ?? null;
    const merchantDetails = parsed.args?.[2] ?? null;

    // isOnline from MerchantDetails
    let isOnline: boolean | null = null;
    if (merchantDetails != null) {
        if (typeof merchantDetails.isOnline === 'boolean') {
            isOnline = merchantDetails.isOnline;
        } else if (typeof merchantDetails[1] === 'boolean') {
            isOnline = merchantDetails[1];
        }
    }

    // currency from MerchantDetails.currency (bytes32)
    const currencyRaw = merchantDetails?.currency ?? merchantDetails?.[7] ?? null;
    let currency: string | null = null;
    if (currencyRaw) currency = currencyMap[String(currencyRaw)];

    if (!currency) throw new Error('❌ OnlineOfflineToggled: currency missing');

    // who sent tx + data
    let caller: string | null = null;
    let txData: string | null = null;
    try {
        const tx = await provider.getTransaction(txHash);
        caller = tx?.from ? String(tx.from).toLowerCase() : null;
        txData = tx?.data ?? null;
    } catch (err) {
        logger.warn(`⚠️ OnlineOfflineToggled: cannot fetch tx data/sender: ${String(err)}`);
    }

    // detect function
    let detectedFn: string | null = null;
    try {
        if (txData) {
            const parsedTx = diamondIface.parseTransaction({ data: txData });
            if (parsedTx?.name) detectedFn = parsedTx.name;
        }
    } catch {
        // ignore
    }

    if (!detectedFn && txData) {
        const lowerData = txData.toLowerCase();
        for (const selector of Object.keys(selectorMap)) {
            const s = selector.toLowerCase();
            const no0x = s.replace(/^0x/, '');
            if (lowerData.includes(s) || lowerData.includes(no0x)) {
                detectedFn = selectorMap[selector];
                break;
            }
        }
    }

    // inspect logs for OrderAccepted (fallback heuristic)
    let txEvents: any[] = [];
    try {
        txEvents = await getEventsFromTransaction(provider, txHash, config.diamondAddress);
    } catch (err) {
        logger.warn(`⚠️ OnlineOfflineToggled: getEventsFromTransaction failed: ${String(err)}`);
    }
    const hasOrderAccepted = (txEvents || []).some((e: any) => e.name === 'OrderAccepted');

    logger.info(
        `OnlineOfflineToggled: merchant=${merchant} currency=${currency} ` +
        `detectedFn=${detectedFn} isOnline=${isOnline} caller=${caller} hasOrderAccepted=${hasOrderAccepted}`
    );

    if (!detectedFn && !hasOrderAccepted) {
        logger.info('❗ OnlineOfflineToggled: no selector detected — skipping announcement');
        return true;
    }

    // build Telegram handle / label
    let telegramId: string | null = null;

    // prefer telegramId from event
    const telegramIdFromEvent =
        merchantConfig && merchantConfig[0] ? String(merchantConfig[0]) : null;
    if (telegramIdFromEvent) {
        telegramId = telegramIdFromEvent;
    } else {
        // fallback to on-chain config
        try {
            const diamond = createDiamondContract(provider, config.diamondAddress);
            const cfg = await fetchMerchantConfig(diamond, merchant);
            telegramId = cfg.telegramId || null;
        } catch (err) {
            logger.warn(`⚠️ OnlineOfflineToggled: fetchMerchantConfig failed: ${String(err)}`);
        }
    }

    // final label to show
    const actor = telegramId ? `@${telegramId}` : merchant;
    const threshold = 12;

    const buildOfflineMsg = (curr: string) =>
        curr === 'Brl'
            ? `${actor} está inativo e offline porque não aceitou os últimos ${threshold} pedidos atribuídos`
            : curr === 'Ars' || curr === 'Mex' || curr === 'Ven'
                ? `${actor} está inactivo y fue puesto en offline por no aceptar las últimas ${threshold} órdenes asignadas`
                : `${actor} is inactive & turned offline for not accepting the last ${threshold} assigned orders`;

    const buildOnlineMsg = (curr: string) =>
        curr === 'Brl'
            ? `${actor} está online pelo sistema.`
            : curr === 'Ars' || curr === 'Mex' || curr === 'Ven'
                ? `${actor} está online automáticamente por el sistema`
                : `${actor} is turned online by system`;

    let msg: string | null = null;

    // primary: based on function name + isOnline
    if (
        detectedFn === 'removeNonEligibleMerchantsByCircleId'
    ) {
        if (isOnline === false) msg = buildOfflineMsg(currency);
        else if (isOnline === true) msg = buildOnlineMsg(currency);
        else {
            logger.info(
                `❗ OnlineOfflineToggled: ${detectedFn} but isOnline unknown — skipping`
            );
            return true;
        }
    } else if (hasOrderAccepted || (detectedFn && (detectedFn === 'acceptOrder' || detectedFn.startsWith('acceptOrder(')))) {
        if (isOnline === true) {
            msg = buildOnlineMsg(currency);
        } else {
            logger.info(
                '❗ OnlineOfflineToggled: acceptOrder detected but isOnline not true — skipping'
            );
            return true;
        }
    }

    // fallback heuristic if msg still empty
    if (!msg) {
        if (caller && caller === merchant && hasOrderAccepted && isOnline === true) {
            msg = buildOnlineMsg(currency);
        } else if ((!caller || caller !== merchant) && isOnline === false) {
            msg = buildOfflineMsg(currency);
        }
    }

    if (!msg) {
        logger.info('❗ OnlineOfflineToggled: nothing to announce');
        return true;
    }

    const { botToken, channelId, topicId } = pickTelegramCredentialsForReport(config, currency);

    if (!botToken || !channelId || !topicId) {
        logger.warn('❌ OnlineOfflineToggled: report telegram config missing, skipping');
        return false;
    }

    try {
        await sendTelegramMessage(botToken, channelId, topicId, msg);
        return true;
    } catch (err: any) {
        throw new Error(
            `❌ OnlineOfflineToggled: telegram send failed: ${String(err?.message ?? err)}`
        );
    }
};
