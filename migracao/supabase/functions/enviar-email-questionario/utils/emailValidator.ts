
import { EmailRequest } from "./emailSender.ts"

export class EmailValidator {
  static validate(emailRequest: EmailRequest): string | null {
    const { name, email, type } = emailRequest

    if (!name || !email || !type) {
      return 'Nome, email e tipo são obrigatórios'
    }

    if (type !== 'welcome' && type !== 'completed') {
      return 'Tipo de email inválido'
    }

    return null
  }

  static getEmailConfig(type: string) {
    if (type === 'welcome') {
      return {
        subject: '💕 Bem-vindo(a) ao Questionário de Noivos - Anrielly Gomes'
      }
    } else if (type === 'completed') {
      return {
        subject: '🎉 Questionário Finalizado com Sucesso! - Anrielly Gomes'
      }
    }
    
    throw new Error('Tipo de email inválido')
  }
}
