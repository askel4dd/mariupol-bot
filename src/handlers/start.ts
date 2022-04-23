import { Context, QUESTIONNAIRE_STEP } from '@/models/Context'
import sendOptions from '@/helpers/sendOptions'

export function handleStartQuestionnaire(ctx: Context) {
  ctx.session.questionnaire.step = QUESTIONNAIRE_STEP.CONTACT
  return ctx.replyWithLocalization('ask_for_contact', sendOptions(ctx))
}
