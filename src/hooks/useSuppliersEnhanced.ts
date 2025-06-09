
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Supplier, 
  SupplierStatus, 
  SupplierSearchFilters, 
  SupplierSearchResult,
  QuoteRequest,
  QuoteResponse,
  SupplierContract,
  SupplierReview,
  SupplierAnalytics
} from '@/types/suppliers';
import { Professional } from '@/hooks/useProfessionals';

export interface SupplierStats {
  total_suppliers: number;
  verified_suppliers: number;
  pending_approvals: number;
  average_rating: number;
  total_quotes_sent: number;
  active_contracts: number;
}

export const useSuppliersEnhanced = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [stats, setStats] = useState<SupplierStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SupplierSearchFilters>({});

  const fetchSuppliers = async (filters?: SupplierSearchFilters) => {
    try {
      setLoading(true);
      let query = supabase
        .from('professionals')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters
      const activeFilters = filters || searchFilters;
      
      if (activeFilters.category) {
        query = query.eq('category', activeFilters.category);
      }
      
      if (activeFilters.location) {
        query = query.ilike('city', `%${activeFilters.location}%`);
      }
      
      if (activeFilters.verified_only) {
        query = query.eq('rating', 5); // Mock verification based on rating
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform Professional data to Supplier format
      const enhancedSuppliers: Supplier[] = (data || []).map(professional => ({
        id: professional.id,
        user_id: professional.id, // Mock user_id
        profile: {
          id: professional.id,
          tenant_id: 'anrielly_gomes',
          email: professional.email,
          role: 'cliente',
          status: 'active',
          first_name: professional.name.split(' ')[0] || '',
          last_name: professional.name.split(' ').slice(1).join(' ') || '',
          full_name: professional.name,
          avatar_url: undefined,
          phone: professional.phone,
          profile_data: {
            type: 'fornecedor',
            company_name: professional.name,
            business_type: professional.category as any,
            tax_id: professional.document || '',
            services: [professional.category],
            service_areas: [professional.city],
            rating: professional.rating || 0,
            verified: (professional.rating || 0) >= 4.5,
            portfolio: []
          },
          permissions: [],
          last_login_at: new Date().toISOString(),
          email_verified_at: new Date().toISOString(),
          created_at: professional.created_at,
          updated_at: professional.updated_at
        },
        company_name: professional.name,
        business_type: professional.category,
        tax_id: professional.document || '',
        email: professional.email,
        phone: professional.phone,
        website: professional.website,
        address: `${professional.city}`,
        categories: [professional.category],
        services: [{
          id: professional.id,
          name: professional.category,
          description: professional.notes || '',
          category: professional.category,
          base_price: parseFloat(professional.price_range?.replace(/[^\d.,]/g, '').replace(',', '.') || '0'),
          price_unit: 'fixed',
          duration: professional.delivery_time,
          capacity: professional.minimum_order,
          includes: [],
          optional_extras: []
        }],
        service_areas: [professional.city],
        status: 'approved' as SupplierStatus,
        verified: (professional.rating || 0) >= 4.5,
        verification_date: (professional.rating || 0) >= 4.5 ? new Date().toISOString() : undefined,
        logo_url: undefined,
        cover_image_url: undefined,
        portfolio: (professional.portfolio_images || []).map((img, index) => ({
          id: `${professional.id}_${index}`,
          title: `Portfolio ${index + 1}`,
          description: '',
          images: [img],
          event_type: professional.category,
          event_date: new Date().toISOString().split('T')[0],
          location: professional.city,
          featured: index === 0,
          tags: [professional.category]
        })),
        rating: professional.rating || 0,
        total_reviews: 0,
        pricing: {
          minimum_budget: parseFloat(professional.price_range?.replace(/[^\d.,]/g, '').replace(',', '.') || '0'),
          accepts_negotiation: true,
          payment_terms: professional.payment_terms ? [professional.payment_terms] : ['À vista', 'Parcelado'],
          cancellation_policy: 'Política padrão de cancelamento',
          deposit_percentage: 30
        },
        availability: {
          available_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
          blackout_dates: [],
          advance_booking_days: 30,
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
        .select('rating, category, created_at');

      if (professionalsData) {
        const stats: SupplierStats = {
          total_suppliers: professionalsData.length,
          verified_suppliers: professionalsData.filter(p => (p.rating || 0) >= 4.5).length,
          pending_approvals: professionalsData.filter(p => (p.rating || 0) < 3).length,
          average_rating: professionalsData.reduce((sum, p) => sum + (p.rating || 0), 0) / professionalsData.length,
          total_quotes_sent: 0, // Will be calculated when quote system is implemented
          active_contracts: 0, // Will be calculated from contracts
        };
        
        setStats(stats);
      }
    } catch (error: any) {
      console.error('Erro ao buscar estatísticas de fornecedores:', error);
    }
  };

  const searchSuppliers = async (filters: SupplierSearchFilters): Promise<SupplierSearchResult[]> => {
    await fetchSuppliers(filters);
    
    return suppliers.map(supplier => ({
      supplier,
      distance: Math.random() * 50, // Mock distance
      matching_services: supplier.categories.filter(cat => 
        !filters.services?.length || filters.services.includes(cat)
      ),
      estimated_price: supplier.pricing.minimum_budget,
      availability_status: 'available' as const
    }));
  };

  const createSupplier = async (supplierData: Partial<Supplier>) => {
    try {
      setLoading(true);
      
      // For now, create in professionals table
      const professionalData = {
        name: supplierData.company_name || '',
        category: supplierData.categories?.[0] || '',
        email: supplierData.email || '',
        phone: supplierData.phone || '',
        city: supplierData.service_areas?.[0] || '',
        website: supplierData.website,
        notes: supplierData.services?.[0]?.description,
        price_range: supplierData.pricing?.minimum_budget?.toString(),
        payment_terms: supplierData.pricing?.payment_terms?.[0],
        document: supplierData.tax_id,
        rating: 0
      };

      const { data, error } = await supabase
        .from('professionals')
        .insert([professionalData])
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

  const updateSupplierStatus = async (id: string, status: SupplierStatus) => {
    try {
      // Mock status update by updating rating
      const ratingMap = {
        'pending': 2,
        'approved': 4.5,
        'rejected': 1,
        'suspended': 0
      };

      const { error } = await supabase
        .from('professionals')
        .update({ rating: ratingMap[status] })
        .eq('id', id);

      if (error) throw error;

      toast.success('Status do fornecedor atualizado!');
      await fetchSuppliers();
    } catch (error: any) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status');
    }
  };

  const sendQuoteRequest = async (supplierId: string, eventData: any): Promise<QuoteRequest> => {
    // Mock quote request - will be implemented with proper tables
    const mockQuoteRequest: QuoteRequest = {
      id: crypto.randomUUID(),
      event_id: eventData.eventId || crypto.randomUUID(),
      supplier_id: supplierId,
      client_id: eventData.clientId || crypto.randomUUID(),
      event_type: eventData.eventType || 'casamento',
      event_date: eventData.eventDate || new Date().toISOString().split('T')[0],
      event_location: eventData.eventLocation || '',
      guest_count: eventData.guestCount || 100,
      budget_range: eventData.budgetRange || 'R$ 5.000 - R$ 10.000',
      requested_services: eventData.requestedServices || [],
      special_requirements: eventData.specialRequirements || '',
      status: 'pending',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    toast.success('Solicitação de orçamento enviada!');
    return mockQuoteRequest;
  };

  const getSupplierAnalytics = async (supplierId: string): Promise<SupplierAnalytics> => {
    // Mock analytics - will be implemented with proper data
    return {
      supplier_id: supplierId,
      period_start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      period_end: new Date().toISOString(),
      total_quotes_received: Math.floor(Math.random() * 20) + 5,
      total_quotes_sent: Math.floor(Math.random() * 15) + 3,
      quote_conversion_rate: Math.random() * 30 + 20,
      total_contracts: Math.floor(Math.random() * 10) + 2,
      total_revenue: Math.random() * 50000 + 10000,
      average_contract_value: Math.random() * 10000 + 5000,
      average_rating: Math.random() * 2 + 3,
      total_reviews: Math.floor(Math.random() * 50) + 10,
      recommendation_rate: Math.random() * 20 + 70,
      category_ranking: Math.floor(Math.random() * 10) + 1,
      overall_ranking: Math.floor(Math.random() * 100) + 1,
      updated_at: new Date().toISOString()
    };
  };

  const applyFilters = (filters: SupplierSearchFilters) => {
    setSearchFilters(filters);
    fetchSuppliers(filters);
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
    searchFilters,
    fetchSuppliers,
    searchSuppliers,
    createSupplier,
    updateSupplierStatus,
    sendQuoteRequest,
    getSupplierAnalytics,
    applyFilters,
    exportSuppliers,
    refetch: () => {
      fetchSuppliers();
      fetchStats();
    }
  };
};
