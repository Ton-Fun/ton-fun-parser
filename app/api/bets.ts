import Router, {RouterParamContext} from '@koa/router'
import {Db} from 'mongodb'
import {readInt} from '../utils/env'
import validator from 'koa-context-validator'
import Joi from 'joi'
import {ExtendableContext} from 'koa'
import {allVersionsFilter} from './utils/filter'
import {Bet} from '../types'

const BETS_MAX_LIMIT: number = readInt(process.env.BETS_MAX, 5000)

export default (router: Router, db: Db) => {
    router.get('/bets',
        validator({
            query: Joi.object().keys({
                offset: Joi.number().integer().min(0),
                limit: Joi.number().integer().min(0).max(BETS_MAX_LIMIT)
            })
        }),
        async (ctx: ExtendableContext & RouterParamContext) => {
            const offset: number = ctx.query.offset ? parseInt(ctx.query.offset.toString()) : 0
            const limit: number = ctx.query.limit ? parseInt(ctx.query.limit.toString()) : BETS_MAX_LIMIT
            const filter: any = allVersionsFilter(db)
            ctx.body = await db.collection<Bet>('bets')
                .find(filter)
                .sort('lt', 'asc')
                .skip(offset)
                .limit(limit)
                .project<Bet>({_id: 0})
                .toArray()
        })

    router.get('/bets/stream',
        validator({
            query: Joi.object().keys({
                offset: Joi.number().integer().min(0),
                limit: Joi.number().integer().min(0).max(BETS_MAX_LIMIT)
            })
        }),
        async (ctx: ExtendableContext & RouterParamContext) => {
            const offset: number = ctx.query.offset ? parseInt(ctx.query.offset.toString()) : 0
            const limit: number = ctx.query.limit ? parseInt(ctx.query.limit.toString()) : BETS_MAX_LIMIT
            const filter: any = allVersionsFilter(db)
            ctx.body = await db.collection<Bet>('bets')
                .find(filter)
                .skip(offset)
                .limit(limit)
                .project<Bet>({_id: 0})
                .toArray()
        })

    router.get('/bets/total', async (ctx: ExtendableContext) => {
        const filters: any = allVersionsFilter(db)
        const result: any[] = await db.collection<Bet>('bets').aggregate([
            {$match: filters},
            {$count: "lt"},
            {$project: {total: "$lt"}}
        ]).toArray()
        ctx.body = result.length ? result[0] : {total: 0}
    })
}