
import { supabase } from '@/integrations/supabase/client';
import { useAutomations } from './useAutomations';

export const useStatusUpdater = (
  proposals: any[],
  contracts: any[],
  refetchQuotes: () => Promise<void>,
  fetchProposals: () => Promise<void>,
  fetchContracts: () => Promise<void>
) => {
  const { createEventFromProposal, createClientFromContract } = useAutomations(proposals, contracts);

  const updateItemStatus = async (itemId: string, newStatus: string, itemType: 'quote' | 'proposal' | 'contract') => {
    try {
      console.log('Updating item status:', { itemId, newStatus, itemType });
      
      // Extrair o ID real removendo o prefixo
      const realId = itemId.replace(`${itemType}-`, '');
      
      switch (itemType) {
        case 'quote':
          const { error: quoteError } = await supabase
            .from('quote_requests')
            .update({ status: newStatus })
            .eq('id', realId);
          if (quoteError) throw quoteError;
          // Refetch quotes para atualizar o estado
          await refetchQuotes();
          break;
          
        case 'proposal':
          const { error: proposalError } = await supabase
            .from('proposals')
            .update({ status: newStatus })
            .eq('id', realId);
          if (proposalError) throw proposalError;
          
          // Se a proposta foi aprovada, criar um evento automaticamente
          if (newStatus === 'aprovado') {
            await createEventFromProposal(realId);
          }
          break;
          
        case 'contract':
          const { error: contractError } = await supabase
            .from('contracts')
            .update({ status: newStatus })
            .eq('id', realId);
          if (contractError) throw contractError;
          
          // Se contrato foi assinado, criar cliente automaticamente
          if (newStatus === 'assinado') {
            await createClientFromContract(realId);
          }
          break;
          
        default:
          throw new Error(`Tipo de item inválido: ${itemType}`);
      }

      // Recarregar dados após atualização
      await Promise.all([fetchProposals(), fetchContracts()]);
      
      console.log('Status updated successfully');
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      throw error;
    }
  };

  return { updateItemStatus };
};
