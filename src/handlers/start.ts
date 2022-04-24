import { Context } from '@/models/Context'
import sendOptions from '@/helpers/sendOptions'

export function handleStartQuestionnaire(ctx: Context) {
    if (ctx.update.message?.chat.type !== 'private') {
        ctx.reply(
            'Извините, в данный момент бот поддерживает только приватные сообщения'
        )
        return
    }
    ctx.session.questionnaire.start()
    return ctx.replyWithLocalization('ask_for_contact', sendOptions(ctx))
}
