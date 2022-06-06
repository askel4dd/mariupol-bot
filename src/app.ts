import 'module-alias/register'
import 'source-map-support/register'

import { session } from 'grammy'
import { ignoreOld, sequentialize } from 'grammy-middlewares'
import { run } from '@grammyjs/runner'
import * as Sentry from '@sentry/node'

import bot from '@/helpers/bot'
import configureI18n from '@/middlewares/configureI18n'
import i18n from '@/helpers/i18n'
import { handleStartQuestionnaire } from '@/handlers/start'
import env from './helpers/env'
import { whatYouWantMenu } from './menus/whatYouWant'
import { wantToHelpMenu } from './menus/wantToHelpMenu'
import attachUser from './middlewares/attachUser'

Sentry.init({
    dsn: env.SENTRY_DSN,

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
})

async function runApp() {
    console.log('Starting app...')

    bot
        // Middlewares
        .use(sequentialize())
        .use(ignoreOld())
        .use(session({ initial: () => ({}) }))
        .use(attachUser)
        .use(i18n.middleware())
        .use(configureI18n)
        // Menus
        .use(whatYouWantMenu)

    // Commands
    bot.command('start', handleStartQuestionnaire)

    bot.on('message', async (ctx, next) => {
        const questionnaire = ctx.session.questionnaire

        if (questionnaire && questionnaire.isActive()) {
            questionnaire.update(ctx)
        } else {
            handleStartQuestionnaire(ctx)
        }

        await next()
    })

    bot.on('edited_message', async (ctx, next) => {
        const questionnaire = ctx.session.questionnaire
        const editedMessage = ctx.update.edited_message

        questionnaire && questionnaire.edit(editedMessage)

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
