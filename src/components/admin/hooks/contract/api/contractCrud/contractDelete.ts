
import { supabase } from '@/integrations/supabase/client';

export const contractDeleteApi = {
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
