import { NextFunction } from 'grammy'
import { Context } from '@/models/Context'

export default async function attachUser(ctx: Context, next: NextFunction) {
    if (!ctx.from) {
        throw new Error('No from field found')
    }

    const from = ctx.from
    ctx.session.userId = from?.id

    if (from?.username) {
        ctx.session.userName = from?.username
    }

    return next()
}
