
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Supplier {
  id: string;
  name: string;
  category: string;
  email: string;
  phone: string;
  address: {
    street?: string;
    city?: string;
    state?: string;
    postal_code?: string;
  };
  rating: number;
  verified: boolean;
  preferred: boolean;
  price_range?: string;
  notes?: string;
  description?: string;
  website?: string;
  instagram?: string;
  tags?: string[];
  portfolio_images?: string[];
  created_at: string;
  updated_at: string;
}

export interface SupplierStats {
  total_suppliers: number;
  verified_suppliers: number;
  preferred_suppliers: number;
  average_rating: number;
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
      
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      // Transform data to match our interface with proper address handling
      const transformedData: Supplier[] = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        category: item.category,
        email: item.email,
        phone: item.phone,
        address: typeof item.address === 'object' && item.address !== null && !Array.isArray(item.address) 
          ? item.address as { street?: string; city?: string; state?: string; postal_code?: string; }
          : {},
        rating: item.rating || 0,
        verified: item.verified || false,
        preferred: item.preferred || false,
        price_range: item.price_range,
        notes: item.description,
        description: item.description,
        website: item.website,
        instagram: item.instagram,
        tags: item.tags || [],
        portfolio_images: item.portfolio_images || [],
        created_at: item.created_at,
        updated_at: item.updated_at
      }));
      
      setSuppliers(transformedData);
      
      // Calculate stats
      if (transformedData.length > 0) {
        const total = transformedData.length;
        const verified = transformedData.filter(s => s.verified).length;
        const preferred = transformedData.filter(s => s.preferred).length;
        const avgRating = transformedData.reduce((sum, s) => sum + (s.rating || 0), 0) / total;
        const byCategory = transformedData.reduce((acc, s) => {
          acc[s.category] = (acc[s.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        setStats({
          total_suppliers: total,
          verified_suppliers: verified,
          preferred_suppliers: preferred,
          average_rating: Number(avgRating.toFixed(1)),
          by_category: byCategory
        });
      } else {
        setStats({
          total_suppliers: 0,
          verified_suppliers: 0,
          preferred_suppliers: 0,
          average_rating: 0,
          by_category: {}
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
      // Transform to match database schema
      const dbData = {
        name: supplierData.name,
        category: supplierData.category,
        email: supplierData.email,
        phone: supplierData.phone,
        address: supplierData.address,
        rating: supplierData.rating,
        verified: supplierData.verified,
        preferred: supplierData.preferred,
        price_range: supplierData.price_range,
        description: supplierData.description,
        website: supplierData.website,
        instagram: supplierData.instagram,
        tags: supplierData.tags,
        portfolio_images: supplierData.portfolio_images
      };

      const { data, error } = await supabase
        .from('suppliers')
        .insert(dbData)
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
      // Transform to match database schema
      const dbData: any = {};
      if (supplierData.name) dbData.name = supplierData.name;
      if (supplierData.category) dbData.category = supplierData.category;
      if (supplierData.email) dbData.email = supplierData.email;
      if (supplierData.phone) dbData.phone = supplierData.phone;
      if (supplierData.address) dbData.address = supplierData.address;
      if (supplierData.rating !== undefined) dbData.rating = supplierData.rating;
      if (supplierData.verified !== undefined) dbData.verified = supplierData.verified;
      if (supplierData.preferred !== undefined) dbData.preferred = supplierData.preferred;
      if (supplierData.price_range) dbData.price_range = supplierData.price_range;
      if (supplierData.description) dbData.description = supplierData.description;
      if (supplierData.website) dbData.website = supplierData.website;
      if (supplierData.instagram) dbData.instagram = supplierData.instagram;
      if (supplierData.tags) dbData.tags = supplierData.tags;
      if (supplierData.portfolio_images) dbData.portfolio_images = supplierData.portfolio_images;

      const { error } = await supabase
        .from('suppliers')
        .update(dbData)
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
