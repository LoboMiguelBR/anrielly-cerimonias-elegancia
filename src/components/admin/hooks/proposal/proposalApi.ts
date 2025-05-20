
import { supabase } from '@/integrations/supabase/client';
import { ProposalFormData, ProposalData } from './types';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';

export async function fetchProposal(proposalId: string): Promise<ProposalData | null> {
  try {
    const { data, error } = await supabase
      .from('proposals')
      .select('*')
      .eq('id', proposalId)
      .single();
    
    if (error) {
      console.error('Erro ao carregar proposta:', error);
      toast.error("Erro ao carregar proposta");
      return null;
    }
    
    if (data) {
      // Use type assertion to properly cast services from Json to Service[]
      const typedServices = (data.services as unknown) as ProposalData['services'];
      
      return {
        id: data.id,
        client_name: data.client_name,
        client_email: data.client_email,
        client_phone: data.client_phone,
        event_type: data.event_type,
        event_date: data.event_date,
        event_location: data.event_location,
        services: typedServices,
        total_price: data.total_price,
        payment_terms: data.payment_terms,
        notes: data.notes || null,
        quote_request_id: data.quote_request_id,
        validity_date: data.validity_date,
        created_at: data.created_at
      };
    }
    
    return null;
  } catch (error: any) {
    console.error('Erro ao buscar proposta:', error);
    toast.error(`Erro ao buscar proposta: ${error.message}`);
    return null;
  }
}

export async function saveProposalToDb(proposalData: ProposalFormData, proposalId?: string): Promise<string | null> {
  try {
    // Filter only included services
    const includedServices = proposalData.services.filter(service => service.included);
    
    const dbProposalData = {
      client_name: proposalData.client_name,
      client_email: proposalData.client_email,
      client_phone: proposalData.client_phone,
      event_type: proposalData.event_type,
      event_date: proposalData.event_date,
      event_location: proposalData.event_location,
      services: includedServices as unknown as Json, // Type cast to satisfy Supabase's Json type
      total_price: parseFloat(proposalData.total_price) || 0,
      payment_terms: proposalData.payment_terms,
      notes: proposalData.notes || null,
      quote_request_id: proposalData.quote_request_id,
      validity_date: proposalData.validity_date
    };
    
    let data;
    let error;
    
    if (proposalId) {
      // Update existing proposal
      const result = await supabase
        .from('proposals')
        .update(dbProposalData)
        .eq('id', proposalId)
        .select('id')
        .single();
        
      data = result.data;
      error = result.error;
    } else {
      // Insert new proposal
      const result = await supabase
        .from('proposals')
        .insert(dbProposalData)
        .select('id')
        .single();
        
      data = result.data;
      error = result.error;
    }
    
    if (error) throw error;
    
    // Update quote request status if it's a new proposal
    if (!proposalId && proposalData.quote_request_id) {
      const { error: quoteError } = await supabase
        .from('quote_requests')
        .update({ status: 'proposta' })
        .eq('id', proposalData.quote_request_id);
      
      if (quoteError) {
        console.error('Erro ao atualizar status do orçamento', quoteError);
      }
    }
    
    toast.success(proposalId ? "Proposta atualizada com sucesso!" : "Proposta criada com sucesso!");
    
    return data?.id || proposalId || null;
  } catch (error: any) {
    console.error('Erro ao salvar proposta:', error);
    toast.error(`Erro ao salvar proposta: ${error.message}`);
    return null;
  }
}

export async function deleteProposalFromDb(proposalId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('proposals')
      .delete()
      .eq('id', proposalId);
      
    if (error) throw error;
    
    toast.success("Proposta excluída com sucesso!");
    return true;
  } catch (error: any) {
    console.error('Erro ao excluir proposta:', error);
    toast.error(`Erro ao excluir proposta: ${error.message}`);
    return false;
  }
}
