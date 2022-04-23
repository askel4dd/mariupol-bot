import { Context as BaseContext, SessionFlavor } from 'grammy'
import { DocumentType } from '@typegoose/typegoose'
import { I18nContext } from '@grammyjs/i18n/dist/source'
import { User } from '@/models/User'

type Session = SessionFlavor<{
  questionnaire: {
    step: number
    contact?: string
    description?: string
    time?: string
  }
}>

// @ts-ignore
class Context extends BaseContext implements Session {
  readonly i18n!: I18nContext
  dbuser!: DocumentType<User>

  replyWithLocalization: this['reply'] = (text, other, ...rest) => {
    text = this.i18n.t(text)
    return this.reply(text, other, ...rest)
  }
}

export default Context
