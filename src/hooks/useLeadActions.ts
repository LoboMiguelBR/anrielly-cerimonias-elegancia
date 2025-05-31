
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  event_type: string;
  event_date?: string;
  event_location: string;
  message?: string;
  status?: string;
  created_at: string;
}

export const useLeadActions = () => {
  const [loading, setLoading] = useState(false);

  const updateLead = async (id: string, data: Partial<Lead>) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('quote_requests')
        .update(data)
        .eq('id', id);

      if (error) throw error;

      toast.success('Lead atualizado com sucesso!');
      return true;
    } catch (err) {
      console.error('Erro ao atualizar lead:', err);
      toast.error('Erro ao atualizar lead');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteLead = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('quote_requests')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Lead deletado com sucesso!');
      return true;
    } catch (err) {
      console.error('Erro ao deletar lead:', err);
      toast.error('Erro ao deletar lead');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    return updateLead(id, { status });
  };

  return {
    updateLead,
    deleteLead,
    updateStatus,
    loading
  };
};
