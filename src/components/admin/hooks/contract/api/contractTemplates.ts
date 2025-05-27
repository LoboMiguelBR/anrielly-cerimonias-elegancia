
import { supabase } from '@/integrations/supabase/client';
import { ContractTemplate } from '../types';

export const contractTemplatesApi = {
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
  }
};
