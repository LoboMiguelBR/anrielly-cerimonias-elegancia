
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Supplier, SupplierStats, SupplierSearchFilters } from '@/types/suppliers';

export const useSuppliersEnhanced = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [stats, setStats] = useState<SupplierStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SupplierSearchFilters>({});

  const fetchSuppliers = async (filters?: SupplierSearchFilters) => {
    try {
      setLoading(true);
      let query = supabase
        .from('suppliers')
        .select('*')
        .order('rating', { ascending: false });

      const activeFilters = filters || searchFilters;

      if (activeFilters.category) {
        query = query.eq('category', activeFilters.category);
      }

      if (activeFilters.search_query) {
        query = query.or(`name.ilike.%${activeFilters.search_query}%,description.ilike.%${activeFilters.search_query}%`);
      }

      if (activeFilters.min_rating) {
        query = query.gte('rating', activeFilters.min_rating);
      }

      if (activeFilters.verified_only) {
        query = query.eq('verified', true);
      }

      if (activeFilters.preferred_only) {
        query = query.eq('preferred', true);
      }

      const { data, error } = await query;

      if (error) throw error;

      const mappedSuppliers: Supplier[] = (data || []).map(item => ({
        ...item,
        address: typeof item.address === 'string' ? JSON.parse(item.address) : item.address || {}
      }));

      setSuppliers(mappedSuppliers);
    } catch (error: any) {
      console.error('Erro ao buscar fornecedores:', error);
      toast.error('Erro ao carregar fornecedores');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await supabase
        .from('suppliers')
        .select('verified, preferred, rating');

      if (data) {
        const stats: SupplierStats = {
          total_suppliers: data.length,
          verified_suppliers: data.filter(s => s.verified).length,
          preferred_suppliers: data.filter(s => s.preferred).length,
          average_rating: data.reduce((acc, s) => acc + (s.rating || 0), 0) / data.length || 0,
        };
        setStats(stats);
      }
    } catch (error: any) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  };

  const createSupplier = async (supplierData: Omit<Supplier, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('suppliers')
        .insert([supplierData])
        .select()
        .single();

      if (error) throw error;

      toast.success('Fornecedor criado com sucesso!');
      await fetchSuppliers();
      return data;
    } catch (error: any) {
      console.error('Erro ao criar fornecedor:', error);
      toast.error('Erro ao criar fornecedor');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateSupplier = async (id: string, updates: Partial<Supplier>) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('suppliers')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast.success('Fornecedor atualizado com sucesso!');
      await fetchSuppliers();
    } catch (error: any) {
      console.error('Erro ao atualizar fornecedor:', error);
      toast.error('Erro ao atualizar fornecedor');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteSupplier = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Fornecedor removido com sucesso!');
      await fetchSuppliers();
    } catch (error: any) {
      console.error('Erro ao remover fornecedor:', error);
      toast.error('Erro ao remover fornecedor');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (filters: SupplierSearchFilters) => {
    setSearchFilters(filters);
    fetchSuppliers(filters);
  };

  const refetch = () => {
    fetchSuppliers();
    fetchStats();
  };

  useEffect(() => {
    fetchSuppliers();
    fetchStats();
  }, []);

  return {
    suppliers,
    stats,
    loading,
    searchFilters,
    fetchSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    applyFilters,
    refetch
  };
};
