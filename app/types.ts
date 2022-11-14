import {Long} from 'mongodb'

export type Bet = {
    lt: Long
    hash: string
    time: Long
    address: string
    value: Long
    win: boolean
}

export type State = {
    maxLt: Long
    maxHash: string
    parserLt: Long
    parseHash: string
    parserTargetLt: Long
    parserTargetHash: string
}