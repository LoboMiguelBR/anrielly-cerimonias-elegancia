
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ContractData } from '@/components/admin/hooks/contract/types';

export const useContractSigning = (contract: ContractData | null, setContract: (contract: ContractData) => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signature, setSignature] = useState('');
  const [hasDrawnSignature, setHasDrawnSignature] = useState(false);
  const [clientName, setClientName] = useState(contract?.client_name || '');
  const [clientEmail, setClientEmail] = useState(contract?.client_email || '');

  const handleSignContract = async () => {
    if (!contract || !signature || !hasDrawnSignature) {
      toast.error('Por favor, assine o contrato antes de continuar');
      return;
    }

    setIsSubmitting(true);
    try {
      // Obter IP do cliente
      let ip = 'unknown';
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        if (ipResponse.ok) {
          const ipData = await ipResponse.json();
          ip = ipData.ip;
        }
      } catch (ipError) {
        console.warn('Failed to get IP address:', ipError);
      }

      const { error } = await supabase.functions.invoke('contract-signed', {
        body: {
          contractId: contract.id,
          signature,
          clientName,
          clientEmail,
          ipAddress: ip,
          signatureData: {
            signature,
            signed_at: new Date().toISOString(),
            signer_ip: ip,
            user_agent: navigator.userAgent
          }
        }
      });

      if (error) throw error;

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
      }
    } catch (error) {
      console.error('Error signing contract:', error);
      toast.error('Erro ao assinar contrato');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    signature,
    setSignature,
    hasDrawnSignature,
    setHasDrawnSignature,
    clientName,
    setClientName,
    clientEmail,
    setClientEmail,
    handleSignContract
  };
};
