import env from '@/helpers/env'
import { sendOptions } from '@/helpers/sendOptions'
import { Message } from '@grammyjs/types'
import { Context } from './Context'
import { Questionnaire } from './Questionnaire'

export enum QUESTIONNAIRE_STEP {
    DONE = 0,
    CONTACT = 1,
    DETAILS = 2,
    TIME = 3,
}

type Answer = {
    text?: string
    messageId?: number
}

export class INeedHelpQuestionnaire implements Questionnaire {
    public userId?: number
    public userName?: string
    private step: QUESTIONNAIRE_STEP = 0
    private contact: Answer = { text: '' }
    private description: Answer = { text: '' }
    private time: Answer = { text: '' }

    public start(context: Context) {
        this.step = QUESTIONNAIRE_STEP.CONTACT

        const from = context.update.message?.from
        this.userId = from?.id
        this.userName = from?.username

        context.replyWithLocalization(
            'i_need_help.ask_for_contact',
            sendOptions(context)
        )

        context.replyWithLocalization('i_need_help.success_message')
    }

    public update(context: Context) {
        const message = context.update.message!

        switch (this.step) {
            case QUESTIONNAIRE_STEP.CONTACT: {
                this.setContact(message)
                context.replyWithLocalization('i_need_help.ask_for_details')
                break
            }
            case QUESTIONNAIRE_STEP.DETAILS: {
                this.setDescription(message)
                context.replyWithLocalization('i_need_help.ask_for_time')
                break
            }
            case QUESTIONNAIRE_STEP.TIME: {
                this.setTime(message)

                context.api.sendMessage(
                    env.I_NEED_HELP_CHANNEL_ID,
                    this.resultMessage(),
                    { parse_mode: 'HTML' }
                )
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

        if (this.contact.messageId === editedMessageId) {
            this.contact.text = editedMessageText
        }

        if (this.description.messageId === editedMessageId) {
            this.description.text = editedMessageText
        }

        if (this.time.messageId === editedMessageId) {
            this.time.text = editedMessageText
        }
    }

    private setContact(message: Message) {
        this.contact.text = message.text
        this.contact.messageId = message.message_id
        this.step = QUESTIONNAIRE_STEP.DETAILS
    }

    private setDescription(message: Message) {
        this.description.text = message.text
        this.description.messageId = message.message_id
        this.step = QUESTIONNAIRE_STEP.TIME
    }

    private setTime(message: Message) {
        this.time.text = message.text
        this.time.messageId = message.message_id
        this.step = QUESTIONNAIRE_STEP.DONE
    }

    private resultMessage(): string {
        return (
            `ИМЯ И КОНТАКТ: ${this.contact.text || ''}\n\n` +
            `ПРОБЛЕМА: ${this.description.text || ''}\n\n` +
            `ВРЕМЯ: ${this.time.text || ''}\n\n` +
            `Username: @${this.userName || ''}\n` +
            `Профиль: <a href="tg://user?id=${this.userId}">${
                this.userName || this.userId
            }</a>`
        )
    }
}
