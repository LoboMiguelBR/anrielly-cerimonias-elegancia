
import { Resend } from "npm:resend@2.0.0"

export interface EmailRequest {
  name: string
  email: string
  type: 'welcome' | 'completed'
  questionarioId?: string
}

export class EmailSender {
  private resend: Resend

  constructor(apiKey: string) {
    this.resend = new Resend(apiKey)
  }

  async sendEmail(to: string, subject: string, html: string) {
    return await this.resend.emails.send({
      from: 'Anrielly Gomes <contato@anriellygomes.com.br>',
      to: [to],
      subject,
      html
    })
  }

  async sendNotificationEmail(name: string, email: string, questionarioId?: string) {
    const notificationSubject = `🔔 Questionário Finalizado - ${name}`
    const notificationHtml = `
      <h2>Novo questionário finalizado!</h2>
      <p><strong>Cliente:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>ID do Questionário:</strong> ${questionarioId || 'N/A'}</p>
      <p>Acesse o painel administrativo para visualizar as respostas completas.</p>
    `

    return await this.resend.emails.send({
      from: 'Sistema <contato@anriellygomes.com.br>',
      to: ['contato@anriellygomes.com.br'],
      subject: notificationSubject,
      html: notificationHtml
    })
  }
}
