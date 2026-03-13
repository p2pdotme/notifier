import express from 'express'
import dotenv from 'dotenv'
dotenv.config()

import { loadCommonConfig, loadOrderConfig, loadPriceConfig } from './helpers/config'
import { startListeners } from './listeners'
import { startSchedulers } from './schedulers'
import { startWorker } from './queue/worker'
import { logger } from './helpers/logger'

const PORT = process.env.PORT ? Number(process.env.PORT) : 8000

const app = express()
app.get('/healthz', (_req, res) => res.status(200).send('I\'m alive'))

async function start() {
    app.listen(PORT, () => logger.info(`http server listening on port ${PORT}`))

    const commonConfig = loadCommonConfig()
    const orderConfig = loadOrderConfig()
    const priceConfig = loadPriceConfig()

    // start listeners (ws)
    try {
        await startListeners(orderConfig)
        logger.info('listeners started')
    } catch (err: any) {
        logger.error(`❌ failed to start listeners: ${String(err.message)}`)
        process.exit(1)
    }

    // start schedulers
    try {
        await startSchedulers(priceConfig)
        logger.info('schedulers started')
    } catch (err: any) {
        logger.error(`❌ failed to start schedulers: ${String(err.message)}`)
    }

    // start worker
    try {
        startWorker(commonConfig)
        logger.info('worker started')
    } catch (err: any) {
        logger.error(`❌ failed to start worker: ${String(err.message)}`)
        process.exit(1)
    }
}

start().catch(err => {
    logger.error(`❌ startup error: ${String(err)}`)
    process.exit(1)
})

process.on('unhandledRejection', (r) => logger.error(`❌ unhandledRejection: ${String(r)}`))
process.on('uncaughtException', (err) => {
    logger.error(`❌ uncaughtException: ${String(err)}`)
    process.exit(1)
})
