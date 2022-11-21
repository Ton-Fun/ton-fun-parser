import { Logger } from 'winston'
import { MongoClient } from 'mongodb'

const MONGO_CONNECTION_FAILED: string = 'MONGO_CONNECTION_FAILED'
const MONGO_CONNECTION_RETRY: string = 'MONGO_CONNECTION_RETRY'
const CANT_CONNECT_TO_MONGO: string = 'Can\'t connect to MongoDB'

export interface MongoClientConfig {
  host: string
  port: string
  username: string
  password: string
  connectionAttempts: number
}

export default async function createMongoClient (config: MongoClientConfig, logger: Logger): Promise<MongoClient> {
  const uri: string = `mongodb://${config.username}:${config.password}@${config.host}:${config.port}`
  const client: MongoClient = new MongoClient(uri)

  let counter: number = 0
  while (counter < config.connectionAttempts) {
    try {
      await client.connect()
      await client.db('admin').command({ ping: 1 })
      break
    } catch (e: any) {
      logger.error(MONGO_CONNECTION_FAILED, { data: e })
      if (++counter < config.connectionAttempts)
        logger.info(MONGO_CONNECTION_RETRY, { attempt: counter })
      else
        throw new Error(CANT_CONNECT_TO_MONGO)
    }
  }

  return client
}
