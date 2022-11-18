import {Bet, ParserVersion, State} from '../types'
import {defaultState, parserVersions} from '../default'
import {ExtendableContext} from 'koa'
import Router from '@koa/router'
import {Db} from 'mongodb'

export const getState = async (db: Db, version: ParserVersion): Promise<State> => {
    return await db.collection<State>('state')
        .findOne({version: {$eq: version}}, {projection: {_id: 0}}) ?? defaultState(version)
}

export default (router: Router, db: Db) => {
    type StateResult = State & {
        scraped: number
    }

    router.get('/state', async (ctx: ExtendableContext): Promise<void> => {
        let result: StateResult[] = []
        for (const version of parserVersions) {
            result.push({
                ...await getState(db, version),
                scraped: await db.collection<Bet>('bets').countDocuments({version: {$eq: version}})
            })
        }
        ctx.body = result
    })
}