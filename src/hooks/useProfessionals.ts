
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Professional {
  id: string;
  name: string;
  category: string;
  email: string;
  phone: string;
  city: string;
  website?: string;
  instagram?: string;
  notes?: string;
  price_range?: string;
  payment_terms?: string;
  supplier_type?: string;
  document?: string;
  tags?: string[];
  rating?: number;
  minimum_order?: number;
  delivery_time?: number;
  portfolio_images?: string[];
  created_at: string;
  updated_at: string;
}

export const useProfessionals = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProfessionals = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Erro ao buscar profissionais:', error);
        toast.error('Erro ao carregar fornecedores');
        return;
      }

      setProfessionals(data || []);
    } catch (err) {
      console.error('Erro ao buscar profissionais:', err);
      toast.error('Erro ao carregar fornecedores');
    } finally {
      setLoading(false);
    }
  };

  const addProfessional = async (professionalData: Omit<Professional, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('professionals')
        .insert([professionalData])
        .select()
        .single();

      if (error) {
        console.error('Erro ao adicionar profissional:', error);
        toast.error('Erro ao adicionar fornecedor');
        throw error;
      }

      setProfessionals(prev => [...prev, data]);
      return data;
    } catch (err) {
      console.error('Erro ao adicionar profissional:', err);
      throw err;
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

      if (error) {
        console.error('Erro ao atualizar profissional:', error);
        toast.error('Erro ao atualizar fornecedor');
        throw error;
      }

      setProfessionals(prev => prev.map(p => 
        p.id === id ? data : p
      ));
      return data;
    } catch (err) {
      console.error('Erro ao atualizar profissional:', err);
      throw err;
    }
  };

  const deleteProfessional = async (id: string) => {
    try {
      const { error } = await supabase
        .from('professionals')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar profissional:', error);
        toast.error('Erro ao remover fornecedor');
        throw error;
      }

      setProfessionals(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Erro ao deletar profissional:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchProfessionals();
  }, []);

  return {
    professionals,
    loading,
    fetchProfessionals,
    addProfessional,
    updateProfessional,
    deleteProfessional
  };
};
