import { Menu } from '@grammyjs/menu'

import { Context } from '@/models/Context'
import { INeedHelpQuestionnaire } from '@/models/INeedHelpQuestionnaire'
import { sendOptions } from '@/helpers/sendOptions'
import { wantToHelpMenu } from './wantToHelpMenu'

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
    .submenu((ctx) => ctx.i18n.t('i_want_to_help_button'), 'want-to-help-menu')

whatYouWantMenu.register(wantToHelpMenu)

export { whatYouWantMenu }
