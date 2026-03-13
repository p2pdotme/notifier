import { ethers } from "ethers";
import ky from "ky";
import { logger } from "./logger";
import { CommonConfig, OrderConfig } from "./types";

export const currencyMap: Record<string, string> = {
    [ethers.encodeBytes32String("INR")]: "Inr",
    [ethers.encodeBytes32String("IDR")]: "Idr",
    [ethers.encodeBytes32String("BRL")]: "Brl",
    [ethers.encodeBytes32String("ARS")]: "Ars",
    [ethers.encodeBytes32String("MEX")]: "Mex",
    [ethers.encodeBytes32String("VEN")]: "Ven",
};

export const sendTelegramMessage = async (
    telegramBotToken: string,
    telegramChannelId: string,
    telegramTopicId: string,
    message: string
) => {
    try {
        const res = await ky.post(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
            json: { chat_id: telegramChannelId, text: message, message_thread_id: telegramTopicId },
            timeout: 30000,
            retry: { limit: 2 }
        });
        logger.info(`☑️ Telegram send ok status=${res.status}`);
        return true;
    } catch (err) {
        const status = (err as any)?.response?.status ?? 'unknown';
        const body = (err as any)?.response ? await (err as any).response.text().catch(() => String((err as any).message)) : String(err);
        const msg = `❌ Telegram message failed: status=${status} body=${body}`;
        logger.error(msg);
        return false;
    }
};

// send fallback telegram message when handler missing or fails
export const sendOnFail = async (config: CommonConfig | OrderConfig, message: string) => {
    if (!config.telegramOnFailBotToken || !config.telegramOnFailChannelId || !config.telegramOnFailTopicId) return;
    const botToken = config.telegramOnFailBotToken;
    const channelId = config.telegramOnFailChannelId;
    const topicId = config.telegramOnFailTopicId;
    try {
        await sendTelegramMessage(botToken, channelId, topicId, message);
    } catch (err) {
        logger.warn(`❌ on-fail telegram send failed: ${String(err)}`);
    }
};
