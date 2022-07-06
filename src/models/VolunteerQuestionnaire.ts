import env from '@/helpers/env'
import { sendOptions } from '@/helpers/sendOptions'
import { Message } from '@grammyjs/types'
import { Context } from './Context'
import { Questionnaire } from './Questionnaire'

enum QUESTIONNAIRE_STEP {
    DONE = 0,
    ASK_FOR_DETAILS = 2,
}

type Answer = {
    text?: string
    messageId?: number
}

export class VolunteerQuestionnaire implements Questionnaire {
    public userId?: number
    public userName?: string
    private step: QUESTIONNAIRE_STEP = 0
    private details: Answer = { text: '' }

    public start(context: Context) {
        this.step = QUESTIONNAIRE_STEP.ASK_FOR_DETAILS

        this.userId = context.session.userId
        this.userName = context.session.userName

        context.replyWithLocalization(
            'i_want_to_help.volunteer.ask_volunteer_form',
            sendOptions(context)
        )
    }

    public update(context: Context) {
        const message = context.update.message!

        switch (this.step) {
            case QUESTIONNAIRE_STEP.ASK_FOR_DETAILS: {
                this.setDetails(message)

                context.api.sendMessage(
                    env.I_WANT_TO_HELP_CHANNEL_ID,
                    this.resultMessage(),
                    { parse_mode: 'HTML' }
                )

                context.replyWithLocalization('i_want_to_help.volunteer.thanks', {
                    ...sendOptions(context),
                    reply_markup: context.session.restartMenu,
                })
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

        if (this.details.messageId === editedMessageId) {
            this.details.text = editedMessageText
        }
    }

    public isActive(): boolean {
        return this.step !== QUESTIONNAIRE_STEP.DONE
    }

    private setDetails(message: Message) {
        this.details.text = message.text
        this.details.messageId = message.message_id
        this.step = QUESTIONNAIRE_STEP.DONE
    }

    private resultMessage(): string {
        return (
            `${this.details.text || ''}\n\n` +
            `User ID: ${this.userId}\n` +
            `Username: @${this.userName || ''}\n` +
            `Профиль: <a href="tg://user?id=${this.userId}">${
                this.userName || this.userId
            }</a>\n` +
            '#помогат'
        )
    }
}
