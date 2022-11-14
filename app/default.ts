import {State} from './types'
import {Long} from 'mongodb'

export const defaultState: State = {
    maxLt: new Long(0),
    maxHash: '',
    parserLt: new Long(0),
    parseHash: '',
    parserTargetLt: new Long(0),
    parserTargetHash: ''
}