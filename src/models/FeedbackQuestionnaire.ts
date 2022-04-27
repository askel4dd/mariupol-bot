import env from '@/helpers/env'
import { sendOptions } from '@/helpers/sendOptions'
import { Message } from '@grammyjs/types'
import { Context } from './Context'
import { Questionnaire } from './Questionnaire'

enum QUESTIONNAIRE_STEP {
    DONE = 0,
    ASK_FOR_FEEDBACK = 2,
}

type Answer = {
    text?: string
    messageId?: number
}

export class FeedbackQuestionnaire implements Questionnaire {
    public userId?: number
    public userName?: string
    private step: QUESTIONNAIRE_STEP = 0
    private feedback: Answer = { text: '' }

    public start(context: Context) {
        this.step = QUESTIONNAIRE_STEP.ASK_FOR_FEEDBACK

        this.userId = context.session.userId
        this.userName = context.session.userName

        context.replyWithLocalization(
            'i_want_to_help.feedback.ask_for_feedback',
            sendOptions(context)
        )
    }

    public update(context: Context) {
        const message = context.update.message!

        switch (this.step) {
            case QUESTIONNAIRE_STEP.ASK_FOR_FEEDBACK: {
                this.setFeedback(message)

                context.api.sendMessage(
                    env.I_WANT_TO_HELP_CHANNEL_ID,
                    this.resultMessage()
                )

                context.replyWithLocalization('i_want_to_help.feedback.thanks')
                break
            }
            default: {
                // noop
            }
        }
    }

    public edit(editedMessage: Message) {
        const editedMessageText = editedMessage.text
        const editedMessageId = editedMessage.message_id

        if (this.feedback.messageId === editedMessageId) {
            this.feedback.text = editedMessageText
        }
    }

    private setFeedback(message: Message) {
        this.feedback.text = message.text
        this.feedback.messageId = message.message_id
    }

    private resultMessage(): string {
        return `${this.feedback.text || ''}\n\n` + '#feedback'
    }
}