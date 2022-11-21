import { api } from './api'
import { createLogger } from './logger'
import { createMongoClient } from './db'
import { Logger } from 'winston'
import * as dotenv from 'dotenv'
import { Db, MongoClient } from 'mongodb'
import { parserV1 } from './parser/parserV1'
import { parserV2 } from './parser/parserV2'
import { LogError, LogInfo } from './log'
import { readInt, readString } from './util/env'

const LOGGER_INFO: string = 'log/parser.log'
const LOGGER_ERROR: string = 'log/error.log'
const LOGGER_MAX_SIZE: number = 10 * 1024 * 1024

const DEFAULT_MONGO_HOST: string = 'localhost'
const DEFAULT_MONGO_PORT: string = '27017'
const DEFAULT_MONGO_INITDB_ROOT_USERNAME: string = 'root'
const DEFAULT_MONGO_INITDB_ROOT_PASSWORD: string = 'example'
const DEFAULT_MONGO_CONNECTION_ATTEMPTS: number = 5

async function main (): Promise<void> {
  dotenv.config()

  const logger: Logger = createLogger({
    info: LOGGER_INFO,
    error: LOGGER_ERROR,
    maxSize: LOGGER_MAX_SIZE
  })
  logger.info(LogInfo.STARTED)

  const mongo: MongoClient = await createMongoClient({
    host: readString(process.env.MONGO_HOST, DEFAULT_MONGO_HOST),
    port: readString(process.env.MONGO_PORT, DEFAULT_MONGO_PORT),
    username: readString(process.env.MONGO_INITDB_ROOT_USERNAME, DEFAULT_MONGO_INITDB_ROOT_USERNAME),
    password: readString(process.env.MONGO_INITDB_ROOT_PASSWORD, DEFAULT_MONGO_INITDB_ROOT_PASSWORD),
    connectionAttempts: readInt(process.env.MONGO_CONNECTION_ATTEMPTS, DEFAULT_MONGO_CONNECTION_ATTEMPTS)
  }, logger)
  const db: Db = mongo.db('parser')
  logger.info(LogInfo.INITIALIZED)

  api(logger, db)
  parserV1(logger, db).catch((e: any) => logger.error(LogError.PARSER_FAILED, { data: e }))
  parserV2(logger, db).catch((e: any) => logger.error(LogError.PARSER_FAILED, { data: e }))
}

main().catch((e: any) => {
  console.dir(e)
  process.exit(1)
})
