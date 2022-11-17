import {Long, MongoClient} from 'mongodb'
import {Logger} from 'winston'
import parser from './parser'
import {TonTransaction} from 'ton'
import {Bet, State} from '../types'
import {readAddress, readInt, readString} from '../utils/env'
import BN from 'bn.js'

const DEFAULT_DELAY: number = 200
const DEFAULT_LIMIT: number = 50
const MIN_BET_VALUE: number = 500_000_000

export default async (logger: Logger, mongo: MongoClient) => {
    const version: string = '1'
    await parser({
        logger,
        mongo,
        endpoint: readString(process.env.PARSER_V2_ENDPOINT),
        delay: readInt(process.env.PARSER_V1_DELAY, DEFAULT_DELAY),
        limit: readInt(process.env.PARSER_V1_LIMIT, DEFAULT_LIMIT),
        contract: readAddress(process.env.PARSER_V1_ADDRESS),
        version,
        betsFromTransactions: (transactions: TonTransaction[], state: State): Bet[] => {
            const filtered: TonTransaction[] = transactions.filter((transaction: TonTransaction) => {
                return transaction.inMessage?.value &&
                    transaction.inMessage?.value.gte(new BN(MIN_BET_VALUE)) &&
                    (new Long(transaction.id.lt)).gt(state.parserTargetLt)
            })

            const bets: Bet[] = []
            filtered.forEach((transaction: TonTransaction) => {
                const address: string = transaction.inMessage?.source?.toFriendly() as string
                bets.push({
                    lt: new Long(transaction.id.lt),
                    hash: transaction.id.hash,
                    time: new Long(transaction.time),
                    address,
                    value: new Long(transaction.inMessage?.value.toString()),
                    win: transaction.inMessage?.value !== undefined &&
                        transaction.outMessages.length > 0 &&
                        transaction.outMessages[0].destination?.toFriendly() === address &&
                        transaction.outMessages[0].value.gt(transaction.inMessage?.value),
                    version
                })
            })
            return bets
        }
    })
}