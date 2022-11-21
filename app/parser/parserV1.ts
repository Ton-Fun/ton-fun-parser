import { Db, Long } from 'mongodb'
import { Logger } from 'winston'
import { parser } from './parser'
import { Address, TonTransaction } from 'ton'
import BN from 'bn.js'
import { ParserVersion, State } from '../model/state'
import { Bet } from '../model/bet'

const MIN_BET_VALUE: number = 500_000_000

interface ParserV1Config {
  endpoint: string
  delay: number
  limit: number
  contract: Address
}

export async function parserV1 (logger: Logger, db: Db, config: ParserV1Config): Promise<void> {
  const version: ParserVersion = '1'
  await parser({
    logger,
    db,
    endpoint: config.endpoint,
    delay: config.delay,
    limit: config.limit,
    contract: config.contract,
    version,
    betsFromTransactions: (transactions: TonTransaction[], state: State): Bet[] => {
      const filtered: TonTransaction[] = transactions.filter((transaction: TonTransaction): unknown => {
        return (transaction.inMessage?.value?.gte(new BN(MIN_BET_VALUE))) === true &&
          (new Long(transaction.id.lt)).gt(state.parserTargetLt)
      })

      const bets: Bet[] = []
      filtered.forEach((transaction: TonTransaction): void => {
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
