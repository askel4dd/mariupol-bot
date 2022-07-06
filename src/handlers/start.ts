import { Context } from '@/models/Context'
import { sendOptions } from '@/helpers/sendOptions'
import { topWhatYouWantMenu } from '@/menus/whatYouWant'

export function handleStartQuestionnaire(ctx: Context) {
    if (ctx.update.message?.chat.type !== 'private') {
        // Ignore NOT private channels
        return
    }

    return ctx.replyWithLocalization('what_you_want', {
        ...sendOptions(ctx),
        reply_markup: topWhatYouWantMenu,
    })
}
