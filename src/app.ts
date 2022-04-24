import 'module-alias/register'
import 'reflect-metadata'
import 'source-map-support/register'

import { session } from 'grammy'
import { ignoreOld, sequentialize } from 'grammy-middlewares'
import { run } from '@grammyjs/runner'
import * as Sentry from '@sentry/node'

import attachUser from '@/middlewares/attachUser'
import bot from '@/helpers/bot'
import configureI18n from '@/middlewares/configureI18n'
import handleLanguage from '@/handlers/language'
import i18n from '@/helpers/i18n'
import languageMenu from '@/menus/language'
import { handleStartQuestionnaire } from '@/handlers/start'
import startMongo from '@/helpers/startMongo'
import { QUESTIONNAIRE_STEP } from './models/Questionnaire'
import env from './helpers/env'
import { Questionnaire } from './models/Questionnaire'

const CHAT_ID = -621653380

Sentry.init({
  dsn: env.SENTRY_DSN,

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
})

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
    .use(session({ initial: () => ({ questionnaire: new Questionnaire() }) }))
  // Menus
  // .use(languageMenu)

  // Commands
  bot.command('start', handleStartQuestionnaire)
  bot.command('language', handleLanguage)

  bot.on('message', async (ctx, next) => {
    console.log(ctx.update.message)

    const questionnaire = ctx.session.questionnaire
    const messageText = ctx.message.text

    switch (questionnaire.step) {
      case QUESTIONNAIRE_STEP.CONTACT: {
        questionnaire.contact = messageText
        questionnaire.step = QUESTIONNAIRE_STEP.DETAILS
        ctx.replyWithLocalization('ask_for_details')
        break
      }
      case QUESTIONNAIRE_STEP.DETAILS: {
        questionnaire.description = messageText
        questionnaire.step = QUESTIONNAIRE_STEP.TIME
        ctx.replyWithLocalization('ask_for_time')
        break
      }
      case QUESTIONNAIRE_STEP.TIME: {
        questionnaire.time = messageText
        questionnaire.step = QUESTIONNAIRE_STEP.DONE

        const authorUser = ctx.message.from?.username
        const message = questionnaire.resultMessage(authorUser)

        ctx.api.sendMessage(CHAT_ID, message)
        break
      }
      default: {
        // noop
      }
    }

    console.log('message ctx.session: ', ctx.session)

    await next()
  })

  bot.on('edited_message', async (ctx, next) => {
    console.log(ctx.update.edited_message)

    const questionnaire = ctx.session.questionnaire
    const editedMessageText = ctx.update.edited_message.text

    switch (questionnaire.step) {
      case QUESTIONNAIRE_STEP.CONTACT: {
        questionnaire.contact = editedMessageText
        break
      }
      case QUESTIONNAIRE_STEP.DETAILS: {
        questionnaire.description = editedMessageText
        break
      }
      case QUESTIONNAIRE_STEP.TIME: {
        questionnaire.time = editedMessageText
        break
      }
      default: {
        // noop
      }
    }

    console.log('edited_message ctx.session: ', ctx.session)

    await next()
  })

  // Errors
  bot.catch(Sentry.captureException)

  // Start bot
  await bot.init()
  run(bot)

  console.info(`Bot ${bot.botInfo.username} is up and running`)
}

void runApp()
