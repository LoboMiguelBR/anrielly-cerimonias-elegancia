
import { supabase } from '@/integrations/supabase/client';

export const useAutomations = (proposals: any[], contracts: any[]) => {
  // Função para criar evento automaticamente quando proposta é aprovada
  const createEventFromProposal = async (proposalId: string) => {
    try {
      const proposal = proposals.find(p => p.id === proposalId);
      if (!proposal) return;

      const { error } = await supabase
        .from('events')
        .insert([{
          type: proposal.event_type,
          date: proposal.event_date,
          location: proposal.event_location,
          description: `Evento criado automaticamente da proposta aprovada para ${proposal.client_name}`,
          status: 'em_planejamento',
          proposal_id: proposalId,
          quote_id: proposal.quote_request_id,
          notes: proposal.notes
        }]);

      if (error) {
        console.error('Erro ao criar evento:', error);
      } else {
        console.log('Evento criado automaticamente para proposta:', proposalId);
      }
    } catch (error) {
      console.error('Erro ao criar evento automaticamente:', error);
    }
  };

  // Função para criar cliente automaticamente quando contrato é assinado
  const createClientFromContract = async (contractId: string) => {
    try {
      const contract = contracts.find(c => c.id === contractId);
      if (!contract) return;

      // Verificar se já existe cliente com este email
      const { data: existingClient } = await supabase
        .from('clientes')
        .select('id')
        .eq('email', contract.client_email)
        .maybeSingle();

      if (existingClient) {
        console.log('Cliente já existe:', existingClient.id);
        return;
      }

      const { error } = await supabase
        .from('clientes')
        .insert([{
          name: contract.client_name,
          email: contract.client_email,
          phone: contract.client_phone,
          event_type: contract.event_type,
          event_date: contract.event_date,
          event_location: contract.event_location,
          quote_id: contract.quote_request_id,
          origin: 'contrato_assinado',
          status: 'ativo'
        }]);

      if (error) {
        console.error('Erro ao criar cliente:', error);
      } else {
        console.log('Cliente criado automaticamente do contrato:', contractId);
      }
    } catch (error) {
      console.error('Erro ao criar cliente automaticamente:', error);
    }
  };

  return {
    createEventFromProposal,
    createClientFromContract
  };
};
