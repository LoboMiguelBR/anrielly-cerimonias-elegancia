import { useParams, Navigate } from 'react-router-dom';
import { useClientPortalAuth } from '@/hooks/client-portal/useClientPortalAuth';
import { ClientPortalLogin } from '@/components/client-portal/ClientPortalLogin';
import { ClientPortalDashboard } from '@/components/client-portal/ClientPortalDashboard';
import { Loader2 } from 'lucide-react';

export const ClientPortal = () => {
  const { token } = useParams<{ token: string }>();
  const { session, loading, isAuthenticated } = useClientPortalAuth();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Carregando portal do cliente...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <ClientPortalLogin token={token} />;
  }

  return <ClientPortalDashboard />;
};