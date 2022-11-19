import {Bet} from '../../model/bet'
import {parserVersions, State} from '../../model/state'
import {ExtendableContext} from 'koa'
import Router from '@koa/router'
import {Db} from 'mongodb'
import {getState} from '../../model/state'

export default (router: Router, db: Db) => {
    type StateResult = State & {
        scraped: number
    }

    router.get('/state', async (ctx: ExtendableContext): Promise<void> => {
        let result: StateResult[] = []
        for (const version of parserVersions)
            result.push({
                ...await getState(db, version),
                scraped: await db.collection<Bet>('bets').countDocuments({version: {$eq: version}})
            })
        ctx.body = result
    })
}