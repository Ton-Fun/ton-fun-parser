import {Db} from 'mongodb'
import {getState, ParserVersion, parserVersions, State} from '../../model/state'

export async function singleVersion(db: Db, version: ParserVersion) {
    const state: State = await getState(db, version)
    return {
        lt: {$lte: state.parserTargetLt},
        version: {$eq: version}
    }
}

export async function allVersions(db: Db) {
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