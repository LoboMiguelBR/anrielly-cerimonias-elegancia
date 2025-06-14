
import { ReactNode, useEffect, useState } from 'react';
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
  
  const checkAuth = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('AdminProtectedRoute: Erro ao verificar sessão:', error);
        setIsAuthenticated(false);
        setUser(null);
        setUserRole(null);
        return;
      }
      
      const isAuth = !!data.session?.user;
      setIsAuthenticated(isAuth);
      setUser(data.session?.user || null);
      
      if (isAuth && data.session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.session.user.id)
          .maybeSingle();
        
        setUserRole(profile?.role || null);
      }
      
    } catch (error) {
      console.error('AdminProtectedRoute: Erro crítico na verificação:', error);
      setIsAuthenticated(false);
      setUser(null);
      setUserRole(null);
    }
  };
  
  useEffect(() => {
    checkAuth();
    
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setIsAuthenticated(!!session);
      setUser(session?.user || null);
      
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .maybeSingle();
        
        setUserRole(profile?.role || null);
      } else {
        setUserRole(null);
      }
    });
    
    return () => authListener.subscription.unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Verificando autenticação...
          </h3>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (userRole === null) {
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
            Não foi possível encontrar seu perfil de usuário.
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

  if (userRole !== 'admin') {
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
            Você não tem permissão para acessar esta área.
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

  return <>{element}</>;
};

export default AdminProtectedRoute;
