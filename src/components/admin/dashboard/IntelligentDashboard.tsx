
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  FileText, 
  DollarSign, 
  Target,
  Heart,
  Star,
  Clock,
  CheckCircle
} from "lucide-react";
import { useAuthEnhanced } from '@/hooks/useAuthEnhanced';
import { useAnalyticsEnhanced } from '@/hooks/useAnalyticsEnhanced';

const IntelligentDashboard = () => {
  const { user } = useAuthEnhanced();
  const { metrics, loading } = useAnalyticsEnhanced();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const renderAdminMasterDashboard = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard Executivo</h2>
        <p className="text-gray-600">Visão completa do negócio e performance geral</p>
      </div>

      {/* KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {metrics.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{metrics.revenueGrowth}% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalClients}</div>
            <p className="text-xs text-muted-foreground">
              +{metrics.newClientsThisMonth} novos este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eventos Próximos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.upcomingEvents}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.completedEvents} concluídos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.proposalConversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Propostas → Contratos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Métricas Avançadas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Gestão de Fornecedores</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Total de Fornecedores</span>
              <Badge variant="secondary">{metrics.totalSuppliers || 0}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Fornecedores Verificados</span>
              <Badge variant="outline">{metrics.verifiedSuppliers || 0}/{metrics.totalSuppliers || 0}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Satisfação Média</span>
              <Badge variant="default">{metrics.supplierSatisfaction || 0}/5 ⭐</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Comercial</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Contratos Este Mês</span>
              <Badge variant="secondary">{metrics.contractsThisMonth || 0}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Propostas Este Mês</span>
              <Badge variant="outline">{metrics.proposalsThisMonth || 0}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Receita Mensal</span>
              <Badge variant="default">R$ {metrics.monthlyRevenue.toLocaleString()}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderAdminDashboard = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard Operacional</h2>
        <p className="text-gray-600">Gestão de eventos e relacionamento com clientes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximos Eventos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.upcomingEvents}</div>
            <p className="text-xs text-muted-foreground">Requerem atenção</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalClients}</div>
            <p className="text-xs text-muted-foreground">
              +{metrics.newClientsThisMonth} novos este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Propostas Pendentes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.proposalsThisMonth || 0}</div>
            <p className="text-xs text-muted-foreground">Aguardando resposta</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderClienteDashboard = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Meu Dashboard</h2>
        <p className="text-gray-600">Acompanhe seus eventos e serviços</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meus Eventos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.upcomingEvents}</div>
            <p className="text-xs text-muted-foreground">Próximos eventos agendados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliação</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.9</div>
            <p className="text-xs text-muted-foreground">Sua nota média</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderUsuarioDashboard = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Bem-vindo!</h2>
        <p className="text-gray-600">Seu evento dos sonhos começa aqui</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meu Evento</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">Em Planejamento</div>
            <p className="text-xs text-muted-foreground">Status atual</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progresso</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">65%</div>
            <p className="text-xs text-muted-foreground">Etapas concluídas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próxima Tarefa</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">Escolher buffet</div>
            <p className="text-xs text-muted-foreground">Pendente</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Determinar qual dashboard exibir baseado no role do usuário
  const renderDashboard = () => {
    switch (user?.role) {
      case 'admin_master':
        return renderAdminMasterDashboard();
      case 'admin':
        return renderAdminDashboard();
      case 'cliente':
        return renderClienteDashboard();
      case 'usuario':
        return renderUsuarioDashboard();
      default:
        return renderUsuarioDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-6">
      {renderDashboard()}
    </div>
  );
};

export default IntelligentDashboard;
