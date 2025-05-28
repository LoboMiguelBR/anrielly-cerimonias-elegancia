
import { supabase } from '@/integrations/supabase/client';
import { ContractData, ContractFormData, ContractStatus } from '../../types';
import { contractSlugApi } from '../contractSlug';
import { sanitizeDateTimeFields } from './utils';

export const contractUpdateApi = {
  // Update contract
  async updateContract(id: string, contractData: Partial<ContractFormData>): Promise<ContractData> {
    // Sanitize date/time fields and convert number fields to ensure proper types
    const sanitizedData = sanitizeDateTimeFields(contractData);
    
    const formattedData = {
      ...sanitizedData,
      total_price: contractData.total_price ? Number(contractData.total_price) : undefined,
      down_payment: contractData.down_payment ? Number(contractData.down_payment) : undefined,
      remaining_amount: contractData.remaining_amount ? Number(contractData.remaining_amount) : undefined,
      // Include audit data for updates
      ip_address: contractData.ip_address || undefined,
      user_agent: contractData.user_agent || undefined,
    };

    console.log('Updating contract with data:', formattedData);

    const { data, error } = await supabase
      .from('contracts')
      .update(formattedData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating contract:', error);
      throw error;
    }

    // Update slug if client name or event date changed
    if (contractData.client_name || contractData.event_date) {
      try {
        const slug = await contractSlugApi.updateSlug(
          id, 
          contractData.client_name || data.client_name, 
          contractData.event_date || data.event_date
        );
        data.public_slug = slug;
        console.log('Updated slug for contract:', slug);
      } catch (slugError) {
        console.warn('Failed to update slug:', slugError);
      }
    }

    return {
      ...data,
      status: data.status as ContractStatus,
      token: data.token || data.id,
      total_price: Number(data.total_price),
      down_payment: data.down_payment ? Number(data.down_payment) : undefined,
      remaining_amount: data.remaining_amount ? Number(data.remaining_amount) : undefined
    } as ContractData; // Explicit cast to ensure type compatibility
  }
};
