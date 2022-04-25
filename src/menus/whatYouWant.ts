import { Menu } from '@grammyjs/menu'

import env from '@/helpers/env'
import { Context } from '@/models/Context'
import { sendOptions } from '@/helpers/sendOptions'
import { INeedHelpQuestionnaire } from '@/models/INeedHelpQuestionnaire'

const whatYouWantMenu = new Menu<Context>('what-you-want-menu')
    .text('Мне нужна помощь', (ctx) => {
        const qustionnaire = new INeedHelpQuestionnaire()
        qustionnaire.start(ctx.session.userId, ctx.session.userName)
        ctx.session.questionnaire = qustionnaire
        return ctx.replyWithLocalization('ask_for_contact', sendOptions(ctx))
    })
    // .row()
    // .text('Мне спросить', (ctx) => {
    //     ctx.api.sendMessage(
    //         env.I_WANT_TO_ASK_CHANNEL_ID,
    //         'Мне просто спросить' + ` @${ctx.session.questionnaire.userName}`
    //     )
    // })
    .row()
    .text('Я хочу помочь', (ctx) => {
        ctx.api.sendMessage(
            env.I_WANT_TO_HELP_CHANNEL_ID,
            'Я хочу помочь' + ` @${ctx.session.questionnaire.userName}`
        )
    })

export { whatYouWantMenu }
