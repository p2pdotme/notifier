import { JsonRpcProvider, WebSocketProvider, Provider, TransactionReceipt } from 'ethers';
import { logger } from './logger';

// cache providers
const httpCache: Record<string, JsonRpcProvider> = {};

// Return cached JsonRpcProvider or create + cache one
export function getHttpProvider(rpcHttp: string): JsonRpcProvider {
    if (!rpcHttp) throw new Error('missing rpcHttp');
    if (httpCache[rpcHttp]) return httpCache[rpcHttp];
    const provider = new JsonRpcProvider(rpcHttp);
    httpCache[rpcHttp] = provider;
    return provider;
}

export function getWsProvider(rpcWs: string): WebSocketProvider {
    if (!rpcWs) throw new Error('missing rpcWs');
    const provider = new WebSocketProvider(rpcWs);

    provider.on('error', (err: any) => {
        logger.error(`❌ ws provider error: ${String(err?.message ?? err)}`);
    });

    return provider;
}

// pick WS or HTTP based on URL scheme
export function getProvider(rpcUrl: string): Provider {
    if (!rpcUrl) throw new Error('missing rpcUrl');
    return rpcUrl.startsWith('ws') ? getWsProvider(rpcUrl) : getHttpProvider(rpcUrl);
}

// Poll for tx receipt and wait for confirmations
export async function waitForConfirmations(
    provider: Provider,
    txHash: string,
    confirmations = 1,
    timeoutMs = 120_000
): Promise<TransactionReceipt> {
    if (!provider) throw new Error('missing provider');
    if (!txHash) throw new Error('missing txHash');
    const start = Date.now();
    while (true) {
        const receipt = await (provider as any).getTransactionReceipt(txHash);
        if (receipt && typeof receipt.blockNumber === 'number') {
            const currentBlock = await provider.getBlockNumber();
            if (currentBlock - receipt.blockNumber + 1 >= confirmations) return receipt;
        }
        if (Date.now() - start > timeoutMs) throw new Error('tx confirmation timeout');
        await delay(1500);
    }
}

// delay helper
function delay(ms: number) {
    return new Promise(res => setTimeout(res, ms));
}

export function getHttpUrl(apiKey: string) {
    return `https://base-mainnet.g.alchemy.com/v2/${apiKey}`;
}

export function getWsUrl(apiKey: string) {
    return `wss://base-mainnet.g.alchemy.com/v2/${apiKey}`;
}

export async function withTimeout<T>(p: Promise<T>, ms = 200_000): Promise<T> {
    let timeoutId: NodeJS.Timeout;

    const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => {
            reject(new Error('RPC timeout'));
        }, ms);
    });

    return Promise.race([p, timeoutPromise])
        .finally(() => {
            if (timeoutId) clearTimeout(timeoutId);
        });
}
