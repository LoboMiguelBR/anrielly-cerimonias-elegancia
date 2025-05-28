
import { useState } from 'react';
import { ContractData } from '../../hooks/contract/types';
import { toast } from 'sonner';

export const useContractActions = (contract: ContractData, onStatusUpdate?: () => void) => {
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');

  const contractUrl = `${window.location.origin}/contrato/${contract.public_token}`;

  // Load default template when dialog opens
  const loadDefaultTemplate = async () => {
    try {
      setEmailSubject(`Contrato para Assinatura Digital - ${contract.event_type}`);
      setEmailMessage(getDefaultEmailContent(contract));
    } catch (error) {
      console.error('Error loading default template:', error);
      setEmailSubject(`Contrato para Assinatura Digital - ${contract.event_type}`);
      setEmailMessage(getDefaultEmailContent(contract));
    }
  };

  const replaceVariables = (content: string, contractData: ContractData): string => {
    return content
      .replace(/{NOME_CLIENTE}/g, contractData.client_name)
      .replace(/{EMAIL_CLIENTE}/g, contractData.client_email)
      .replace(/{TELEFONE_CLIENTE}/g, contractData.client_phone)
      .replace(/{TIPO_EVENTO}/g, contractData.event_type)
      .replace(/{DATA_EVENTO}/g, contractData.event_date ? new Date(contractData.event_date).toLocaleDateString('pt-BR') : 'A definir')
      .replace(/{LOCAL_EVENTO}/g, contractData.event_location || 'A definir')
      .replace(/{VALOR_TOTAL}/g, new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(contractData.total_price))
      .replace(/{LINK_CONTRATO}/g, contractUrl)
      .replace(/{DATA_ASSINATURA}/g, contractData.signed_at ? new Date(contractData.signed_at).toLocaleString('pt-BR') : 'Não assinado')
      .replace(/{NOME_EMPRESA}/g, 'Anrielly Gomes - Mestre de Cerimônia')
      .replace(/{TELEFONE_EMPRESA}/g, '(24) 99268-9947')
      .replace(/{EMAIL_EMPRESA}/g, 'contato@anriellygomes.com.br');
  };

  const getDefaultEmailContent = (contractData: ContractData): string => {
    return `
Olá ${contractData.client_name},

Segue o link para assinatura digital do seu contrato de prestação de serviços de cerimonial:

${contractUrl}

✅ SOBRE A ASSINATURA DIGITAL:
• Possui validade jurídica conforme Lei nº 14.063/2020
• Registra automaticamente data, hora e IP para auditoria
• Você receberá o PDF assinado por email após a conclusão

📋 PARA ASSINAR:
• Clique no link acima
• Leia o contrato completo
• Preencha seus dados pessoais
• Desenhe sua assinatura no campo indicado (obrigatório)
• Clique em "Assinar Contrato Digitalmente"

⚠️ IMPORTANTE: A assinatura desenhada é obrigatória para garantir a validade jurídica do documento.

Caso tenha alguma dúvida, entre em contato conosco.

Atenciosamente,
Anrielly Gomes - Mestre de Cerimônia
(24) 99268-9947
contato@anriellygomes.com.br
    `.trim();
  };

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

  const openEmailDialog = () => {
    setIsEmailDialogOpen(true);
    loadDefaultTemplate();
  };

  const sendContractEmail = async () => {
    setIsSending(true);
    try {
      console.log('Sending contract email via edge function...');
      
      const response = await fetch('https://oampddkpuybkbwqggrty.supabase.co/functions/v1/enviar-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: contract.client_email,
          name: contract.client_name,
          subject: emailSubject,
          message: emailMessage,
          contractUrl: contractUrl,
          eventType: contract.event_type,
          contractData: contract,
          tipo: 'contrato-assinatura'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response from email function:', errorData);
        throw new Error(`Error sending email: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Email sent successfully:', result);

      toast.success('Email enviado com sucesso!');
      setIsEmailDialogOpen(false);
      onStatusUpdate?.();
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
    selectedTemplateId,
    setSelectedTemplateId,
    copyToClipboard,
    openContractLink,
    openEmailDialog,
    sendContractEmail,
    replaceVariables,
    loadDefaultTemplate
  };
};
