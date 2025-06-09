
import { supabase } from '@/integrations/supabase/client';

export const contractStatusApi = {
  // Update contract status
  async updateContractStatus(id: string, status: string): Promise<void> {
    const { error } = await supabase
      .from('contracts')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating contract status:', error);
      throw error;
    }
  }
};
