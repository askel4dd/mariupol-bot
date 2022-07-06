import {Menu} from '@grammyjs/menu'

import {Context} from '@/models/Context'
import {INeedHelpQuestionnaire} from '@/models/INeedHelpQuestionnaire'
import {sendOptions} from '@/helpers/sendOptions'
import {VolunteerQuestionnaire} from "@/models/VolunteerQuestionnaire";
import {FeedbackQuestionnaire} from "@/models/FeedbackQuestionnaire";


function getWantToHelpMenu(id: string) {
    return new Menu<Context>(id)
        .text(
            (ctx) => ctx.i18n.t('i_want_to_help.i_volunteer'),
            (ctx) => {
                const qustionnaire = new VolunteerQuestionnaire()
                ctx.session.questionnaire = qustionnaire
                ctx.session.restartMenu = restartMenu
                qustionnaire.start(ctx)
            }
        )
        .row()
        .text(
            (ctx) => ctx.i18n.t('i_want_to_help.want_to_give_feedback'),
            (ctx) => {
                const qustionnaire = new FeedbackQuestionnaire()
                ctx.session.questionnaire = qustionnaire
                ctx.session.restartMenu = restartMenu
                qustionnaire.start(ctx)
            }
        )
        .row()
        .back((ctx) => ctx.i18n.t('back'))
}

export const topWantToHelpMenu = getWantToHelpMenu('want-to-help-menu-top')
export const innerWantToHelpMenu = getWantToHelpMenu('want-to-help-menu-inner')


function getWhatYouWantMenu(id: string, submenu_id: string) {
    return new Menu<Context>(id)
        .text(
            (ctx) => ctx.i18n.t('i_need_help_button'),
            (ctx) => {
                const qustionnaire = new INeedHelpQuestionnaire()
                ctx.session.questionnaire = qustionnaire
                ctx.session.restartMenu = restartMenu
                qustionnaire.start(ctx)
            }
        )
        .row()
        .submenu((ctx) => ctx.i18n.t('i_want_to_help_button'), submenu_id)
}


export const topWhatYouWantMenu = getWhatYouWantMenu('what-you-want-menu-top', 'want-to-help-menu-top')
export const innerWhatYouWantMenu = getWhatYouWantMenu('what-you-want-menu-inner', 'want-to-help-menu-inner')

topWhatYouWantMenu.register(topWantToHelpMenu)
innerWhatYouWantMenu.register(innerWantToHelpMenu)


function getRestartMenu(id: string, submenu_id: string) {
    return new Menu<Context>(id).submenu(
        (ctx) => ctx.i18n.t('restart_menu'),
        submenu_id,
    )
}

// export const restartMenu = new Menu<Context>('restart-menu').submenu(
//   (ctx) => ctx.i18n.t('restart_menu'),
//   'want-to-help-menu-inner'
// )

export const restartMenu = getRestartMenu('restart-menu', 'what-you-want-menu-inner')
restartMenu.register(innerWhatYouWantMenu)
