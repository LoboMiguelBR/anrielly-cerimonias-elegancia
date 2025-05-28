import { supabase } from '@/integrations/supabase/client';
import { ContractData, ContractFormData, ContractStatus } from '../types';
import { contractSlugApi } from './contractSlug';
import { sendContractForSignature } from '@/utils/email';
import { toast } from 'sonner';

const sanitizeDateTimeFields = (data: any) => {
  const sanitized = { ...data };
  
  // Convert empty strings to null for date/time fields
  if (sanitized.event_date === '') sanitized.event_date = null;
  if (sanitized.event_time === '') sanitized.event_time = null;
  if (sanitized.down_payment_date === '') sanitized.down_payment_date = null;
  if (sanitized.remaining_payment_date === '') sanitized.remaining_payment_date = null;
  
  return sanitized;
};

export const contractCrudApi = {
  // Get all contracts
  async getContracts(): Promise<ContractData[]> {
    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching contracts:', error);
      throw error;
    }

    // Ensure all required fields are present
    return data.map(contract => ({
      ...contract,
      token: contract.token || contract.id, // fallback to id if token is missing
      status: contract.status as ContractStatus,
      total_price: Number(contract.total_price),
      down_payment: contract.down_payment ? Number(contract.down_payment) : undefined,
      remaining_amount: contract.remaining_amount ? Number(contract.remaining_amount) : undefined
    })) as ContractData[]; // Explicit cast to ensure type compatibility
  },

  // Get contract by ID
  async getContractById(id: string): Promise<ContractData | null> {
    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching contract by ID:', error);
      throw error;
    }

    if (!data) return null;

    return {
      ...data,
      token: data.token || data.id, // fallback to id if token is missing
      status: data.status as ContractStatus,
      total_price: Number(data.total_price),
      down_payment: data.down_payment ? Number(data.down_payment) : undefined,
      remaining_amount: data.remaining_amount ? Number(data.remaining_amount) : undefined
    } as ContractData; // Explicit cast to ensure type compatibility
  },

  // Create contract
  async createContract(contractData: ContractFormData): Promise<ContractData> {
    // Generate tokens for the contract
    const token = crypto.randomUUID();
    const publicToken = crypto.randomUUID();

    // Sanitize date/time fields and convert number fields to ensure proper types
    const sanitizedData = sanitizeDateTimeFields(contractData);
    
    const formattedData = {
      ...sanitizedData,
      total_price: Number(contractData.total_price),
      down_payment: contractData.down_payment ? Number(contractData.down_payment) : null,
      remaining_amount: contractData.remaining_amount ? Number(contractData.remaining_amount) : null,
      token,
      public_token: publicToken,
      status: 'draft' as ContractStatus,
      // Include audit data
      ip_address: contractData.ip_address || null,
      user_agent: contractData.user_agent || null,
    };

    console.log('Creating contract with data:', formattedData);

    const { data, error } = await supabase
      .from('contracts')
      .insert(formattedData)
      .select()
      .single();

    if (error) {
      console.error('Error creating contract:', error);
      throw error;
    }

    // Generate and save slug after contract creation
    try {
      const slug = await contractSlugApi.generateAndSaveSlug(
        data.id, 
        contractData.client_name, 
        contractData.event_date
      );
      data.public_slug = slug;
      console.log('Generated slug for contract:', slug);
    } catch (slugError) {
      console.warn('Failed to generate slug, continuing without it:', slugError);
    }

    const contractResult = {
      ...data,
      status: data.status as ContractStatus,
      token: data.token || data.id,
      total_price: Number(data.total_price),
      down_payment: data.down_payment ? Number(data.down_payment) : undefined,
      remaining_amount: data.remaining_amount ? Number(data.remaining_amount) : undefined
    } as ContractData;

    // Enviar email automaticamente após criação do contrato com slug amigável
    try {
      console.log('Sending automatic contract email...');
      const contractUrl = contractResult.public_slug 
        ? `${window.location.origin}/contrato/${contractResult.public_slug}`
        : `${window.location.origin}/contrato/${contractResult.public_token}`;
        
      const success = await sendContractForSignature(
        contractResult.client_name,
        contractResult.client_email,
        contractUrl,
        contractResult.event_type,
        contractResult
      );

      if (success) {
        console.log('Contract email sent successfully');
        toast.success('Contrato criado e email enviado com sucesso!');
      } else {
        console.warn('Contract created but email failed to send');
        toast.warning('Contrato criado, mas falha no envio do email');
      }
    } catch (emailError) {
      console.error('Error sending contract email:', emailError);
      toast.warning('Contrato criado, mas falha no envio do email');
    }

    return contractResult;
  },

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
  }
};
