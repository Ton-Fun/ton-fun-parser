import { defaultReaders, readEnvironment } from '../env'
import { tonAddressReader, ZERO_ADDRESS } from './tonAddressReader'
import * as dotenv from 'dotenv'

const defaults = {
  PORT: 3000,
  BETS_MAX_LIMIT: 5000,
  LOGGER_CONSOLE: true,
  LOGGER_INFO: 'log/parser.log',
  LOGGER_ERROR: 'log/error.log',
  LOGGER_MAX_SIZE: 10 * 1024 * 1024,
  MONGO_HOST: 'localhost',
  MONGO_PORT: '27017',
  MONGO_INITDB_ROOT_USERNAME: 'root',
  MONGO_INITDB_ROOT_PASSWORD: 'example',
  MONGO_CONNECTION_ATTEMPTS: 5,
  PARSER_V1_ENDPOINT: 'https://api.uniton.app/jsonRPC',
  PARSER_V1_LIMIT: 50,
  PARSER_V1_DELAY: 200,
  PARSER_V1_ADDRESS: ZERO_ADDRESS,
  PARSER_V1_OWNER: ZERO_ADDRESS,
  PARSER_V2_ENDPOINT: 'https://api.uniton.app/jsonRPC',
  PARSER_V2_LIMIT: 50,
  PARSER_V2_DELAY: 200,
  PARSER_V2_ADDRESS: ZERO_ADDRESS,
  PARSER_V2_ECHO_ADDRESS: ZERO_ADDRESS
}
export type Environment = typeof defaults

export function read (): Environment {
  dotenv.config()
  return readEnvironment<Environment>(process.env, defaults, { ...defaultReaders, Address: tonAddressReader })
}
