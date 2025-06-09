import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  UserProfile, 
  Tenant, 
  UserRole, 
  TenantStatus,
  CreateUserData,
  UpdateUserData,
  CreateTenantData,
  UpdateTenantData,
  UserFilters,
  TenantFilters
} from '@/types/auth';
import { useAuth } from '@/hooks/useAuthEnhanced';

// Chaves de query para cache
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: UserFilters) => [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  byTenant: (tenantId: string) => [...userKeys.all, 'tenant', tenantId] as const,
};

export const tenantKeys = {
  all: ['tenants'] as const,
  lists: () => [...tenantKeys.all, 'list'] as const,
  list: (filters: TenantFilters) => [...tenantKeys.lists(), { filters }] as const,
  details: () => [...tenantKeys.all, 'detail'] as const,
  detail: (id: string) => [...tenantKeys.details(), id] as const,
  stats: (id: string) => [...tenantKeys.detail(id), 'stats'] as const,
};

// Serviços de usuários
class UserService {
  static async getUsers(filters?: UserFilters): Promise<UserProfile[]> {
    let query = supabase
      .from('user_profiles')
      .select(`
        *,
        tenant:tenants(*)
      `);

    // Aplicar filtros
    if (filters?.tenant_id) {
      query = query.eq('tenant_id', filters.tenant_id);
    }

    if (filters?.role?.length) {
      query = query.in('role', filters.role);
    }

    if (filters?.status?.length) {
      query = query.in('status', filters.status);
    }

    if (filters?.search_query) {
      query = query.or(`
        full_name.ilike.%${filters.search_query}%,
        email.ilike.%${filters.search_query}%
      `);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  static async getUserById(id: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select(`
        *,
        tenant:tenants(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data;
  }

  static async createUser(userData: CreateUserData): Promise<UserProfile> {
    // Primeiro criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true,
      user_metadata: {
        first_name: userData.first_name,
        last_name: userData.last_name,
        role: userData.role,
      }
    });

    if (authError) throw authError;

    if (!authData.user) {
      throw new Error('Erro ao criar usuário');
    }

    // Criar perfil do usuário
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([{
        id: authData.user.id,
        tenant_id: userData.tenant_id,
        email: userData.email,
        role: userData.role,
        status: userData.status || 'active',
        first_name: userData.first_name,
        last_name: userData.last_name,
        full_name: `${userData.first_name} ${userData.last_name}`,
        profile_data: userData.profile_data || null,
        permissions: userData.permissions || [],
      }])
      .select(`
        *,
        tenant:tenants(*)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  static async updateUser(id: string, updates: UpdateUserData): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        tenant:tenants(*)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteUser(id: string): Promise<void> {
    // Primeiro deletar o perfil
    const { error: profileError } = await supabase
      .from('user_profiles')
      .delete()
      .eq('id', id);

    if (profileError) throw profileError;

    // Depois deletar do Supabase Auth
    const { error: authError } = await supabase.auth.admin.deleteUser(id);
    if (authError) throw authError;
  }

  static async inviteUser(userData: Omit<CreateUserData, 'password'>): Promise<UserProfile> {
    // Criar convite no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.inviteUserByEmail(
      userData.email,
      {
        data: {
          first_name: userData.first_name,
          last_name: userData.last_name,
          role: userData.role,
          tenant_id: userData.tenant_id,
        }
      }
    );

    if (authError) throw authError;

    if (!authData.user) {
      throw new Error('Erro ao enviar convite');
    }

    // Criar perfil do usuário
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([{
        id: authData.user.id,
        tenant_id: userData.tenant_id,
        email: userData.email,
        role: userData.role,
        status: 'pending',
        first_name: userData.first_name,
        last_name: userData.last_name,
        full_name: `${userData.first_name} ${userData.last_name}`,
        profile_data: userData.profile_data || null,
        permissions: userData.permissions || [],
      }])
      .select(`
        *,
        tenant:tenants(*)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  static async resetPassword(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  }

  static async updateUserRole(id: string, role: UserRole): Promise<UserProfile> {
    return UserService.updateUser(id, { role });
  }

  static async updateUserStatus(id: string, status: UserProfile['status']): Promise<UserProfile> {
    return UserService.updateUser(id, { status });
  }

  static async getUsersByTenant(tenantId: string): Promise<UserProfile[]> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select(`
        *,
        tenant:tenants(*)
      `)
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
}

// Serviços de tenants
class TenantService {
  static async getTenants(filters?: TenantFilters): Promise<Tenant[]> {
    let query = supabase
      .from('tenants')
      .select('*');

    // Aplicar filtros
    if (filters?.status?.length) {
      query = query.in('status', filters.status);
    }

    if (filters?.subscription_plan?.length) {
      query = query.in('subscription_plan', filters.subscription_plan);
    }

    if (filters?.search_query) {
      query = query.or(`
        name.ilike.%${filters.search_query}%,
        slug.ilike.%${filters.search_query}%
      `);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  static async getTenantById(id: string): Promise<Tenant | null> {
    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data;
  }

  static async createTenant(tenantData: CreateTenantData): Promise<Tenant> {
    const { data, error } = await supabase
      .from('tenants')
      .insert([{
        ...tenantData,
        slug: tenantData.slug || tenantData.name.toLowerCase().replace(/\s+/g, '-'),
        status: tenantData.status || 'trial',
        subscription_plan: tenantData.subscription_plan || 'basic',
        subscription_status: tenantData.subscription_status || 'trialing',
        trial_ends_at: tenantData.trial_ends_at || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateTenant(id: string, updates: UpdateTenantData): Promise<Tenant> {
    const { data, error } = await supabase
      .from('tenants')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteTenant(id: string): Promise<void> {
    // Primeiro deletar todos os usuários do tenant
    const { error: usersError } = await supabase
      .from('user_profiles')
      .delete()
      .eq('tenant_id', id);

    if (usersError) throw usersError;

    // Depois deletar o tenant
    const { error } = await supabase
      .from('tenants')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async getTenantStats(id: string): Promise<any> {
    // Buscar estatísticas do tenant
    const [usersResult, eventsResult] = await Promise.all([
      supabase
        .from('user_profiles')
        .select('role, status', { count: 'exact' })
        .eq('tenant_id', id),
      supabase
        .from('events')
        .select('status', { count: 'exact' })
        .eq('tenant_id', id)
    ]);

    const users = usersResult.data || [];
    const events = eventsResult.data || [];

    return {
      users: {
        total: usersResult.count || 0,
        by_role: users.reduce((acc, user) => {
          acc[user.role] = (acc[user.role] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        by_status: users.reduce((acc, user) => {
          acc[user.status] = (acc[user.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
      },
      events: {
        total: eventsResult.count || 0,
        by_status: events.reduce((acc, event) => {
          acc[event.status] = (acc[event.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
      },
    };
  }

  static async updateTenantStatus(id: string, status: TenantStatus): Promise<Tenant> {
    return TenantService.updateTenant(id, { status });
  }

  static async suspendTenant(id: string, reason?: string): Promise<Tenant> {
    return TenantService.updateTenant(id, { 
      status: 'suspended',
      // Adicionar reason aos metadados se necessário
    });
  }

  static async activateTenant(id: string): Promise<Tenant> {
    return TenantService.updateTenant(id, { status: 'active' });
  }
}

// Hook para gerenciamento de usuários
export function useUsers(filters?: UserFilters) {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();

  // Aplicar filtro de tenant automaticamente se não for admin master
  const effectiveFilters = {
    ...filters,
    tenant_id: currentUser?.role === 'admin_master' ? filters?.tenant_id : currentUser?.tenant_id,
  };

  const {
    data: users,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: userKeys.list(effectiveFilters),
    queryFn: () => UserService.getUsers(effectiveFilters),
    enabled: !!currentUser,
    staleTime: 2 * 60 * 1000,
  });

  const createUserMutation = useMutation({
    mutationFn: UserService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries(userKeys.lists());
      toast.success('Usuário criado com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao criar usuário:', error);
      toast.error('Erro ao criar usuário');
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateUserData }) =>
      UserService.updateUser(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries(userKeys.lists());
      toast.success('Usuário atualizado com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao atualizar usuário:', error);
      toast.error('Erro ao atualizar usuário');
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: UserService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(userKeys.lists());
      toast.success('Usuário deletado com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao deletar usuário:', error);
      toast.error('Erro ao deletar usuário');
    },
  });

  const inviteUserMutation = useMutation({
    mutationFn: UserService.inviteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(userKeys.lists());
      toast.success('Convite enviado com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao enviar convite:', error);
      toast.error('Erro ao enviar convite');
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: UserService.resetPassword,
    onSuccess: () => {
      toast.success('Email de redefinição de senha enviado!');
    },
    onError: (error: any) => {
      console.error('Erro ao enviar email:', error);
      toast.error('Erro ao enviar email de redefinição');
    },
  });

  return {
    users: users || [],
    isLoading,
    error: error?.message || null,
    refetch,
    createUser: (userData: CreateUserData) => createUserMutation.mutateAsync(userData),
    updateUser: (id: string, updates: UpdateUserData) => 
      updateUserMutation.mutateAsync({ id, updates }),
    deleteUser: (id: string) => deleteUserMutation.mutateAsync(id),
    inviteUser: (userData: Omit<CreateUserData, 'password'>) => 
      inviteUserMutation.mutateAsync(userData),
    resetPassword: (email: string) => resetPasswordMutation.mutateAsync(email),
    updateUserRole: (id: string, role: UserRole) => 
      updateUserMutation.mutateAsync({ id, updates: { role } }),
    updateUserStatus: (id: string, status: UserProfile['status']) => 
      updateUserMutation.mutateAsync({ id, updates: { status } }),
    isCreating: createUserMutation.isLoading,
    isUpdating: updateUserMutation.isLoading,
    isDeleting: deleteUserMutation.isLoading,
    isInviting: inviteUserMutation.isLoading,
    isResettingPassword: resetPasswordMutation.isLoading,
  };
}

// Hook para usuário específico
export function useUser(userId: string) {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => UserService.getUserById(userId),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
  });

  const updateUserMutation = useMutation({
    mutationFn: (updates: UpdateUserData) => UserService.updateUser(userId, updates),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(userKeys.detail(userId), updatedUser);
      queryClient.invalidateQueries(userKeys.lists());
      toast.success('Usuário atualizado com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao atualizar usuário:', error);
      toast.error('Erro ao atualizar usuário');
    },
  });

  return {
    user,
    isLoading,
    error: error?.message || null,
    refetch,
    updateUser: (updates: UpdateUserData) => updateUserMutation.mutateAsync(updates),
    isUpdating: updateUserMutation.isLoading,
  };
}

// Hook para gerenciamento de tenants (apenas admin master)
export function useTenants(filters?: TenantFilters) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: tenants,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: tenantKeys.list(filters || {}),
    queryFn: () => TenantService.getTenants(filters),
    enabled: user?.role === 'admin_master',
    staleTime: 5 * 60 * 1000,
  });

  const createTenantMutation = useMutation({
    mutationFn: TenantService.createTenant,
    onSuccess: () => {
      queryClient.invalidateQueries(tenantKeys.lists());
      toast.success('Empresa criada com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao criar empresa:', error);
      toast.error('Erro ao criar empresa');
    },
  });

  const updateTenantMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateTenantData }) =>
      TenantService.updateTenant(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries(tenantKeys.lists());
      toast.success('Empresa atualizada com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao atualizar empresa:', error);
      toast.error('Erro ao atualizar empresa');
    },
  });

  const deleteTenantMutation = useMutation({
    mutationFn: TenantService.deleteTenant,
    onSuccess: () => {
      queryClient.invalidateQueries(tenantKeys.lists());
      toast.success('Empresa deletada com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao deletar empresa:', error);
      toast.error('Erro ao deletar empresa');
    },
  });

  return {
    tenants: tenants || [],
    isLoading,
    error: error?.message || null,
    refetch,
    createTenant: (tenantData: CreateTenantData) => createTenantMutation.mutateAsync(tenantData),
    updateTenant: (id: string, updates: UpdateTenantData) => 
      updateTenantMutation.mutateAsync({ id, updates }),
    deleteTenant: (id: string) => deleteTenantMutation.mutateAsync(id),
    suspendTenant: (id: string, reason?: string) => 
      updateTenantMutation.mutateAsync({ id, updates: { status: 'suspended' } }),
    activateTenant: (id: string) => 
      updateTenantMutation.mutateAsync({ id, updates: { status: 'active' } }),
    isCreating: createTenantMutation.isLoading,
    isUpdating: updateTenantMutation.isLoading,
    isDeleting: deleteTenantMutation.isLoading,
  };
}

// Hook para tenant específico
export function useTenantDetails(tenantId: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: tenant,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: tenantKeys.detail(tenantId),
    queryFn: () => TenantService.getTenantById(tenantId),
    enabled: !!tenantId && (user?.role === 'admin_master' || user?.tenant_id === tenantId),
    staleTime: 2 * 60 * 1000,
  });

  const {
    data: stats,
    isLoading: isLoadingStats,
    refetch: refetchStats,
  } = useQuery({
    queryKey: tenantKeys.stats(tenantId),
    queryFn: () => TenantService.getTenantStats(tenantId),
    enabled: !!tenantId && !!tenant,
    staleTime: 5 * 60 * 1000,
  });

  const updateTenantMutation = useMutation({
    mutationFn: (updates: UpdateTenantData) => TenantService.updateTenant(tenantId, updates),
    onSuccess: (updatedTenant) => {
      queryClient.setQueryData(tenantKeys.detail(tenantId), updatedTenant);
      queryClient.invalidateQueries(tenantKeys.lists());
      toast.success('Empresa atualizada com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao atualizar empresa:', error);
      toast.error('Erro ao atualizar empresa');
    },
  });

  return {
    tenant,
    stats,
    isLoading,
    isLoadingStats,
    error: error?.message || null,
    refetch,
    refetchStats,
    updateTenant: (updates: UpdateTenantData) => updateTenantMutation.mutateAsync(updates),
    isUpdating: updateTenantMutation.isLoading,
  };
}

// Hook para usuários de um tenant específico
export function useTenantUsers(tenantId: string) {
  const { user } = useAuth();

  const {
    data: users,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: userKeys.byTenant(tenantId),
    queryFn: () => UserService.getUsersByTenant(tenantId),
    enabled: !!tenantId && (user?.role === 'admin_master' || user?.tenant_id === tenantId),
    staleTime: 2 * 60 * 1000,
  });

  return {
    users: users || [],
    isLoading,
    error: error?.message || null,
    refetch,
  };
}

// Hook para estatísticas de usuários
export function useUserStats() {
  const { user } = useAuth();

  const {
    data: stats,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['user-stats', user?.tenant_id],
    queryFn: async () => {
      if (!user?.tenant_id) return null;

      const filters: UserFilters = {
        tenant_id: user.role === 'admin_master' ? undefined : user.tenant_id,
      };

      const users = await UserService.getUsers(filters);

      return {
        total: users.length,
        by_role: users.reduce((acc, user) => {
          acc[user.role] = (acc[user.role] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        by_status: users.reduce((acc, user) => {
          acc[user.status] = (acc[user.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        recent: users.slice(0, 5),
      };
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });

  return {
    stats,
    isLoading,
    error: error?.message || null,
    refetch,
  };
}

// Exportações para compatibilidade
export { UserService, TenantService };

