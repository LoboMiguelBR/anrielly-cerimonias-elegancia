
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
        return;
      }
      
      console.log('AdminProtectedRoute: Sessão obtida:', !!data.session);
      const isAuth = !!data.session?.user;
      setIsAuthenticated(isAuth);
      setUser(data.session?.user || null);
      setLastError(null);
      setRetryCount(0);
      
    } catch (error) {
      console.error('AdminProtectedRoute: Erro crítico na verificação:', error);
      setLastError('Erro de conexão');
      setIsAuthenticated(false);
      setUser(null);
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
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('AdminProtectedRoute: Auth state changed:', event, !!session);
      
      // Limpar timeout se auth resolver
      clearTimeout(timeoutId);
      
      setIsAuthenticated(!!session);
      setUser(session?.user || null);
      setLastError(null);
      setRetryCount(0);
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

  console.log('AdminProtectedRoute: Usuário autenticado, renderizando elemento');
  // Renderiza o elemento se estiver autenticado
  return <>{element}</>;
};

export default AdminProtectedRoute;
