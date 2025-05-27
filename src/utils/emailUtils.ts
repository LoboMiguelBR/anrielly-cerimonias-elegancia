
/**
 * Utility to send email notifications via the Supabase Edge Function
 */

/**
 * Send an email notification through the Supabase Edge Function
 * @param payload The data to send to the email function
 * @returns Promise with the result of the request
 */
export const sendEmailNotification = async (payload: any): Promise<boolean> => {
  try {
    console.log('Sending email notification:', payload);
    
    const response = await fetch('https://oampddkpuybkbwqggrty.supabase.co/functions/v1/enviar-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response from email function:', errorData);
      throw new Error(`Error sending email notification: ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log('Email notification sent successfully:', result);
    
    return true;
  } catch (error) {
    console.error('Failed to send email notification:', error);
    return false;
  }
};

/**
 * Send a contact form submission notification
 */
export const sendContactNotification = async (name: string, email: string, phone: string, message: string): Promise<boolean> => {
  return sendEmailNotification({
    name,
    email,
    phone,
    message,
    tipo: 'contato'
  });
};

/**
 * Send a notification for a new testimonial submission
 */
export const sendNewTestimonialNotification = async (name: string, email: string): Promise<boolean> => {
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
export const sendTestimonialApprovedNotification = async (name: string, email: string): Promise<boolean> => {
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

/**
 * Send a notification when a questionnaire is completed
 */
export const sendQuestionarioCompletedNotification = async (name: string, questionarioId: string): Promise<boolean> => {
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
export const sendQuestionarioConfirmationNotification = async (name: string, email: string): Promise<boolean> => {
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
export const sendQuestionarioWelcomeEmail = async (name: string, email: string): Promise<boolean> => {
  if (!email) {
    console.error('Email is required for sending welcome email');
    return false;
  }

  try {
    const response = await fetch('https://oampddkpuybkbwqggrty.supabase.co/functions/v1/enviar-email-questionario', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        type: 'welcome'
      })
    });

    if (!response.ok) {
      throw new Error(`Error sending welcome email: ${response.statusText}`);
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
export const sendQuestionarioCompletionEmail = async (name: string, email: string, questionarioId: string): Promise<boolean> => {
  if (!email) {
    console.error('Email is required for sending completion email');
    return false;
  }

  try {
    const response = await fetch('https://oampddkpuybkbwqggrty.supabase.co/functions/v1/enviar-email-questionario', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        type: 'completed',
        questionarioId
      })
    });

    if (!response.ok) {
      throw new Error(`Error sending completion email: ${response.statusText}`);
    }

    console.log('Completion email sent successfully');
    return true;
  } catch (error) {
    console.error('Failed to send completion email:', error);
    return false;
  }
};
