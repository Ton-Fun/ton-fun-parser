import { api } from './api'
import { createLogger } from './logger'
import { createMongoClient } from './db'
import { Logger } from 'winston'
import { Db, MongoClient } from 'mongodb'
import { parserV1 } from './parser/parserV1'
import { parserV2 } from './parser/parserV2'
import { LogError, LogInfo } from './log'
import { killer } from './killer'
import { Environment, read } from './envReader'

async function main (): Promise<void> {
  const environment: Environment = read()
  const logger: Logger = createLogger({
    console: environment.LOGGER_CONSOLE,
    info: environment.LOGGER_INFO,
    error: environment.LOGGER_ERROR,
    maxSize: environment.LOGGER_MAX_SIZE
  })
  logger.info(LogInfo.STARTED)

  killer(logger)

  const mongo: MongoClient = await createMongoClient({
    host: environment.MONGO_HOST,
    port: environment.MONGO_PORT,
    username: environment.MONGO_INITDB_ROOT_USERNAME,
    password: environment.MONGO_INITDB_ROOT_PASSWORD,
    connectionAttempts: environment.MONGO_CONNECTION_ATTEMPTS
  }, logger)
  const db: Db = mongo.db('parser')
  logger.info(LogInfo.INITIALIZED)

  api(logger, db, {
    port: environment.PORT,
    betsMaxLimit: environment.BETS_MAX_LIMIT
  })

  parserV1(logger, db, {
    endpoint: environment.PARSER_V1_ENDPOINT,
    delay: environment.PARSER_V1_DELAY,
    limit: environment.PARSER_V1_LIMIT,
    contract: environment.PARSER_V1_ADDRESS
  }).catch((e: any) => logger.error(LogError.PARSER_FAILED, { data: e }))

  parserV2(logger, db, {
    endpoint: environment.PARSER_V2_ENDPOINT,
    delay: environment.PARSER_V2_DELAY,
    limit: environment.PARSER_V2_LIMIT,
    contract: environment.PARSER_V2_ADDRESS,
    echoContract: environment.PARSER_V2_ECHO_ADDRESS
  }).catch((e: any) => logger.error(LogError.PARSER_FAILED, { data: e }))
}

main().catch((e: any) => {
  console.dir(e)
  process.exit(1)
})
