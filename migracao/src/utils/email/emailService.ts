
import { supabase } from '@/integrations/supabase/client';

/**
 * Core email service for sending notifications via Supabase Edge Function
 */
export const sendEmailNotification = async (payload: any): Promise<boolean> => {
  try {
    console.log('Sending email notification:', payload);
    
    const { data, error } = await supabase.functions.invoke('enviar-email', {
      body: payload
    });
    
    if (error) {
      console.error('Error response from email function:', error);
      throw new Error(`Error sending email notification: ${error.message}`);
    }
    
    console.log('Email notification sent successfully:', data);
    return true;
  } catch (error) {
    console.error('Failed to send email notification:', error);
    return false;
  }
};
