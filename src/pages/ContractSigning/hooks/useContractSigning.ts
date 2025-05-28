
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ContractData } from '@/components/admin/hooks/contract/types';

export const useContractSigning = (contract: ContractData | null, setContract: (contract: ContractData) => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signature, setSignature] = useState('');
  const [signatureUrl, setSignatureUrl] = useState(contract?.preview_signature_url || '');
  const [hasDrawnSignature, setHasDrawnSignature] = useState(!!contract?.preview_signature_url);
  const [clientName, setClientName] = useState(contract?.client_name || '');
  const [clientEmail, setClientEmail] = useState(contract?.client_email || '');
  const [isInPreviewMode, setIsInPreviewMode] = useState(contract?.status === 'draft_signed');

  // Função para salvar assinatura como preview (primeira etapa)
  const handleSaveSignaturePreview = async () => {
    if (!contract || !signature || !hasDrawnSignature || !signatureUrl) {
      toast.error('Por favor, desenhe e salve sua assinatura antes de continuar');
      return;
    }

    if (!clientName.trim()) {
      toast.error('Por favor, preencha seu nome completo');
      return;
    }

    if (!clientEmail.trim() || !clientEmail.includes('@')) {
      toast.error('Por favor, digite um email válido');
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Salvando preview da assinatura:', {
        contractId: contract.id,
        hasSignature: !!signatureUrl,
        clientName,
        clientEmail
      });

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

      if (error) {
        console.error('Erro ao salvar preview:', error);
        throw error;
      }

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
    if (!contract) {
      toast.error('Erro: contrato não encontrado');
      return;
    }

    // Usar a URL da assinatura salva no banco (preview) ou a local como fallback
    const finalSignatureUrl = contract.preview_signature_url || signatureUrl;
    
    if (!finalSignatureUrl) {
      toast.error('Erro: assinatura não encontrada. Por favor, desenhe sua assinatura novamente.');
      return;
    }

    console.log('Confirmando assinatura definitiva:', {
      contractId: contract.id,
      hasPreviewSignature: !!contract.preview_signature_url,
      hasLocalSignature: !!signatureUrl,
      finalSignatureUrl: !!finalSignatureUrl
    });

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

      // Chamar edge function com dados no formato correto
      const { error } = await supabase.functions.invoke('contract-signed', {
        body: {
          contractId: contract.id,
          signature: finalSignatureUrl,
          clientName,
          clientEmail,
          ipAddress,
          userAgent,
          signedAt
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
      toast.error('Erro ao confirmar assinatura do contrato. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para voltar à edição da assinatura
  const handleEditSignature = async () => {
    if (!contract) {
      toast.error('Erro: contrato não encontrado');
      return;
    }

    console.log('Editando assinatura - removendo preview do banco');
    
    try {
      // Atualizar banco para remover status de preview
      const { data, error } = await supabase
        .from('contracts')
        .update({
          status: 'sent', // Voltar para status enviado
          preview_signature_url: null,
          signature_drawn_at: null
        })
        .eq('id', contract.id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao limpar preview da assinatura:', error);
        throw error;
      }

      // Atualizar estado local
      setContract({
        ...data,
        status: data.status as ContractData['status']
      });

      // Resetar estados locais
      setIsInPreviewMode(false);
      setHasDrawnSignature(false);
      setSignature('');
      setSignatureUrl('');

      toast.success('Voltando para edição da assinatura');
    } catch (error) {
      console.error('Error editing signature:', error);
      toast.error('Erro ao editar assinatura');
    }
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
