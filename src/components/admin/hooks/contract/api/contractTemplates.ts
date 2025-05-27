
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
  },

  // Create contract template
  async createContractTemplate(templateData: Omit<ContractTemplate, 'id' | 'created_at' | 'updated_at'>): Promise<ContractTemplate> {
    // Se for marcado como padrão, desmarcar outros templates
    if (templateData.is_default) {
      await supabase
        .from('contract_templates')
        .update({ is_default: false })
        .neq('id', '');
    }

    const { data, error } = await supabase
      .from('contract_templates')
      .insert(templateData)
      .select()
      .single();

    if (error) {
      console.error('Error creating contract template:', error);
      throw error;
    }

    return data;
  },

  // Update contract template
  async updateContractTemplate(id: string, templateData: Partial<ContractTemplate>): Promise<ContractTemplate> {
    // Se for marcado como padrão, desmarcar outros templates
    if (templateData.is_default) {
      await supabase
        .from('contract_templates')
        .update({ is_default: false })
        .neq('id', id);
    }

    const { data, error } = await supabase
      .from('contract_templates')
      .update(templateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating contract template:', error);
      throw error;
    }

    return data;
  },

  // Delete contract template
  async deleteContractTemplate(id: string): Promise<void> {
    const { error } = await supabase
      .from('contract_templates')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting contract template:', error);
      throw error;
    }
  },

  // Get default template
  async getDefaultTemplate(): Promise<ContractTemplate | null> {
    const { data, error } = await supabase
      .from('contract_templates')
      .select('*')
      .eq('is_default', true)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching default template:', error);
      throw error;
    }

    return data || null;
  }
};
