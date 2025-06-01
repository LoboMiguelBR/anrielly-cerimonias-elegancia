
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import CerimonialistaDashboard from '@/components/dashboards/CerimonialistaDashboard';

const AreaProfissional = () => {
  const { isAuthenticated, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>Carregando área do profissional...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth?redirect=area-profissional" replace />;
  }

  // Só permite acesso a cerimonialistas
  if (profile && profile.role !== 'cerimonialista') {
    return <Navigate to="/dashboard" replace />;
  }

  return <CerimonialistaDashboard />;
};

export default AreaProfissional;
