import Router, { RouterParamContext } from '@koa/router'
import { Db } from 'mongodb'
import Joi from 'joi'
import validator from 'koa-context-validator'
import { ExtendableContext } from 'koa'
import { allVersions, singleVersion } from '../util/filter'
import { Bet } from '../../model/bet'
import { ParserVersion, parserVersions } from '../../model/state'

export function players (router: Router, db: Db): void {
  const DEFAULT_ORDER_BY: string = 'betsValue'
  const DEFAULT_SORT: string = 'asc'

  const validOrderBy: string[] = [
    'betsValue',
    'winsValue',
    'bets',
    'wins',
    'maxBet',
    'maxWin',
    'firstBetTimestamp',
    'lastBetTimestamp',
    'profit'
  ]

  const validSort: string[] = ['asc', 'desc']

  interface Sorting {
    $sort: number
  }

  const getSorting = (ctx: ExtendableContext): Sorting => {
    const orderBy: string = ctx.query.orderBy != null ? ctx.query.orderBy.toString() : DEFAULT_ORDER_BY
    const sort: string = ctx.query.sort != null ? ctx.query.sort.toString() : DEFAULT_SORT
    const sorting: { $sort: any } = { $sort: {} }
    sorting.$sort[orderBy] = (sort === 'asc') ? 1 : -1
    return sorting
  }

  const getPlayers = async (db: Db, filters: any, sorting: { $sort: any }): Promise<any> => {
    return await db.collection<Bet>('bets').aggregate([{
      $match: filters
    }, {
      $group: {
        _id: '$address',
        betsValue: { $sum: '$value' },
        winsValue: { $sum: { $cond: ['$win', { $multiply: ['$value', 2] }, 0] } },
        bets: { $sum: 1 },
        wins: { $sum: { $cond: ['$win', 1, 0] } },
        maxBet: { $max: '$value' },
        maxWin: { $max: { $cond: ['$win', { $multiply: ['$value', 2] }, 0] } },
        firstBetTimestamp: { $min: '$time' },
        lastBetTimestamp: { $max: '$time' }
      }
    }, {
      $project: {
        _id: 0,
        address: '$_id',
        betsValue: 1,
        winsValue: 1,
        bets: 1,
        wins: 1,
        maxBet: 1,
        maxWin: 1,
        firstBetTimestamp: 1,
        lastBetTimestamp: 1,
        profit: { $subtract: ['$winsValue', '$betsValue'] }
      }
    },
    sorting
    ]).toArray()
  }

  router.get('/players',
    validator({
      query: Joi.object().keys({
        orderBy: Joi.string().valid(...validOrderBy),
        sort: Joi.string().valid(...validSort)
      })
    }), async (ctx: ExtendableContext): Promise<void> => {
      const filters: any = await allVersions(db)
      const sorting: Sorting = getSorting(ctx)
      ctx.body = await getPlayers(db, filters, sorting)
    })

  router.get('/players/:version',
    validator({
      params: Joi.object().keys({
        version: Joi.string().valid(...parserVersions)
      })
    }), async (ctx: ExtendableContext & RouterParamContext): Promise<void> => {
      const filters: any = await singleVersion(db, ctx.params.version as ParserVersion)
      const sorting: Sorting = getSorting(ctx)
      ctx.body = await getPlayers(db, filters, sorting)
    })

  router.get('/player/:address',
    async (ctx: ExtendableContext & RouterParamContext): Promise<void> => {
      const address: string = ctx.params.address
      const filters: any = await allVersions(db)
      const extendedFilters: any = { $and: [{ address: { $eq: address } }, { ...filters }] }
      const sorting: Sorting = getSorting(ctx)
      const players: any[] = await getPlayers(db, extendedFilters, sorting)
      const bets: Bet[] = await db.collection<Bet>('bets')
        .find<Bet>({ address: { $eq: address } })
        .filter(extendedFilters)
        .project<Bet>({ _id: 0 })
        .toArray()
      ctx.body = {
        player: players[0] ?? [],
        bets
      }
    })
}
