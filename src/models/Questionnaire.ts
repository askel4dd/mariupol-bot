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

  public resultMessage(authorUser?: string): string {
    return `ИМЯ И КОНТАКТ: ${this.contact}\n\n` +
    `ПРОБЛЕМА: ${this.description}\n\n` +
    `ВРЕМЯ: ${this.time}\n\n` +
    `@${authorUser || ''}`
  }
}
