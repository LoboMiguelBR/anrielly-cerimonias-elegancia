import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign, 
  Brain, 
  AlertTriangle,
  Clock,
  CheckCircle,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useAuthEnhanced } from '@/hooks/useAuthEnhanced';

const IntelligentDashboard = () => {
  const { user, hasRole } = useAuthEnhanced();
  const { metrics, alertas, atividades, isLoading } = useDashboardData();

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

  // Render different content based on user role
  if (hasRole('admin') || hasRole('admin_master')) {
    return (
      <div className="space-y-6">
        {/* Admin Dashboard Content */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Dashboard Administrativo</h2>
            <p className="text-gray-600">Visão geral completa do negócio</p>
          </div>
          <Badge variant="secondary">Modo Admin</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.leadsNovosMes || 0}</div>
              <p className="text-xs text-muted-foreground">
                +20% em relação ao mês passado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Propostas</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.orcamentosPendentes || 0}</div>
              <p className="text-xs text-muted-foreground">
                Pendentes de aprovação
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita do Mês</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {(metrics.receitaMes || 0).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +15% em relação ao mês passado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.taxaConversao || 0}%</div>
              <p className="text-xs text-muted-foreground">
                Meta: 25%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                Insights de IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-semibold text-blue-900">Oportunidade Identificada</h4>
                  <p className="text-blue-800 text-sm mt-1">
                    Aumento de 30% em consultas para casamentos em dezembro. 
                    Considere criar uma promoção específica.
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <h4 className="font-semibold text-green-900">Performance Positiva</h4>
                  <p className="text-green-800 text-sm mt-1">
                    Sua taxa de conversão está 15% acima da média do setor.
                  </p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                  <h4 className="font-semibold text-orange-900">Ação Recomendada</h4>
                  <p className="text-orange-800 text-sm mt-1">
                    3 propostas estão próximas do vencimento. Considere fazer follow-up.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-600" />
                Atividades Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {atividades.slice(0, 5).map((atividade, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{atividade.titulo}</p>
                      <p className="text-xs text-gray-500">{atividade.tempo}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Cliente dashboard
  if (hasRole('cliente')) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Meu Painel</h2>
            <p className="text-gray-600">Acompanhe o andamento do seu evento</p>
          </div>
          <Badge variant="outline">Cliente</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Próximo Evento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold">Casamento Maria & João</div>
              <p className="text-sm text-gray-600">15 de Janeiro, 2024</p>
              <div className="mt-2">
                <Badge variant="secondary">Em Planejamento</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Progresso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">75%</div>
              <p className="text-sm text-gray-600">Tarefas concluídas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Próxima Reunião
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold">Prova do Cardápio</div>
              <p className="text-sm text-gray-600">Amanhã, 14:00</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Default fallback
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <p className="text-gray-600">Bem-vindo ao sistema</p>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-600">
            Carregando informações do dashboard...
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntelligentDashboard;
