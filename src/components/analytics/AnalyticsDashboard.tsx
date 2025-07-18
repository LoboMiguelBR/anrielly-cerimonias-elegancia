import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { useDashboardStats, useAnalytics } from '@/hooks/analytics/useAnalytics';
import { StatCard } from './StatCard';
import { RevenueChart } from './RevenueChart';
import { ConversionFunnel } from './ConversionFunnel';
import { CustomReports } from './CustomReports';
import { TemplateAnalytics } from './TemplateAnalytics';
import { RefreshCw, Download, Filter } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const AnalyticsDashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
  });

  const dateFrom = dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined;
  const dateTo = dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined;

  const { data: dashboardStats, isLoading: statsLoading, refetch } = useDashboardStats();
  const { data: analytics, isLoading: analyticsLoading } = useAnalytics(dateFrom, dateTo);

  const handleRefresh = () => {
    refetch();
  };

  const handleExport = () => {
    // Implementar exportação de dados
    console.log('Exporting analytics data...');
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Acompanhe o desempenho do seu negócio em tempo real
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <DatePickerWithRange
            date={dateRange}
            onDateChange={setDateRange}
            placeholder="Selecionar período"
          />
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Cards de estatísticas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Receita Total"
          value={dashboardStats?.totalRevenue || 0}
          format="currency"
          growth={dashboardStats?.monthlyGrowth}
          isLoading={statsLoading}
        />
        <StatCard
          title="Total de Leads"
          value={dashboardStats?.totalLeads || 0}
          format="number"
          isLoading={statsLoading}
        />
        <StatCard
          title="Propostas Criadas"
          value={dashboardStats?.totalProposals || 0}
          format="number"
          isLoading={statsLoading}
        />
        <StatCard
          title="Taxa de Conversão"
          value={dashboardStats?.conversionRate || 0}
          format="percentage"
          isLoading={statsLoading}
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Receita ao Longo do Tempo</CardTitle>
              </CardHeader>
              <CardContent>
                <RevenueChart data={analytics} isLoading={analyticsLoading} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Funil de Conversão</CardTitle>
              </CardHeader>
              <CardContent>
                <ConversionFunnel 
                  leads={dashboardStats?.totalLeads || 0}
                  proposals={dashboardStats?.totalProposals || 0}
                  contracts={dashboardStats?.totalContracts || 0}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports">
          <CustomReports />
        </TabsContent>

        <TabsContent value="templates">
          <TemplateAnalytics />
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Métricas de Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Métricas de performance em desenvolvimento...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};