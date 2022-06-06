import { Context as BaseContext, SessionFlavor } from 'grammy'
import { I18nContext } from '@grammyjs/i18n/dist/source'
import { Questionnaire } from './Questionnaire'

type Session = SessionFlavor<{
    questionnaire: Questionnaire
    userId?: number
    userName?: string
}>

class BotContext extends BaseContext {
    readonly i18n!: I18nContext

    replyWithLocalization: this['reply'] = (text, other, ...rest) => {
        text = this.i18n.t(text)
        return this.reply(text, other, ...rest)
    }
}

type Context = BotContext & Session

export { BotContext, Context }
