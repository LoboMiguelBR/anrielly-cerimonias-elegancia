
import { supabase } from '@/integrations/supabase/client';
import { ContractEmailTemplate, ContractEmailTemplateFormData } from '../types';

export const contractEmailTemplatesApi = {
  // Get all email templates
  async getContractEmailTemplates(): Promise<ContractEmailTemplate[]> {
    const { data, error } = await supabase
      .from('contract_email_templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching contract email templates:', error);
      throw error;
    }

    return data || [];
  },

  // Get email template by ID
  async getContractEmailTemplateById(id: string): Promise<ContractEmailTemplate | null> {
    const { data, error } = await supabase
      .from('contract_email_templates')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching contract email template by ID:', error);
      throw error;
    }

    return data;
  },

  // Get default email template by type
  async getDefaultEmailTemplate(type: string): Promise<ContractEmailTemplate | null> {
    const { data, error } = await supabase
      .from('contract_email_templates')
      .select('*')
      .eq('template_type', type)
      .eq('is_default', true)
      .maybeSingle();

    if (error) {
      console.error('Error fetching default email template:', error);
      throw error;
    }

    return data;
  },

  // Create email template
  async createContractEmailTemplate(templateData: ContractEmailTemplateFormData): Promise<ContractEmailTemplate> {
    // If this is being set as default, first remove default flag from others of same type
    if (templateData.is_default) {
      await supabase
        .from('contract_email_templates')
        .update({ is_default: false })
        .eq('template_type', templateData.template_type);
    }

    const { data, error } = await supabase
      .from('contract_email_templates')
      .insert(templateData)
      .select()
      .single();

    if (error) {
      console.error('Error creating contract email template:', error);
      throw error;
    }

    return data;
  },

  // Update email template
  async updateContractEmailTemplate(id: string, templateData: Partial<ContractEmailTemplateFormData>): Promise<ContractEmailTemplate> {
    // If this is being set as default, first remove default flag from others of same type
    if (templateData.is_default) {
      const { data: currentTemplate } = await supabase
        .from('contract_email_templates')
        .select('template_type')
        .eq('id', id)
        .single();

      if (currentTemplate) {
        await supabase
          .from('contract_email_templates')
          .update({ is_default: false })
          .eq('template_type', currentTemplate.template_type)
          .neq('id', id);
      }
    }

    const { data, error } = await supabase
      .from('contract_email_templates')
      .update(templateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating contract email template:', error);
      throw error;
    }

    return data;
  },

  // Delete email template
  async deleteContractEmailTemplate(id: string): Promise<void> {
    const { error } = await supabase
      .from('contract_email_templates')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting contract email template:', error);
      throw error;
    }
  }
};
