import { Context } from '@/models/Context'
import sendOptions from '@/helpers/sendOptions'

export function handleStartQuestionnaire(ctx: Context) {
    ctx.session.questionnaire.start()
    return ctx.replyWithLocalization('ask_for_contact', sendOptions(ctx))
}
