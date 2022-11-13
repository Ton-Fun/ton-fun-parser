import {Collection, Db, MongoClient} from 'mongodb'
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
            lt: state.parserLt,
            hash: state.parseHash
        })

        if (!transactions.length) {
            newState.parserLt = '0'
            newState.parseHash = ''
            newState.parserTargetLt = state.maxLt
            newState.parserTargetHash = state.maxHash
            return
        }

        const filteredTransactions: TonTransaction[] = transactions.filter((transaction: TonTransaction) => {
            return transaction.inMessage?.source &&
                transaction.inMessage?.source.toString() === echoContract.toString() &&
                BigInt(transaction.id.lt) > BigInt(state.parserTargetLt)
        })

        filteredTransactions.forEach((transaction: TonTransaction) => {
            const lt: string = transaction.id.lt
            const hash: string = transaction.id.hash
            const time: number = transaction.time
            // @ts-ignore
            const buffer: Buffer = (transaction.inMessage.body as TonMessageData).data
            const slice: Slice = Slice.fromCell(Cell.fromBoc(buffer)[0])
            const addressOrNull: Address | null = slice.readAddress()
            const address: string = addressOrNull ? addressOrNull.toFriendly() : ''
            const value: string = slice.readCoins().toString()
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
        if (BigInt(maxTransaction.id.lt) > BigInt(state.maxLt)) {
            newState.maxLt = maxTransaction.id.lt
            newState.maxHash = maxTransaction.id.hash
        }

        const minTransaction: TonTransaction = transactions[transactions.length - 1]
        if (BigInt(minTransaction.id.lt) <= BigInt(state.parserTargetLt) || transactions.length < PARSER_LIMIT) {
            newState.parserLt = '0'
            newState.parseHash = ''
            newState.parserTargetLt = newState.maxLt
            newState.parserTargetHash = newState.maxHash
        } else {
            newState.parserLt = minTransaction.id.lt
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