import { Bot, SessionFlavor } from 'grammy'
import Context from '@/models/Context'
import env from '@/helpers/env'

type Session = SessionFlavor<{
  questionnaire: {
    step: number
    contact?: string
    description?: string
    time?: string
  }
}>

const bot = new Bot<Context & Session>(env.TOKEN, {
  // @ts-ignore
  ContextConstructor: Context,
})

export default bot
