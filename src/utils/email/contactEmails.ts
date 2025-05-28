
import { sendEmailNotification } from './emailService';

/**
 * Send a contact form submission notification
 */
export const sendContactNotification = async (
  name: string, 
  email: string, 
  phone: string, 
  message: string
): Promise<boolean> => {
  return sendEmailNotification({
    name,
    email,
    phone,
    message,
    tipo: 'contato'
  });
};
