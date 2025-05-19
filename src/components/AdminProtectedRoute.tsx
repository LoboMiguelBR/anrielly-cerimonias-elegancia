
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
    setIsAuthenticated(!!adminUser);
  }, []);

  // Mostra loading enquanto verifica autenticação
  if (isAuthenticated === null) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }
  
  // Redireciona para login se não estiver autenticado
  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  // Renderiza os componentes filhos se estiver autenticado
  return <>{children}</>;
};

export default AdminProtectedRoute;
