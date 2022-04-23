import { Bot } from 'grammy'
import { BotContext, Context } from '@/models/Context'
import env from '@/helpers/env'

const bot = new Bot<Context>(env.TOKEN, {
  // @ts-ignore
  ContextConstructor: BotContext,
})

export default bot
