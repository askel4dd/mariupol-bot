import { Message } from '@grammyjs/types'
import { Context } from './Context'

export interface Questionnaire {
    userId?: number
    userName?: string
    start(context: Context): void
    update(context: Context): void
    edit(editedMessage: Message): void
}
