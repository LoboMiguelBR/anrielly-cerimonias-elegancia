import { ReactNode, useEffect, useState, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { User } from '@supabase/supabase-js';

interface AdminProtectedRouteProps {
  element: ReactNode;
}

const AdminProtectedRoute = ({ element }: AdminProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [lastError, setLastError] = useState<string | null>(null);
  
  const checkAuth = useCallback(async () => {
    try {
      console.log('AdminProtectedRoute: Verificando autenticação...');
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('AdminProtectedRoute: Erro ao verificar sessão:', error);
        setLastError(error.message);
        
        // Se houver erro de rede e ainda temos tentativas, retry
        if (retryCount < 3 && (error.message.includes('fetch') || error.message.includes('network'))) {
          console.log(`AdminProtectedRoute: Tentativa ${retryCount + 1} de 3`);
          setRetryCount(prev => prev + 1);
          setTimeout(checkAuth, 2000);
          return;
        }
        
        setIsAuthenticated(false);
        setUser(null);
        setUserRole(null);
        return;
      }
      
      console.log('AdminProtectedRoute: Sessão obtida:', !!data.session);
      const isAuth = !!data.session?.user;
      setIsAuthenticated(isAuth);
      setUser(data.session?.user || null);
      
      // Verificar role do usuário se autenticado
      if (isAuth && data.session?.user) {
        try {
          // TROCA DE .single() por .maybeSingle()
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.session.user.id)
            .maybeSingle();

          if (profileError) {
            console.error('Erro ao buscar perfil:', profileError);
            setUserRole(null);
          } else if (!profile) {
            console.warn('Perfil do usuário não encontrado.');
            setUserRole(null);
          } else {
            console.log('Role do usuário:', profile?.role);
            setUserRole(profile?.role || null);
          }
        } catch (profileErr) {
          console.error('Erro ao verificar role:', profileErr);
          setUserRole(null);
        }
      }
      
      setLastError(null);
      setRetryCount(0);
      
    } catch (error) {
      console.error('AdminProtectedRoute: Erro crítico na verificação:', error);
      setLastError('Erro de conexão');
      setIsAuthenticated(false);
      setUser(null);
      setUserRole(null);
    }
  }, [retryCount]);
  
  useEffect(() => {
    // Timeout para evitar loading infinito
    const timeoutId = setTimeout(() => {
      if (isAuthenticated === null) {
        console.warn('AdminProtectedRoute: Timeout na verificação de auth');
        setIsAuthenticated(false);
        setLastError('Timeout na verificação de autenticação');
      }
    }, 10000);
    
    checkAuth();
    
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('AdminProtectedRoute: Auth state changed:', event, !!session);
      
      // Limpar timeout se auth resolver
      clearTimeout(timeoutId);
      
      setIsAuthenticated(!!session);
      setUser(session?.user || null);
      setLastError(null);
      setRetryCount(0);
      
      // Verificar role quando a sessão mudar
      if (session?.user) {
        try {
          // TROCA DE .single() por .maybeSingle() aqui TAMBÉM
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .maybeSingle();
          
          if (!profileError && profile) {
            setUserRole(profile.role);
          } else if (!profile) {
            setUserRole(null);
            console.warn('Perfil do usuário não encontrado ao atualizar sessão.');
          } else {
            setUserRole(null);
          }
        } catch (err) {
          console.error('Erro ao verificar role no listener:', err);
          setUserRole(null);
        }
      } else {
        setUserRole(null);
      }
    });
    
    return () => {
      clearTimeout(timeoutId);
      authListener.subscription.unsubscribe();
    };
  }, [checkAuth]);

  // Loading state com informações de debug
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Verificando autenticação...
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Aguarde enquanto validamos sua sessão
          </p>
          
          {retryCount > 0 && (
            <p className="text-orange-600 text-sm">
              Tentativa {retryCount} de 3...
            </p>
          )}
          
          {lastError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">
                Erro: {lastError}
              </p>
              <button 
                onClick={() => {
                  setRetryCount(0);
                  setLastError(null);
                  checkAuth();
                }}
                className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
              >
                Tentar novamente
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // Redireciona para login se não estiver autenticado
  if (!isAuthenticated || !user) {
    console.log('AdminProtectedRoute: Redirecionando para login');
    return <Navigate to="/admin/login" replace />;
  }

  // NOVA MENSAGEM: Usuário autenticado mas sem perfil
  if (isAuthenticated && user && userRole === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-yellow-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Perfil não encontrado
          </h3>
          <p className="text-gray-600 text-sm">
            Não foi possível encontrar seu perfil de usuário. Por favor, entre em contato com o suporte ou tente novamente.
          </p>
          <button 
            onClick={() => window.location.href = '/admin/login'}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Voltar ao Login
          </button>
        </div>
      </div>
    );
  }

  // Verificar se é admin
  if (userRole && userRole !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Acesso Negado
          </h3>
          <p className="text-gray-600 text-sm">
            Você não tem permissão para acessar esta área. Apenas administradores podem acessar o painel admin.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Voltar ao Site
          </button>
        </div>
      </div>
    );
  }

  console.log('AdminProtectedRoute: Usuário admin autenticado, renderizando elemento');
  // Renderiza o elemento se estiver autenticado e for admin
  return <>{element}</>;
};

export default AdminProtectedRoute;
