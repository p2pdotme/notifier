import { CommonConfig, OrderConfig, PriceConfig } from './types';

function requireEnv(name: string): string {
    const v = process.env[name];
    if (!v) throw new Error(`Missing env: ${name}`);
    return v;
}

export function loadCommonConfig(): CommonConfig {
    return {
        alchemyApiKey: requireEnv('ALCHEMY_API_KEY'),
        diamondAddress: requireEnv('DIAMOND_ADDRESS'),
        telegramOnFailBotToken: requireEnv('TELEGRAM_ONFAIL_BOT_TOKEN'),
        telegramOnFailChannelId: requireEnv('TELEGRAM_ONFAIL_CHANNEL_ID'),
        telegramOnFailTopicId: requireEnv('TELEGRAM_ONFAIL_TOPIC_ID'),
    };
}

export function loadOrderConfig(): OrderConfig {
    const commonConfig: CommonConfig = loadCommonConfig();
    return {
        ...commonConfig,
        telegramInrBuyOrderBotToken: requireEnv('TELEGRAM_INR_BUY_ORDER_BOT_TOKEN'),
        telegramInrSellOrderBotToken: requireEnv('TELEGRAM_INR_SELL_ORDER_BOT_TOKEN'),
        telegramInrPayOrderBotToken: requireEnv('TELEGRAM_INR_PAY_ORDER_BOT_TOKEN'),
        telegramInrAlertsBotToken: requireEnv('TELEGRAM_INR_ALERTS_BOT_TOKEN'),
        telegramInrReportBotToken: requireEnv('TELEGRAM_INR_REPORT_BOT_TOKEN'),
        telegramInrOrderUpdatesChannelId: requireEnv('TELEGRAM_INR_ORDER_UPDATES_CHANNEL_ID'),
        telegramInrOrderUpdatesTopicId: requireEnv('TELEGRAM_INR_ORDER_UPDATES_TOPIC_ID'),
        telegramInrDisputeTopicId: requireEnv('TELEGRAM_INR_DISPUTE_TOPIC_ID'),
        telegramInrReportTopicId: requireEnv('TELEGRAM_INR_REPORT_TOPIC_ID'),
        telegramIdrBuyOrderBotToken: requireEnv('TELEGRAM_IDR_BUY_ORDER_BOT_TOKEN'),
        telegramIdrSellOrderBotToken: requireEnv('TELEGRAM_IDR_SELL_ORDER_BOT_TOKEN'),
        telegramIdrPayOrderBotToken: requireEnv('TELEGRAM_IDR_PAY_ORDER_BOT_TOKEN'),
        telegramIdrAlertsBotToken: requireEnv('TELEGRAM_IDR_ALERTS_BOT_TOKEN'),
        telegramIdrReportBotToken: requireEnv('TELEGRAM_IDR_REPORT_BOT_TOKEN'),
        telegramIdrOrderUpdatesChannelId: requireEnv('TELEGRAM_IDR_ORDER_UPDATES_CHANNEL_ID'),
        telegramIdrOrderUpdatesTopicId: requireEnv('TELEGRAM_IDR_ORDER_UPDATES_TOPIC_ID'),
        telegramIdrDisputeTopicId: requireEnv('TELEGRAM_IDR_DISPUTE_TOPIC_ID'),
        telegramIdrReportTopicId: requireEnv('TELEGRAM_IDR_REPORT_TOPIC_ID'),
        telegramBrlBuyOrderBotToken: requireEnv('TELEGRAM_BRL_BUY_ORDER_BOT_TOKEN'),
        telegramBrlSellOrderBotToken: requireEnv('TELEGRAM_BRL_SELL_ORDER_BOT_TOKEN'),
        telegramBrlPayOrderBotToken: requireEnv('TELEGRAM_BRL_PAY_ORDER_BOT_TOKEN'),
        telegramBrlAlertsBotToken: requireEnv('TELEGRAM_BRL_ALERTS_BOT_TOKEN'),
        telegramBrlReportBotToken: requireEnv('TELEGRAM_BRL_REPORT_BOT_TOKEN'),
        telegramBrlOrderUpdatesChannelId: requireEnv('TELEGRAM_BRL_ORDER_UPDATES_CHANNEL_ID'),
        telegramBrlOrderUpdatesTopicId: requireEnv('TELEGRAM_BRL_ORDER_UPDATES_TOPIC_ID'),
        telegramBrlDisputeTopicId: requireEnv('TELEGRAM_BRL_DISPUTE_TOPIC_ID'),
        telegramBrlReportTopicId: requireEnv('TELEGRAM_BRL_REPORT_TOPIC_ID'),
        telegramArsBuyOrderBotToken: requireEnv('TELEGRAM_ARS_BUY_ORDER_BOT_TOKEN'),
        telegramArsSellOrderBotToken: requireEnv('TELEGRAM_ARS_SELL_ORDER_BOT_TOKEN'),
        telegramArsPayOrderBotToken: requireEnv('TELEGRAM_ARS_PAY_ORDER_BOT_TOKEN'),
        telegramArsAlertsBotToken: requireEnv('TELEGRAM_ARS_ALERTS_BOT_TOKEN'),
        telegramArsReportBotToken: requireEnv('TELEGRAM_ARS_REPORT_BOT_TOKEN'),
        telegramArsOrderUpdatesChannelId: requireEnv('TELEGRAM_ARS_ORDER_UPDATES_CHANNEL_ID'),
        telegramArsOrderUpdatesTopicId: requireEnv('TELEGRAM_ARS_ORDER_UPDATES_TOPIC_ID'),
        telegramArsDisputeTopicId: requireEnv('TELEGRAM_ARS_DISPUTE_TOPIC_ID'),
        telegramArsReportTopicId: requireEnv('TELEGRAM_ARS_REPORT_TOPIC_ID'),
        telegramMexBuyOrderBotToken: requireEnv('TELEGRAM_MEX_BUY_ORDER_BOT_TOKEN'),
        telegramMexSellOrderBotToken: requireEnv('TELEGRAM_MEX_SELL_ORDER_BOT_TOKEN'),
        telegramMexPayOrderBotToken: requireEnv('TELEGRAM_MEX_PAY_ORDER_BOT_TOKEN'),
        telegramMexAlertsBotToken: requireEnv('TELEGRAM_MEX_ALERTS_BOT_TOKEN'),
        telegramMexReportBotToken: requireEnv('TELEGRAM_MEX_REPORT_BOT_TOKEN'),
        telegramMexOrderUpdatesChannelId: requireEnv('TELEGRAM_MEX_ORDER_UPDATES_CHANNEL_ID'),
        telegramMexOrderUpdatesTopicId: requireEnv('TELEGRAM_MEX_ORDER_UPDATES_TOPIC_ID'),
        telegramMexDisputeTopicId: requireEnv('TELEGRAM_MEX_DISPUTE_TOPIC_ID'),
        telegramMexReportTopicId: requireEnv('TELEGRAM_MEX_REPORT_TOPIC_ID'),
        telegramVenBuyOrderBotToken: requireEnv('TELEGRAM_VEN_BUY_ORDER_BOT_TOKEN'),
        telegramVenSellOrderBotToken: requireEnv('TELEGRAM_VEN_SELL_ORDER_BOT_TOKEN'),
        telegramVenPayOrderBotToken: requireEnv('TELEGRAM_VEN_PAY_ORDER_BOT_TOKEN'),
        telegramVenAlertsBotToken: requireEnv('TELEGRAM_VEN_ALERTS_BOT_TOKEN'),
        telegramVenReportBotToken: requireEnv('TELEGRAM_VEN_REPORT_BOT_TOKEN'),
        telegramVenOrderUpdatesChannelId: requireEnv('TELEGRAM_VEN_ORDER_UPDATES_CHANNEL_ID'),
        telegramVenOrderUpdatesTopicId: requireEnv('TELEGRAM_VEN_ORDER_UPDATES_TOPIC_ID'),
        telegramVenDisputeTopicId: requireEnv('TELEGRAM_VEN_DISPUTE_TOPIC_ID'),
        telegramVenReportTopicId: requireEnv('TELEGRAM_VEN_REPORT_TOPIC_ID'),
        pushNotifXSecretKey: requireEnv('PUSH_NOTIF_X_SECRET_KEY'),
        pushNotifBaseUrl: requireEnv('PUSH_NOTIF_BASE_URL'),
        pushNotifImageUrl: requireEnv('PUSH_NOTIF_IMAGE_URL'),
        pushNotifLandingUrl: requireEnv('PUSH_NOTIF_LANDING_URL'),
    };
}

export function loadPriceConfig(): PriceConfig {
    const commonConfig: CommonConfig = loadCommonConfig();
    return {
        ...commonConfig,
        telegramInrAlertsBotToken: requireEnv('TELEGRAM_INR_ALERTS_BOT_TOKEN'),
        telegramInrPriceUpdatesChannelId: requireEnv('TELEGRAM_INR_PRICE_UPDATES_CHANNEL_ID'),
        telegramInrPriceUpdatesTopicId: requireEnv('TELEGRAM_INR_PRICE_UPDATES_TOPIC_ID'),
        telegramIdrAlertsBotToken: requireEnv('TELEGRAM_IDR_ALERTS_BOT_TOKEN'),
        telegramIdrPriceUpdatesChannelId: requireEnv('TELEGRAM_IDR_PRICE_UPDATES_CHANNEL_ID'),
        telegramIdrPriceUpdatesTopicId: requireEnv('TELEGRAM_IDR_PRICE_UPDATES_TOPIC_ID'),
        telegramBrlAlertsBotToken: requireEnv('TELEGRAM_BRL_ALERTS_BOT_TOKEN'),
        telegramBrlPriceUpdatesChannelId: requireEnv('TELEGRAM_BRL_PRICE_UPDATES_CHANNEL_ID'),
        telegramBrlPriceUpdatesTopicId: requireEnv('TELEGRAM_BRL_PRICE_UPDATES_TOPIC_ID'),
        telegramArsAlertsBotToken: requireEnv('TELEGRAM_ARS_ALERTS_BOT_TOKEN'),
        telegramArsPriceUpdatesChannelId: requireEnv('TELEGRAM_ARS_PRICE_UPDATES_CHANNEL_ID'),
        telegramArsPriceUpdatesTopicId: requireEnv('TELEGRAM_ARS_PRICE_UPDATES_TOPIC_ID'),
        telegramMexAlertsBotToken: requireEnv('TELEGRAM_MEX_ALERTS_BOT_TOKEN'),
        telegramMexPriceUpdatesChannelId: requireEnv('TELEGRAM_MEX_PRICE_UPDATES_CHANNEL_ID'),
        telegramMexPriceUpdatesTopicId: requireEnv('TELEGRAM_MEX_PRICE_UPDATES_TOPIC_ID'),
        telegramVenAlertsBotToken: requireEnv('TELEGRAM_VEN_ALERTS_BOT_TOKEN'),
        telegramVenPriceUpdatesChannelId: requireEnv('TELEGRAM_VEN_PRICE_UPDATES_CHANNEL_ID'),
        telegramVenPriceUpdatesTopicId: requireEnv('TELEGRAM_VEN_PRICE_UPDATES_TOPIC_ID'),
    };
}
