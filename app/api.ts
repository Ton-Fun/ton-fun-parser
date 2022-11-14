import Koa, {ExtendableContext} from 'koa'
import Router, {RouterParamContext} from '@koa/router'
import {Bet, State} from './types'
import Joi from 'joi'
import validator from 'koa-context-validator'
import {Logger} from 'winston'
import {Collection, Db, MongoClient} from 'mongodb'
import {defaultState} from './default'

export default (logger: Logger, mongoClient: MongoClient) => {
    const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000
    const BETS_MAX_LIMIT: number = process.env.BETS_MAX_LIMIT ? parseInt(process.env.BETS_MAX_LIMIT) : 1000

    const app: Koa = new Koa()
    const router: Router = new Router()
    const database: Db = mongoClient.db('parser')
    const stateCollection: Collection<State> = database.collection('state')
    const betsCollection: Collection<Bet> = database.collection('bets')

    router.get('/health', (ctx: ExtendableContext) => {
        ctx.body = { success: 'OK' }
    })

    router.get('/state', async (ctx: ExtendableContext) => {
        const state: State = await stateCollection.findOne() ?? defaultState
        const scraped: number = await betsCollection.countDocuments()
        ctx.body = { state, scraped }
    })

    router.get('/summary', async (ctx: ExtendableContext) => {
        const players: number = (await betsCollection.distinct('address')).length
        const summary = await betsCollection.aggregate([{
            $group: {
                _id: '',
                betsValue: {$sum: '$value'},
                winsValue: {$sum: {$cond: ['$win', {$multiply: ['$value', 2]}, 0]}},
                bets: {$sum: 1},
                wins: {$sum: {$cond: ['$win', 1, 0]}},
                maxBet: {$max: '$value'},
                maxWin: {$max: {$cond: ['$win', {$multiply: ['$value', 2]}, 0]}},
                firstBetTimestamp: {$min: '$time'},
                lastBetTimestamp: {$max: '$time'}
            }
        }, {
            $project: {
                _id: 0
            }
        }]).toArray()
        ctx.body = {players, ...summary[0]}
    })

    router.get('/players',
        validator({
            query: Joi.object().keys({
                orderBy: Joi.string().valid(
                    'betsValue',
                    'winsValue',
                    'bets',
                    'wins',
                    'maxBet',
                    'maxWin',
                    'firstBetTimestamp',
                    'lastBetTimestamp',
                    'profit'
                ),
                sort: Joi.string().valid('asc', 'desc')
            })
        }), async (ctx: ExtendableContext) => {
            const orderBy: string = ctx.query.orderBy ? ctx.query.orderBy.toString() : 'betsValue'
            const sort: string = ctx.query.sort ? ctx.query.sort.toString() : 'asc'
            const sortingObject: { $sort: any } = {$sort: {}}
            sortingObject.$sort[orderBy] = (sort === 'asc') ? 1 : -1
            ctx.body = await betsCollection.aggregate([{
                $group: {
                    _id: '$address',
                    betsValue: {$sum: '$value'},
                    winsValue: {$sum: {$cond: ['$win', {$multiply: ['$value', 2]}, 0]}},
                    bets: {$sum: 1},
                    wins: {$sum: {$cond: ['$win', 1, 0]}},
                    maxBet: {$max: '$value'},
                    maxWin: {$max: {$cond: ['$win', {$multiply: ['$value', 2]}, 0]}},
                    firstBetTimestamp: {$min: '$time'},
                    lastBetTimestamp: {$max: '$time'}
                }
            }, {
                $project: {
                    _id: 0,
                    address: '$_id',
                    betsValue: 1,
                    winsValue: 1,
                    bets: 1,
                    wins: 1,
                    maxBet: 1,
                    maxWin: 1,
                    firstBetTimestamp: 1,
                    lastBetTimestamp: 1,
                    profit: {$subtract: ['$winsValue', '$betsValue']}
                }
            },
                sortingObject
            ]).toArray()
        })

    router.get('/player/:address', async (ctx: ExtendableContext & RouterParamContext) => {
        const address: string = ctx.params.address
        const players = await betsCollection.aggregate([{
            $match: {'address': {$eq: address}}
        }, {
            $group: {
                _id: '$address',
                betsValue: {$sum: '$value'},
                winsValue: {$sum: {$cond: ['$win', {$multiply: ['$value', 2]}, 0]}},
                bets: {$sum: 1},
                wins: {$sum: {$cond: ['$win', 1, 0]}},
                maxBet: {$max: '$value'},
                maxWin: {$max: {$cond: ['$win', {$multiply: ['$value', 2]}, 0]}},
                firstBetTimestamp: {$min: '$time'},
                lastBetTimestamp: {$max: '$time'}
            }
        }, {
            $project: {
                _id: 0,
                address: '$_id',
                betsValue: 1,
                winsValue: 1,
                bets: 1,
                wins: 1,
                maxBet: 1,
                maxWin: 1,
                firstBetTimestamp: 1,
                lastBetTimestamp: 1,
                profit: {$subtract: ['$winsValue', '$betsValue']}
            }
        }
        ]).toArray()
        const bets: Bet[] = await betsCollection
            .find<Bet>({address: {$eq: address}})
            .project<Bet>({_id: 0})
            .toArray()
        ctx.body = {
            player: players[0] ?? [],
            bets
        }
    })

    router.get('/bets',
        validator({
            query: Joi.object().keys({
                offset: Joi.number().integer().min(0),
                limit: Joi.number().integer().min(0).max(BETS_MAX_LIMIT)
            })
        }),
        async (ctx: ExtendableContext & RouterParamContext) => {
            const offset: number = ctx.query.offset ? parseInt(ctx.query.offset.toString()) : 0
            const limit: number = ctx.query.limit ? parseInt(ctx.query.limit.toString()) : BETS_MAX_LIMIT
            const state: State = await stateCollection.findOne() ?? defaultState
            const total: number = await betsCollection.countDocuments({lt: {$lte: state.parserTargetLt}})
            const bets: Bet[] = await betsCollection.find({lt: {$lte: state.parserTargetLt}})
                .skip(offset)
                .limit(limit)
                .toArray()
            ctx.body = { bets, total }
        })

    router.get('/bets/total', async (ctx: ExtendableContext) => {
        const state: State = await stateCollection.findOne() ?? defaultState
        const total: number = await betsCollection.countDocuments({lt: {$lte: state.parserTargetLt}})
        ctx.body = { total }
    })

    try {
        app.use(router.middleware()).listen(PORT)
    } catch (e: any) {
        logger.error(e.stack)
    }
}