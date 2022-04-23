import { Context as BaseContext } from 'grammy'
import { DocumentType } from '@typegoose/typegoose'
import { I18nContext } from '@grammyjs/i18n/dist/source'
import { User } from '@/models/User'

class Context extends BaseContext {
  readonly i18n!: I18nContext
  dbuser!: DocumentType<User>
  questionnaire!: {
    step: number
    contact?: string
    description?: string
    time?: string
  }

  constructor(update: any, api: any, me: any) {
    super(update, api, me)

    this.questionnaire = {
      step: 1,
    }
  }

  replyWithLocalization: this['reply'] = (text, other, ...rest) => {
    text = this.i18n.t(text)
    return this.reply(text, other, ...rest)
  }
}

export default Context
