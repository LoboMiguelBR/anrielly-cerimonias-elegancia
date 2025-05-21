
import { supabase } from '@/integrations/supabase/client';
import { ProposalData, Service } from './types';
import { Json } from '@/integrations/supabase/types';

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
      // Add explicit type casting for services
      services: (data.services as unknown) as Service[],
      total_price: data.total_price,
      payment_terms: data.payment_terms,
      notes: data.notes,
      quote_request_id: data.quote_request_id,
      validity_date: data.validity_date,
      created_at: data.created_at,
      template_id: data.template_id || '',
      status: data.status,
      pdf_url: data.pdf_url
    };
  } catch (error) {
    console.error('Error fetching proposal:', error);
    return null;
  }
};

// Create or update a proposal
export const saveProposal = async (proposal: Omit<ProposalData, 'id' | 'created_at'> & { id?: string }): Promise<string | null> => {
  try {
    const newProposal = {
      client_name: proposal.client_name,
      client_email: proposal.client_email,
      client_phone: proposal.client_phone,
      event_type: proposal.event_type,
      event_date: proposal.event_date,
      event_location: proposal.event_location,
      // Cast the services to Json to satisfy TypeScript
      services: proposal.services as unknown as Json,
      total_price: proposal.total_price,
      payment_terms: proposal.payment_terms,
      notes: proposal.notes,
      quote_request_id: proposal.quote_request_id,
      validity_date: proposal.validity_date,
      template_id: proposal.template_id || '',
      status: proposal.status || 'draft',
    };

    if (proposal.id) {
      // Update existing proposal
      const { error } = await supabase
        .from('proposals')
        .update(newProposal)
        .eq('id', proposal.id);
        
      if (error) throw error;
      return proposal.id;
    } else {
      // Create new proposal
      const { data, error } = await supabase
        .from('proposals')
        .insert([newProposal])
        .select('id');
        
      if (error) throw error;
      return data?.[0]?.id || null;
    }
  } catch (error) {
    console.error('Error saving proposal:', error);
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

// Generate and store a PDF for a proposal
export const generateProposalPDF = async (proposalId: string, pdfBlob: Blob): Promise<string | null> => {
  try {
    // Upload PDF to storage
    const filePath = `proposals/${proposalId}.pdf`;
    const { error: uploadError } = await supabase.storage
      .from('proposals')
      .upload(filePath, pdfBlob, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data } = supabase.storage
      .from('proposals')
      .getPublicUrl(filePath);

    const pdfUrl = data.publicUrl;

    // Update proposal with PDF URL
    const { error: updateError } = await supabase
      .from('proposals')
      .update({ pdf_url: pdfUrl })
      .eq('id', proposalId);

    if (updateError) throw updateError;

    return pdfUrl;
  } catch (error) {
    console.error('Error generating proposal PDF:', error);
    return null;
  }
};

// Send a proposal by email - Stub function, will be implemented later
export const sendProposalByEmail = async (proposal: ProposalData): Promise<boolean> => {
  try {
    console.log('Sending proposal by email:', proposal.id, 'to', proposal.client_email);
    // Implementation would go here - for now just return success
    return true;
  } catch (error) {
    console.error('Error sending proposal by email:', error);
    return false;
  }
};

// Save the PDF URL to the proposal
export const savePdfUrl = async (proposalId: string, pdfUrl: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('proposals')
      .update({ pdf_url: pdfUrl })
      .eq('id', proposalId);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error saving PDF URL:', error);
    return false;
  }
};
