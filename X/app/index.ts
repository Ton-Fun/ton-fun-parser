// const uri =
//     'mongodb+srv://root:example@localhost:27017?retryWrites=true&writeConcern=majority'
// const client = new MongoClient(uri);

// import {Address, TonClient, TonTransaction} from 'ton'
// import config from './config'
// import {delay} from 'ton/dist/utils/time'
// import winston, {Logger} from 'winston'
//
// let lt: string = '0'
// let hash: string = ''
//
// const logger: Logger = winston.createLogger({
//     format: winston.format.json(),
//     transports: [
//         new winston.transports.Console({
//             format: winston.format.simple()
//         }),
//         new winston.transports.File({
//             filename: config.log.error,
//             level: 'error',
//             maxsize: config.log.maxSize
//         }),
//         new winston.transports.File({
//             filename: config.log.all,
//             maxsize: config.log.maxSize
//         })
//     ]
// })
//
// const client: TonClient = new TonClient({
//     endpoint: config.endpoint
// })
// const contract: Address = Address.parse(config.address)
//
// async function main(): Promise<void> {
//     while (true) {
//         try {
//             await parse()
//         } catch (e: any) {
//             logger.error(e)
//         }
//         await delay(config.delay)
//     }
// }
//
// async function parse(): Promise<void> {
//     const transactions: TonTransaction[] = await client.getTransactions(contract, {
//         limit: config.limit,
//         lt: lt,
//         hash: hash
//     })
//
//     if (transactions.length === 0)
//         return
//
//     const lastTransaction: TonTransaction = transactions[transactions.length - 1]
//     lt = lastTransaction.id.lt
//     hash = lastTransaction.id.hash
//
//     logger.info(lt)
//     logger.info(transactions.length)
//
//     // const transactions: TonTransaction[] = await client.getTransactions(Address.parse(config.address), {limit: config.limit})
//     // transactions.forEach((transaction: TonTransaction) => {
//     //     if (transaction.inMessage?.source && transaction.inMessage?.source.toString() === Address.parse('Ef9EEo2b2-xd5mHH4LgDk8uuK5qr20-Cz-zRs0CCOI3JeOmm').toString()) {
//     //         // @ts-ignore
//     //         const buffer: Buffer = (transaction.inMessage.body as TonMessageData).data
//     //         console.log(Slice.fromCell(Cell.fromBoc(buffer)[0]).readAddress())
//     //         // Cell.fromBoc(buffer)
//     //     }
//     //     // console.log(transaction)
//     //     // if (transaction.outMessages.length > 1)
//     //     // console.log(transaction.outMessages)
//     // })
// }
//
// main().catch(reason => console.error(reason))