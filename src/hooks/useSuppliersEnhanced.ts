
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useCache } from './useCache';

export interface Supplier {
  id: string;
  name: string;
  category: string;
  email: string;
  phone: string;
  website?: string;
  instagram?: string;
  description?: string;
  address?: any;
  tags?: string[];
  rating: number;
  verified: boolean;
  preferred: boolean;
  price_range?: string;
  portfolio_images?: string[];
  created_at: string;
  updated_at: string;
}

export interface SupplierFilters {
  category?: string[];
  verified?: boolean;
  preferred?: boolean;
  rating_min?: number;
  search_query?: string;
}

export interface SupplierStats {
  total_suppliers: number;
  verified_suppliers: number;
  preferred_suppliers: number;
  avg_rating: number;
}

export const useSuppliersEnhanced = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [stats, setStats] = useState<SupplierStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<SupplierFilters>({});
  const { getCache, setCache } = useCache();

  const fetchSuppliers = async (supplierFilters?: SupplierFilters) => {
    try {
      setLoading(true);
      const activeFilters = supplierFilters || filters;
      const cacheKey = `suppliers_${JSON.stringify(activeFilters)}`;
      
      // Try cache first
      const cachedData = await getCache(cacheKey);
      if (cachedData) {
        setSuppliers(cachedData);
        setLoading(false);
        return;
      }

      // Optimized query with selective fields and proper indexing
      let query = supabase
        .from('suppliers')
        .select(`
          id,
          name,
          category,
          email,
          phone,
          website,
          instagram,
          description,
          rating,
          verified,
          preferred,
          price_range,
          created_at,
          updated_at
        `)
        .order('rating', { ascending: false })
        .order('name');

      if (activeFilters.category && activeFilters.category.length > 0) {
        query = query.in('category', activeFilters.category);
      }

      if (activeFilters.verified !== undefined) {
        query = query.eq('verified', activeFilters.verified);
      }

      if (activeFilters.preferred !== undefined) {
        query = query.eq('preferred', activeFilters.preferred);
      }

      if (activeFilters.rating_min !== undefined) {
        query = query.gte('rating', activeFilters.rating_min);
      }

      if (activeFilters.search_query) {
        query = query.or(`name.ilike.%${activeFilters.search_query}%,category.ilike.%${activeFilters.search_query}%,description.ilike.%${activeFilters.search_query}%`);
      }

      const { data, error } = await query.limit(100); // Limit results for performance

      if (error) throw error;

      const typedSuppliers: Supplier[] = data || [];
      setSuppliers(typedSuppliers);
      
      // Cache the results
      await setCache(cacheKey, typedSuppliers, 300); // 5 minutes cache
      
    } catch (error: any) {
      console.error('Erro ao buscar fornecedores:', error);
      toast.error('Erro ao carregar fornecedores');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const cacheKey = 'suppliers_stats';
      const cachedStats = await getCache(cacheKey);
      
      if (cachedStats) {
        setStats(cachedStats);
        return;
      }

      // Optimized stats query
      const { data, error } = await supabase
        .from('suppliers')
        .select('verified, preferred, rating');

      if (error) throw error;

      if (data) {
        const stats: SupplierStats = {
          total_suppliers: data.length,
          verified_suppliers: data.filter(s => s.verified).length,
          preferred_suppliers: data.filter(s => s.preferred).length,
          avg_rating: data.reduce((acc, s) => acc + (s.rating || 0), 0) / data.length || 0,
        };
        
        setStats(stats);
        await setCache(cacheKey, stats, 600); // 10 minutes cache
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

  const applyFilters = (newFilters: SupplierFilters) => {
    setFilters(newFilters);
    fetchSuppliers(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    fetchSuppliers({});
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
