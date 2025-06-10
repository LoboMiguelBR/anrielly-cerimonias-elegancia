
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  FileText, 
  AlertTriangle, 
  Activity,
  DollarSign,
  Target,
  Clock,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Zap,
  Brain,
  RefreshCw
} from 'lucide-react';
import { useAnalyticsEnhanced } from '@/hooks/useAnalyticsEnhanced';
import { useEventsEnhanced } from '@/hooks/useEventsEnhanced';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuthEnhanced } from '@/hooks/useAuthEnhanced';
import { toast } from 'sonner';

// Interface para métricas do dashboard
interface DashboardMetrics {
  totalRevenue: number;
  monthlyRevenue: number; // Usar monthlyRevenue ao invés de receitaMes
  revenueGrowth: number;
  totalClients: number;
  newClientsThisMonth: number;
  clientsGrowth: number;
  totalEvents: number;
  upcomingEvents: number;
  completedEvents: number;
  totalProposals: number;
  proposalConversionRate: number;
  leadConversionRate: number;
  customerSatisfactionScore: number;
}

// Interface para atividades recentes
interface AtividadeRecente {
  id: string;
  tipo: 'lead' | 'proposal' | 'contract';
  clienteNome: string; // Usar clienteNome ao invés de titulo
  clienteEmail: string;
  data: string; // Usar data ao invés de tempo
  status: string;
  valor?: number;
}

const IntelligentDashboard = () => {
  const { user } = useAuthEnhanced();
  const { metrics, loading: analyticsLoading, refetch: refetchAnalytics } = useAnalyticsEnhanced();
  const { events, loading: eventsLoading, refetch: refetchEvents } = useEventsEnhanced();
  const { notifications, unreadCount } = useNotifications(user?.id);

  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetrics>({
    totalRevenue: 0,
    monthlyRevenue: 0,
    revenueGrowth: 0,
    totalClients: 0,
    newClientsThisMonth: 0,
    clientsGrowth: 0,
    totalEvents: 0,
    upcomingEvents: 0,
    completedEvents: 0,
    totalProposals: 0,
    proposalConversionRate: 0,
    leadConversionRate: 0,
    customerSatisfactionScore: 0,
  });

  const [atividades, setAtividades] = useState<AtividadeRecente[]>([]);
  const [loading, setLoading] = useState(true);

  // Simular dados de atividades recentes baseadas nos eventos
  useEffect(() => {
    if (events.length > 0) {
      const atividadesSimuladas: AtividadeRecente[] = events.slice(0, 5).map((event, index) => ({
        id: event.id,
        tipo: 'lead' as const,
        clienteNome: event.description || `Evento ${event.type}`,
        clienteEmail: 'cliente@exemplo.com',
        data: event.date || new Date().toISOString(),
        status: event.status,
        valor: 5000 + (index * 1000)
      }));
      setAtividades(atividadesSimuladas);
    }
  }, [events]);

  // Atualizar métricas do dashboard
  useEffect(() => {
    if (metrics) {
      setDashboardMetrics({
        totalRevenue: metrics.totalRevenue,
        monthlyRevenue: metrics.monthlyRevenue, // Usar a propriedade correta
        revenueGrowth: metrics.revenueGrowth,
        totalClients: metrics.totalClients,
        newClientsThisMonth: metrics.newClientsThisMonth,
        clientsGrowth: metrics.clientsGrowth,
        totalEvents: metrics.totalEvents,
        upcomingEvents: metrics.upcomingEvents,
        completedEvents: metrics.completedEvents,
        totalProposals: metrics.totalProposals,
        proposalConversionRate: metrics.proposalConversionRate,
        leadConversionRate: metrics.leadConversionRate,
        customerSatisfactionScore: metrics.customerSatisfactionScore,
      });
    }
    setLoading(analyticsLoading || eventsLoading);
  }, [metrics, analyticsLoading, eventsLoading]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const handleRefreshAll = async () => {
    try {
      setLoading(true);
      await Promise.all([
        refetchAnalytics(),
        refetchEvents()
      ]);
      toast.success('Dashboard atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Insights de IA baseados nas métricas
  const getAIInsights = () => {
    const insights = [];
    
    if (dashboardMetrics.revenueGrowth > 10) {
      insights.push({
        type: 'success',
        title: 'Crescimento Excelente',
        message: `Sua receita cresceu ${formatPercentage(dashboardMetrics.revenueGrowth)} este mês!`,
        icon: TrendingUp
      });
    }
    
    if (dashboardMetrics.proposalConversionRate < 30) {
      insights.push({
        type: 'warning',
        title: 'Taxa de Conversão',
        message: 'Considere revisar suas propostas para melhorar a conversão.',
        icon: Target
      });
    }
    
    if (dashboardMetrics.upcomingEvents > 5) {
      insights.push({
        type: 'info',
        title: 'Agenda Movimentada',
        message: `Você tem ${dashboardMetrics.upcomingEvents} eventos próximos.`,
        icon: Calendar
      });
    }

    return insights;
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com ações */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Inteligente</h1>
          <p className="text-gray-600">Insights em tempo real para seu negócio</p>
        </div>
        <Button onClick={handleRefreshAll} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Atualizar
        </Button>
      </div>

      {/* Cards de métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Receita Mensal</p>
                <p className="text-2xl font-bold text-blue-900">
                  {formatCurrency(dashboardMetrics.monthlyRevenue)}
                </p>
                <div className="flex items-center mt-2">
                  <ArrowUp className="h-4 w-4 text-green-600" />
                  <span className="text-green-600 text-sm ml-1">
                    {formatPercentage(dashboardMetrics.revenueGrowth)}
                  </span>
                </div>
              </div>
              <DollarSign className="h-12 w-12 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Novos Clientes</p>
                <p className="text-2xl font-bold text-green-900">
                  {dashboardMetrics.newClientsThisMonth}
                </p>
                <div className="flex items-center mt-2">
                  <ArrowUp className="h-4 w-4 text-green-600" />
                  <span className="text-green-600 text-sm ml-1">
                    {formatPercentage(dashboardMetrics.clientsGrowth)}
                  </span>
                </div>
              </div>
              <Users className="h-12 w-12 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Eventos Próximos</p>
                <p className="text-2xl font-bold text-purple-900">
                  {dashboardMetrics.upcomingEvents}
                </p>
                <p className="text-purple-600 text-sm mt-2">
                  {dashboardMetrics.completedEvents} concluídos
                </p>
              </div>
              <Calendar className="h-12 w-12 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">Taxa Conversão</p>
                <p className="text-2xl font-bold text-orange-900">
                  {formatPercentage(dashboardMetrics.proposalConversionRate)}
                </p>
                <p className="text-orange-600 text-sm mt-2">Propostas</p>
              </div>
              <Target className="h-12 w-12 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights de IA */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            Insights Inteligentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {getAIInsights().map((insight, index) => {
              const Icon = insight.icon;
              return (
                <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-gray-50">
                  <Icon className={`h-5 w-5 mt-1 ${
                    insight.type === 'success' ? 'text-green-600' :
                    insight.type === 'warning' ? 'text-yellow-600' :
                    'text-blue-600'
                  }`} />
                  <div>
                    <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                    <p className="text-sm text-gray-600">{insight.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Atividades Recentes */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            Atividades Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {atividades.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Nenhuma atividade recente</p>
            ) : (
              atividades.map((atividade) => (
                <div key={atividade.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-blue-100">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{atividade.clienteNome}</p>
                      <p className="text-sm text-gray-600">{atividade.clienteEmail}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(atividade.data).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">{atividade.status}</Badge>
                    {atividade.valor && (
                      <p className="text-sm font-medium text-green-600 mt-1">
                        {formatCurrency(atividade.valor)}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Satisfação do Cliente */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Satisfação do Cliente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {dashboardMetrics.customerSatisfactionScore.toFixed(1)}
              </div>
              <p className="text-gray-600">de 5.0</p>
              <Progress 
                value={dashboardMetrics.customerSatisfactionScore * 20} 
                className="mt-4"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-600" />
              Performance do Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Meta de Receita</span>
                <span className="font-semibold">85%</span>
              </div>
              <Progress value={85} />
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Conversão de Leads</span>
                <span className="font-semibold">
                  {formatPercentage(dashboardMetrics.leadConversionRate)}
                </span>
              </div>
              <Progress value={dashboardMetrics.leadConversionRate} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IntelligentDashboard;
