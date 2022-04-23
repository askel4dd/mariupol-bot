import 'module-alias/register'
import 'reflect-metadata'
import 'source-map-support/register'

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
  // Menus
  // .use(languageMenu)

  // Commands
  bot.command(['help', 'start'], sendHelp)
  bot.command('language', handleLanguage)

  bot.on('message', async (ctx, next) => {
    console.log('ctx.message: ', ctx.message.text)
    console.log('ctx.questionnaire.step: ', ctx.questionnaire.step)

    switch (ctx.questionnaire.step) {
      case 1: {
        ctx.questionnaire.contact = ctx.message.text
        ctx.questionnaire.step = 2
        ctx.replyWithLocalization('ask_for_details')
        break
      }
      case 2: {
        ctx.questionnaire.description = ctx.message.text
        ctx.questionnaire.step = 3
        ctx.replyWithLocalization('ask_for_time')
        break
      }
      case 3: {
        ctx.questionnaire.time = ctx.message.text
        ctx.questionnaire.step = 1
        ctx.reply(
          `Contact: ${ctx.questionnaire.contact} Description: ${ctx.questionnaire.description} Time: ${ctx.questionnaire.time}`
        )
        break
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
