import { Menu } from '@grammyjs/menu'

import { Context } from '@/models/Context'

export const wantToHelpMenu = new Menu<Context>('want-to-help-menu')
    .text(
        (ctx) => ctx.i18n.t('i_want_to_help.i_volunteer'),
        (ctx) => {
            console.log('i_volunteer')
        }
    )
    .row()
    .text(
        (ctx) => ctx.i18n.t('i_want_to_help.want_to_give_feedback'),
        (ctx) => {
            console.log('want_to_give_feedback')
        }
    )
    .row()
    .back((ctx) => ctx.i18n.t('back'))
