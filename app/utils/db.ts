import {Logger} from 'winston'
import {MongoClient} from 'mongodb'
import {readString} from './env'

export default async (logger: Logger): Promise<MongoClient> => {
    const host: string = readString(process.env.MONGO_HOST, 'localhost')
    const port: string = readString(process.env.MONGO_PORT, '27017')
    const username: string = readString(process.env.MONGO_INITDB_ROOT_USERNAME, 'root')
    const password: string = readString(process.env.MONGO_INITDB_ROOT_PASSWORD, 'example')

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