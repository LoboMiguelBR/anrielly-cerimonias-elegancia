
import { sendEmailNotification } from './emailService';

/**
 * Send a contract for signature via email with enhanced audit variables
 */
export const sendContractForSignature = async (
  clientName: string, 
  clientEmail: string, 
  contractUrl: string,
  eventType: string,
  contractData?: any
): Promise<boolean> => {
  return sendEmailNotification({
    to: clientEmail,
    name: clientName,
    contractUrl,
    eventType,
    contractData,
    tipo: 'contrato-assinatura'
  });
};

/**
 * Send contract signed confirmation with audit data
 */
export const sendContractSignedConfirmation = async (
  clientName: string,
  clientEmail: string,
  contractDetails: any,
  auditData?: {
    signerIp?: string;
    userAgent?: string;
    contractHash?: string;
    signedAt?: string;
  }
): Promise<boolean> => {
  return sendEmailNotification({
    to: clientEmail,
    name: clientName,
    contractDetails,
    auditData,
    tipo: 'contrato-assinado'
  });
};
