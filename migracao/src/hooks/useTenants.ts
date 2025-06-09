import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { 
  Tenant, 
  TenantStatus, 
  TenantSubscriptionPlan,
  CreateTenantData,
  UpdateTenantData,
  TenantStats,
  TenantBilling
} from '@/types/auth';

// Query keys para cache
export const tenantKeys = {
  all: ['tenants'] as const,
  lists: () => [...tenantKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...tenantKeys.lists(), { filters }] as const,
  details: () => [...tenantKeys.all, 'detail'] as const,
  detail: (id: string) => [...tenantKeys.details(), id] as const,
  stats: () => [...tenantKeys.all, 'stats'] as const,
  billing: () => [...tenantKeys.all, 'billing'] as const,
  analytics: () => [...tenantKeys.all, 'analytics'] as const,
};

// Serviços de Tenant
class TenantService {
  static async getTenants(filters?: {
    status?: TenantStatus;
    plan?: TenantSubscriptionPlan;
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    let query = supabase
      .from('tenants')
      .select(`
        *,
        user_profiles!tenant_id(count),
        events!tenant_id(count)
      `);

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.plan) {
      query = query.eq('subscription_plan', filters.plan);
    }

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,slug.ilike.%${filters.search}%`);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(filters.offset, (filters.offset + (filters.limit || 10)) - 1);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;
    return data as Tenant[];
  }

  static async getTenant(id: string) {
    const { data, error } = await supabase
      .from('tenants')
      .select(`
        *,
        user_profiles!tenant_id(
          id,
          email,
          role,
          status,
          first_name,
          last_name,
          created_at
        ),
        events!tenant_id(
          id,
          title,
          status,
          start_date,
          created_at
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Tenant;
  }

  static async createTenant(data: CreateTenantData) {
    // Criar tenant
    const { data: tenant, error: tenantError } = await supabase
      .from('tenants')
      .insert({
        name: data.name,
        slug: data.slug,
        status: 'trial',
        subscription_plan: 'basic',
        trial_ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dias
        settings: {
          brand: {
            name: data.name,
            primary_color: '#8B5CF6',
            secondary_color: '#A78BFA'
          },
          features: {
            cms_enabled: true,
            events_enabled: true,
            suppliers_enabled: true,
            analytics_enabled: true,
            ai_enabled: false,
            questionnaires_enabled: true
          },
          limits: {
            max_users: 10,
            max_events: 50,
            max_suppliers: 100,
            storage_gb: 5
          }
        },
        billing_info: {
          email: data.admin_email,
          company_name: data.name,
          tax_id: data.tax_id || null,
          address: data.address || null
        }
      })
      .select()
      .single();

    if (tenantError) throw tenantError;

    // Criar usuário admin do tenant
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: data.admin_email,
      password: data.admin_password,
      email_confirm: true,
      user_metadata: {
        first_name: data.admin_first_name,
        last_name: data.admin_last_name,
        role: 'admin',
        tenant_id: tenant.id
      }
    });

    if (authError) {
      // Rollback: deletar tenant se criação do usuário falhar
      await supabase.from('tenants').delete().eq('id', tenant.id);
      throw authError;
    }

    // Criar perfil do usuário
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: authUser.user.id,
        tenant_id: tenant.id,
        email: data.admin_email,
        role: 'admin',
        status: 'active',
        first_name: data.admin_first_name,
        last_name: data.admin_last_name,
        permissions: []
      });

    if (profileError) {
      // Rollback: deletar tenant e usuário
      await supabase.auth.admin.deleteUser(authUser.user.id);
      await supabase.from('tenants').delete().eq('id', tenant.id);
      throw profileError;
    }

    return tenant;
  }

  static async updateTenant(id: string, data: UpdateTenantData) {
    const { data: tenant, error } = await supabase
      .from('tenants')
      .update({
        name: data.name,
        status: data.status,
        subscription_plan: data.subscription_plan,
        subscription_status: data.subscription_status,
        trial_ends_at: data.trial_ends_at,
        settings: data.settings,
        billing_info: data.billing_info,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return tenant;
  }

  static async deleteTenant(id: string) {
    // Verificar se há dados dependentes
    const { data: users } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('tenant_id', id);

    const { data: events } = await supabase
      .from('events')
      .select('id')
      .eq('tenant_id', id);

    if (users && users.length > 0) {
      throw new Error('Não é possível deletar tenant com usuários ativos. Remova todos os usuários primeiro.');
    }

    if (events && events.length > 0) {
      throw new Error('Não é possível deletar tenant com eventos ativos. Remova todos os eventos primeiro.');
    }

    const { error } = await supabase
      .from('tenants')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async getTenantStats(): Promise<TenantStats> {
    // Stats gerais
    const { data: tenants, error: tenantsError } = await supabase
      .from('tenants')
      .select('status, subscription_plan, created_at');

    if (tenantsError) throw tenantsError;

    // Stats de usuários
    const { data: users, error: usersError } = await supabase
      .from('user_profiles')
      .select('tenant_id, role, status, created_at');

    if (usersError) throw usersError;

    // Stats de eventos
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('tenant_id, status, created_at');

    if (eventsError) throw eventsError;

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    return {
      total_tenants: tenants.length,
      active_tenants: tenants.filter(t => t.status === 'active').length,
      trial_tenants: tenants.filter(t => t.status === 'trial').length,
      suspended_tenants: tenants.filter(t => t.status === 'suspended').length,
      new_tenants_30d: tenants.filter(t => new Date(t.created_at) > thirtyDaysAgo).length,
      total_users: users.length,
      active_users: users.filter(u => u.status === 'active').length,
      new_users_30d: users.filter(u => new Date(u.created_at) > thirtyDaysAgo).length,
      total_events: events.length,
      active_events: events.filter(e => e.status === 'confirmado').length,
      new_events_30d: events.filter(e => new Date(e.created_at) > thirtyDaysAgo).length,
      plans_distribution: {
        basic: tenants.filter(t => t.subscription_plan === 'basic').length,
        premium: tenants.filter(t => t.subscription_plan === 'premium').length,
        enterprise: tenants.filter(t => t.subscription_plan === 'enterprise').length,
      },
      growth_rate: this.calculateGrowthRate(tenants),
      churn_rate: this.calculateChurnRate(tenants),
    };
  }

  static async getTenantBilling(tenantId?: string): Promise<TenantBilling[]> {
    let query = supabase
      .from('tenant_billing')
      .select(`
        *,
        tenant:tenants(name, slug)
      `);

    if (tenantId) {
      query = query.eq('tenant_id', tenantId);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;
    return data as TenantBilling[];
  }

  private static calculateGrowthRate(tenants: any[]): number {
    const now = new Date();
    const thisMonth = tenants.filter(t => {
      const created = new Date(t.created_at);
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
    }).length;

    const lastMonth = tenants.filter(t => {
      const created = new Date(t.created_at);
      const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1);
      return created.getMonth() === lastMonthDate.getMonth() && created.getFullYear() === lastMonthDate.getFullYear();
    }).length;

    if (lastMonth === 0) return thisMonth > 0 ? 100 : 0;
    return ((thisMonth - lastMonth) / lastMonth) * 100;
  }

  private static calculateChurnRate(tenants: any[]): number {
    const suspended = tenants.filter(t => t.status === 'suspended').length;
    const total = tenants.length;
    return total > 0 ? (suspended / total) * 100 : 0;
  }
}

// Hook principal para gestão de tenants
export function useTenants(filters?: {
  status?: TenantStatus;
  plan?: TenantSubscriptionPlan;
  search?: string;
  limit?: number;
  offset?: number;
}) {
  const queryClient = useQueryClient();

  const {
    data: tenants = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: tenantKeys.list(filters || {}),
    queryFn: () => TenantService.getTenants(filters),
    staleTime: 2 * 60 * 1000, // 2 minutos
  });

  const createMutation = useMutation({
    mutationFn: TenantService.createTenant,
    onSuccess: (newTenant) => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.all });
      toast.success(`Tenant "${newTenant.name}" criado com sucesso!`);
    },
    onError: (error: any) => {
      toast.error(`Erro ao criar tenant: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTenantData }) =>
      TenantService.updateTenant(id, data),
    onSuccess: (updatedTenant) => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.all });
      toast.success(`Tenant "${updatedTenant.name}" atualizado com sucesso!`);
    },
    onError: (error: any) => {
      toast.error(`Erro ao atualizar tenant: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: TenantService.deleteTenant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.all });
      toast.success('Tenant deletado com sucesso!');
    },
    onError: (error: any) => {
      toast.error(`Erro ao deletar tenant: ${error.message}`);
    },
  });

  return {
    tenants,
    isLoading,
    error,
    refetch,
    createTenant: createMutation.mutate,
    updateTenant: updateMutation.mutate,
    deleteTenant: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

// Hook para tenant específico
export function useTenant(id: string) {
  const queryClient = useQueryClient();

  const {
    data: tenant,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: tenantKeys.detail(id),
    queryFn: () => TenantService.getTenant(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  return {
    tenant,
    isLoading,
    error,
    refetch,
  };
}

// Hook para estatísticas de tenants
export function useTenantStats() {
  const {
    data: stats,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: tenantKeys.stats(),
    queryFn: TenantService.getTenantStats,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchInterval: 5 * 60 * 1000, // Atualizar a cada 5 minutos
  });

  return {
    stats,
    isLoading,
    error,
    refetch,
  };
}

// Hook para billing de tenants
export function useTenantBilling(tenantId?: string) {
  const {
    data: billing = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: [...tenantKeys.billing(), tenantId],
    queryFn: () => TenantService.getTenantBilling(tenantId),
    staleTime: 2 * 60 * 1000, // 2 minutos
  });

  return {
    billing,
    isLoading,
    error,
    refetch,
  };
}

export default useTenants;

