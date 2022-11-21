import { Db, Long } from 'mongodb'
import { Logger } from 'winston'
import { parser } from './parser'
import { Address, Cell, Slice, TonTransaction } from 'ton'
import { TonMessage } from 'ton/dist/client/TonTransaction'
import BN from 'bn.js'
import { ParserVersion, State } from '../model/state'
import { Bet } from '../model/bet'

interface ParserV2Config {
  endpoint: string
  delay: number
  limit: number
  contract: Address
  echoContract: Address
}

export async function parserV2 (logger: Logger, db: Db, config: ParserV2Config): Promise<void> {
  const version: ParserVersion = '2'
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
        const transactionFromEcho: boolean = transaction.inMessage?.source !== null &&
          transaction.inMessage?.source.toFriendly() === config.echoContract.toFriendly() &&
          (new Long(transaction.id.lt)).gt(state.parserTargetLt)
        if (!transactionFromEcho) {
          return false
        }

        const transactionBody: TransactionBody = readTransactionBody(transaction)
        const notEnoughMoneyToPayReward: boolean = transaction.outMessages != null &&
          transaction.outMessages.length === 1 &&
          transaction.outMessages[0].source?.toFriendly() === transactionBody.address.toFriendly() &&
          transaction.outMessages[0].value.lte(transactionBody.coins)

        return !notEnoughMoneyToPayReward
      })

      const bets: Bet[] = []
      filtered.forEach((transaction: TonTransaction): void => {
        const transactionBody: TransactionBody = readTransactionBody(transaction)
        bets.push({
          lt: new Long(transaction.id.lt),
          hash: transaction.id.hash,
          time: new Long(transaction.time),
          address: transactionBody.address.toFriendly(),
          value: new Long(transactionBody.coins.toString()),
          win: transaction.outMessages.length === 1,
          version
        })
      })
      return bets
    }
  })

  interface TransactionBody {
    address: Address
    coins: BN
  }

  function readTransactionBody (transaction: TonTransaction): TransactionBody {
    const buffer: Buffer = ((transaction.inMessage as TonMessage).body as {
      type: 'data'
      data: Buffer
    }).data
    const slice: Slice = Slice.fromCell(Cell.fromBoc(buffer)[0])
    return { address: slice.readAddress() as Address, coins: slice.readCoins() }
  }
}
