
import { supabase } from '@/integrations/supabase/client';
import { ContractData, ContractFormData, ContractStatus } from '../types';

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
      status: contract.status as ContractStatus
    }));
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
      status: data.status as ContractStatus
    };
  },

  // Create contract
  async createContract(contractData: ContractFormData): Promise<ContractData> {
    // Generate tokens for the contract
    const token = crypto.randomUUID();
    const publicToken = crypto.randomUUID();

    // Convert number fields to ensure proper types
    const formattedData = {
      ...contractData,
      total_price: Number(contractData.total_price),
      down_payment: contractData.down_payment ? Number(contractData.down_payment) : null,
      remaining_amount: contractData.remaining_amount ? Number(contractData.remaining_amount) : null,
      token,
      public_token: publicToken,
      status: 'draft' as ContractStatus
    };

    const { data, error } = await supabase
      .from('contracts')
      .insert(formattedData)
      .select()
      .single();

    if (error) {
      console.error('Error creating contract:', error);
      throw error;
    }

    return {
      ...data,
      status: data.status as ContractStatus
    };
  },

  // Update contract
  async updateContract(id: string, contractData: Partial<ContractFormData>): Promise<ContractData> {
    // Convert number fields to ensure proper types
    const formattedData = {
      ...contractData,
      total_price: contractData.total_price ? Number(contractData.total_price) : undefined,
      down_payment: contractData.down_payment ? Number(contractData.down_payment) : undefined,
      remaining_amount: contractData.remaining_amount ? Number(contractData.remaining_amount) : undefined,
    };

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

    return {
      ...data,
      status: data.status as ContractStatus
    };
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
