import {ParserVersion, State} from './types'
import {Long} from 'mongodb'

export function defaultState(version: string): State {
    return {
        maxLt: new Long(0),
        maxHash: '',
        parserLt: new Long(0),
        parseHash: '',
        parserTargetLt: new Long(0),
        parserTargetHash: '',
        version: version
    }
}

export const parserVersions: ParserVersion[] = ['1', '2']