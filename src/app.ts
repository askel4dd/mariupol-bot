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
import { session } from 'grammy'

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
  bot.command(['help', 'start'], sendHelp)
  bot.command('language', handleLanguage)

  bot.on('message', async (ctx, next) => {
    console.log('ctx.message: ', ctx.message.text)
    const questionnaire = ctx.session.questionnaire
    console.log('ctx.questionnaire.step: ', questionnaire.step)

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
        questionnaire.step = 1
        ctx.reply(
          `Contact: ${questionnaire.contact} Description: ${questionnaire.description} Time: ${questionnaire.time}`
        )
        break
      }
    }

    console.log('before:')
    console.log('ctx.session.questionnaire: ', ctx.session.questionnaire)
    ctx.session.questionnaire = questionnaire
    console.log('after:')
    console.log('ctx.session.questionnaire: ', ctx.session.questionnaire)

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
