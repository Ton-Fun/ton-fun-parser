import api from './api'
import createLogger from './logger/logger'
import createDatabaseClient from './db'
import {Logger} from 'winston'
import * as dotenv from 'dotenv'
import {MongoClient} from 'mongodb'
import parserV1 from './parser/parserV1'
import parserV2 from './parser/parserV2'

async function main() {
    dotenv.config()
    const logger: Logger = createLogger()
    const mongo: MongoClient = await createDatabaseClient(logger)
    api(logger, mongo)
    parserV1(logger, mongo).catch((e: any) => logger.error(e.stack))
    parserV2(logger, mongo).catch((e: any) => logger.error(e.stack))
}

main().catch(console.dir)