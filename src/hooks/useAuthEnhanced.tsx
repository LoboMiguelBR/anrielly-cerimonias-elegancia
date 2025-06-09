
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  UserProfile, 
  Tenant, 
  AuthContext, 
  SignUpData, 
  UserRole 
} from '@/types/auth';

const AuthContextComponent = createContext<AuthContext | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Carregar dados do usuário e tenant
  const loadUserData = async (userId: string) => {
    try {
      // Buscar perfil do usuário
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Erro ao carregar perfil:', profileError);
        return;
      }

      // Transformar dados para o formato esperado
      const userProfile: UserProfile = {
        id: profileData.id,
        tenant_id: profileData.tenant_id || 'default',
        email: profileData.email,
        role: profileData.role as UserRole,
        status: 'active',
        first_name: profileData.name?.split(' ')[0] || '',
        last_name: profileData.name?.split(' ').slice(1).join(' ') || '',
        full_name: profileData.name || profileData.email,
        avatar_url: profileData.avatar_url,
        phone: profileData.phone,
        profile_data: null,
        permissions: [],
        last_login_at: new Date().toISOString(),
        email_verified_at: new Date().toISOString(),
        created_at: profileData.created_at,
        updated_at: profileData.updated_at
      };

      setUser(userProfile);

      // Buscar dados do tenant (por enquanto usar dados mock)
      const mockTenant: Tenant = {
        id: userProfile.tenant_id,
        name: 'Anrielly Gomes Cerimonialista',
        slug: 'anrielly-gomes',
        status: 'active',
        subscription_plan: 'premium',
        subscription_status: 'active',
        settings: {
          brand: {
            name: 'Anrielly Gomes Cerimonialista',
            primary_color: '#8B5CF6',
            secondary_color: '#EC4899',
          },
          contact: {
            email: 'contato@anriellygomes.com',
            phone: '(11) 99999-9999',
            address: 'São Paulo, SP',
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
            max_users: 50,
            max_storage_gb: 10,
          },
        },
        billing_info: {
          company_name: 'Anrielly Gomes Cerimonialista',
          tax_id: '00.000.000/0001-00',
          billing_email: 'financeiro@anriellygomes.com',
          billing_address: 'São Paulo, SP',
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setTenant(mockTenant);
      setIsAuthenticated(true);

    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
      toast.error('Erro ao carregar dados do usuário');
    } finally {
      setIsLoading(false);
    }
  };

  // Configurar listener de autenticação
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, !!session);
        
        if (session?.user) {
          await loadUserData(session.user.id);
        } else {
          setUser(null);
          setTenant(null);
          setIsAuthenticated(false);
          setIsLoading(false);
        }
      }
    );

    // Verificar sessão existente
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserData(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Métodos de autenticação
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success('Login realizado com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer login');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (data: SignUpData) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: `${data.first_name} ${data.last_name}`,
            role: data.role,
          }
        }
      });

      if (error) throw error;

      toast.success('Conta criada com sucesso! Verifique seu email.');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar conta');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setTenant(null);
      setIsAuthenticated(false);
      toast.success('Logout realizado com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer logout');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: data.full_name,
          phone: data.phone,
          avatar_url: data.avatar_url,
        })
        .eq('id', user.id);

      if (error) throw error;

      setUser({ ...user, ...data });
      toast.success('Perfil atualizado com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao atualizar perfil');
      throw error;
    }
  };

  const switchTenant = async (tenantId: string) => {
    // Implementação futura para multi-tenant
    console.log('Switch tenant:', tenantId);
  };

  // Verificações de permissão
  const hasPermission = (resource: string, action: string): boolean => {
    if (!user) return false;
    
    // Admin master tem todas as permissões
    if (user.role === 'admin_master') return true;
    
    // Admin tem permissões básicas
    if (user.role === 'admin') {
      return ['read', 'create', 'update'].includes(action);
    }
    
    // Outros roles têm permissões limitadas
    return action === 'read';
  };

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  const canAccess = (resource: string): boolean => {
    return hasPermission(resource, 'read');
  };

  const value: AuthContext = {
    user,
    tenant,
    isLoading,
    isAuthenticated,
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
    <AuthContextComponent.Provider value={value}>
      {children}
    </AuthContextComponent.Provider>
  );
};

export const useAuthEnhanced = (): AuthContext => {
  const context = useContext(AuthContextComponent);
  if (context === undefined) {
    throw new Error('useAuthEnhanced must be used within an AuthProvider');
  }
  return context;
};
