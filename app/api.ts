import Koa, {ExtendableContext} from 'koa'
import Router, {RouterParamContext} from '@koa/router'
import {Bet, stubBets} from './bets'
import Joi from 'joi'
import validator from 'koa-context-validator'
import {Logger} from 'winston'

export default (logger: Logger) => {
    const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000
    const BETS_MAX_LIMIT: number = process.env.BETS_MAX_LIMIT ? parseInt(process.env.BETS_MAX_LIMIT) : 100

    const app: Koa = new Koa()
    const router: Router = new Router()

    router.get('/health', (ctx: ExtendableContext) => {
        ctx.body = { success: 'OK' }
    })

    router.get('/bets/total', (ctx: ExtendableContext) => {
        ctx.body = { total: stubBets.length }
    })

    router.get(
        '/bets',
        validator({
            query: Joi.object().keys({
                offset: Joi.number().integer().min(0),
                limit: Joi.number().integer().min(0).max(BETS_MAX_LIMIT)
            })
        }),
        (ctx: ExtendableContext & RouterParamContext) => {
            const offset: number = ctx.query.offset ? parseInt(ctx.query.offset.toString()) : 0
            const limit: number = ctx.query.limit ? parseInt(ctx.query.limit.toString()) : BETS_MAX_LIMIT
            const end: number = Math.min(offset + limit, stubBets.length)
            const bets: Bet[] = []
            for (let i = offset; i < end; i++)
                bets.push(stubBets[i])
            ctx.body = {
                bets,
                total: stubBets.length
            }
        })

    try {
        app.use(router.middleware()).listen(PORT)
    } catch (e) {
        logger.error(e)
    }
}