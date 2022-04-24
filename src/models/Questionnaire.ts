import { Message } from '@grammyjs/types'
import { Context } from './Context'

const MODERATOR_CHAT_ID = -621653380

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

export class Questionnaire {
    private step: QUESTIONNAIRE_STEP = 0
    private contact: Answer = { text: '' }
    private description: Answer = { text: '' }
    private time: Answer = { text: '' }

    public start() {
        this.step = QUESTIONNAIRE_STEP.CONTACT
    }

    public update(context: Context) {
        const message = context.update.message!

        switch (this.step) {
            case QUESTIONNAIRE_STEP.CONTACT: {
                this.setContact(message)
                context.replyWithLocalization('ask_for_details')
                break
            }
            case QUESTIONNAIRE_STEP.DETAILS: {
                this.setDescription(message)
                context.replyWithLocalization('ask_for_time')
                break
            }
            case QUESTIONNAIRE_STEP.TIME: {
                this.setTime(message)

                const authorUser = message.from?.username

                context.api.sendMessage(
                    MODERATOR_CHAT_ID,
                    this.resultMessage(authorUser)
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

    private resultMessage(authorUser?: string): string {
        return (
            `ИМЯ И КОНТАКТ: ${this.contact.text || ''}\n\n` +
            `ПРОБЛЕМА: ${this.description.text || ''}\n\n` +
            `ВРЕМЯ: ${this.time.text || ''}\n\n` +
            `@${authorUser || ''}`
        )
    }
}
