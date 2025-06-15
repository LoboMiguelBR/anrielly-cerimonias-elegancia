
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

function parseSupplier(raw: any): Supplier {
  return {
    id: raw.id,
    name: raw.name,
    email: raw.email,
    phone: raw.phone,
    category: raw.category,
    rating: Number(raw.rating ?? 0),
    contracts: Array.isArray(raw.contracts)
      ? raw.contracts
      : (typeof raw.contracts === 'string'
        ? JSON.parse(raw.contracts)
        : []),
    portfolio_images: Array.isArray(raw.portfolio_images) ? raw.portfolio_images : [],
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    created_at: raw.created_at,
    updated_at: raw.updated_at,
  };
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
    setSuppliers((data || []).map(parseSupplier));
    setLoading(false);
  }, []);

  useEffect(() => { fetchSuppliers(); }, [fetchSuppliers]);

  const addSupplier = async (input: Partial<Supplier>) => {
    if (!input.name || !input.email || !input.phone || !input.category) {
      toast.error('Preencha todos os campos obrigatórios: nome, email, telefone, categoria');
      throw new Error("Campos obrigatórios ausentes");
    }

    const insertObj = {
      name: input.name,
      email: input.email,
      phone: input.phone,
      category: input.category,
      rating: input.rating ?? 0,
      contracts: input.contracts ?? [],
      portfolio_images: input.portfolio_images ?? [],
      tags: input.tags ?? [],
    };

    const { data, error } = await supabase
      .from('suppliers')
      .insert([insertObj])
      .select()
      .single();

    if (error) {
      toast.error('Erro ao adicionar fornecedor: ' + error.message);
      throw error;
    }
    setSuppliers(prev => [parseSupplier(data), ...prev]);
    toast.success('Fornecedor cadastrado!');
    return parseSupplier(data);
  };

  const updateSupplier = async (id: string, updates: Partial<Supplier>) => {
    const updateObj = {
      ...updates,
      contracts: updates.contracts ?? [],
      portfolio_images: updates.portfolio_images ?? [],
      tags: updates.tags ?? [],
    };

    const { data, error } = await supabase
      .from('suppliers')
      .update(updateObj)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      toast.error('Erro ao atualizar fornecedor: ' + error.message);
      throw error;
    }
    setSuppliers(prev => prev.map(s => s.id === id ? parseSupplier(data) : s));
    toast.success('Fornecedor atualizado!');
    return parseSupplier(data);
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
