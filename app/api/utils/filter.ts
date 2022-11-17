import {ParserVersion, State} from '../../types'
import {getState} from '../state'
import {Db} from 'mongodb'
import {parserVersions} from '../../default'

export async function singleVersionFilter(db: Db, version: ParserVersion) {
    const state: State = await getState(db, version)
    return {
        lt: {$lte: state.parserTargetLt},
        version: {$eq: version}
    }
}

export async function allVersionsFilter(db: Db) {
    const filters: { [key: string]: any } = []
    for (const version of parserVersions) {
        const state: State = await getState(db, version)
        filters.push({
            lt: {$lte: state.parserTargetLt},
            version: {$eq: version}
        })
    }
    return {$or: filters}
}