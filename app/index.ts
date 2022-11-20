import api from './api'
import createLogger from './logger/index'
import createDatabaseClient from './db'
import { Logger } from 'winston'
import * as dotenv from 'dotenv'
import { MongoClient } from 'mongodb'
import parserV1 from './parser/parserV1'
import parserV2 from './parser/parserV2'
import { LogInfo } from './logger/message'

async function main (): Promise<void> {
  dotenv.config()

  const logger: Logger = createLogger()
  logger.info(LogInfo.INITIALIZATION)

  const mongo: MongoClient = await createDatabaseClient(logger)
  api(logger, mongo)
  parserV1(logger, mongo).catch((e: any) => logger.error(e.stack))
  parserV2(logger, mongo).catch((e: any) => logger.error(e.stack))
}

main().catch(console.dir)
