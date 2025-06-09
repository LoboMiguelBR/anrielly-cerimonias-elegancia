import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  UserProfile, 
  Tenant, 
  AuthContext as AuthContextType, 
  SignUpData,
  UserRole,
  Session
} from '@/types/auth';
import { toast } from 'sonner';

// Contexto de autenticação
const AuthContext = createContext<AuthContextType | null>(null);

// Serviços de autenticação
class AuthService {
  static async getCurrentUser(): Promise<UserProfile | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) return null;

      // Buscar perfil completo do usuário
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select(`
          *,
          tenant:tenants(*)
        `)
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Erro ao buscar perfil:', profileError);
        return null;
      }

      return profile;
    } catch (error) {
      console.error('Erro ao obter usuário atual:', error);
      return null;
    }
  }

  static async getCurrentTenant(tenantId: string): Promise<Tenant | null> {
    try {
      const { data: tenant, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('id', tenantId)
        .single();

      if (error) {
        console.error('Erro ao buscar tenant:', error);
        return null;
      }

      return tenant;
    } catch (error) {
      console.error('Erro ao obter tenant:', error);
      return null;
    }
  }

  static async signIn(email: string, password: string): Promise<{ user: UserProfile; tenant: Tenant }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (!data.user) {
        throw new Error('Usuário não encontrado');
      }

      // Buscar perfil completo
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select(`
          *,
          tenant:tenants(*)
        `)
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        throw new Error('Erro ao carregar perfil do usuário');
      }

      // Verificar se o usuário tem acesso ao tenant
      if (profile.status !== 'active') {
        throw new Error('Conta inativa. Entre em contato com o administrador.');
      }

      const tenant = profile.tenant;
      if (!tenant || tenant.status !== 'active') {
        throw new Error('Tenant inativo. Entre em contato com o suporte.');
      }

      return { user: profile, tenant };
    } catch (error: any) {
      console.error('Erro no login:', error);
      throw new Error(error.message || 'Erro ao fazer login');
    }
  }

  static async signUp(signUpData: SignUpData): Promise<{ user: UserProfile; tenant: Tenant }> {
    try {
      // Criar usuário no Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: signUpData.email,
        password: signUpData.password,
        options: {
          data: {
            first_name: signUpData.first_name,
            last_name: signUpData.last_name,
            role: signUpData.role,
          }
        }
      });

      if (error) throw error;

      if (!data.user) {
        throw new Error('Erro ao criar usuário');
      }

      // Determinar tenant_id
      let tenantId = signUpData.tenant_id;
      
      // Se não foi especificado um tenant e o role é admin_master, criar novo tenant
      if (!tenantId && signUpData.role === 'admin_master') {
        const { data: newTenant, error: tenantError } = await supabase
          .from('tenants')
          .insert([{
            name: `${signUpData.first_name} ${signUpData.last_name}`,
            slug: `${signUpData.first_name.toLowerCase()}-${signUpData.last_name.toLowerCase()}`,
            status: 'trial',
            subscription_plan: 'basic',
            subscription_status: 'trialing',
            trial_ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dias
            settings: {
              brand: {
                name: `${signUpData.first_name} ${signUpData.last_name}`,
                primary_color: '#8B5CF6',
                secondary_color: '#A78BFA',
              },
              contact: {
                email: signUpData.email,
                phone: '',
                address: '',
              },
              features: {
                cms_enabled: true,
                events_enabled: true,
                suppliers_enabled: true,
                analytics_enabled: true,
                ai_enabled: true,
                questionnaires_enabled: true,
              },
              limits: {
                max_events: 100,
                max_users: 10,
                max_storage_gb: 5,
              },
            },
            billing_info: {
              company_name: `${signUpData.first_name} ${signUpData.last_name}`,
              tax_id: '',
              billing_email: signUpData.email,
              billing_address: '',
            },
          }])
          .select()
          .single();

        if (tenantError) {
          throw new Error('Erro ao criar empresa');
        }

        tenantId = newTenant.id;
      }

      if (!tenantId) {
        throw new Error('Tenant não especificado');
      }

      // Criar perfil do usuário
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .insert([{
          id: data.user.id,
          tenant_id: tenantId,
          email: signUpData.email,
          role: signUpData.role,
          status: 'active',
          first_name: signUpData.first_name,
          last_name: signUpData.last_name,
          full_name: `${signUpData.first_name} ${signUpData.last_name}`,
          profile_data: signUpData.profile_data || null,
          permissions: [],
        }])
        .select(`
          *,
          tenant:tenants(*)
        `)
        .single();

      if (profileError) {
        throw new Error('Erro ao criar perfil');
      }

      return { user: profile, tenant: profile.tenant };
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      throw new Error(error.message || 'Erro ao criar conta');
    }
  }

  static async signOut(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      console.error('Erro ao fazer logout:', error);
      throw new Error(error.message || 'Erro ao fazer logout');
    }
  }

  static async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId)
        .select(`
          *,
          tenant:tenants(*)
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      throw new Error(error.message || 'Erro ao atualizar perfil');
    }
  }

  static async switchTenant(userId: string, tenantId: string): Promise<{ user: UserProfile; tenant: Tenant }> {
    try {
      // Verificar se o usuário tem acesso ao tenant
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select(`
          *,
          tenant:tenants(*)
        `)
        .eq('id', userId)
        .eq('tenant_id', tenantId)
        .single();

      if (profileError) {
        throw new Error('Acesso negado ao tenant');
      }

      return { user: profile, tenant: profile.tenant };
    } catch (error: any) {
      console.error('Erro ao trocar tenant:', error);
      throw new Error(error.message || 'Erro ao trocar empresa');
    }
  }

  static hasPermission(user: UserProfile | null, resource: string, action: string): boolean {
    if (!user) return false;

    // Admin Master tem acesso total
    if (user.role === 'admin_master') return true;

    // Admin tem acesso total dentro do seu tenant
    if (user.role === 'admin') return true;

    // Verificar permissões específicas
    return user.permissions.some(permission => 
      permission.resource === resource && 
      (permission.action === action || permission.action === 'manage')
    );
  }

  static hasRole(user: UserProfile | null, roles: UserRole | UserRole[]): boolean {
    if (!user) return false;

    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  }

  static canAccess(user: UserProfile | null, resource: string): boolean {
    if (!user) return false;

    // Verificar se o usuário tem pelo menos uma permissão para o recurso
    return AuthService.hasPermission(user, resource, 'read') ||
           AuthService.hasPermission(user, resource, 'manage');
  }
}

// Provider de autenticação
export function AuthProvider({ children, initialUser, initialTenant }: {
  children: React.ReactNode;
  initialUser?: UserProfile | null;
  initialTenant?: Tenant | null;
}) {
  const [user, setUser] = useState<UserProfile | null>(initialUser || null);
  const [tenant, setTenant] = useState<Tenant | null>(initialTenant || null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão atual
    const checkSession = async () => {
      try {
        const currentUser = await AuthService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          if (currentUser.tenant_id) {
            const currentTenant = await AuthService.getCurrentTenant(currentUser.tenant_id);
            setTenant(currentTenant);
          }
        }
      } catch (error) {
        console.error('Erro ao verificar sessão:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const currentUser = await AuthService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            if (currentUser.tenant_id) {
              const currentTenant = await AuthService.getCurrentTenant(currentUser.tenant_id);
              setTenant(currentTenant);
            }
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setTenant(null);
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { user: newUser, tenant: newTenant } = await AuthService.signIn(email, password);
      setUser(newUser);
      setTenant(newTenant);
      toast.success('Login realizado com sucesso!');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (data: SignUpData) => {
    try {
      setIsLoading(true);
      const { user: newUser, tenant: newTenant } = await AuthService.signUp(data);
      setUser(newUser);
      setTenant(newTenant);
      toast.success('Conta criada com sucesso!');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await AuthService.signOut();
      setUser(null);
      setTenant(null);
      toast.success('Logout realizado com sucesso!');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) throw new Error('Usuário não autenticado');

    try {
      const updatedUser = await AuthService.updateProfile(user.id, updates);
      setUser(updatedUser);
      toast.success('Perfil atualizado com sucesso!');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const switchTenant = async (tenantId: string) => {
    if (!user) throw new Error('Usuário não autenticado');

    try {
      setIsLoading(true);
      const { user: updatedUser, tenant: newTenant } = await AuthService.switchTenant(user.id, tenantId);
      setUser(updatedUser);
      setTenant(newTenant);
      toast.success('Empresa alterada com sucesso!');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const hasPermission = (resource: string, action: string): boolean => {
    return AuthService.hasPermission(user, resource, action);
  };

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    return AuthService.hasRole(user, roles);
  };

  const canAccess = (resource: string): boolean => {
    return AuthService.canAccess(user, resource);
  };

  const value: AuthContextType = {
    user,
    tenant,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    updateProfile,
    switchTenant,
    hasPermission,
    hasRole,
    canAccess,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar o contexto de autenticação
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

// Hook para verificar permissões
export function usePermissions() {
  const { user, hasPermission, hasRole, canAccess } = useAuth();

  return {
    user,
    hasPermission,
    hasRole,
    canAccess,
    isAdmin: hasRole(['admin', 'admin_master']),
    isAdminMaster: hasRole('admin_master'),
    isClient: hasRole('cliente'),
    isUser: hasRole('usuario'),
  };
}

// Hook para dados do tenant atual
export function useTenant() {
  const { tenant, user } = useAuth();

  const canManageTenant = user?.role === 'admin_master' || user?.role === 'admin';
  const canViewAnalytics = tenant?.settings.features.analytics_enabled && canManageTenant;
  const canManageUsers = canManageTenant;
  const canManageSettings = canManageTenant;

  return {
    tenant,
    canManageTenant,
    canViewAnalytics,
    canManageUsers,
    canManageSettings,
    features: tenant?.settings.features || {},
    limits: tenant?.settings.limits || {},
    branding: tenant?.settings.brand || {},
  };
}

// Componente para proteção de rotas
export function ProtectedRoute({ 
  children, 
  roles, 
  permissions, 
  fallback 
}: {
  children: React.ReactNode;
  roles?: UserRole[];
  permissions?: Array<{ resource: string; action: string }>;
  fallback?: React.ReactNode;
}) {
  const { user, isLoading, hasRole, hasPermission } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!user) {
    return fallback || <div>Acesso negado</div>;
  }

  // Verificar roles
  if (roles && !hasRole(roles)) {
    return fallback || <div>Acesso negado - Role insuficiente</div>;
  }

  // Verificar permissões
  if (permissions && !permissions.every(p => hasPermission(p.resource, p.action))) {
    return fallback || <div>Acesso negado - Permissões insuficientes</div>;
  }

  return <>{children}</>;
}

// Exportações para compatibilidade
export { AuthService };
export type { AuthContextType };

