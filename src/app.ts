import 'module-alias/register'
import 'reflect-metadata'
import 'source-map-support/register'

import { session } from 'grammy'
import { ignoreOld, sequentialize } from 'grammy-middlewares'
import { run } from '@grammyjs/runner'

import attachUser from '@/middlewares/attachUser'
import bot from '@/helpers/bot'
import configureI18n from '@/middlewares/configureI18n'
import handleLanguage from '@/handlers/language'
import i18n from '@/helpers/i18n'
import languageMenu from '@/menus/language'
import sendHelp from '@/handlers/help'
import startMongo from '@/helpers/startMongo'

const CHAT_ID = -621653380

async function runApp() {
  console.log('Starting app...')
  // Mongo
  //   await startMongo()
  //   console.log('Mongo connected')
  bot
    // Middlewares
    .use(sequentialize())
    .use(ignoreOld())
    // .use(attachUser)
    .use(i18n.middleware())
    .use(configureI18n)
    .use(session({ initial: () => ({ questionnaire: { step: 1 } }) }))
  // Menus
  // .use(languageMenu)

  // Commands
  bot.command(['start'], sendHelp)
  bot.command('language', handleLanguage)

  bot.on('message', async (ctx, next) => {
    const questionnaire = ctx.session.questionnaire

    switch (questionnaire.step) {
      case 1: {
        questionnaire.contact = ctx.message.text
        questionnaire.step = 2
        ctx.replyWithLocalization('ask_for_details')
        break
      }
      case 2: {
        questionnaire.description = ctx.message.text
        questionnaire.step = 3
        ctx.replyWithLocalization('ask_for_time')
        break
      }
      case 3: {
        questionnaire.time = ctx.message.text
        questionnaire.step = 0

        const authorUser = ctx.message.from?.username
        const message = `ИМЯ И КОНТАКТ: ${questionnaire.contact}\n\nПРОБЛЕМА: ${questionnaire.description}\n\nВРЕМЯ: ${questionnaire.time}\n\n@${authorUser}`
        ctx.api.sendMessage(CHAT_ID, message)
        break
      }
      default: {
        // noop
      }
    }

    await next()
  })

  // Errors
  bot.catch(console.error)

  // Start bot
  await bot.init()
  run(bot)

  console.info(`Bot ${bot.botInfo.username} is up and running`)
}

void runApp()
