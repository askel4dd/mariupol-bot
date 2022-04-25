import { Message } from '@grammyjs/types'
import { Context } from './Context'

export interface Questionnaire {
    userId?: number
    userName?: string
    start(userId?: number, userName?: string): void
    update(context: Context): void
    edit(editedMessage: Message): void
}
