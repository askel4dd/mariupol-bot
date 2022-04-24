import { Context } from '@/models/Context'
import sendOptions from '@/helpers/sendOptions'
import { QUESTIONNAIRE_STEP } from '@/models/Questionnaire'

export function handleStartQuestionnaire(ctx: Context) {
  ctx.session.questionnaire.step = QUESTIONNAIRE_STEP.CONTACT
  return ctx.replyWithLocalization('ask_for_contact', sendOptions(ctx))
}
