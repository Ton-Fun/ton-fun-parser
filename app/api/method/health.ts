import { ExtendableContext } from 'koa'
import Router from '@koa/router'

export function health (router: Router): void {
  router.get('/health', (ctx: ExtendableContext): void => {
    ctx.body = { success: 'OK' }
  })
}
