
import React, { useEffect, useState } from 'react';
import { useOptimizedQueries } from '@/hooks/useOptimizedQueries';
import MobileOptimizedLayout from '../mobile/MobileOptimizedLayout';
import MobileStatsGrid from '../mobile/MobileStatsGrid';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MobileFriendlyTable from '@/components/ui/mobile-friendly-table';
import { RefreshCw, Calendar, FileText, Users, DollarSign } from 'lucide-react';

interface DashboardData {
  upcomingEvents: any[];
  recentProposals: any[];
  recentContracts: any[];
  recentClients: any[];
  timestamp: string;
}

const OptimizedDashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { fetchDashboardData } = useOptimizedQueries();

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await fetchDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const stats = [
    {
      title: 'Eventos Próximos',
      value: dashboardData?.upcomingEvents?.length || 0,
      subtitle: 'Próximos 30 dias',
      icon: Calendar,
      color: 'text-blue-600'
    },
    {
      title: 'Propostas Recentes',
      value: dashboardData?.recentProposals?.length || 0,
      subtitle: 'Últimas 5 propostas',
      icon: FileText,
      color: 'text-green-600'
    },
    {
      title: 'Contratos Ativos',
      value: dashboardData?.recentContracts?.length || 0,
      subtitle: 'Em andamento',
      icon: DollarSign,
      color: 'text-purple-600'
    },
    {
      title: 'Novos Clientes',
      value: dashboardData?.recentClients?.length || 0,
      subtitle: 'Últimos 10 dias',
      icon: Users,
      color: 'text-orange-600'
    }
  ];

  const eventsColumns = [
    { key: 'type', label: 'Tipo' },
    { key: 'date', label: 'Data', render: (value: string) => new Date(value).toLocaleDateString() },
    { key: 'status', label: 'Status' }
  ];

  const proposalsColumns = [
    { key: 'id', label: 'ID', render: (value: string) => value.slice(0, 8) },
    { key: 'status', label: 'Status' },
    { key: 'total_price', label: 'Valor', render: (value: number) => `R$ ${value.toLocaleString()}` }
  ];

  return (
    <MobileOptimizedLayout
      title="Dashboard Otimizado"
      actions={
        <Button 
          onClick={loadDashboard}
          disabled={loading}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      }
    >
      {/* Stats */}
      <MobileStatsGrid stats={stats} loading={loading} />

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Próximos Eventos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MobileFriendlyTable
              data={dashboardData?.upcomingEvents || []}
              columns={eventsColumns}
              loading={loading}
              emptyMessage="Nenhum evento próximo"
            />
          </CardContent>
        </Card>

        {/* Recent Proposals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Propostas Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MobileFriendlyTable
              data={dashboardData?.recentProposals || []}
              columns={proposalsColumns}
              loading={loading}
              emptyMessage="Nenhuma proposta recente"
            />
          </CardContent>
        </Card>
      </div>

      {/* Cache info */}
      {dashboardData?.timestamp && (
        <div className="text-xs text-gray-500 text-center">
          Dados atualizados em: {new Date(dashboardData.timestamp).toLocaleString()}
        </div>
      )}
    </MobileOptimizedLayout>
  );
};

export default OptimizedDashboard;
