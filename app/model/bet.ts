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