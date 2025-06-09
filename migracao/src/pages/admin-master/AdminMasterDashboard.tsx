import React from 'react';
import { useFinancialOverview } from '@/hooks/useFinancialSystem';
import { useSystemHealth } from '@/hooks/useSystemMonitoring';
import { useTenants } from '@/hooks/useTenants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  DollarSign, 
  Users, 
  Activity,
  TrendingUp,
  TrendingDown,
  Server,
  AlertTriangle,
  CheckCircle,
  Calendar,
  CreditCard,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

// Dashboard principal do Admin Master
export function AdminMasterDashboard() {
  const { overview: financialOverview, isLoading: financialLoading } = useFinancialOverview();
  const { health, isLoading: healthLoading } = useSystemHealth();
  const { tenants, isLoading: tenantsLoading } = useTenants({ limit: 10 });

  // Dados simulados para gráficos
  const revenueData = [
    { month: 'Jan', revenue: 12000, tenants: 15 },
    { month: 'Fev', revenue: 15000, tenants: 18 },
    { month: 'Mar', revenue: 18000, tenants: 22 },
    { month: 'Abr', revenue: 22000, tenants: 28 },
    { month: 'Mai', revenue: 25000, tenants: 32 },
    { month: 'Jun', revenue: 28000, tenants: 35 },
  ];

  const tenantsByPlan = [
    { name: 'Básico', value: 15, color: '#8B5CF6' },
    { name: 'Premium', value: 12, color: '#3B82F6' },
    { name: 'Enterprise', value: 8, color: '#10B981' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Admin Master</h1>
          <p className="text-muted-foreground">
            Visão geral completa do sistema e todos os tenants
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" asChild>
            <Link to="/admin-master/tenants">
              <Building2 className="mr-2 h-4 w-4" />
              Gerenciar Tenants
            </Link>
          </Button>
          <Button asChild>
            <Link to="/admin-master/financial">
              <DollarSign className="mr-2 h-4 w-4" />
              Sistema Financeiro
            </Link>
          </Button>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {financialLoading ? '...' : `R$ ${financialOverview?.total_revenue.toLocaleString('pt-BR') || '0'}`}
            </div>
            <p className="text-xs text-muted-foreground">
              {financialOverview?.revenue_growth && financialOverview.revenue_growth > 0 ? (
                <span className="text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{financialOverview.revenue_growth.toFixed(1)}% este mês
                </span>
              ) : (
                <span className="text-red-600 flex items-center">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  {financialOverview?.revenue_growth?.toFixed(1) || '0'}% este mês
                </span>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Tenants</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tenantsLoading ? '...' : tenants.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {tenants.filter(t => t.status === 'active').length} ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assinaturas Ativas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {financialLoading ? '...' : financialOverview?.active_subscriptions || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              {financialOverview?.trial_subscriptions || 0} em trial
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status do Sistema</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {healthLoading ? (
                <div className="text-sm">Carregando...</div>
              ) : (
                <>
                  {health?.status === 'healthy' ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  )}
                  <span className="text-sm font-medium">
                    {health?.status === 'healthy' ? 'Saudável' : 'Problema'}
                  </span>
                </>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {health?.response_time?.toFixed(0) || 0}ms resposta
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos e Tabelas */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Evolução da Receita</CardTitle>
            <CardDescription>
              Receita e crescimento de tenants nos últimos 6 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any, name: string) => [
                    name === 'revenue' ? `R$ ${value.toLocaleString('pt-BR')}` : value,
                    name === 'revenue' ? 'Receita' : 'Tenants'
                  ]}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8B5CF6" 
                  fill="#8B5CF6" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Plano</CardTitle>
            <CardDescription>
              Tenants por tipo de assinatura
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tenantsByPlan.map((plan) => (
                <div key={plan.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: plan.color }}
                    ></div>
                    <span className="text-sm font-medium">{plan.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{plan.value}</span>
                    <Badge variant="outline">
                      {((plan.value / tenantsByPlan.reduce((acc, p) => acc + p.value, 0)) * 100).toFixed(0)}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tenants Recentes e Alertas */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Tenants Recentes</CardTitle>
                <CardDescription>
                  Últimos tenants cadastrados no sistema
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin-master/tenants">
                  Ver todos
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tenants.slice(0, 5).map((tenant) => (
                <div key={tenant.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Building2 className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{tenant.name}</p>
                      <p className="text-xs text-muted-foreground">{tenant.slug}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={tenant.status === 'active' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {tenant.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(tenant.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Métricas de Performance</CardTitle>
                <CardDescription>
                  Indicadores de saúde do sistema
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin-master/monitoring">
                  Ver detalhes
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Tempo de Resposta</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{health?.response_time?.toFixed(0) || 0}ms</span>
                  {health?.response_time && health.response_time < 100 ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Taxa de Erro</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{health?.error_rate?.toFixed(1) || 0}%</span>
                  {health?.error_rate && health.error_rate < 1 ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Uso de CPU</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{health?.cpu_usage?.toFixed(1) || 0}%</span>
                  {health?.cpu_usage && health.cpu_usage < 70 ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Uso de Memória</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{health?.memory_usage?.toFixed(1) || 0}%</span>
                  {health?.memory_usage && health.memory_usage < 80 ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>
            Acesso rápido às principais funcionalidades
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link to="/admin-master/tenants/new">
                <Building2 className="h-6 w-6 mb-2" />
                Novo Tenant
              </Link>
            </Button>
            
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link to="/admin-master/financial/subscriptions">
                <CreditCard className="h-6 w-6 mb-2" />
                Assinaturas
              </Link>
            </Button>
            
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link to="/admin-master/monitoring/logs">
                <Activity className="h-6 w-6 mb-2" />
                Logs do Sistema
              </Link>
            </Button>
            
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link to="/admin-master/financial/analytics">
                <BarChart3 className="h-6 w-6 mb-2" />
                Analytics
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminMasterDashboard;

