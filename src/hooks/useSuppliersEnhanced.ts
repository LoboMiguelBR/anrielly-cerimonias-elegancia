import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Supplier {
  id: string;
  name: string;
  category: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  rating: number;
  status: 'active' | 'inactive';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface SupplierStats {
  total: number;
  active: number;
  inactive: number;
  avg_rating: number; // Corrigido de average_rating para avg_rating
  by_category: Record<string, number>;
}

export const useSuppliersEnhanced = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [stats, setStats] = useState<SupplierStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    search: ''
  });

  const fetchSuppliers = useCallback(async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('suppliers')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,contact_email.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      setSuppliers(data || []);
      
      // Calculate stats
      if (data) {
        const total = data.length;
        const active = data.filter(s => s.status === 'active').length;
        const inactive = total - active;
        const avgRating = data.reduce((sum, s) => sum + (s.rating || 0), 0) / total;
        const byCategory = data.reduce((acc, s) => {
          acc[s.category] = (acc[s.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        setStats({
          total,
          active,
          inactive,
          avg_rating: Number(avgRating.toFixed(1)),
          by_category: byCategory
        });
      }
    } catch (error: any) {
      console.error('Error fetching suppliers:', error);
      toast.error('Erro ao carregar fornecedores');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const createSupplier = async (supplierData: Omit<Supplier, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .insert(supplierData)
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success('Fornecedor criado com sucesso');
      await fetchSuppliers();
      return data;
    } catch (error: any) {
      console.error('Error creating supplier:', error);
      toast.error('Erro ao criar fornecedor');
      throw error;
    }
  };

  const updateSupplier = async (id: string, supplierData: Partial<Supplier>) => {
    try {
      const { error } = await supabase
        .from('suppliers')
        .update(supplierData)
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Fornecedor atualizado com sucesso');
      await fetchSuppliers();
    } catch (error: any) {
      console.error('Error updating supplier:', error);
      toast.error('Erro ao atualizar fornecedor');
      throw error;
    }
  };

  const deleteSupplier = async (id: string) => {
    try {
      const { error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Fornecedor removido com sucesso');
      await fetchSuppliers();
    } catch (error: any) {
      console.error('Error deleting supplier:', error);
      toast.error('Erro ao remover fornecedor');
      throw error;
    }
  };

  const applyFilters = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ category: '', status: '', search: '' });
  }, []);

  const refetch = useCallback(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  return {
    suppliers,
    stats,
    loading,
    filters,
    fetchSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    applyFilters,
    clearFilters,
    refetch
  };
};
