
import { useAuth } from '@/hooks/useAuth';
import NoivoDashboard from './NoivoDashboard';
import NoivaDashboard from './NoivaDashboard';
import ClienteDashboard from '../../dashboards/ClienteDashboard';
import CerimoniaListaDashboard from './CerimoniaListaDashboard';
import CerimonialistaDashboard from '../../dashboards/CerimonialistaDashboard';
import DashboardTab from '../tabs/DashboardTab';

const DashboardManager = () => {
  const { profile, loading } = useAuth();

  console.log('DashboardManager - Profile:', profile);

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
    return <DashboardTab onNavigate={() => {}} />;
  }

  switch (profile.role) {
    case 'admin':
      return <DashboardTab onNavigate={() => {}} />;
    case 'noivo':
      return <NoivoDashboard />;
    case 'noiva':
      return <NoivaDashboard />;
    case 'cliente':
      return <ClienteDashboard />;
    case 'cerimonialista':
      return <CerimonialistaDashboard />;
    default:
      return <DashboardTab onNavigate={() => {}} />;
  }
};

export default DashboardManager;
