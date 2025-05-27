import { supabase } from '@/integrations/supabase/client';
import { Contract, ContractFormData, ContractTemplate, ContractTemplateFormData, ContractEmailTemplate, ContractEmailTemplateFormData, ContractData } from './types';

export const contractApi = {
  // Contracts
  async getContracts(): Promise<Contract[]> {
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
      status: contract.status as 'pending' | 'signed' | 'draft' | 'canceled'
    }));
  },

  async getContractById(id: string): Promise<Contract | null> {
    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching contract by id:', error);
      throw error;
    }

    return data ? {
      ...data,
      status: data.status as 'pending' | 'signed' | 'draft' | 'canceled'
    } : null;
  },

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
      token: data.token || data.id, // fallback to id if token is missing
      status: data.status as 'pending' | 'signed' | 'draft' | 'canceled'
    };
  },

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
  },

  async createContract(contractData: ContractFormData): Promise<Contract> {
    const { data, error } = await supabase
      .from('contracts')
      .insert(contractData)
      .select()
      .single();

    if (error) {
      console.error('Error creating contract:', error);
      throw error;
    }

    return {
      ...data,
      status: data.status as 'pending' | 'signed' | 'draft' | 'canceled'
    };
  },

  async updateContract(id: string, contractData: Partial<ContractFormData>): Promise<Contract> {
    const { data, error } = await supabase
      .from('contracts')
      .update(contractData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating contract:', error);
      throw error;
    }

    return {
      ...data,
      status: data.status as 'pending' | 'signed' | 'draft' | 'canceled'
    };
  },

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

  // Contract Templates
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

  async createContractTemplate(templateData: ContractTemplateFormData): Promise<ContractTemplate> {
    // If marking as default, unset other defaults first
    if (templateData.is_default) {
      await supabase
        .from('contract_templates')
        .update({ is_default: false })
        .neq('id', ''); // This will affect all records since we're creating a new one
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

  async updateContractTemplate(id: string, templateData: Partial<ContractTemplateFormData>): Promise<ContractTemplate> {
    // If marking as default, unset other defaults first
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

  async getDefaultTemplate(): Promise<ContractTemplate | null> {
    const { data, error } = await supabase
      .from('contract_templates')
      .select('*')
      .eq('is_default', true)
      .maybeSingle();

    if (error) {
      console.error('Error fetching default template:', error);
      throw error;
    }

    return data;
  },

  // Contract Email Templates
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

    if (!data) return null;

    return {
      ...data,
      template_type: data.template_type as 'signature' | 'signed_confirmation' | 'reminder'
    };
  },

  async createContractEmailTemplate(templateData: ContractEmailTemplateFormData): Promise<ContractEmailTemplate> {
    // If marking as default, unset other defaults of the same type first
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

  async updateContractEmailTemplate(id: string, templateData: Partial<ContractEmailTemplateFormData>): Promise<ContractEmailTemplate> {
    // If marking as default, unset other defaults of the same type first
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

  async getDefaultEmailTemplate(type: 'signature' | 'signed_confirmation' | 'reminder'): Promise<ContractEmailTemplate | null> {
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

    if (!data) return null;

    return {
      ...data,
      template_type: data.template_type as 'signature' | 'signed_confirmation' | 'reminder'
    };
  }
};
