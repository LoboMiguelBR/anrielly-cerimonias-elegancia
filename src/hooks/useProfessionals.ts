
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Professional {
  id: string;
  name: string;
  category: string;
  document?: string;
  phone: string;
  email: string;
  instagram?: string;
  website?: string;
  city: string;
  tags?: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const useProfessionals = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfessionals = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProfessionals(data || []);
    } catch (error: any) {
      console.error('Erro ao buscar profissionais:', error);
      toast.error('Erro ao carregar profissionais: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const addProfessional = async (professionalData: Omit<Professional, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('professionals')
        .insert([professionalData])
        .select()
        .single();

      if (error) throw error;
      
      setProfessionals(prev => [data, ...prev]);
      toast.success('Profissional cadastrado com sucesso!');
      return data;
    } catch (error: any) {
      console.error('Erro ao cadastrar profissional:', error);
      toast.error('Erro ao cadastrar profissional: ' + error.message);
      throw error;
    }
  };

  const updateProfessional = async (id: string, updates: Partial<Professional>) => {
    try {
      const { data, error } = await supabase
        .from('professionals')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setProfessionals(prev => 
        prev.map(prof => prof.id === id ? data : prof)
      );
      toast.success('Profissional atualizado com sucesso!');
      return data;
    } catch (error: any) {
      console.error('Erro ao atualizar profissional:', error);
      toast.error('Erro ao atualizar profissional: ' + error.message);
      throw error;
    }
  };

  const deleteProfessional = async (id: string) => {
    try {
      const { error } = await supabase
        .from('professionals')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setProfessionals(prev => prev.filter(prof => prof.id !== id));
      toast.success('Profissional removido com sucesso!');
    } catch (error: any) {
      console.error('Erro ao remover profissional:', error);
      toast.error('Erro ao remover profissional: ' + error.message);
      throw error;
    }
  };

  useEffect(() => {
    fetchProfessionals();
  }, []);

  return {
    professionals,
    isLoading,
    addProfessional,
    updateProfessional,
    deleteProfessional,
    refetch: fetchProfessionals
  };
};
