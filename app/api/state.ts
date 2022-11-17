import {Bet, ParserVersion, State} from '../types'
import {defaultState, parserVersions} from '../default'
import {ExtendableContext} from 'koa'
import Router from '@koa/router'
import {Db} from 'mongodb'

export const getState = async (db: Db, version: ParserVersion): Promise<State> => {
    return await db.collection<State>('state').findOne({version: {$eq: version}}) ?? defaultState(version)
}

export default (router: Router, db: Db) => {
    type StateResult = {
        state: State
        scraped: number
    }

    router.get('/state', async (ctx: ExtendableContext): Promise<void> => {
        let results: { [key: string]: StateResult } = {}
        for (const version of parserVersions)
            results[version] = {
                state: await getState(db, version),
                scraped: await db.collection<Bet>('bets').countDocuments({version: {$eq: version}})
            }
        ctx.body = results
    })
}