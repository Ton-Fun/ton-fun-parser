import Koa from 'koa'

export default (app: Koa) => {
    app.use(async (ctx, next) => {
        ctx.set('Access-Control-Allow-Methods', 'GET')
        ctx.set('Access-Control-Allow-Origin', '*')
        ctx.set('Content-Disposition', 'inline')
        await next()
    })
}