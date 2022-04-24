import { Message } from '@grammyjs/types'

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
    public step: QUESTIONNAIRE_STEP = 0
    private contact: Answer = { text: '' }
    private description: Answer = { text: '' }
    private time: Answer = { text: '' }

    public start() {
        this.step = QUESTIONNAIRE_STEP.CONTACT
    }

    public setContact(message: Message) {
        this.contact.text = message.text
        this.contact.messageId = message.message_id
        this.step = QUESTIONNAIRE_STEP.DETAILS
    }

    public setDescription(message: Message) {
        this.description.text = message.text
        this.description.messageId = message.message_id
        this.step = QUESTIONNAIRE_STEP.TIME
    }

    public setTime(message: Message) {
        this.time.text = message.text
        this.time.messageId = message.message_id
        this.step = QUESTIONNAIRE_STEP.DONE
    }

    public resultMessage(authorUser?: string): string {
        return (
            `ИМЯ И КОНТАКТ: ${this.contact.text || ''}\n\n` +
            `ПРОБЛЕМА: ${this.description.text || ''}\n\n` +
            `ВРЕМЯ: ${this.time.text || ''}\n\n` +
            `@${authorUser || ''}`
        )
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
}
