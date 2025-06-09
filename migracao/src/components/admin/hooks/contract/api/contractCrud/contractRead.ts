
import { supabase } from '@/integrations/supabase/client';
import { ContractData, ContractStatus } from '../../types';

export const contractReadApi = {
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
  }
};
