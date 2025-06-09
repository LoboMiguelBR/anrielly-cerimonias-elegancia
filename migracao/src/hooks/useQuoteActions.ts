
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useQuoteActions = () => {
  const [loading, setLoading] = useState(false);

  const deleteQuote = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('quote_requests')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Solicitação de orçamento deletada com sucesso!');
      return true;
    } catch (err) {
      console.error('Erro ao deletar solicitação:', err);
      toast.error('Erro ao deletar solicitação de orçamento');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('quote_requests')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      toast.success('Status atualizado com sucesso!');
      return true;
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
      toast.error('Erro ao atualizar status');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteQuote,
    updateStatus,
    loading
  };
};
