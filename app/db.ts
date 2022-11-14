import {Logger} from 'winston'
import {MongoClient} from 'mongodb'

const MONGO_HOST: string = process.env.MONGO_HOST ?? 'localhost'
const MONGO_PORT: string = process.env.MONGO_PORT ?? '27017'
const MONGO_INITDB_ROOT_USERNAME: string = process.env.MONGO_INITDB_ROOT_USERNAME ?? 'root'
const MONGO_INITDB_ROOT_PASSWORD: string = process.env.MONGO_INITDB_ROOT_PASSWORD ?? 'example'

export default async (logger: Logger): Promise<MongoClient> => {
    const uri = `mongodb://${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}`
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