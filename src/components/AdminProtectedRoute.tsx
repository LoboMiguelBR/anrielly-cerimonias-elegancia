
import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

interface AdminProtectedRouteProps {
  children: ReactNode;
}

const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  useEffect(() => {
    // Verificar se o usuário está autenticado
    const adminUser = localStorage.getItem('adminUser');
    // Lista de usuários permitidos
    const allowedUsers = ['anrielly@yahoo.com.br', 'miguel.d.s.lobo@gmail.com'];
    
    // Verificar se o usuário está na lista de permitidos
    setIsAuthenticated(!!adminUser && allowedUsers.includes(adminUser));
  }, []);

  // Mostra loading enquanto verifica autenticação
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }
  
  // Redireciona para login se não estiver autenticado
  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  // Renderiza os componentes filhos se estiver autenticado
  return <>{children}</>;
};

export default AdminProtectedRoute;
