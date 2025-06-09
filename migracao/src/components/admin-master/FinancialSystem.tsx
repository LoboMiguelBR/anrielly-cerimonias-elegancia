import React, { useState } from 'react';
import { 
  useFinancialOverview, 
  useRevenueData, 
  useSubscriptions, 
  usePayments, 
  useInvoices,
  useSubscriptionPlans
} from '@/hooks/useFinancialSystem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Users, 
  CreditCard, 
  FileText, 
  Calendar,
  Download,
  Filter,
  Search,
  BarChart3,
  PieChart,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Componente principal do sistema financeiro
export function FinancialSystem() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  
  const { overview, isLoading: overviewLoading } = useFinancialOverview();
  const { revenueData, isLoading: revenueLoading } = useRevenueData(selectedPeriod);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sistema Financeiro</h1>
          <p className="text-muted-foreground">
            Controle financeiro completo e analytics de receita
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={selectedPeriod} onValueChange={(value: any) => setSelectedPeriod(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Semana</SelectItem>
              <SelectItem value="month">Mês</SelectItem>
              <SelectItem value="year">Ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
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
              {overviewLoading ? '...' : `R$ ${overview?.total_revenue.toLocaleString('pt-BR') || '0'}`}
            </div>
            <p className="text-xs text-muted-foreground">
              {overview?.revenue_growth && overview.revenue_growth > 0 ? (
                <span className="text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{overview.revenue_growth.toFixed(1)}% este mês
                </span>
              ) : (
                <span className="text-red-600 flex items-center">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  {overview?.revenue_growth?.toFixed(1) || '0'}% este mês
                </span>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overviewLoading ? '...' : `R$ ${overview?.monthly_revenue.toLocaleString('pt-BR') || '0'}`}
            </div>
            <p className="text-xs text-muted-foreground">
              Receita recorrente mensal
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
              {overviewLoading ? '...' : overview?.active_subscriptions || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              {overview?.trial_subscriptions || 0} em trial
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Churn</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overviewLoading ? '...' : `${overview?.churn_rate.toFixed(1) || '0'}%`}
            </div>
            <p className="text-xs text-muted-foreground">
              {overview?.cancelled_subscriptions || 0} cancelamentos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos e Tabelas */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="subscriptions">Assinaturas</TabsTrigger>
          <TabsTrigger value="payments">Pagamentos</TabsTrigger>
          <TabsTrigger value="invoices">Faturas</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Evolução da Receita</CardTitle>
                <CardDescription>
                  Receita ao longo do tempo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: any) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Receita']}
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
                <CardTitle>Distribuição de Planos</CardTitle>
                <CardDescription>
                  Assinaturas por plano
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                      <span className="text-sm">Básico</span>
                    </div>
                    <span className="text-sm font-medium">
                      {overview?.plans_distribution?.basic || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Premium</span>
                    </div>
                    <span className="text-sm font-medium">
                      {overview?.plans_distribution?.premium || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-sm">Enterprise</span>
                    </div>
                    <span className="text-sm font-medium">
                      {overview?.plans_distribution?.enterprise || 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">ARPU</CardTitle>
                <CardDescription>Receita média por usuário</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  R$ {overview?.average_revenue_per_user.toFixed(2) || '0,00'}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">LTV</CardTitle>
                <CardDescription>Valor de vida do cliente</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  R$ {overview?.lifetime_value.toFixed(2) || '0,00'}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Conversão</CardTitle>
                <CardDescription>Taxa de conversão trial → pago</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {overview?.conversion_rate.toFixed(1) || '0'}%
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-4">
          <SubscriptionsTable />
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <PaymentsTable />
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          <InvoicesTable />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <FinancialAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Componente de tabela de assinaturas
function SubscriptionsTable() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');

  const filters = {
    status: statusFilter !== 'all' ? statusFilter : undefined,
    plan_id: planFilter !== 'all' ? planFilter : undefined,
    limit: 50,
  };

  const { subscriptions, isLoading } = useSubscriptions(filters);
  const { plans } = useSubscriptionPlans();

  const getStatusBadge = (status: string) => {
    const variants = {
      active: { variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' },
      trialing: { variant: 'secondary' as const, icon: Clock, color: 'text-blue-600' },
      past_due: { variant: 'destructive' as const, icon: AlertCircle, color: 'text-orange-600' },
      cancelled: { variant: 'outline' as const, icon: XCircle, color: 'text-gray-600' },
      unpaid: { variant: 'destructive' as const, icon: XCircle, color: 'text-red-600' },
    };

    const config = variants[status as keyof typeof variants] || variants.cancelled;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className={`h-3 w-3 ${config.color}`} />
        {status === 'active' && 'Ativa'}
        {status === 'trialing' && 'Trial'}
        {status === 'past_due' && 'Vencida'}
        {status === 'cancelled' && 'Cancelada'}
        {status === 'unpaid' && 'Não Paga'}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Assinaturas</CardTitle>
            <CardDescription>
              Gestão de todas as assinaturas do sistema
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Ativa</SelectItem>
                <SelectItem value="trialing">Trial</SelectItem>
                <SelectItem value="past_due">Vencida</SelectItem>
                <SelectItem value="cancelled">Cancelada</SelectItem>
              </SelectContent>
            </Select>
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Plano" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {plans.map(plan => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {plan.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tenant</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Período Atual</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Criado em</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.map((subscription) => (
                <TableRow key={subscription.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{subscription.tenant?.name}</div>
                      <div className="text-sm text-muted-foreground">{subscription.tenant?.slug}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {subscription.plan?.name}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(subscription.status)}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{new Date(subscription.current_period_start).toLocaleDateString('pt-BR')}</div>
                      <div className="text-muted-foreground">
                        até {new Date(subscription.current_period_end).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      R$ {subscription.plan?.price.toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      /{subscription.plan?.interval === 'monthly' ? 'mês' : 'ano'}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(subscription.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

// Componente de tabela de pagamentos
function PaymentsTable() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const filters = {
    status: statusFilter !== 'all' ? statusFilter : undefined,
    limit: 50,
  };

  const { payments, isLoading } = usePayments(filters);

  const getStatusBadge = (status: string) => {
    const variants = {
      succeeded: { variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' },
      pending: { variant: 'secondary' as const, icon: Clock, color: 'text-blue-600' },
      failed: { variant: 'destructive' as const, icon: XCircle, color: 'text-red-600' },
      refunded: { variant: 'outline' as const, icon: XCircle, color: 'text-gray-600' },
    };

    const config = variants[status as keyof typeof variants] || variants.failed;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className={`h-3 w-3 ${config.color}`} />
        {status === 'succeeded' && 'Sucesso'}
        {status === 'pending' && 'Pendente'}
        {status === 'failed' && 'Falhou'}
        {status === 'refunded' && 'Reembolsado'}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Pagamentos</CardTitle>
            <CardDescription>
              Histórico de todos os pagamentos
            </CardDescription>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="succeeded">Sucesso</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="failed">Falhou</SelectItem>
              <SelectItem value="refunded">Reembolsado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tenant</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{payment.tenant?.name}</div>
                      <div className="text-sm text-muted-foreground">{payment.tenant?.slug}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      R$ {payment.amount.toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {payment.currency}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(payment.status)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {payment.payment_method === 'card' ? 'Cartão' : payment.payment_method}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{payment.description}</div>
                  </TableCell>
                  <TableCell>
                    {new Date(payment.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

// Componente de tabela de faturas
function InvoicesTable() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const filters = {
    status: statusFilter !== 'all' ? statusFilter : undefined,
    limit: 50,
  };

  const { invoices, isLoading } = useInvoices(filters);

  const getStatusBadge = (status: string) => {
    const variants = {
      paid: { variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' },
      open: { variant: 'secondary' as const, icon: Clock, color: 'text-blue-600' },
      void: { variant: 'outline' as const, icon: XCircle, color: 'text-gray-600' },
      uncollectible: { variant: 'destructive' as const, icon: XCircle, color: 'text-red-600' },
      draft: { variant: 'outline' as const, icon: FileText, color: 'text-gray-600' },
    };

    const config = variants[status as keyof typeof variants] || variants.draft;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className={`h-3 w-3 ${config.color}`} />
        {status === 'paid' && 'Paga'}
        {status === 'open' && 'Aberta'}
        {status === 'void' && 'Anulada'}
        {status === 'uncollectible' && 'Incobrável'}
        {status === 'draft' && 'Rascunho'}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Faturas</CardTitle>
            <CardDescription>
              Gestão de faturas e cobranças
            </CardDescription>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="paid">Paga</SelectItem>
              <SelectItem value="open">Aberta</SelectItem>
              <SelectItem value="void">Anulada</SelectItem>
              <SelectItem value="uncollectible">Incobrável</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tenant</TableHead>
                <TableHead>Valor Devido</TableHead>
                <TableHead>Valor Pago</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Criada em</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{invoice.tenant?.name}</div>
                      <div className="text-sm text-muted-foreground">{invoice.tenant?.slug}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      R$ {invoice.amount_due.toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      R$ {invoice.amount_paid.toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(invoice.status)}
                  </TableCell>
                  <TableCell>
                    <div className={`text-sm ${
                      new Date(invoice.due_date) < new Date() && invoice.status === 'open'
                        ? 'text-red-600 font-medium'
                        : ''
                    }`}>
                      {new Date(invoice.due_date).toLocaleDateString('pt-BR')}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(invoice.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

// Componente de analytics financeiros
function FinancialAnalytics() {
  const { revenueData } = useRevenueData('month');
  const { overview } = useFinancialOverview();

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Crescimento de Clientes</CardTitle>
            <CardDescription>
              Novos clientes vs. churn ao longo do tempo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="new_customers" fill="#8B5CF6" name="Novos Clientes" />
                <Bar dataKey="churned_customers" fill="#EF4444" name="Churn" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Métricas de Retenção</CardTitle>
            <CardDescription>
              Indicadores de saúde do negócio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Taxa de Churn</span>
                <span className="text-2xl font-bold text-red-600">
                  {overview?.churn_rate.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Taxa de Conversão</span>
                <span className="text-2xl font-bold text-green-600">
                  {overview?.conversion_rate.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">ARPU</span>
                <span className="text-2xl font-bold">
                  R$ {overview?.average_revenue_per_user.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">LTV</span>
                <span className="text-2xl font-bold">
                  R$ {overview?.lifetime_value.toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Previsão de Receita</CardTitle>
          <CardDescription>
            Projeção baseada em tendências atuais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Gráfico de previsão de receita será implementado aqui
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default FinancialSystem;

