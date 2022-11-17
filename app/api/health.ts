import {ExtendableContext} from 'koa'
import Router from '@koa/router'

export default (router: Router) => {
    router.get('/health', (ctx: ExtendableContext): void => {
        ctx.body = {success: 'OK'}
    })
}