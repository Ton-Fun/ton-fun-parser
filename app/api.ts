import Koa, {ExtendableContext} from 'koa'
import Router, {RouterParamContext} from '@koa/router'
import {Bet, State} from './types'
import Joi from 'joi'
import validator from 'koa-context-validator'
import {Logger} from 'winston'
import {Collection, Db, MongoClient} from 'mongodb'
import {defaultState} from './default'

export default (logger: Logger, mongoClient: MongoClient) => {
    const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000
    const BETS_MAX_LIMIT: number = process.env.BETS_MAX_LIMIT ? parseInt(process.env.BETS_MAX_LIMIT) : 1000

    const app: Koa = new Koa()
    const router: Router = new Router()
    const database: Db = mongoClient.db('parser')
    const stateCollection: Collection<State> = database.collection('state')
    const betsCollection: Collection<Bet> = database.collection('bets')

    router.get('/health', (ctx: ExtendableContext) => {
        ctx.body = { success: 'OK' }
    })

    router.get('/bets/total', async (ctx: ExtendableContext) => {
        const state: State = await stateCollection.findOne() ?? defaultState
        const total: number = await betsCollection.countDocuments({lt: {$lte: state.parserTargetLt}})
        ctx.body = { total }
    })

    router.get(
        '/bets',
        validator({
            query: Joi.object().keys({
                offset: Joi.number().integer().min(0),
                limit: Joi.number().integer().min(0).max(BETS_MAX_LIMIT)
            })
        }),
        async (ctx: ExtendableContext & RouterParamContext) => {
            const offset: number = ctx.query.offset ? parseInt(ctx.query.offset.toString()) : 0
            const limit: number = ctx.query.limit ? parseInt(ctx.query.limit.toString()) : BETS_MAX_LIMIT
            const state: State = await stateCollection.findOne() ?? defaultState
            const total: number = await betsCollection.countDocuments({lt: {$lte: state.parserTargetLt}})
            const bets: Bet[] = await betsCollection.find({lt: {$lte: state.parserTargetLt}})
                .skip(offset)
                .limit(limit)
                .toArray()
            ctx.body = { bets, total }
        })

    try {
        app.use(router.middleware()).listen(PORT)
    } catch (e: any) {
        logger.error(e.stack)
    }
}