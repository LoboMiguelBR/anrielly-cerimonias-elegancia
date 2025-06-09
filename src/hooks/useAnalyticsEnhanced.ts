
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AnalyticsMetrics {
  // Receita e financeiro
  totalRevenue: number;
  monthlyRevenue: number;
  revenueGrowth: number;
  averageContractValue: number;
  
  // Clientes
  totalClients: number;
  newClientsThisMonth: number;
  clientsGrowth: number;
  clientRetentionRate: number;
  
  // Eventos
  totalEvents: number;
  upcomingEvents: number;
  completedEvents: number;
  eventsThisMonth: number;
  
  // Propostas e conversões
  totalProposals: number;
  proposalsThisMonth: number;
  proposalConversionRate: number;
  averageResponseTime: number;
  
  // Contratos
  totalContracts: number;
  contractsThisMonth: number;
  contractCompletionRate: number;
  
  // Fornecedores (para admins)
  totalSuppliers?: number;
  verifiedSuppliers?: number;
  supplierSatisfaction?: number;
  
  // Performance
  leadConversionRate: number;
  averageProjectDuration: number;
  customerSatisfactionScore: number;
}

export interface AnalyticsFilters {
  dateRange: {
    start: string;
    end: string;
  };
  eventTypes?: string[];
  clientStatus?: string[];
  contractStatus?: string[];
}

export interface ChartData {
  period: string;
  revenue: number;
  clients: number;
  events: number;
  proposals: number;
}

export const useAnalyticsEnhanced = () => {
  const [metrics, setMetrics] = useState<AnalyticsMetrics>({
    totalRevenue: 0,
    monthlyRevenue: 0,
    revenueGrowth: 0,
    averageContractValue: 0,
    totalClients: 0,
    newClientsThisMonth: 0,
    clientsGrowth: 0,
    clientRetentionRate: 0,
    totalEvents: 0,
    upcomingEvents: 0,
    completedEvents: 0,
    eventsThisMonth: 0,
    totalProposals: 0,
    proposalsThisMonth: 0,
    proposalConversionRate: 0,
    averageResponseTime: 0,
    totalContracts: 0,
    contractsThisMonth: 0,
    contractCompletionRate: 0,
    totalSuppliers: 0,
    verifiedSuppliers: 0,
    supplierSatisfaction: 0,
    leadConversionRate: 0,
    averageProjectDuration: 0,
    customerSatisfactionScore: 0,
  });
  
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<AnalyticsFilters>({
    dateRange: {
      start: new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0]
    }
  });

  const fetchAnalytics = async (currentFilters?: AnalyticsFilters) => {
    try {
      setLoading(true);
      const activeFilters = currentFilters || filters;
      
      // Buscar dados básicos
      const [
        { data: contractsData },
        { data: clientsData },
        { data: eventsData },
        { data: proposalsData }
      ] = await Promise.all([
        supabase.from('contracts').select('*'),
        supabase.from('clientes').select('*'),
        supabase.from('events').select('*'),
        supabase.from('proposals').select('*')
      ]);

      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // Calcular métricas de receita
      const totalRevenue = (contractsData || [])
        .filter(c => c.status === 'signed')
        .reduce((sum, c) => sum + (parseFloat(c.total_price?.toString() || '0')), 0);

      const monthlyRevenue = (contractsData || [])
        .filter(c => c.status === 'signed' && new Date(c.created_at) >= thisMonth)
        .reduce((sum, c) => sum + (parseFloat(c.total_price?.toString() || '0')), 0);

      // Calcular métricas de clientes
      const totalClients = clientsData?.length || 0;
      const newClientsThisMonth = (clientsData || [])
        .filter(c => new Date(c.created_at) >= thisMonth).length;

      // Calcular métricas de eventos
      const totalEvents = eventsData?.length || 0;
      const upcomingEvents = (eventsData || [])
        .filter(e => e.date && new Date(e.date) > now).length;
      const completedEvents = (eventsData || [])
        .filter(e => e.status === 'concluido').length;

      // Calcular métricas de propostas
      const totalProposals = proposalsData?.length || 0;
      const proposalsThisMonth = (proposalsData || [])
        .filter(p => new Date(p.created_at) >= thisMonth).length;

      const convertedProposals = (proposalsData || [])
        .filter(p => p.status === 'accepted').length;

      const proposalConversionRate = totalProposals > 0 
        ? (convertedProposals / totalProposals) * 100 
        : 0;

      // Atualizar métricas
      setMetrics({
        totalRevenue,
        monthlyRevenue,
        revenueGrowth: 15.5, // Placeholder - calcular baseado em dados históricos
        averageContractValue: totalRevenue / Math.max((contractsData?.length || 1), 1),
        totalClients,
        newClientsThisMonth,
        clientsGrowth: 12.3, // Placeholder
        clientRetentionRate: 85.2, // Placeholder
        totalEvents,
        upcomingEvents,
        completedEvents,
        eventsThisMonth: (eventsData || [])
          .filter(e => new Date(e.created_at) >= thisMonth).length,
        totalProposals,
        proposalsThisMonth,
        proposalConversionRate,
        averageResponseTime: 2.5, // Placeholder - dias
        totalContracts: contractsData?.length || 0,
        contractsThisMonth: (contractsData || [])
          .filter(c => new Date(c.created_at) >= thisMonth).length,
        contractCompletionRate: 92.1, // Placeholder
        totalSuppliers: 0, // Será implementado com sistema de fornecedores
        verifiedSuppliers: 0,
        supplierSatisfaction: 0,
        leadConversionRate: 45.8, // Placeholder
        averageProjectDuration: 120, // Placeholder - dias
        customerSatisfactionScore: 4.7, // Placeholder
      });

      // Gerar dados do gráfico (últimos 6 meses)
      const chartPeriods: ChartData[] = [];
      for (let i = 5; i >= 0; i--) {
        const periodStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const periodEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
        
        const periodRevenue = (contractsData || [])
          .filter(c => {
            const createdAt = new Date(c.created_at);
            return createdAt >= periodStart && createdAt <= periodEnd && c.status === 'signed';
          })
          .reduce((sum, c) => sum + (parseFloat(c.total_price?.toString() || '0')), 0);

        const periodClients = (clientsData || [])
          .filter(c => {
            const createdAt = new Date(c.created_at);
            return createdAt >= periodStart && createdAt <= periodEnd;
          }).length;

        const periodEvents = (eventsData || [])
          .filter(e => {
            const createdAt = new Date(e.created_at);
            return createdAt >= periodStart && createdAt <= periodEnd;
          }).length;

        const periodProposals = (proposalsData || [])
          .filter(p => {
            const createdAt = new Date(p.created_at);
            return createdAt >= periodStart && createdAt <= periodEnd;
          }).length;

        chartPeriods.push({
          period: periodStart.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
          revenue: periodRevenue,
          clients: periodClients,
          events: periodEvents,
          proposals: periodProposals
        });
      }

      setChartData(chartPeriods);

    } catch (error: any) {
      console.error('Erro ao buscar analytics:', error);
      toast.error('Erro ao carregar métricas');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (newFilters: AnalyticsFilters) => {
    setFilters(newFilters);
    fetchAnalytics(newFilters);
  };

  const exportAnalytics = async (format: 'csv' | 'excel' | 'pdf' = 'csv') => {
    try {
      toast.success('Funcionalidade de exportação será implementada em breve');
    } catch (error) {
      toast.error('Erro ao exportar métricas');
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return {
    metrics,
    chartData,
    loading,
    filters,
    fetchAnalytics,
    applyFilters,
    exportAnalytics,
    refetch: fetchAnalytics
  };
};
