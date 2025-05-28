
import { sendEmailNotification } from './emailService';

/**
 * Send contact form submission notifications (admin + client confirmation)
 */
export const sendContactNotification = async (
  name: string, 
  email: string, 
  phone: string, 
  message: string
): Promise<boolean> => {
  try {
    // Enviar notificação para o admin
    const adminSuccess = await sendEmailNotification({
      name,
      email,
      phone,
      message,
      tipo: 'contato'
    });

    // Enviar confirmação para o cliente
    const clientSuccess = await sendEmailNotification({
      to: email,
      name,
      email,
      phone,
      message,
      tipo: 'contato-confirmacao'
    });

    // Retornar true se pelo menos o email do admin foi enviado
    return adminSuccess;
  } catch (error) {
    console.error('Erro ao enviar notificações de contato:', error);
    return false;
  }
};
