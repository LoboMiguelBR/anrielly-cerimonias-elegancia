
import { supabase } from '@/integrations/supabase/client';
import { ContractEmailTemplate, ContractEmailTemplateFormData } from '../types';

export const contractEmailTemplatesApi = {
  // Get all contract email templates
  async getContractEmailTemplates(): Promise<ContractEmailTemplate[]> {
    const { data, error } = await supabase
      .from('contract_email_templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching contract email templates:', error);
      throw error;
    }

    return (data || []).map(template => ({
      ...template,
      template_type: template.template_type as 'signature' | 'signed_confirmation' | 'reminder'
    }));
  },

  // Create contract email template
  async createContractEmailTemplate(templateData: ContractEmailTemplateFormData): Promise<ContractEmailTemplate> {
    // Se for marcado como padrão, desmarcar outros templates do mesmo tipo
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

    return {
      ...data,
      template_type: data.template_type as 'signature' | 'signed_confirmation' | 'reminder'
    };
  },

  // Update contract email template
  async updateContractEmailTemplate(id: string, templateData: Partial<ContractEmailTemplateFormData>): Promise<ContractEmailTemplate> {
    // Se for marcado como padrão, desmarcar outros templates do mesmo tipo
    if (templateData.is_default && templateData.template_type) {
      await supabase
        .from('contract_email_templates')
        .update({ is_default: false })
        .eq('template_type', templateData.template_type)
        .neq('id', id);
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

    return {
      ...data,
      template_type: data.template_type as 'signature' | 'signed_confirmation' | 'reminder'
    };
  },

  // Delete contract email template
  async deleteContractEmailTemplate(id: string): Promise<void> {
    const { error } = await supabase
      .from('contract_email_templates')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting contract email template:', error);
      throw error;
    }
  },

  // Get default template by type
  async getDefaultTemplateByType(type: 'signature' | 'signed_confirmation' | 'reminder'): Promise<ContractEmailTemplate | null> {
    const { data, error } = await supabase
      .from('contract_email_templates')
      .select('*')
      .eq('template_type', type)
      .eq('is_default', true)
      .maybeSingle();

    if (error) {
      console.error('Error fetching default template by type:', error);
      throw error;
    }

    if (!data) return null;

    return {
      ...data,
      template_type: data.template_type as 'signature' | 'signed_confirmation' | 'reminder'
    };
  },

  // Get templates by type
  async getTemplatesByType(type: 'signature' | 'signed_confirmation' | 'reminder'): Promise<ContractEmailTemplate[]> {
    const { data, error } = await supabase
      .from('contract_email_templates')
      .select('*')
      .eq('template_type', type)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching templates by type:', error);
      throw error;
    }

    return (data || []).map(template => ({
      ...template,
      template_type: template.template_type as 'signature' | 'signed_confirmation' | 'reminder'
    }));
  }
};
