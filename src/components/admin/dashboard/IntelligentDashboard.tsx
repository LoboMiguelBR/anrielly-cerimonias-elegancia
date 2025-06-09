
import React from 'react';
import { useAuthEnhanced } from '@/hooks/useAuthEnhanced';
import { useAnalyticsEnhanced } from '@/hooks/useAnalyticsEnhanced';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  Calendar, 
  DollarSign, 
  FileText, 
  TrendingUp, 
  Star,
  Building,
  Target
} from "lucide-react";

const AdminMasterDashboard = () => {
  const { metrics, analyticsData } = useAnalyticsEnhanced();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {metrics?.total_revenue.toLocaleString('pt-BR') || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              +{metrics?.revenue_growth.toFixed(1) || '0'}% desde o mês passado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.total_clients || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{metrics?.new_clients_this_month || 0} novos este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eventos Ativos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.upcoming_events || 0}</div>
            <p className="text-xs text-muted-foreground">
              {metrics?.completed_events || 0} concluídos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.proposal_conversion_rate.toFixed(1) || '0'}%
            </div>
            <p className="text-xs text-muted-foreground">
              Propostas → Contratos
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Fornecedores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total</span>
                <span className="font-semibold">{metrics?.total_suppliers || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Verificados</span>
                <span className="font-semibold text-green-600">{metrics?.verified_suppliers || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Satisfação Média</span>
                <span className="font-semibold">{metrics?.supplier_satisfaction || 0}/5</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance do Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Novos Contratos</span>
                <span className="font-semibold">{metrics?.contracts_this_month || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Propostas Enviadas</span>
                <span className="font-semibold">{metrics?.proposals_this_month || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Receita Mensal</span>
                <span className="font-semibold">R$ {metrics?.monthly_revenue.toLocaleString('pt-BR') || '0'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const { metrics } = useAnalyticsEnhanced();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eventos Próximos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.upcoming_events || 0}</div>
            <p className="text-xs text-muted-foreground">
              Próximos 30 dias
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.total_clients || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{metrics?.new_clients_this_month || 0} este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Propostas Pendentes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.proposals_this_month || 0}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando resposta
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tarefas Prioritárias</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <span>Revisar propostas pendentes</span>
              <span className="text-orange-600 font-semibold">Alta</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span>Confirmar fornecedores para eventos</span>
              <span className="text-blue-600 font-semibold">Média</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span>Atualizar cronograma de eventos</span>
              <span className="text-green-600 font-semibold">Baixa</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ClienteDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meus Serviços</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              Serviços ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliação Média</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <p className="text-xs text-muted-foreground">
              Baseado em 24 avaliações
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cotações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-semibold">Casamento - Maria e João</p>
                <p className="text-sm text-gray-600">Solicitado há 2 dias</p>
              </div>
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">Pendente</span>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-semibold">Aniversário - Ana Silva</p>
                <p className="text-sm text-gray-600">Solicitado há 5 dias</p>
              </div>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Aceita</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const UsuarioDashboard = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Meu Evento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Data do Evento</span>
              <span className="font-semibold">15 de Julho, 2024</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Dias Restantes</span>
              <span className="font-semibold text-purple-600">89 dias</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Progresso do Planejamento</span>
              <span className="font-semibold">75%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Próximas Tarefas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <input type="checkbox" className="rounded" />
              <span>Confirmar lista de convidados</span>
            </div>
            <div className="flex items-center space-x-3">
              <input type="checkbox" className="rounded" checked />
              <span className="line-through text-gray-500">Escolher decoração</span>
            </div>
            <div className="flex items-center space-x-3">
              <input type="checkbox" className="rounded" />
              <span>Definir cardápio</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const IntelligentDashboard = () => {
  const { user } = useAuthEnhanced();

  const renderDashboard = () => {
    switch (user?.role) {
      case 'admin_master':
        return <AdminMasterDashboard />;
      case 'admin':
        return <AdminDashboard />;
      case 'cliente':
        return <ClienteDashboard />;
      case 'usuario':
        return <UsuarioDashboard />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          Dashboard {user?.role === 'admin_master' ? 'Master' : user?.role === 'admin' ? 'Administrativo' : 'Personalizado'}
        </h2>
        <p className="text-muted-foreground">
          Bem-vindo, {user?.full_name || user?.email}!
        </p>
      </div>
      
      {renderDashboard()}
    </div>
  );
};

export default IntelligentDashboard;
