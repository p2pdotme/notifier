export type CommonConfig = {
    alchemyApiKey: string;
    diamondAddress: string;
    telegramOnFailBotToken: string;
    telegramOnFailChannelId: string;
    telegramOnFailTopicId: string;
};

export type OrderConfig = CommonConfig & {
    // INR-specific
    telegramInrBuyOrderBotToken: string;
    telegramInrSellOrderBotToken: string;
    telegramInrPayOrderBotToken: string;
    telegramInrAlertsBotToken: string;
    telegramInrReportBotToken: string;
    telegramInrOrderUpdatesChannelId: string;
    telegramInrOrderUpdatesTopicId: string;
    telegramInrDisputeTopicId: string;
    telegramInrReportTopicId: string;

    // IDR-specific
    telegramIdrBuyOrderBotToken: string;
    telegramIdrSellOrderBotToken: string;
    telegramIdrPayOrderBotToken: string;
    telegramIdrAlertsBotToken: string;
    telegramIdrReportBotToken: string;
    telegramIdrOrderUpdatesChannelId: string;
    telegramIdrOrderUpdatesTopicId: string;
    telegramIdrDisputeTopicId: string;
    telegramIdrReportTopicId: string;

    // BRL-specific
    telegramBrlBuyOrderBotToken: string;
    telegramBrlSellOrderBotToken: string;
    telegramBrlPayOrderBotToken: string;
    telegramBrlAlertsBotToken: string;
    telegramBrlReportBotToken: string;
    telegramBrlOrderUpdatesChannelId: string;
    telegramBrlOrderUpdatesTopicId: string;
    telegramBrlDisputeTopicId: string;
    telegramBrlReportTopicId: string;

    // ARS-specific
    telegramArsBuyOrderBotToken: string;
    telegramArsSellOrderBotToken: string;
    telegramArsPayOrderBotToken: string;
    telegramArsAlertsBotToken: string;
    telegramArsReportBotToken: string;
    telegramArsOrderUpdatesChannelId: string;
    telegramArsOrderUpdatesTopicId: string;
    telegramArsDisputeTopicId: string;
    telegramArsReportTopicId: string;

    // MEX-specific
    telegramMexBuyOrderBotToken: string;
    telegramMexSellOrderBotToken: string;
    telegramMexPayOrderBotToken: string;
    telegramMexAlertsBotToken: string;
    telegramMexReportBotToken: string;
    telegramMexOrderUpdatesChannelId: string;
    telegramMexOrderUpdatesTopicId: string;
    telegramMexDisputeTopicId: string;
    telegramMexReportTopicId: string;

    // VEN-specific
    telegramVenBuyOrderBotToken: string;
    telegramVenSellOrderBotToken: string;
    telegramVenPayOrderBotToken: string;
    telegramVenAlertsBotToken: string;
    telegramVenReportBotToken: string;
    telegramVenOrderUpdatesChannelId: string;
    telegramVenOrderUpdatesTopicId: string;
    telegramVenDisputeTopicId: string;
    telegramVenReportTopicId: string;

    pushNotifXSecretKey: string;
    pushNotifBaseUrl: string;
    pushNotifImageUrl: string;
    pushNotifLandingUrl: string;
};

export type PriceConfig = CommonConfig & {
    // INR-specific
    telegramInrAlertsBotToken: string;
    telegramInrPriceUpdatesChannelId: string;
    telegramInrPriceUpdatesTopicId: string;

    // IDR-specific
    telegramIdrAlertsBotToken: string;
    telegramIdrPriceUpdatesChannelId: string;
    telegramIdrPriceUpdatesTopicId: string;

    // BRL-specific
    telegramBrlAlertsBotToken: string;
    telegramBrlPriceUpdatesChannelId: string;
    telegramBrlPriceUpdatesTopicId: string;

    // ARS-specific
    telegramArsAlertsBotToken: string;
    telegramArsPriceUpdatesChannelId: string;
    telegramArsPriceUpdatesTopicId: string;

    // MEX-specific
    telegramMexAlertsBotToken: string;
    telegramMexPriceUpdatesChannelId: string;
    telegramMexPriceUpdatesTopicId: string;

    // VEN-specific
    telegramVenAlertsBotToken: string;
    telegramVenPriceUpdatesChannelId: string;
    telegramVenPriceUpdatesTopicId: string;
};
