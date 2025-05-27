
import { supabase } from '@/integrations/supabase/client';
import { ContractData, ContractStatus } from '../types';

export const contractSigningApi = {
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
