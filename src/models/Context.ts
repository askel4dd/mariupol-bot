import { Context as BaseContext, SessionFlavor } from 'grammy'
import { DocumentType } from '@typegoose/typegoose'
import { I18nContext } from '@grammyjs/i18n/dist/source'
import { User } from '@/models/User'
import { Questionnaire } from './Questionnaire'

type Session = SessionFlavor<{
    questionnaire: Questionnaire
    userId?: number
    userName?: string
}>

class BotContext extends BaseContext {
    readonly i18n!: I18nContext
    dbuser!: DocumentType<User>

    replyWithLocalization: this['reply'] = (text, other, ...rest) => {
        text = this.i18n.t(text)
        return this.reply(text, other, ...rest)
    }
}

type Context = BotContext & Session

export { BotContext, Context }
