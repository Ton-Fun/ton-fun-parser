import { Bet } from '../../model/bet'
import { getState, parserVersions, State } from '../../model/state'
import { ExtendableContext } from 'koa'
import Router from '@koa/router'
import { Db } from 'mongodb'

export default (router: Router, db: Db): void => {
  type StateResult = State & {
    scraped: number
  }

  router.get('/state', async (ctx: ExtendableContext): Promise<void> => {
    const result: StateResult[] = []
    for (const version of parserVersions) {
      result.push({
        ...await getState(db, version),
        scraped: await db.collection<Bet>('bets').countDocuments({ version: { $eq: version } })
      })
    }
    ctx.body = result
  })
}
