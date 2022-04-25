import { Context } from '@/models/Context'
import { sendOptions } from '@/helpers/sendOptions'
import { whatYouWantMenu } from '@/menus/whatYouWant'

export function handleStartQuestionnaire(ctx: Context) {
    if (ctx.update.message?.chat.type !== 'private') {
        ctx.reply(
            'Извините, в данный момент бот поддерживает только приватные сообщения'
        )
        return
    }

    const from = ctx.update.message?.from
    ctx.session.questionnaire.identify(from?.id, from?.username)

    return ctx.replyWithLocalization('what_you_want', {
        ...sendOptions(ctx),
        reply_markup: whatYouWantMenu,
    })
}
