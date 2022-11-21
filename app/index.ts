import api from './api'
import createLogger from './logger/index'
import createMongoClient from './db'
import { Logger } from 'winston'
import * as dotenv from 'dotenv'
import { Db, MongoClient } from 'mongodb'
import parserV1 from './parser/parserV1'
import parserV2 from './parser/parserV2'
import { LogInfo } from './log'

async function main (): Promise<void> {
  dotenv.config()

  const logger: Logger = createLogger()
  logger.info(LogInfo.INITIALIZATION)

  const mongo: MongoClient = await createMongoClient(logger)
  const db: Db = mongo.db('parser')
  api(logger, db)
  parserV1(logger, db).catch((e: any) => logger.error(e.stack))
  parserV2(logger, db).catch((e: any) => logger.error(e.stack))
}

main().catch((e: any) => {
  console.dir(e)
  process.exit()
})
