
import React from 'react';
import { useDashboardData } from '@/hooks/useDashboardData';
import DashboardStats from '../dashboard/DashboardStats';
import AIInsights from '../dashboard/AIInsights';
import AlertasOperacionais from '../dashboard/AlertasOperacionais';
import FeedAtividades from '../dashboard/FeedAtividades';
import GraficosBI from '../dashboard/GraficosBI';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useMobileLayout } from '@/hooks/useMobileLayout';

interface DashboardTabProps {
  onNavigate: (tab: string) => void;
}

const DashboardTab: React.FC<DashboardTabProps> = ({ onNavigate }) => {
  const { metrics, alertas, atividades, isLoading, refetchData } = useDashboardData();
  const { isMobile } = useMobileLayout();

  const handleRefresh = () => {
    refetchData();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Dashboard BI</h2>
            <p className="text-gray-600">Inteligência de negócios em tempo real</p>
          </div>
        </div>

        {/* Loading skeleton */}
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-96 bg-gray-200 rounded-lg"></div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard BI</h2>
          <p className="text-gray-600">Inteligência de negócios em tempo real</p>
        </div>
        <Button 
          onClick={handleRefresh}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Atualizar
        </Button>
      </div>

      {/* Stats Cards */}
      <DashboardStats
        quoteRequestsCount={metrics.leadsNovosMes}
        proposalsCount={metrics.orcamentosPendentes}
        galleryCount={0} // Este valor pode vir de outra query se necessário
        testimonialsCount={0} // Este valor pode vir de outra query se necessário
        questionariosCount={0} // Este valor pode vir de outra query se necessário
      />

      {/* Main Content Grid */}
      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'} gap-6`}>
        {/* Left Column - AI Insights and Charts */}
        <div className={`${isMobile ? '' : 'lg:col-span-2'} space-y-6`}>
          {/* AI Insights */}
          <AIInsights metrics={metrics} />
          
          {/* BI Charts */}
          <GraficosBI />
        </div>

        {/* Right Column - Alerts and Activity Feed */}
        <div className="space-y-6">
          {/* Operational Alerts */}
          <AlertasOperacionais 
            alertas={alertas} 
            onRefresh={refetchData}
          />
          
          {/* Recent Activities */}
          <FeedAtividades 
            atividades={atividades}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;
