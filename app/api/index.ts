import Koa from 'koa'
import Router from '@koa/router'
import {Logger} from 'winston'
import {Db, MongoClient} from 'mongodb'
import {readInt} from '../utils/env'
import headers from './headers'
import health from './health'
import state from './state'
import summary from './summary'
import players from './players'
import bets from './bets'

const DEFAULT_PORT: number = 3000

export default (logger: Logger, mongo: MongoClient): void => {
    const port: number = readInt(process.env.PORT, DEFAULT_PORT)

    const app: Koa = new Koa()
    const router: Router = new Router()
    const db: Db = mongo.db('parser')

    headers(app)

    health(router)
    state(router, db)
    summary(router, db)
    players(router, db)
    bets(router, db)

    try {
        app.use(router.middleware()).listen(port)
    } catch (e: any) {
        logger.error(e.stack)
    }
}