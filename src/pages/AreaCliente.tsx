
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import ClienteDashboard from '@/components/dashboards/ClienteDashboard';

const AreaCliente = () => {
  const { isAuthenticated, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>Carregando área do cliente...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth?redirect=area-cliente" replace />;
  }

  // Só permite acesso a clientes, noivos e noivas
  if (profile && !['cliente', 'noivo', 'noiva'].includes(profile.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <ClienteDashboard />;
};

export default AreaCliente;
