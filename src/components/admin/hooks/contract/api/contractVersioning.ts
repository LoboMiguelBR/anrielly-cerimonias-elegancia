
import { supabase } from '@/integrations/supabase/client';

export const contractVersioningApi = {
  // Incrementar versão do contrato
  async incrementContractVersion(contractId: string): Promise<number> {
    const { data, error } = await supabase
      .from('contracts')
      .select('version')
      .eq('id', contractId)
      .single();

    if (error) {
      console.error('Error fetching current version:', error);
      throw error;
    }

    const newVersion = (data?.version || 1) + 1;

    const { error: updateError } = await supabase
      .from('contracts')
      .update({ 
        version: newVersion,
        version_timestamp: new Date().toISOString()
      })
      .eq('id', contractId);

    if (updateError) {
      console.error('Error updating contract version:', updateError);
      throw updateError;
    }

    return newVersion;
  },

  // Obter histórico de versões (se necessário no futuro)
  async getContractVersionHistory(contractId: string) {
    // Por enquanto, apenas retorna a versão atual
    // No futuro, pode ser expandido para incluir histórico completo
    const { data, error } = await supabase
      .from('contracts')
      .select('version, version_timestamp, updated_at')
      .eq('id', contractId)
      .single();

    if (error) {
      console.error('Error fetching version history:', error);
      throw error;
    }

    return data;
  }
};
