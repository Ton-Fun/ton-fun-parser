import {Logger} from 'winston'
import {MongoClient} from 'mongodb'
import {readString} from './util/env'

const DEFAULT_HOST: string = 'localhost'
const DEFAULT_PORT: string = '27017'
const DEFAULT_MONGO_INITDB_ROOT_USERNAME: string = 'root'
const DEFAULT_MONGO_INITDB_ROOT_PASSWORD: string = 'example'

export default async (logger: Logger): Promise<MongoClient> => {
    const host: string = readString(process.env.MONGO_HOST, DEFAULT_HOST)
    const port: string = readString(process.env.MONGO_PORT, DEFAULT_PORT)
    const username: string = readString(process.env.MONGO_INITDB_ROOT_USERNAME, DEFAULT_MONGO_INITDB_ROOT_USERNAME)
    const password: string = readString(process.env.MONGO_INITDB_ROOT_PASSWORD, DEFAULT_MONGO_INITDB_ROOT_PASSWORD)

    const uri: string = `mongodb://${username}:${password}@${host}:${port}`
    const client: MongoClient = new MongoClient(uri)

    try {
        await client.connect()
        await client.db('admin').command({ping: 1})
        logger.info('Connected successfully to database')
    } catch (e: any) {
        logger.error(e.stack)
    }

    return client
}