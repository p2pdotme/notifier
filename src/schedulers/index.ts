import { getHttpProvider, getHttpUrl } from '../helpers/provider';
import { DIAMOND_ABI } from '../helpers/abi';
import { processPriceSchedulers } from './schedule';
import { Contract } from 'ethers';
import { logger } from '../helpers/logger';
import { PriceConfig } from '../helpers/types';

export async function startSchedulers(config: PriceConfig) {
    const httpUrl = getHttpUrl(config.alchemyApiKey);
    const httpProvider = getHttpProvider(httpUrl);
    const diamondAddress = config.diamondAddress;
    const diamond = new Contract(diamondAddress, DIAMOND_ABI, httpProvider);

    logger.info('schedulers: starting price schedulers');
    try {
        await processPriceSchedulers(diamond, config);
        logger.info('price schedulers started');
    } catch (err: any) {
        logger.error(`❌ schedulers: failed to start: ${String(err.message)}`);
        throw new Error(`❌ schedulers: failed to start: ${String(err.message)}`);
    }
}
