
import { useState } from 'react';
import { ContractData } from '../../hooks/contract/types';
import { sendEmailNotification } from '@/utils/emailUtils';
import { toast } from 'sonner';

export const useContractActions = (contract: ContractData, onStatusUpdate?: () => void) => {
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState(`Contrato para Assinatura Digital - ${contract.event_type}`);
  const [emailMessage, setEmailMessage] = useState(`
Olá ${contract.client_name},

Segue o link para assinatura digital do seu contrato de prestação de serviços de cerimonial:

{LINK_CONTRATO}

✅ SOBRE A ASSINATURA DIGITAL:
• Possui validade jurídica conforme Lei nº 14.063/2020
• Registra automaticamente data, hora e IP para auditoria
• Você receberá o PDF assinado por email após a conclusão

📋 PARA ASSINAR:
• Clique no link acima
• Leia o contrato completo
• Marque o checkbox de concordância
• Desenhe sua assinatura no campo indicado (obrigatório)
• Clique em "Assinar Contrato Digitalmente"

⚠️ IMPORTANTE: A assinatura desenhada é obrigatória para garantir a validade jurídica do documento.

Caso tenha alguma dúvida, entre em contato conosco.

Atenciosamente,
Anrielly Gomes - Mestre de Cerimônia
(24) 99268-9947
contato@anriellygomes.com.br
  `.trim());
  const [isSending, setIsSending] = useState(false);

  const contractUrl = `${window.location.origin}/contrato/${contract.public_token}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(contractUrl);
      toast.success('Link do contrato copiado para área de transferência!');
    } catch (err) {
      toast.error('Erro ao copiar link');
    }
  };

  const openContractLink = () => {
    window.open(contractUrl, '_blank');
  };

  const sendContractEmail = async () => {
    setIsSending(true);
    try {
      const messageWithLink = emailMessage.replace('{LINK_CONTRATO}', contractUrl);
      
      const success = await sendEmailNotification({
        to: contract.client_email,
        name: contract.client_name,
        subject: emailSubject,
        message: messageWithLink,
        tipo: 'contrato-assinatura',
        contractUrl: contractUrl,
        eventType: contract.event_type
      });

      if (success) {
        toast.success('Email enviado com sucesso!');
        setIsEmailDialogOpen(false);
        onStatusUpdate?.();
      } else {
        toast.error('Erro ao enviar email');
      }
    } catch (error) {
      console.error('Error sending contract email:', error);
      toast.error('Erro ao enviar email');
    } finally {
      setIsSending(false);
    }
  };

  return {
    isEmailDialogOpen,
    setIsEmailDialogOpen,
    emailSubject,
    setEmailSubject,
    emailMessage,
    setEmailMessage,
    isSending,
    contractUrl,
    copyToClipboard,
    openContractLink,
    sendContractEmail
  };
};
