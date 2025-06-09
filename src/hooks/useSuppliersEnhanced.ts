
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Supplier, 
  SupplierSearchFilters, 
  SupplierSearchResult,
  QuoteRequest,
  SupplierContract,
  SupplierReview 
} from '@/types/suppliers';

export interface SupplierStats {
  total_suppliers: number;
  verified_suppliers: number;
  pending_approval: number;
  average_rating: number;
  total_contracts: number;
  total_revenue: number;
  top_categories: Array<{ category: string; count: number }>;
}

export const useSuppliersEnhanced = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [stats, setStats] = useState<SupplierStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<SupplierSearchFilters>({});

  const fetchSuppliers = async (currentFilters?: SupplierSearchFilters) => {
    try {
      setLoading(true);
      let query = supabase
        .from('professionals')
        .select(`
          *,
          profiles:id(*)
        `)
        .order('created_at', { ascending: false });

      // Apply filters
      const activeFilters = currentFilters || filters;
      
      if (activeFilters.category) {
        query = query.eq('category', activeFilters.category);
      }
      
      if (activeFilters.location) {
        query = query.ilike('city', `%${activeFilters.location}%`);
      }
      
      if (activeFilters.verified_only) {
        query = query.eq('rating', 5); // Usar rating como proxy para verificado
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform data to enhanced format
      const enhancedSuppliers: Supplier[] = (data || []).map(professional => ({
        id: professional.id,
        user_id: professional.id,
        profile: {
          id: professional.id,
          tenant_id: 'anrielly_gomes',
          email: professional.email,
          role: 'cliente' as const,
          status: 'active' as const,
          first_name: professional.name?.split(' ')[0] || '',
          last_name: professional.name?.split(' ').slice(1).join(' ') || '',
          full_name: professional.name || '',
          avatar_url: undefined,
          phone: professional.phone,
          profile_data: null,
          permissions: [],
          created_at: professional.created_at,
          updated_at: professional.updated_at
        },
        company_name: professional.name,
        business_type: professional.category,
        tax_id: professional.document || '',
        email: professional.email,
        phone: professional.phone,
        website: professional.website,
        address: professional.city,
        categories: [professional.category],
        services: [],
        service_areas: [professional.city],
        status: 'approved' as const,
        verified: professional.rating >= 4,
        verification_date: professional.rating >= 4 ? professional.updated_at : undefined,
        logo_url: undefined,
        cover_image_url: undefined,
        portfolio: [],
        rating: professional.rating || 0,
        total_reviews: 0,
        pricing: {
          minimum_budget: professional.minimum_order || 0,
          accepts_negotiation: true,
          payment_terms: professional.payment_terms ? [professional.payment_terms] : [],
          cancellation_policy: '',
          deposit_percentage: 50
        },
        availability: {
          available_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
          blackout_dates: [],
          advance_booking_days: professional.delivery_time || 7,
          max_events_per_day: 1
        },
        created_at: professional.created_at,
        updated_at: professional.updated_at
      }));

      setSuppliers(enhancedSuppliers);
    } catch (error: any) {
      console.error('Erro ao buscar fornecedores:', error);
      toast.error('Erro ao carregar fornecedores');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data: professionalsData } = await supabase
        .from('professionals')
        .select('category, rating, created_at');

      if (professionalsData) {
        const categoryCount = professionalsData.reduce((acc, prof) => {
          acc[prof.category] = (acc[prof.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const topCategories = Object.entries(categoryCount)
          .map(([category, count]) => ({ category, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        const stats: SupplierStats = {
          total_suppliers: professionalsData.length,
          verified_suppliers: professionalsData.filter(p => p.rating >= 4).length,
          pending_approval: professionalsData.filter(p => p.rating < 2).length,
          average_rating: professionalsData.reduce((acc, p) => acc + (p.rating || 0), 0) / professionalsData.length,
          total_contracts: 0, // Calculate from contracts table
          total_revenue: 0, // Calculate from contracts table
          top_categories: topCategories
        };
        
        setStats(stats);
      }
    } catch (error: any) {
      console.error('Erro ao buscar estatísticas de fornecedores:', error);
    }
  };

  const createSupplier = async (supplierData: Partial<Supplier>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('professionals')
        .insert([{
          name: supplierData.company_name,
          email: supplierData.email,
          phone: supplierData.phone,
          category: supplierData.business_type,
          document: supplierData.tax_id,
          website: supplierData.website,
          city: supplierData.address,
          rating: 0,
          minimum_order: supplierData.pricing?.minimum_budget,
          payment_terms: supplierData.pricing?.payment_terms?.[0],
          delivery_time: supplierData.availability?.advance_booking_days,
        }])
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
        .from('professionals')
        .update({
          name: updates.company_name,
          email: updates.email,
          phone: updates.phone,
          category: updates.business_type,
          document: updates.tax_id,
          website: updates.website,
          city: updates.address,
          minimum_order: updates.pricing?.minimum_budget,
          payment_terms: updates.pricing?.payment_terms?.[0],
          delivery_time: updates.availability?.advance_booking_days,
        })
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
        .from('professionals')
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

  const verifySupplier = async (id: string) => {
    try {
      await updateSupplier(id, { verified: true, verification_date: new Date().toISOString() });
      toast.success('Fornecedor verificado com sucesso!');
    } catch (error) {
      toast.error('Erro ao verificar fornecedor');
    }
  };

  const searchSuppliers = async (searchFilters: SupplierSearchFilters): Promise<SupplierSearchResult[]> => {
    try {
      await fetchSuppliers(searchFilters);
      return suppliers.map(supplier => ({
        supplier,
        distance: undefined,
        matching_services: supplier.categories,
        estimated_price: supplier.pricing.minimum_budget,
        availability_status: 'available' as const
      }));
    } catch (error) {
      toast.error('Erro ao buscar fornecedores');
      return [];
    }
  };

  const applyFilters = (newFilters: SupplierSearchFilters) => {
    setFilters(newFilters);
    fetchSuppliers(newFilters);
  };

  const exportSuppliers = async (format: 'csv' | 'excel' = 'csv') => {
    try {
      toast.success('Funcionalidade de exportação será implementada em breve');
    } catch (error) {
      toast.error('Erro ao exportar fornecedores');
    }
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
    verifySupplier,
    searchSuppliers,
    applyFilters,
    exportSuppliers,
    refetch: () => {
      fetchSuppliers();
      fetchStats();
    }
  };
};
