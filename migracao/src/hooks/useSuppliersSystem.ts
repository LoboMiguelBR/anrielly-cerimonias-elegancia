import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Supplier,
  SupplierQuote,
  QuoteRequest,
  SupplierContract,
  SupplierReview,
  SupplierFilters,
  SupplierSearchResult,
  SupplierAnalytics,
  SupplierNotification,
  CreateSupplierData,
  UpdateSupplierData,
  CreateQuoteData,
  UpdateQuoteData,
  CreateContractData,
  UpdateContractData
} from '@/types/suppliers';
import { useAuth } from '@/hooks/useAuthEnhanced';

// Chaves de query para cache
export const supplierKeys = {
  all: ['suppliers'] as const,
  lists: () => [...supplierKeys.all, 'list'] as const,
  list: (filters: SupplierFilters) => [...supplierKeys.lists(), { filters }] as const,
  details: () => [...supplierKeys.all, 'detail'] as const,
  detail: (id: string) => [...supplierKeys.details(), id] as const,
  quotes: () => [...supplierKeys.all, 'quotes'] as const,
  quote: (id: string) => [...supplierKeys.quotes(), id] as const,
  quotesBySupplier: (supplierId: string) => [...supplierKeys.quotes(), 'supplier', supplierId] as const,
  quotesByEvent: (eventId: string) => [...supplierKeys.quotes(), 'event', eventId] as const,
  contracts: () => [...supplierKeys.all, 'contracts'] as const,
  contract: (id: string) => [...supplierKeys.contracts(), id] as const,
  contractsBySupplier: (supplierId: string) => [...supplierKeys.contracts(), 'supplier', supplierId] as const,
  reviews: (supplierId: string) => [...supplierKeys.detail(supplierId), 'reviews'] as const,
  analytics: (supplierId: string) => [...supplierKeys.detail(supplierId), 'analytics'] as const,
  notifications: (supplierId: string) => [...supplierKeys.detail(supplierId), 'notifications'] as const,
};

// Serviços de fornecedores
class SupplierService {
  static async getSuppliers(filters?: SupplierFilters): Promise<SupplierSearchResult> {
    let query = supabase
      .from('suppliers')
      .select(`
        *,
        user:user_profiles(*),
        services:supplier_services(*),
        portfolio:supplier_portfolio(*),
        reviews:supplier_reviews(*)
      `, { count: 'exact' });

    // Aplicar filtros
    if (filters?.categories?.length) {
      query = query.in('business_type', filters.categories);
    }

    if (filters?.service_areas?.length) {
      query = query.contains('service_areas', filters.service_areas);
    }

    if (filters?.rating_min) {
      query = query.gte('rating->overall', filters.rating_min);
    }

    if (filters?.price_range) {
      // Implementar filtro de preço baseado nos serviços
    }

    if (filters?.availability_date) {
      // Implementar filtro de disponibilidade
    }

    if (filters?.verification_status?.length) {
      query = query.in('verification_status', filters.verification_status);
    }

    if (filters?.status?.length) {
      query = query.in('status', filters.status);
    }

    if (filters?.search_query) {
      query = query.or(`
        company_name.ilike.%${filters.search_query}%,
        business_name.ilike.%${filters.search_query}%,
        specialties.cs.{${filters.search_query}}
      `);
    }

    if (filters?.tags?.length) {
      query = query.contains('tags', filters.tags);
    }

    // Ordenação
    const sortBy = filters?.sort_by || 'rating';
    const sortOrder = filters?.sort_order || 'desc';
    
    switch (sortBy) {
      case 'rating':
        query = query.order('rating->overall', { ascending: sortOrder === 'asc' });
        break;
      case 'price':
        // Implementar ordenação por preço
        break;
      case 'distance':
        // Implementar ordenação por distância
        break;
      case 'reviews':
        query = query.order('rating->total_reviews', { ascending: sortOrder === 'asc' });
        break;
      case 'recent':
        query = query.order('created_at', { ascending: sortOrder === 'asc' });
        break;
      default:
        query = query.order('created_at', { ascending: false });
    }

    const { data, error, count } = await query;

    if (error) throw error;

    // Calcular agregações
    const suppliers = data || [];
    const aggregations = {
      categories: suppliers.reduce((acc, supplier) => {
        acc[supplier.business_type] = (acc[supplier.business_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      price_ranges: {}, // Implementar baseado nos serviços
      ratings: suppliers.reduce((acc, supplier) => {
        const rating = Math.floor(supplier.rating?.overall || 0);
        acc[rating] = (acc[rating] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      locations: suppliers.reduce((acc, supplier) => {
        supplier.service_areas?.forEach((area: any) => {
          acc[area.city] = (acc[area.city] || 0) + 1;
        });
        return acc;
      }, {} as Record<string, number>),
    };

    return {
      suppliers,
      total_count: count || 0,
      page: 1,
      per_page: 50,
      total_pages: Math.ceil((count || 0) / 50),
      filters_applied: filters || {},
      aggregations,
    };
  }

  static async getSupplierById(id: string): Promise<Supplier | null> {
    const { data, error } = await supabase
      .from('suppliers')
      .select(`
        *,
        user:user_profiles(*),
        services:supplier_services(*),
        portfolio:supplier_portfolio(*),
        reviews:supplier_reviews(*),
        certifications:supplier_certifications(*),
        documents:supplier_documents(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data;
  }

  static async createSupplier(supplierData: CreateSupplierData): Promise<Supplier> {
    const { data, error } = await supabase
      .from('suppliers')
      .insert([{
        ...supplierData,
        rating: {
          overall: 0,
          total_reviews: 0,
          breakdown: {
            quality: 0,
            punctuality: 0,
            communication: 0,
            value_for_money: 0,
            professionalism: 0,
          },
          recent_reviews: [],
        },
        stats: {
          total_events: 0,
          completed_events: 0,
          cancelled_events: 0,
          total_revenue: 0,
          avg_event_value: 0,
          response_time_hours: 24,
          completion_rate: 0,
          repeat_client_rate: 0,
          on_time_delivery_rate: 0,
          last_updated: new Date().toISOString(),
        },
      }])
      .select(`
        *,
        user:user_profiles(*),
        services:supplier_services(*),
        portfolio:supplier_portfolio(*)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  static async updateSupplier(id: string, updates: UpdateSupplierData): Promise<Supplier> {
    const { data, error } = await supabase
      .from('suppliers')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        user:user_profiles(*),
        services:supplier_services(*),
        portfolio:supplier_portfolio(*)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteSupplier(id: string): Promise<void> {
    // Deletar dados relacionados primeiro
    await Promise.all([
      supabase.from('supplier_services').delete().eq('supplier_id', id),
      supabase.from('supplier_portfolio').delete().eq('supplier_id', id),
      supabase.from('supplier_reviews').delete().eq('supplier_id', id),
      supabase.from('supplier_certifications').delete().eq('supplier_id', id),
      supabase.from('supplier_documents').delete().eq('supplier_id', id),
      supabase.from('supplier_quotes').delete().eq('supplier_id', id),
      supabase.from('supplier_contracts').delete().eq('supplier_id', id),
    ]);

    // Deletar fornecedor
    const { error } = await supabase
      .from('suppliers')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async verifySupplier(id: string, verifiedBy: string): Promise<Supplier> {
    return SupplierService.updateSupplier(id, {
      verification_status: 'verified',
      verified_at: new Date().toISOString(),
      verified_by: verifiedBy,
    });
  }

  static async suspendSupplier(id: string, reason?: string): Promise<Supplier> {
    return SupplierService.updateSupplier(id, {
      status: 'suspended',
      notes: reason,
    });
  }

  static async getSupplierQuotes(supplierId: string): Promise<SupplierQuote[]> {
    const { data, error } = await supabase
      .from('supplier_quotes')
      .select(`
        *,
        event:events(*),
        quote_request:quote_requests(*)
      `)
      .eq('supplier_id', supplierId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async createQuote(quoteData: CreateQuoteData): Promise<SupplierQuote> {
    const { data, error } = await supabase
      .from('supplier_quotes')
      .insert([{
        ...quoteData,
        status: 'draft',
        expires_at: new Date(Date.now() + (quoteData.validity_days || 30) * 24 * 60 * 60 * 1000).toISOString(),
      }])
      .select(`
        *,
        event:events(*),
        quote_request:quote_requests(*)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  static async updateQuote(id: string, updates: UpdateQuoteData): Promise<SupplierQuote> {
    const { data, error } = await supabase
      .from('supplier_quotes')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        event:events(*),
        quote_request:quote_requests(*)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  static async sendQuote(id: string): Promise<SupplierQuote> {
    return SupplierService.updateQuote(id, {
      status: 'sent',
      sent_at: new Date().toISOString(),
    });
  }

  static async acceptQuote(id: string): Promise<SupplierQuote> {
    return SupplierService.updateQuote(id, {
      status: 'accepted',
      responded_at: new Date().toISOString(),
    });
  }

  static async rejectQuote(id: string, feedback?: string): Promise<SupplierQuote> {
    return SupplierService.updateQuote(id, {
      status: 'rejected',
      responded_at: new Date().toISOString(),
      client_feedback: feedback,
    });
  }

  static async getSupplierContracts(supplierId: string): Promise<SupplierContract[]> {
    const { data, error } = await supabase
      .from('supplier_contracts')
      .select(`
        *,
        event:events(*),
        quote:supplier_quotes(*)
      `)
      .eq('supplier_id', supplierId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async createContract(contractData: CreateContractData): Promise<SupplierContract> {
    const { data, error } = await supabase
      .from('supplier_contracts')
      .insert([{
        ...contractData,
        contract_number: `CONT-${Date.now()}`,
        status: 'draft',
        signatures: [],
      }])
      .select(`
        *,
        event:events(*),
        quote:supplier_quotes(*)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  static async updateContract(id: string, updates: UpdateContractData): Promise<SupplierContract> {
    const { data, error } = await supabase
      .from('supplier_contracts')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        event:events(*),
        quote:supplier_quotes(*)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  static async signContract(id: string, signatureData: any): Promise<SupplierContract> {
    // Buscar contrato atual
    const contract = await supabase
      .from('supplier_contracts')
      .select('signatures')
      .eq('id', id)
      .single();

    if (!contract.data) throw new Error('Contrato não encontrado');

    const updatedSignatures = [...(contract.data.signatures || []), signatureData];

    return SupplierService.updateContract(id, {
      signatures: updatedSignatures,
      status: updatedSignatures.length >= 2 ? 'signed' : 'sent',
      signed_at: updatedSignatures.length >= 2 ? new Date().toISOString() : undefined,
    });
  }

  static async getSupplierReviews(supplierId: string): Promise<SupplierReview[]> {
    const { data, error } = await supabase
      .from('supplier_reviews')
      .select(`
        *,
        event:events(*)
      `)
      .eq('supplier_id', supplierId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async createReview(reviewData: any): Promise<SupplierReview> {
    const { data, error } = await supabase
      .from('supplier_reviews')
      .insert([reviewData])
      .select(`
        *,
        event:events(*)
      `)
      .single();

    if (error) throw error;

    // Atualizar rating do fornecedor
    await SupplierService.updateSupplierRating(reviewData.supplier_id);

    return data;
  }

  static async updateSupplierRating(supplierId: string): Promise<void> {
    // Buscar todas as avaliações do fornecedor
    const { data: reviews } = await supabase
      .from('supplier_reviews')
      .select('rating, breakdown')
      .eq('supplier_id', supplierId);

    if (!reviews || reviews.length === 0) return;

    // Calcular nova média
    const totalReviews = reviews.length;
    const overallRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
    
    const breakdown = {
      quality: reviews.reduce((sum, review) => sum + (review.breakdown?.quality || 0), 0) / totalReviews,
      punctuality: reviews.reduce((sum, review) => sum + (review.breakdown?.punctuality || 0), 0) / totalReviews,
      communication: reviews.reduce((sum, review) => sum + (review.breakdown?.communication || 0), 0) / totalReviews,
      value_for_money: reviews.reduce((sum, review) => sum + (review.breakdown?.value_for_money || 0), 0) / totalReviews,
      professionalism: reviews.reduce((sum, review) => sum + (review.breakdown?.professionalism || 0), 0) / totalReviews,
    };

    // Atualizar fornecedor
    await supabase
      .from('suppliers')
      .update({
        rating: {
          overall: Math.round(overallRating * 10) / 10,
          total_reviews: totalReviews,
          breakdown,
          recent_reviews: reviews.slice(0, 5),
        }
      })
      .eq('id', supplierId);
  }

  static async getSupplierAnalytics(supplierId: string): Promise<SupplierAnalytics> {
    // Implementar lógica de analytics
    // Por enquanto, retornar dados mock
    return {
      supplier_id: supplierId,
      period: 'month',
      metrics: {
        quote_requests_received: 0,
        quotes_sent: 0,
        quote_acceptance_rate: 0,
        total_revenue: 0,
        avg_order_value: 0,
        client_retention_rate: 0,
        response_time_avg_hours: 0,
        rating_trend: [],
        booking_trend: [],
      },
      top_services: [],
      client_feedback_summary: {
        positive_keywords: [],
        improvement_areas: [],
        common_complaints: [],
      },
      generated_at: new Date().toISOString(),
    };
  }

  static async getSupplierNotifications(supplierId: string): Promise<SupplierNotification[]> {
    const { data, error } = await supabase
      .from('supplier_notifications')
      .select('*')
      .eq('supplier_id', supplierId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return data || [];
  }

  static async markNotificationAsRead(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('supplier_notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('id', notificationId);

    if (error) throw error;
  }
}

// Hook principal para fornecedores
export function useSuppliers(filters?: SupplierFilters) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: suppliersResult,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: supplierKeys.list(filters || {}),
    queryFn: () => SupplierService.getSuppliers(filters),
    enabled: !!user,
    staleTime: 2 * 60 * 1000,
  });

  const createSupplierMutation = useMutation({
    mutationFn: SupplierService.createSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries(supplierKeys.lists());
      toast.success('Fornecedor criado com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao criar fornecedor:', error);
      toast.error('Erro ao criar fornecedor');
    },
  });

  const updateSupplierMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateSupplierData }) =>
      SupplierService.updateSupplier(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries(supplierKeys.lists());
      toast.success('Fornecedor atualizado com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao atualizar fornecedor:', error);
      toast.error('Erro ao atualizar fornecedor');
    },
  });

  const deleteSupplierMutation = useMutation({
    mutationFn: SupplierService.deleteSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries(supplierKeys.lists());
      toast.success('Fornecedor removido com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao remover fornecedor:', error);
      toast.error('Erro ao remover fornecedor');
    },
  });

  const verifySupplierMutation = useMutation({
    mutationFn: ({ id, verifiedBy }: { id: string; verifiedBy: string }) =>
      SupplierService.verifySupplier(id, verifiedBy),
    onSuccess: () => {
      queryClient.invalidateQueries(supplierKeys.lists());
      toast.success('Fornecedor verificado com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao verificar fornecedor:', error);
      toast.error('Erro ao verificar fornecedor');
    },
  });

  return {
    suppliers: suppliersResult?.suppliers || [],
    suppliersResult,
    totalCount: suppliersResult?.total_count || 0,
    aggregations: suppliersResult?.aggregations || {},
    isLoading,
    error: error?.message || null,
    refetch,
    createSupplier: (supplierData: CreateSupplierData) => 
      createSupplierMutation.mutateAsync(supplierData),
    updateSupplier: (id: string, updates: UpdateSupplierData) => 
      updateSupplierMutation.mutateAsync({ id, updates }),
    deleteSupplier: (id: string) => deleteSupplierMutation.mutateAsync(id),
    verifySupplier: (id: string, verifiedBy: string) => 
      verifySupplierMutation.mutateAsync({ id, verifiedBy }),
    suspendSupplier: (id: string, reason?: string) => 
      updateSupplierMutation.mutateAsync({ id, updates: { status: 'suspended', notes: reason } }),
    isCreating: createSupplierMutation.isLoading,
    isUpdating: updateSupplierMutation.isLoading,
    isDeleting: deleteSupplierMutation.isLoading,
    isVerifying: verifySupplierMutation.isLoading,
  };
}

// Hook para fornecedor específico
export function useSupplier(supplierId: string) {
  const queryClient = useQueryClient();

  const {
    data: supplier,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: supplierKeys.detail(supplierId),
    queryFn: () => SupplierService.getSupplierById(supplierId),
    enabled: !!supplierId,
    staleTime: 2 * 60 * 1000,
  });

  const updateSupplierMutation = useMutation({
    mutationFn: (updates: UpdateSupplierData) => 
      SupplierService.updateSupplier(supplierId, updates),
    onSuccess: (updatedSupplier) => {
      queryClient.setQueryData(supplierKeys.detail(supplierId), updatedSupplier);
      queryClient.invalidateQueries(supplierKeys.lists());
      toast.success('Fornecedor atualizado com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao atualizar fornecedor:', error);
      toast.error('Erro ao atualizar fornecedor');
    },
  });

  return {
    supplier,
    isLoading,
    error: error?.message || null,
    refetch,
    updateSupplier: (updates: UpdateSupplierData) => updateSupplierMutation.mutateAsync(updates),
    isUpdating: updateSupplierMutation.isLoading,
  };
}

// Hook para cotações de fornecedor
export function useSupplierQuotes(supplierId: string) {
  const queryClient = useQueryClient();

  const {
    data: quotes,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: supplierKeys.quotesBySupplier(supplierId),
    queryFn: () => SupplierService.getSupplierQuotes(supplierId),
    enabled: !!supplierId,
    staleTime: 2 * 60 * 1000,
  });

  const createQuoteMutation = useMutation({
    mutationFn: SupplierService.createQuote,
    onSuccess: () => {
      queryClient.invalidateQueries(supplierKeys.quotes());
      toast.success('Cotação criada com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao criar cotação:', error);
      toast.error('Erro ao criar cotação');
    },
  });

  const updateQuoteMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateQuoteData }) =>
      SupplierService.updateQuote(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries(supplierKeys.quotes());
      toast.success('Cotação atualizada com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao atualizar cotação:', error);
      toast.error('Erro ao atualizar cotação');
    },
  });

  const sendQuoteMutation = useMutation({
    mutationFn: SupplierService.sendQuote,
    onSuccess: () => {
      queryClient.invalidateQueries(supplierKeys.quotes());
      toast.success('Cotação enviada com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao enviar cotação:', error);
      toast.error('Erro ao enviar cotação');
    },
  });

  return {
    quotes: quotes || [],
    isLoading,
    error: error?.message || null,
    refetch,
    createQuote: (quoteData: CreateQuoteData) => createQuoteMutation.mutateAsync(quoteData),
    updateQuote: (id: string, updates: UpdateQuoteData) => 
      updateQuoteMutation.mutateAsync({ id, updates }),
    sendQuote: (id: string) => sendQuoteMutation.mutateAsync(id),
    acceptQuote: (id: string) => SupplierService.acceptQuote(id),
    rejectQuote: (id: string, feedback?: string) => SupplierService.rejectQuote(id, feedback),
    isCreating: createQuoteMutation.isLoading,
    isUpdating: updateQuoteMutation.isLoading,
    isSending: sendQuoteMutation.isLoading,
  };
}

// Hook para contratos de fornecedor
export function useSupplierContracts(supplierId: string) {
  const queryClient = useQueryClient();

  const {
    data: contracts,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: supplierKeys.contractsBySupplier(supplierId),
    queryFn: () => SupplierService.getSupplierContracts(supplierId),
    enabled: !!supplierId,
    staleTime: 2 * 60 * 1000,
  });

  const createContractMutation = useMutation({
    mutationFn: SupplierService.createContract,
    onSuccess: () => {
      queryClient.invalidateQueries(supplierKeys.contracts());
      toast.success('Contrato criado com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao criar contrato:', error);
      toast.error('Erro ao criar contrato');
    },
  });

  const updateContractMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateContractData }) =>
      SupplierService.updateContract(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries(supplierKeys.contracts());
      toast.success('Contrato atualizado com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao atualizar contrato:', error);
      toast.error('Erro ao atualizar contrato');
    },
  });

  const signContractMutation = useMutation({
    mutationFn: ({ id, signatureData }: { id: string; signatureData: any }) =>
      SupplierService.signContract(id, signatureData),
    onSuccess: () => {
      queryClient.invalidateQueries(supplierKeys.contracts());
      toast.success('Contrato assinado com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao assinar contrato:', error);
      toast.error('Erro ao assinar contrato');
    },
  });

  return {
    contracts: contracts || [],
    isLoading,
    error: error?.message || null,
    refetch,
    createContract: (contractData: CreateContractData) => 
      createContractMutation.mutateAsync(contractData),
    updateContract: (id: string, updates: UpdateContractData) => 
      updateContractMutation.mutateAsync({ id, updates }),
    signContract: (id: string, signatureData: any) => 
      signContractMutation.mutateAsync({ id, signatureData }),
    isCreating: createContractMutation.isLoading,
    isUpdating: updateContractMutation.isLoading,
    isSigning: signContractMutation.isLoading,
  };
}

// Hook para avaliações de fornecedor
export function useSupplierReviews(supplierId: string) {
  const queryClient = useQueryClient();

  const {
    data: reviews,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: supplierKeys.reviews(supplierId),
    queryFn: () => SupplierService.getSupplierReviews(supplierId),
    enabled: !!supplierId,
    staleTime: 5 * 60 * 1000,
  });

  const createReviewMutation = useMutation({
    mutationFn: SupplierService.createReview,
    onSuccess: () => {
      queryClient.invalidateQueries(supplierKeys.reviews(supplierId));
      queryClient.invalidateQueries(supplierKeys.detail(supplierId));
      toast.success('Avaliação criada com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao criar avaliação:', error);
      toast.error('Erro ao criar avaliação');
    },
  });

  return {
    reviews: reviews || [],
    isLoading,
    error: error?.message || null,
    refetch,
    createReview: (reviewData: any) => createReviewMutation.mutateAsync(reviewData),
    isCreating: createReviewMutation.isLoading,
  };
}

// Hook para analytics de fornecedor
export function useSupplierAnalytics(supplierId: string) {
  const {
    data: analytics,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: supplierKeys.analytics(supplierId),
    queryFn: () => SupplierService.getSupplierAnalytics(supplierId),
    enabled: !!supplierId,
    staleTime: 5 * 60 * 1000,
  });

  return {
    analytics,
    isLoading,
    error: error?.message || null,
    refetch,
  };
}

// Hook para notificações de fornecedor
export function useSupplierNotifications(supplierId: string) {
  const queryClient = useQueryClient();

  const {
    data: notifications,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: supplierKeys.notifications(supplierId),
    queryFn: () => SupplierService.getSupplierNotifications(supplierId),
    enabled: !!supplierId,
    staleTime: 1 * 60 * 1000, // 1 minuto
  });

  const markAsReadMutation = useMutation({
    mutationFn: SupplierService.markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries(supplierKeys.notifications(supplierId));
    },
    onError: (error: any) => {
      console.error('Erro ao marcar notificação como lida:', error);
    },
  });

  return {
    notifications: notifications || [],
    unreadCount: notifications?.filter(n => !n.read_at).length || 0,
    isLoading,
    error: error?.message || null,
    refetch,
    markAsRead: (notificationId: string) => markAsReadMutation.mutateAsync(notificationId),
    isMarkingAsRead: markAsReadMutation.isLoading,
  };
}

// Exportações para compatibilidade
export { SupplierService };

