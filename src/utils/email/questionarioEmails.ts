
import { supabase } from '@/integrations/supabase/client';
import { sendEmailNotification } from './emailService';

/**
 * Send a notification when a questionnaire is completed
 */
export const sendQuestionarioCompletedNotification = async (
  name: string, 
  questionarioId: string
): Promise<boolean> => {
  return sendEmailNotification({
    name,
    email: 'contato@anriellygomes.com.br',
    questionarioId,
    tipo: 'questionario-concluido'
  });
};

/**
 * Send a confirmation email to the couple when questionnaire is submitted
 */
export const sendQuestionarioConfirmationNotification = async (
  name: string, 
  email: string
): Promise<boolean> => {
  if (!email) {
    console.error('Email is required for sending questionnaire confirmation');
    return false;
  }
  
  return sendEmailNotification({
    name,
    email,
    tipo: 'questionario-confirmacao'
  });
};

/**
 * Send a welcome email when creating a new questionnaire account
 */
export const sendQuestionarioWelcomeEmail = async (
  name: string, 
  email: string
): Promise<boolean> => {
  if (!email) {
    console.error('Email is required for sending welcome email');
    return false;
  }

  try {
    const { data, error } = await supabase.functions.invoke('enviar-email-questionario', {
      body: {
        name,
        email,
        type: 'welcome'
      }
    });

    if (error) {
      throw new Error(`Error sending welcome email: ${error.message}`);
    }

    console.log('Welcome email sent successfully');
    return true;
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return false;
  }
};

/**
 * Send a completion email when questionnaire is finalized
 */
export const sendQuestionarioCompletionEmail = async (
  name: string, 
  email: string, 
  questionarioId: string
): Promise<boolean> => {
  if (!email) {
    console.error('Email is required for sending completion email');
    return false;
  }

  try {
    const { data, error } = await supabase.functions.invoke('enviar-email-questionario', {
      body: {
        name,
        email,
        type: 'completed',
        questionarioId
      }
    });

    if (error) {
      throw new Error(`Error sending completion email: ${error.message}`);
    }

    console.log('Completion email sent successfully');
    return true;
  } catch (error) {
    console.error('Failed to send completion email:', error);
    return false;
  }
};
