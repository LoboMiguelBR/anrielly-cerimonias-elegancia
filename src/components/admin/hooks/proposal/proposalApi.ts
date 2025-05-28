
import { supabase } from '@/integrations/supabase/client';
import { ProposalData, Service } from './types';
import { Json } from '@/integrations/supabase/types';
import { toast } from 'sonner';

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
    
    // Prepare proposal data
    const newProposal = {
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
      template_id: proposal.template_id,
      status: proposal.status || 'draft',
      html_content: proposal.html_content,
      css_content: proposal.css_content,
      version: proposal.version || 1,
      public_slug: proposal.public_slug,
      public_token: proposal.public_token
    };

    if (proposal.id) {
      // Update existing proposal
      const { error } = await supabase
        .from('proposals')
        .update(newProposal)
        .eq('id', proposal.id);
        
      if (error) {
        console.error('Error updating proposal:', error);
        throw error;
      }
      
      return proposal.id;
    } else {
      // Create new proposal
      const { data, error } = await supabase
        .from('proposals')
        .insert([newProposal])
        .select('id');
        
      if (error) {
        console.error('Error inserting proposal:', error);
        throw error;
      }
      
      return data?.[0]?.id || null;
    }
  } catch (error: any) {
    console.error('Error saving proposal:', error);
    toast.error(`Erro ao salvar proposta: ${error.message}`);
    return null;
  }
};

// Delete a proposal
export const deleteProposal = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('proposals')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting proposal:', error);
    return false;
  }
};

// Send a proposal by email
export const sendProposalByEmail = async (proposal: ProposalData): Promise<boolean> => {
  try {
    console.log('Sending proposal by email:', proposal.id, 'to', proposal.client_email);
    
    // Call the email edge function
    const response = await fetch('/api/send-proposal-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        proposal,
        to: proposal.client_email,
        name: proposal.client_name,
        tipo: 'proposta-envio'
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    toast.success(`Proposta enviada para ${proposal.client_email}`);
    return true;
  } catch (error) {
    console.error('Error sending proposal by email:', error);
    toast.error('Erro ao enviar proposta por email');
    return false;
  }
};

// Save the PDF URL to the proposal
export const savePdfUrl = async (proposalId: string, pdfUrl: string): Promise<boolean> => {
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
