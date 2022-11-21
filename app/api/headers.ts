import Koa, { ExtendableContext, Next } from 'koa'

export function headers (app: Koa): void {
  app.use(async (ctx: ExtendableContext, next: Next): Promise<void> => {
    ctx.set('Access-Control-Allow-Methods', 'GET')
    ctx.set('Access-Control-Allow-Origin', '*')
    ctx.set('Content-Disposition', 'inline')
    await next()
  })
}
