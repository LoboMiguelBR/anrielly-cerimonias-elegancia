
import { supabase } from '@/integrations/supabase/client';
import { ProposalData, Service } from './types';
import { Json } from '@/integrations/supabase/types';
import { toast } from 'sonner';

// Fetch all proposals
export const fetchProposals = async (): Promise<ProposalData[]> => {
  try {
    const { data, error } = await supabase
      .from('proposals')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    if (!data) return [];
    
    return data.map(item => ({
      id: item.id,
      client_name: item.client_name,
      client_email: item.client_email,
      client_phone: item.client_phone,
      event_type: item.event_type,
      event_date: item.event_date,
      event_location: item.event_location,
      services: (item.services as unknown) as Service[],
      total_price: item.total_price,
      payment_terms: item.payment_terms,
      notes: item.notes,
      quote_request_id: item.quote_request_id,
      validity_date: item.validity_date,
      created_at: item.created_at,
      template_id: item.template_id || null,
      status: item.status,
      pdf_url: item.pdf_url,
      html_content: item.html_content,
      css_content: item.css_content,
      version: item.version || 1,
      version_timestamp: item.version_timestamp,
      public_slug: item.public_slug,
      public_token: item.public_token
    }));
  } catch (error) {
    console.error('Error fetching proposals:', error);
    toast.error('Erro ao carregar propostas');
    return [];
  }
};

// Fetch a specific proposal
export const fetchProposal = async (id: string): Promise<ProposalData | null> => {
  try {
    const { data, error } = await supabase
      .from('proposals')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    if (!data) return null;
    
    return {
      id: data.id,
      client_name: data.client_name,
      client_email: data.client_email,
      client_phone: data.client_phone,
      event_type: data.event_type,
      event_date: data.event_date,
      event_location: data.event_location,
      services: (data.services as unknown) as Service[],
      total_price: data.total_price,
      payment_terms: data.payment_terms,
      notes: data.notes,
      quote_request_id: data.quote_request_id,
      validity_date: data.validity_date,
      created_at: data.created_at,
      template_id: data.template_id || null,
      status: data.status,
      pdf_url: data.pdf_url,
      html_content: data.html_content,
      css_content: data.css_content,
      version: data.version || 1,
      version_timestamp: data.version_timestamp,
      public_slug: data.public_slug,
      public_token: data.public_token
    };
  } catch (error) {
    console.error('Error fetching proposal:', error);
    return null;
  }
};

// Create or update a proposal
export const saveProposal = async (proposal: Omit<ProposalData, 'id' | 'created_at'> & { id?: string }): Promise<string | null> => {
  try {
    console.log('Saving proposal with template_id:', proposal.template_id);
    
    let templateId = proposal.template_id;
    
    if (templateId) {
      const { data: templateExists, error: templateError } = await supabase
        .from('proposal_template_html')
        .select('id')
        .eq('id', templateId)
        .maybeSingle();
        
      if (templateError) {
        console.warn('Error checking template existence:', templateError);
        templateId = null;
      } else if (!templateExists) {
        console.warn('Template ID not found in proposal_template_html, setting to null:', templateId);
        templateId = null;
      } else {
        console.log('Template validated successfully:', templateId);
      }
    }
    
    const proposalData = {
      client_name: proposal.client_name,
      client_email: proposal.client_email,
      client_phone: proposal.client_phone,
      event_type: proposal.event_type,
      event_date: proposal.event_date,
      event_location: proposal.event_location,
      services: proposal.services as unknown as Json,
      total_price: proposal.total_price,
      payment_terms: proposal.payment_terms,
      notes: proposal.notes,
      quote_request_id: proposal.quote_request_id,
      validity_date: proposal.validity_date,
      template_id: templateId,
      status: proposal.status || 'draft',
      html_content: proposal.html_content,
      css_content: proposal.css_content,
      version: proposal.version || 1,
      public_slug: proposal.public_slug,
      public_token: proposal.public_token
    };

    console.log('Final proposal data to save:', {
      ...proposalData,
      services: 'services array',
      template_id: proposalData.template_id
    });

    if (proposal.id) {
      const { error } = await supabase
        .from('proposals')
        .update(proposalData)
        .eq('id', proposal.id);
        
      if (error) {
        console.error('Error updating proposal:', error);
        throw error;
      }
      
      console.log('Proposal updated successfully:', proposal.id);
      return proposal.id;
    } else {
      const { data, error } = await supabase
        .from('proposals')
        .insert([proposalData])
        .select('id');
        
      if (error) {
        console.error('Error inserting proposal:', error);
        throw error;
      }
      
      const newId = data?.[0]?.id;
      if (newId) {
        console.log('Proposal created successfully:', newId);
        return newId;
      } else {
        throw new Error('No ID returned after insert');
      }
    }
  } catch (error: any) {
    console.error('Error saving proposal:', error);
    
    let errorMessage = 'Erro ao salvar proposta';
    if (error.message?.includes('foreign key')) {
      errorMessage = 'Erro de referência de template. Verifique se o template selecionado é válido.';
    } else if (error.message?.includes('null value')) {
      errorMessage = 'Erro: campos obrigatórios não preenchidos.';
    } else if (error.message) {
      errorMessage = `Erro: ${error.message}`;
    }
    
    toast.error(errorMessage);
    return null;
  }
};

const deleteProposal = async (id: string): Promise<boolean> => {
  try {
    console.log('Attempting to delete proposal:', id);
    
    const { error } = await supabase
      .from('proposals')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting proposal:', error);
      throw error;
    }
    
    console.log('Proposal deleted successfully:', id);
    toast.success('Proposta excluída com sucesso!');
    return true;
  } catch (error: any) {
    console.error('Error deleting proposal:', error);
    toast.error(`Erro ao excluir proposta: ${error.message}`);
    return false;
  }
};

const sendProposalByEmail = async (proposal: ProposalData): Promise<boolean> => {
  try {
    console.log('Sending proposal by email:', proposal.id, 'to', proposal.client_email);
    
    // Use the correct edge function call
    const { data, error } = await supabase.functions.invoke('send-proposal', {
      body: {
        proposalId: proposal.id,
        to: proposal.client_email,
        clientName: proposal.client_name,
        pdfUrl: proposal.pdf_url,
        subject: `Proposta de Serviço - ${proposal.event_type}`,
        message: `Olá ${proposal.client_name}, segue em anexo a proposta de serviços conforme solicitado.`
      }
    });

    if (error) {
      console.error('Error response from send-proposal:', error);
      throw new Error(`Erro ao enviar email: ${error.message}`);
    }

    console.log('Email sent successfully:', data);
    
    // Update proposal status to 'sent' after successful email
    await supabase
      .from('proposals')
      .update({ status: 'enviado' })
      .eq('id', proposal.id);

    toast.success(`Proposta enviada para ${proposal.client_email}!`);
    return true;
  } catch (error: any) {
    console.error('Error sending proposal by email:', error);
    toast.error(`Erro ao enviar proposta por email: ${error.message}`);
    return false;
  }
};

const savePdfUrl = async (proposalId: string, pdfUrl: string): Promise<boolean> => {
  try {
    console.log('Saving PDF URL:', pdfUrl, 'for proposal:', proposalId);
    const { error } = await supabase
      .from('proposals')
      .update({ pdf_url: pdfUrl })
      .eq('id', proposalId);
      
    if (error) {
      console.error('Error updating proposal with PDF URL:', error);
      throw error;
    }
    
    return true;
  } catch (error: any) {
    console.error('Error saving PDF URL:', error);
    toast.error(`Erro ao salvar URL do PDF: ${error.message}`);
    return false;
  }
};

export { deleteProposal, sendProposalByEmail, savePdfUrl };
