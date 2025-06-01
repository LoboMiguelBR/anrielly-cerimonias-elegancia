
import { useAuth } from '@/hooks/useAuth';
import NoivoDashboard from './NoivoDashboard';
import NoivaDashboard from './NoivaDashboard';
import ClienteDashboard from '../../dashboards/ClienteDashboard';
import CerimoniaListaDashboard from './CerimoniaListaDashboard';
import CerimonialistaDashboard from '../../dashboards/CerimonialistaDashboard';
import DashboardSummary from '../DashboardSummary';

const DashboardManager = () => {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>Carregando painel...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return <DashboardSummary />;
  }

  switch (profile.role) {
    case 'noivo':
      return <NoivoDashboard />;
    case 'noiva':
      return <NoivaDashboard />;
    case 'cliente':
      return <ClienteDashboard />;
    case 'cerimonialista':
      return <CerimonialistaDashboard />;
    case 'admin':
      return <DashboardSummary />;
    default:
      return <DashboardSummary />;
  }
};

export default DashboardManager;
