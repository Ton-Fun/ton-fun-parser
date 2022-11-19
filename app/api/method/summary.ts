import Router, { RouterParamContext } from '@koa/router'
import { Db } from 'mongodb'
import { ExtendableContext } from 'koa'
import { allVersions, singleVersion } from '../util/filter'
import { Bet } from '../../model/bet'
import { parserVersions } from '../../model/state'

export default (router: Router, db: Db): void => {
  interface SummaryResult {
    players: number
  }

  const getSummary = async (db: Db, players: number, filters: any): Promise<SummaryResult> => {
    const summary = await db.collection<Bet>('bets').aggregate([{
      $match: filters
    }, {
      $group: {
        _id: '',
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
        _id: 0
      }
    }]).toArray()
    return { players, ...summary[0] }
  }

  router.get('/summary', async (ctx: ExtendableContext & RouterParamContext) => {
    const results: { [key: string]: SummaryResult } = {}
    for (const version of parserVersions) {
      const players: number = (await db.collection<Bet>('bets')
        .distinct('address', { version: { $eq: version } })
      ).length
      const filters: any = await singleVersion(db, version)
      results[version] = await getSummary(db, players, filters)
    }
    const players: number = (await db.collection<Bet>('bets').distinct('address')).length
    const filters: any = await allVersions(db)
    results.total = await getSummary(db, players, filters)
    ctx.body = results
  })
}
