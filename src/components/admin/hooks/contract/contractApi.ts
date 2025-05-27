
import { supabase } from '@/integrations/supabase/client';
import { ContractData, ContractFormData, ContractTemplate, ContractStatus } from './types';

export const contractApi = {
  // Fetch all contracts
  async getContracts(): Promise<ContractData[]> {
    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching contracts:', error);
      throw error;
    }

    return (data || []).map(contract => ({
      ...contract,
      status: contract.status as ContractStatus
    }));
  },

  // Fetch single contract
  async getContract(id: string): Promise<ContractData | null> {
    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching contract:', error);
      throw error;
    }

    if (!data) return null;

    return {
      ...data,
      status: data.status as ContractStatus
    };
  },

  // Create contract
  async createContract(contractData: ContractFormData): Promise<string> {
    const { data, error } = await supabase
      .from('contracts')
      .insert({
        client_name: contractData.client_name,
        client_email: contractData.client_email,
        client_phone: contractData.client_phone,
        client_address: contractData.client_address,
        client_profession: contractData.client_profession,
        civil_status: contractData.civil_status,
        event_type: contractData.event_type,
        event_date: contractData.event_date || null,
        event_time: contractData.event_time || null,
        event_location: contractData.event_location,
        total_price: parseFloat(contractData.total_price),
        down_payment: contractData.down_payment ? parseFloat(contractData.down_payment) : null,
        down_payment_date: contractData.down_payment_date || null,
        remaining_amount: contractData.remaining_amount ? parseFloat(contractData.remaining_amount) : null,
        remaining_payment_date: contractData.remaining_payment_date || null,
        template_id: contractData.template_id || null,
        notes: contractData.notes || null,
        quote_request_id: contractData.quote_request_id || null,
        proposal_id: contractData.proposal_id || null
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error creating contract:', error);
      throw error;
    }

    return data.id;
  },

  // Update contract
  async updateContract(id: string, contractData: Partial<ContractFormData>): Promise<void> {
    const updateData: any = {};

    if (contractData.client_name !== undefined) updateData.client_name = contractData.client_name;
    if (contractData.client_email !== undefined) updateData.client_email = contractData.client_email;
    if (contractData.client_phone !== undefined) updateData.client_phone = contractData.client_phone;
    if (contractData.client_address !== undefined) updateData.client_address = contractData.client_address;
    if (contractData.client_profession !== undefined) updateData.client_profession = contractData.client_profession;
    if (contractData.civil_status !== undefined) updateData.civil_status = contractData.civil_status;
    if (contractData.event_type !== undefined) updateData.event_type = contractData.event_type;
    if (contractData.event_date !== undefined) updateData.event_date = contractData.event_date || null;
    if (contractData.event_time !== undefined) updateData.event_time = contractData.event_time || null;
    if (contractData.event_location !== undefined) updateData.event_location = contractData.event_location;
    if (contractData.total_price !== undefined) updateData.total_price = parseFloat(contractData.total_price);
    if (contractData.down_payment !== undefined) updateData.down_payment = contractData.down_payment ? parseFloat(contractData.down_payment) : null;
    if (contractData.down_payment_date !== undefined) updateData.down_payment_date = contractData.down_payment_date || null;
    if (contractData.remaining_amount !== undefined) updateData.remaining_amount = contractData.remaining_amount ? parseFloat(contractData.remaining_amount) : null;
    if (contractData.remaining_payment_date !== undefined) updateData.remaining_payment_date = contractData.remaining_payment_date || null;
    if (contractData.notes !== undefined) updateData.notes = contractData.notes || null;

    const { error } = await supabase
      .from('contracts')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating contract:', error);
      throw error;
    }
  },

  // Delete contract
  async deleteContract(id: string): Promise<void> {
    const { error } = await supabase
      .from('contracts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting contract:', error);
      throw error;
    }
  },

  // Update contract status
  async updateContractStatus(id: string, status: string): Promise<void> {
    const { error } = await supabase
      .from('contracts')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating contract status:', error);
      throw error;
    }
  },

  // Get contract templates
  async getContractTemplates(): Promise<ContractTemplate[]> {
    const { data, error } = await supabase
      .from('contract_templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching contract templates:', error);
      throw error;
    }

    return data || [];
  },

  // Get contract by public token
  async getContractByToken(token: string): Promise<ContractData | null> {
    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('public_token', token)
      .maybeSingle();

    if (error) {
      console.error('Error fetching contract by token:', error);
      throw error;
    }

    if (!data) return null;

    return {
      ...data,
      status: data.status as ContractStatus
    };
  },

  // Sign contract - enhanced with legal compliance
  async signContract(token: string, signatureData: any, ip: string): Promise<void> {
    console.log('Signing contract with token:', token);
    console.log('Signature data:', signatureData);
    
    // First, get the contract ID from the token
    const { data: contract, error: fetchError } = await supabase
      .from('contracts')
      .select('id, client_name, client_email, event_type')
      .eq('public_token', token)
      .single();

    if (fetchError || !contract) {
      console.error('Error fetching contract for signing:', fetchError);
      throw new Error('Contract not found');
    }

    try {
      // Call the edge function to process signing and send emails
      const { error: functionError } = await supabase.functions.invoke('contract-signed', {
        body: {
          contractId: contract.id,
          signatureData: {
            ...signatureData,
            signer_ip: ip
          },
          clientIP: ip
        }
      });

      if (functionError) {
        console.error('Error calling contract-signed function:', functionError);
        throw functionError;
      }

      console.log('Contract signed successfully via edge function');
    } catch (error) {
      console.error('Error in sign contract process:', error);
      
      // Fallback: update contract status directly if edge function fails
      const { error: directUpdateError } = await supabase
        .from('contracts')
        .update({
          status: 'signed',
          signed_at: new Date().toISOString(),
          signer_ip: ip,
          signature_data: signatureData
        })
        .eq('public_token', token);

      if (directUpdateError) {
        console.error('Error updating contract directly:', directUpdateError);
        throw directUpdateError;
      }

      console.log('Contract status updated directly as fallback');
    }
  }
};
