import {Collection, Db, Long, MongoClient} from 'mongodb'
import {Address, TonClient, TonTransaction} from 'ton'
import {Logger} from 'winston'
import {delay} from 'ton/dist/utils/time'
import {Bet, State} from '../types'
import {defaultState} from '../default'

export type ParserConfig = {
    logger: Logger
    mongo: MongoClient
    endpoint: string
    delay: number
    limit: number
    contract: Address
    version: string
    betsFromTransactions: (transactions: TonTransaction[], state: State) => Bet[]
}

export default async (config: ParserConfig): Promise<void> => {
    const client: TonClient = new TonClient({endpoint: config.endpoint})
    const database: Db = config.mongo.db('parser')
    const stateCollection: Collection<State> = database.collection(`state`)
    const betsCollection: Collection<Bet> = database.collection('bets')
    let state: State = await stateCollection.findOne({version: {$eq: config.version}}) ??
        defaultState(config.version)
    state.version = config.version
    let newState: State = {...state}

    await betsCollection.createIndex({lt: 1}, {unique: true})

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

    async function parse(): Promise<void> {
        const transactions: TonTransaction[] = await client.getTransactions(config.contract, {
            limit: config.limit,
            lt: state.parserLt.toString(),
            hash: state.parseHash
        })

        if (!transactions.length) {
            newState.parserLt = new Long(0)
            newState.parseHash = ''
            newState.parserTargetLt = state.maxLt
            newState.parserTargetHash = state.maxHash
            return
        }

        const bets: Bet[] = config.betsFromTransactions(transactions, state)
        bets.forEach((bet: Bet) => {
            betsCollection.updateOne({lt: {$eq: bet.lt}}, {$set: bet}, {upsert: true})
            config.logger.info('New bet', {data: bet})
        })

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

    async function updateState(): Promise<void> {
        if (JSON.stringify(state) !== JSON.stringify(newState)) {
            state = {...newState}
            await stateCollection.updateOne({version: {$eq: config.version}}, {$set: state}, {upsert: true})
        }
    }
}