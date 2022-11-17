import {Long} from 'mongodb'

export type Bet = {
    lt: Long
    hash: string
    time: Long
    address: string
    value: Long
    win: boolean
    version: string
}

export type State = {
    maxLt: Long
    maxHash: string
    parserLt: Long
    parseHash: string
    parserTargetLt: Long
    parserTargetHash: string
    version: string
}

export type ParserVersion = '1' | '2'