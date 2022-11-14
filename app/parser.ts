import {Collection, Db, Long, MongoClient} from 'mongodb'
import {Address, Cell, Slice, TonClient, TonMessageData, TonTransaction} from 'ton'
import {Logger} from 'winston'
import {delay} from 'ton/dist/utils/time'
import {Bet, State} from './types'
import {defaultState} from './default'

export default async (logger: Logger, mongoClient: MongoClient) => {
    const PARSER_ADDRESS: string = process.env.PARSER_ADDRESS ?? ''
    const PARSER_ECHO_ADDRESS: string = process.env.PARSER_ECHO_ADDRESS ?? ''
    const PARSER_ENDPOINT: string = process.env.PARSER_ENDPOINT ?? 'https://mainnet.tonhubapi.com/jsonRPC'
    const PARSER_LIMIT: number = process.env.PARSER_LIMIT ? parseInt(process.env.PARSER_LIMIT) : 100
    const PARSER_DELAY: number = process.env.PARSER_DELAY ? parseInt(process.env.PARSER_DELAY) : 200

    const tonClient: TonClient = new TonClient({
        endpoint: PARSER_ENDPOINT
    })
    const contract: Address = Address.parse(PARSER_ADDRESS)
    const echoContract: Address = Address.parse(PARSER_ECHO_ADDRESS)
    const database: Db = mongoClient.db('parser')
    const stateCollection: Collection<State> = database.collection('state')
    const betsCollection: Collection<Bet> = database.collection('bets')
    let state: State = await stateCollection.findOne() ?? defaultState
    let newState: State = {...state}

    await betsCollection.createIndex({lt: 1}, {unique: true})

    while (true) {
        try {
            await parse()
            await updateState()
        } catch (e: any) {
            logger.error(e.stack)
        }
        await delay(PARSER_DELAY)
    }

    async function parse(): Promise<void> {
        const transactions: TonTransaction[] = await tonClient.getTransactions(contract, {
            limit: PARSER_LIMIT,
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

        const filteredTransactions: TonTransaction[] = transactions.filter((transaction: TonTransaction) => {
            return transaction.inMessage?.source &&
                transaction.inMessage?.source.toString() === echoContract.toString() &&
                (new Long(transaction.id.lt)).gt(state.parserTargetLt)
        })

        filteredTransactions.forEach((transaction: TonTransaction) => {
            const lt: Long = new Long(transaction.id.lt)
            const hash: string = transaction.id.hash
            const time: Long = new Long(transaction.time)
            // @ts-ignore
            const buffer: Buffer = (transaction.inMessage.body as TonMessageData).data
            const slice: Slice = Slice.fromCell(Cell.fromBoc(buffer)[0])
            const addressOrNull: Address | null = slice.readAddress()
            const address: string = addressOrNull ? addressOrNull.toFriendly() : ''
            const value: Long = new Long(slice.readCoins().toString())
            const win: boolean = transaction.outMessages.length === 1
            const bet: Bet = {
                lt,
                hash,
                time,
                address,
                value,
                win
            }
            betsCollection.updateOne({lt: {$eq: bet.lt}}, {$set: bet}, {upsert: true})
            logger.info('New bet', bet)
        })

        const maxTransaction: TonTransaction = transactions[0]
        if ((new Long(maxTransaction.id.lt)).gt(state.maxLt)) {
            newState.maxLt = new Long(maxTransaction.id.lt)
            newState.maxHash = maxTransaction.id.hash
        }

        const minTransaction: TonTransaction = transactions[transactions.length - 1]
        if ((new Long(minTransaction.id.lt)).lte(state.parserTargetLt) || transactions.length < PARSER_LIMIT) {
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
            await stateCollection.updateOne({}, {$set: state}, {upsert: true})
        }
    }
}