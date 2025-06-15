
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  rating?: number;
  contracts?: any[];
  portfolio_images?: string[];
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSuppliers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Erro ao carregar fornecedores: ' + error.message);
      setLoading(false);
      return;
    }
    setSuppliers(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchSuppliers(); }, [fetchSuppliers]);

  const addSupplier = async (data: Partial<Supplier>) => {
    const { data: created, error } = await supabase
      .from('suppliers')
      .insert([data])
      .select()
      .single();

    if (error) {
      toast.error('Erro ao adicionar fornecedor: ' + error.message);
      throw error;
    }
    setSuppliers(prev => [created, ...prev]);
    toast.success('Fornecedor cadastrado!');
    return created;
  };

  const updateSupplier = async (id: string, updates: Partial<Supplier>) => {
    const { data: updated, error } = await supabase
      .from('suppliers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      toast.error('Erro ao atualizar fornecedor: ' + error.message);
      throw error;
    }
    setSuppliers(prev => prev.map(s => s.id === id ? updated : s));
    toast.success('Fornecedor atualizado!');
    return updated;
  };

  const deleteSupplier = async (id: string) => {
    const { error } = await supabase
      .from('suppliers')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Erro ao deletar fornecedor: ' + error.message);
      throw error;
    }
    setSuppliers(prev => prev.filter(s => s.id !== id));
    toast.success('Fornecedor removido!');
  };

  return {
    suppliers,
    loading,
    fetchSuppliers,
    addSupplier,
    updateSupplier,
    deleteSupplier,
  }
}
