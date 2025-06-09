
import { sendEmailNotification } from './emailService';

/**
 * Send a notification for a new testimonial submission
 */
export const sendNewTestimonialNotification = async (
  name: string, 
  email: string
): Promise<boolean> => {
  if (!email) {
    console.error('Email is required for sending testimonial notification');
    return false;
  }
  
  return sendEmailNotification({
    name,
    email,
    tipo: 'novo-depoimento'
  });
};

/**
 * Send a notification when a testimonial is approved
 */
export const sendTestimonialApprovedNotification = async (
  name: string, 
  email: string
): Promise<boolean> => {
  if (!email) {
    console.error('Email is required for sending testimonial approval notification');
    return false;
  }
  
  return sendEmailNotification({
    name,
    email,
    tipo: 'depoimento-aprovado'
  });
};
