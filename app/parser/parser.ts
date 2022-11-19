import { Db, Long, MongoClient } from 'mongodb'
import { Address, TonClient, TonTransaction } from 'ton'
import { Logger } from 'winston'
import { delay } from 'ton/dist/utils/time'
import { getState, ParserVersion, State } from '../model/state'
import { Bet } from '../model/bet'

const BET_LOG: string = 'BET'
const UPDATE_BET_ERROR_LOG: string = 'UPDATE_BET_ERROR'

export interface ParserConfig {
  logger: Logger
  mongo: MongoClient
  endpoint: string
  delay: number
  limit: number
  contract: Address
  version: ParserVersion
  betsFromTransactions: (transactions: TonTransaction[], state: State) => Bet[]
}

export default async (config: ParserConfig): Promise<void> => {
  const client: TonClient = new TonClient({ endpoint: config.endpoint })
  const db: Db = config.mongo.db('parser')
  let state: State = await getState(db, config.version)
  const newState: State = { ...state }

  await db.collection<Bet>('bets').createIndex({ lt: 1 }, { unique: true })

  // noinspection InfiniteLoopJS
  while (true) {
    try {
      await parse()
      await updateState()
    } catch (e: any) {
      config.logger.error(e.stack)
    }
    await delay(config.delay)
  }

  async function parse (): Promise<void> {
    const transactions: TonTransaction[] = await client.getTransactions(config.contract, {
      limit: config.limit,
      lt: state.parserLt.toString(),
      hash: state.parseHash
    })

    if (transactions.length === 0) {
      newState.parserLt = new Long(0)
      newState.parseHash = ''
      newState.parserTargetLt = state.maxLt
      newState.parserTargetHash = state.maxHash
      return
    }

    const bets: Bet[] = config.betsFromTransactions(transactions, state)
    try {
      for (const bet of bets) {
        await db.collection<Bet>('bets').updateOne(
          { lt: { $eq: bet.lt } },
          { $set: bet }, { upsert: true }
        )
        config.logger.info(BET_LOG, { data: bet })
      }
    } catch (e: any) {
      config.logger.error(UPDATE_BET_ERROR_LOG, e)
    }

    const maxTransaction: TonTransaction = transactions[0]
    if ((new Long(maxTransaction.id.lt)).gt(state.maxLt)) {
      newState.maxLt = new Long(maxTransaction.id.lt)
      newState.maxHash = maxTransaction.id.hash
    }

    const minTransaction: TonTransaction = transactions[transactions.length - 1]
    if ((new Long(minTransaction.id.lt)).lte(state.parserTargetLt) || transactions.length < config.limit) {
      newState.parserLt = new Long(0)
      newState.parseHash = ''
      newState.parserTargetLt = newState.maxLt
      newState.parserTargetHash = newState.maxHash
    } else {
      newState.parserLt = new Long(minTransaction.id.lt)
      newState.parseHash = minTransaction.id.hash
    }
  }

  async function updateState (): Promise<void> {
    if (JSON.stringify(state) !== JSON.stringify(newState)) {
      state = { ...newState }
      await db.collection<State>('state').updateOne(
        { version: { $eq: config.version } },
        { $set: state }, { upsert: true }
      )
    }
  }
}
