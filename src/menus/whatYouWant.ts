import { Menu } from '@grammyjs/menu'

import env from '@/helpers/env'
import { Context } from '@/models/Context'
import { INeedHelpQuestionnaire } from '@/models/INeedHelpQuestionnaire'

const whatYouWantMenu = new Menu<Context>('what-you-want-menu')
    .text(
        (ctx) => ctx.i18n.t('i_need_help_button'),
        (ctx) => {
            const qustionnaire = new INeedHelpQuestionnaire()
            ctx.session.questionnaire = qustionnaire
            qustionnaire.start(ctx)
        }
    )
    .row()
    .text(
        (ctx) => ctx.i18n.t('i_want_to_help_button'),
        (ctx) => {
            ctx.api.sendMessage(
                env.I_WANT_TO_HELP_CHANNEL_ID,
                'Я хочу помочь' + ` @${ctx.session.userName}`
            )
        }
    )

export { whatYouWantMenu }
