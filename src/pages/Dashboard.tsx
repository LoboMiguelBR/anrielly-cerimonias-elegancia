
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import DashboardManager from '@/components/admin/dashboards/DashboardManager';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const { profile, loading, signOut, isAuthenticated } = useAuth();

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

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Se for admin, redireciona para /admin
  if (profile?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header simples para usuários não-admin */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Meu Painel
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Olá, {profile?.name || profile?.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <DashboardManager />
      </main>
    </div>
  );
};

export default Dashboard;
