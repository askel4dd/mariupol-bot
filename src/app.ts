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
        .use(
            session({ initial: () => ({ questionnaire: new Questionnaire() }) })
        )
    // Menus
    // .use(languageMenu)

    // Commands
    bot.command('start', handleStartQuestionnaire)
    bot.command('language', handleLanguage)

    bot.on('message', async (ctx, next) => {
        const questionnaire = ctx.session.questionnaire
        const message = ctx.update.message

        switch (questionnaire.step) {
            case QUESTIONNAIRE_STEP.CONTACT: {
                questionnaire.setContact(message)
                ctx.replyWithLocalization('ask_for_details')
                break
            }
            case QUESTIONNAIRE_STEP.DETAILS: {
                questionnaire.setDescription(message)
                ctx.replyWithLocalization('ask_for_time')
                break
            }
            case QUESTIONNAIRE_STEP.TIME: {
                questionnaire.setTime(message)

                const authorUser = ctx.message.from?.username

                ctx.api.sendMessage(
                    CHAT_ID,
                    questionnaire.resultMessage(authorUser)
                )
                break
            }
            default: {
                // noop
            }
        }

        await next()
    })

    bot.on('edited_message', async (ctx, next) => {
        const questionnaire = ctx.session.questionnaire
        const editedMessage = ctx.update.edited_message

        questionnaire.edit(editedMessage)

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
