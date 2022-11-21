import { Db, Long } from 'mongodb'
import { Logger } from 'winston'
import { parser } from './parser'
import { Address, Cell, Slice, TonTransaction } from 'ton'
import { TonMessage } from 'ton/dist/client/TonTransaction'
import { readAddress, readInt, readString } from '../util/env'
import BN from 'bn.js'
import { ParserVersion, State } from '../model/state'
import { Bet } from '../model/bet'

const DEFAULT_DELAY: number = 200
const DEFAULT_LIMIT: number = 50

export async function parserV2 (logger: Logger, db: Db): Promise<void> {
  const version: ParserVersion = '2'
  const echoContract: Address = readAddress(process.env.PARSER_V2_ECHO_ADDRESS)
  await parser({
    logger,
    db,
    endpoint: readString(process.env.PARSER_V2_ENDPOINT),
    delay: readInt(process.env.PARSER_V2_DELAY, DEFAULT_DELAY),
    limit: readInt(process.env.PARSER_V2_LIMIT, DEFAULT_LIMIT),
    contract: readAddress(process.env.PARSER_V2_ADDRESS),
    version,
    betsFromTransactions: (transactions: TonTransaction[], state: State): Bet[] => {
      const filtered: TonTransaction[] = transactions.filter((transaction: TonTransaction) => {
        const transactionFromEcho: boolean = transaction.inMessage?.source !== null &&
          transaction.inMessage?.source.toFriendly() === echoContract.toFriendly() &&
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
      filtered.forEach((transaction: TonTransaction) => {
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
