import api from './api'
import parser from './parser'
import createLogger from './logger'
import createDatabaseClient from './db'
import {Logger} from 'winston'
import * as dotenv from 'dotenv'
import {MongoClient} from "mongodb";

async function main() {
    dotenv.config()
    const logger: Logger = createLogger()
    const client: MongoClient = await createDatabaseClient(logger)
    api(logger)
    parser(client)
}

main().catch(console.dir)