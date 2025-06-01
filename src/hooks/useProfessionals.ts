
import useSWR from 'swr';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import { toast } from 'sonner';

export interface Professional {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  city: string;
  document?: string;
  instagram?: string;
  website?: string;
  tags?: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

const fetcher = async (): Promise<Professional[]> => {
  const { data, error } = await supabase
    .from('professionals')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data || [];
};

export const useProfessionals = () => {
  const { data, error, mutate } = useSWR('professionals', fetcher);
  const [loading, setLoading] = useState(false);

  const addProfessional = async (professionalData: Partial<Professional>) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('professionals')
        .insert([professionalData]);

      if (error) throw error;

      toast.success('Profissional adicionado com sucesso!');
      mutate();
      return true;
    } catch (err) {
      console.error('Erro ao adicionar profissional:', err);
      toast.error('Erro ao adicionar profissional');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateProfessional = async (id: string, data: Partial<Professional>) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('professionals')
        .update(data)
        .eq('id', id);

      if (error) throw error;

      toast.success('Profissional atualizado com sucesso!');
      mutate();
      return true;
    } catch (err) {
      console.error('Erro ao atualizar profissional:', err);
      toast.error('Erro ao atualizar profissional');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteProfessional = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('professionals')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Profissional deletado com sucesso!');
      mutate();
      return true;
    } catch (err) {
      console.error('Erro ao deletar profissional:', err);
      toast.error('Erro ao deletar profissional');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    data: data || [],
    professionals: data || [],
    isLoading: !error && !data,
    error,
    mutate,
    refetch: mutate,
    addProfessional,
    updateProfessional,
    deleteProfessional,
    loading
  };
};
