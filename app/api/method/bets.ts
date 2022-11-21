import Router, { RouterParamContext } from '@koa/router'
import { Db } from 'mongodb'
import validator from 'koa-context-validator'
import Joi from 'joi'
import { ExtendableContext } from 'koa'
import { allVersions } from '../util/filter'
import { Bet } from '../../model/bet'

export function bets (router: Router, db: Db, betsMaxLimit: number): void {
  router.get('/bets',
    validator({
      query: Joi.object().keys({
        offset: Joi.number().integer().min(0),
        limit: Joi.number().integer().min(0).max(betsMaxLimit)
      })
    }),
    async (ctx: ExtendableContext & RouterParamContext) => {
      const offset: number = ctx.query.offset != null ? parseInt(ctx.query.offset.toString()) : 0
      const limit: number = ctx.query.limit != null ? parseInt(ctx.query.limit.toString()) : betsMaxLimit
      const filter: any = await allVersions(db)
      ctx.body = await db.collection<Bet>('bets')
        .find(filter)
        .sort('lt', 'asc')
        .skip(offset)
        .limit(limit)
        .project<Bet>({ _id: 0 })
        .toArray()
    })

  router.get('/bets/stream',
    validator({
      query: Joi.object().keys({
        offset: Joi.number().integer().min(0),
        limit: Joi.number().integer().min(0).max(betsMaxLimit)
      })
    }),
    async (ctx: ExtendableContext & RouterParamContext) => {
      const offset: number = ctx.query.offset != null ? parseInt(ctx.query.offset.toString()) : 0
      const limit: number = ctx.query.limit != null ? parseInt(ctx.query.limit.toString()) : betsMaxLimit
      const filter: any = await allVersions(db)
      ctx.body = await db.collection<Bet>('bets')
        .find(filter)
        .skip(offset)
        .limit(limit)
        .project<Bet>({ _id: 0 })
        .toArray()
    })

  router.get('/bets/total', async (ctx: ExtendableContext) => {
    const filters: any = await allVersions(db)
    const result: any[] = await db.collection<Bet>('bets').aggregate([
      { $match: filters },
      { $count: 'lt' },
      { $project: { total: '$lt' } }
    ]).toArray()
    ctx.body = (result.length > 0) ? result[0] : { total: 0 }
  })
}
