
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ContractData } from '@/components/admin/hooks/contract/types';

export const useContractSigning = (contract: ContractData | null, setContract: (contract: ContractData) => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signature, setSignature] = useState('');
  const [signatureUrl, setSignatureUrl] = useState('');
  const [hasDrawnSignature, setHasDrawnSignature] = useState(false);
  const [clientName, setClientName] = useState(contract?.client_name || '');
  const [clientEmail, setClientEmail] = useState(contract?.client_email || '');
  const [isInPreviewMode, setIsInPreviewMode] = useState(contract?.status === 'draft_signed');

  // Função para salvar assinatura como preview (primeira etapa)
  const handleSaveSignaturePreview = async () => {
    if (!contract || !signature || !hasDrawnSignature || !signatureUrl) {
      toast.error('Por favor, desenhe e salve sua assinatura antes de continuar');
      return;
    }

    setIsSubmitting(true);
    try {
      // Atualizar contrato com assinatura de preview
      const { data, error } = await supabase
        .from('contracts')
        .update({
          status: 'draft_signed',
          preview_signature_url: signatureUrl,
          signature_drawn_at: new Date().toISOString(),
          client_name: clientName,
          client_email: clientEmail
        })
        .eq('id', contract.id)
        .select()
        .single();

      if (error) throw error;

      // Atualizar estado local
      setContract({
        ...data,
        status: data.status as ContractData['status']
      });
      
      setIsInPreviewMode(true);
      toast.success('Assinatura salva! Revise o contrato antes de confirmar.');
    } catch (error) {
      console.error('Error saving signature preview:', error);
      toast.error('Erro ao salvar assinatura');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para confirmar assinatura definitiva (segunda etapa)
  const handleConfirmSignature = async () => {
    if (!contract || !signatureUrl) {
      toast.error('Erro: assinatura não encontrada');
      return;
    }

    setIsSubmitting(true);
    try {
      // Obter IP do cliente
      let ipAddress = 'unknown';
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        if (ipResponse.ok) {
          const ipData = await ipResponse.json();
          ipAddress = ipData.ip;
        }
      } catch (ipError) {
        console.warn('Failed to get IP address:', ipError);
      }

      // Capturar dados do dispositivo
      const userAgent = navigator.userAgent;
      const signedAt = new Date().toISOString();

      console.log('Confirmando assinatura definitiva:', {
        contractId: contract.id,
        hasPreviewSignature: !!contract.preview_signature_url,
        signatureUrl
      });

      // Chamar edge function com dados no formato correto
      const { error } = await supabase.functions.invoke('contract-signed', {
        body: {
          contractId: contract.id,
          signature: signatureUrl,
          clientName,
          clientEmail,
          ipAddress,
          signatureData: {
            signature: signatureUrl,
            signed_at: signedAt,
            signer_ip: ipAddress,
            user_agent: userAgent,
            client_name: clientName,
            client_email: clientEmail,
            timestamp: Date.now(),
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
          }
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }

      toast.success('Contrato assinado com sucesso!');
      
      // Atualizar dados do contrato
      const { data: updatedData } = await supabase
        .from('contracts')
        .select('*')
        .eq('id', contract.id)
        .single();

      if (updatedData) {
        setContract({
          ...updatedData,
          status: updatedData.status as ContractData['status']
        });
        setIsInPreviewMode(false);
      }
    } catch (error) {
      console.error('Error confirming contract signature:', error);
      toast.error('Erro ao confirmar assinatura do contrato');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para voltar à edição da assinatura
  const handleEditSignature = () => {
    setIsInPreviewMode(false);
    setHasDrawnSignature(false);
    setSignature('');
    setSignatureUrl('');
    
    // Opcional: limpar preview do banco (manter por segurança)
    // Usuário pode querer voltar ao preview sem redesenhar
  };

  return {
    isSubmitting,
    signature,
    setSignature,
    signatureUrl,
    setSignatureUrl,
    hasDrawnSignature,
    setHasDrawnSignature,
    clientName,
    setClientName,
    clientEmail,
    setClientEmail,
    isInPreviewMode,
    handleSaveSignaturePreview,
    handleConfirmSignature,
    handleEditSignature
  };
};
