export enum QUESTIONNAIRE_STEP {
    DONE = 0,
    CONTACT = 1,
    DETAILS = 2,
    TIME = 3,
}

export class Questionnaire {
    public step: QUESTIONNAIRE_STEP = 0
    public contact?: string
    public description?: string
    public time?: string

    public start() {
        this.step = QUESTIONNAIRE_STEP.CONTACT
    }

    public setContact(message?: string) {
        this.contact = message
        this.step = QUESTIONNAIRE_STEP.DETAILS
    }

    public setDescription(message?: string) {
        this.description = message
        this.step = QUESTIONNAIRE_STEP.TIME
    }

    public setTime(message?: string) {
        this.time = message
        this.step = QUESTIONNAIRE_STEP.DONE
    }

    public resultMessage(authorUser?: string): string {
        return (
            `ИМЯ И КОНТАКТ: ${this.contact}\n\n` +
            `ПРОБЛЕМА: ${this.description}\n\n` +
            `ВРЕМЯ: ${this.time}\n\n` +
            `@${authorUser || ''}`
        )
    }
}
