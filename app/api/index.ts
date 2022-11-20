import Koa from 'koa'
import Router from '@koa/router'
import { Logger } from 'winston'
import { Db } from 'mongodb'
import { readInt } from '../util/env'
import headers from './headers'
import health from './method/health'
import state from './method/state'
import summary from './method/summary'
import players from './method/players'
import bets from './method/bets'

const DEFAULT_PORT: number = 3000

export default (logger: Logger, db: Db): void => {
  const port: number = readInt(process.env.PORT, DEFAULT_PORT)

  const app: Koa = new Koa()
  const router: Router = new Router()

  headers(app)

  health(router)
  state(router, db)
  summary(router, db)
  players(router, db)
  bets(router, db)

  try {
    app.use(router.middleware()).listen(port)
  } catch (e: any) {
    logger.error(e.stack)
  }
}
