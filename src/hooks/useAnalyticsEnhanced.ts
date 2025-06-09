
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AnalyticsMetrics {
  // Vendas e Revenue
  totalRevenue: number;
  monthlyRevenue: number;
  revenueGrowth: number;
  averageTicket: number;
  
  // Leads e Conversão
  totalLeads: number;
  monthlyLeads: number;
  conversionRate: number;
  leadsToday: number;
  
  // Eventos
  totalEvents: number;
  activeEvents: number;
  completedEvents: number;
  upcomingEvents: number;
  
  // Clientes
  totalClients: number;
  activeClients: number;
  newClientsThisMonth: number;
  clientRetentionRate: number;
  
  // Performance Financeira
  profitMargin: number;
  operationalCosts: number;
  netProfit: number;
  
  // KPIs Operacionais
  eventCompletionRate: number;
  averageEventDuration: number;
  clientSatisfactionScore: number;
  
  // Tendências
  growthTrend: 'up' | 'down' | 'stable';
  topEventTypes: Array<{ type: string; count: number; revenue: number }>;
  seasonalTrends: Array<{ month: string; events: number; revenue: number }>;
}

export interface AnalyticsFilters {
  dateRange: {
    start: string;
    end: string;
  };
  eventTypes?: string[];
  clientSegments?: string[];
  revenueRange?: {
    min: number;
    max: number;
  };
}

export const useAnalyticsEnhanced = () => {
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<AnalyticsFilters>({
    dateRange: {
      start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0]
    }
  });

  const fetchAnalytics = async (currentFilters?: AnalyticsFilters) => {
    try {
      setLoading(true);
      const activeFilters = currentFilters || filters;

      // Buscar dados de eventos
      const { data: eventsData } = await supabase
        .from('events')
        .select('*')
        .gte('created_at', activeFilters.dateRange.start)
        .lte('created_at', activeFilters.dateRange.end);

      // Buscar dados de contratos para revenue
      const { data: contractsData } = await supabase
        .from('contracts')
        .select('total_price, status, created_at, event_type')
        .gte('created_at', activeFilters.dateRange.start)
        .lte('created_at', activeFilters.dateRange.end);

      // Buscar dados de clientes
      const { data: clientsData } = await supabase
        .from('clientes')
        .select('*')
        .gte('created_at', activeFilters.dateRange.start)
        .lte('created_at', activeFilters.dateRange.end);

      // Buscar dados de leads
      const { data: leadsData } = await supabase
        .from('quote_requests')
        .select('*')
        .gte('created_at', activeFilters.dateRange.start)
        .lte('created_at', activeFilters.dateRange.end);

      // Calcular métricas
      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

      // Revenue calculations
      const totalRevenue = contractsData?.reduce((sum, contract) => 
        sum + (parseFloat(contract.total_price?.toString() || '0')), 0) || 0;
      
      const monthlyRevenue = contractsData?.filter(c => 
        new Date(c.created_at) >= thisMonth
      ).reduce((sum, contract) => 
        sum + (parseFloat(contract.total_price?.toString() || '0')), 0) || 0;

      const lastMonthRevenue = contractsData?.filter(c => {
        const date = new Date(c.created_at);
        return date >= lastMonth && date < thisMonth;
      }).reduce((sum, contract) => 
        sum + (parseFloat(contract.total_price?.toString() || '0')), 0) || 0;

      const revenueGrowth = lastMonthRevenue > 0 
        ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
        : 0;

      // Events calculations
      const totalEvents = eventsData?.length || 0;
      const activeEvents = eventsData?.filter(e => 
        e.status === 'em_andamento' || e.status === 'contratado'
      ).length || 0;
      
      const completedEvents = eventsData?.filter(e => 
        e.status === 'concluido'
      ).length || 0;

      const upcomingEvents = eventsData?.filter(e => 
        e.date && new Date(e.date) > now
      ).length || 0;

      // Clients calculations
      const totalClients = clientsData?.length || 0;
      const activeClients = clientsData?.filter(c => c.status === 'ativo').length || 0;
      const newClientsThisMonth = clientsData?.filter(c => 
        new Date(c.created_at) >= thisMonth
      ).length || 0;

      // Leads calculations
      const totalLeads = leadsData?.length || 0;
      const monthlyLeads = leadsData?.filter(l => 
        new Date(l.created_at) >= thisMonth
      ).length || 0;
      
      const leadsToday = leadsData?.filter(l => {
        const today = new Date().toISOString().split('T')[0];
        return l.created_at.split('T')[0] === today;
      }).length || 0;

      const conversionRate = totalLeads > 0 
        ? (totalClients / totalLeads) * 100 
        : 0;

      // Calculate top event types
      const eventTypeCounts = eventsData?.reduce((acc: Record<string, { count: number; revenue: number }>, event) => {
        const type = event.type || 'outros';
        if (!acc[type]) {
          acc[type] = { count: 0, revenue: 0 };
        }
        acc[type].count++;
        
        // Find related contract revenue
        const relatedContract = contractsData?.find(c => c.event_type === type);
        if (relatedContract) {
          acc[type].revenue += parseFloat(relatedContract.total_price?.toString() || '0');
        }
        
        return acc;
      }, {}) || {};

      const topEventTypes = Object.entries(eventTypeCounts)
        .map(([type, data]) => ({ type, ...data }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      const analyticsMetrics: AnalyticsMetrics = {
        totalRevenue,
        monthlyRevenue,
        revenueGrowth,
        averageTicket: totalClients > 0 ? totalRevenue / totalClients : 0,
        
        totalLeads,
        monthlyLeads,
        conversionRate,
        leadsToday,
        
        totalEvents,
        activeEvents,
        completedEvents,
        upcomingEvents,
        
        totalClients,
        activeClients,
        newClientsThisMonth,
        clientRetentionRate: 85, // Placeholder - calculate based on repeat customers
        
        profitMargin: 25, // Placeholder
        operationalCosts: totalRevenue * 0.3, // Estimate 30% operational costs
        netProfit: totalRevenue * 0.7, // Estimate 70% net profit
        
        eventCompletionRate: totalEvents > 0 ? (completedEvents / totalEvents) * 100 : 0,
        averageEventDuration: 6, // Placeholder - hours
        clientSatisfactionScore: 4.7, // Placeholder
        
        growthTrend: revenueGrowth > 5 ? 'up' : revenueGrowth < -5 ? 'down' : 'stable',
        topEventTypes,
        seasonalTrends: [], // Placeholder - calculate seasonal data
      };

      setMetrics(analyticsMetrics);
    } catch (error: any) {
      console.error('Erro ao buscar analytics:', error);
      toast.error('Erro ao carregar analytics');
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (type: 'revenue' | 'events' | 'clients' | 'complete') => {
    try {
      // Generate different types of reports
      toast.success(`Relatório de ${type} será gerado em breve`);
    } catch (error) {
      toast.error('Erro ao gerar relatório');
    }
  };

  const exportData = async (format: 'csv' | 'excel' | 'pdf') => {
    try {
      toast.success(`Export em ${format} será implementado em breve`);
    } catch (error) {
      toast.error('Erro ao exportar dados');
    }
  };

  const applyFilters = (newFilters: AnalyticsFilters) => {
    setFilters(newFilters);
    fetchAnalytics(newFilters);
  };

  const getKPIComparison = (current: number, previous: number) => {
    if (previous === 0) return { percentage: 0, trend: 'stable' as const };
    
    const percentage = ((current - previous) / previous) * 100;
    const trend = percentage > 5 ? 'up' : percentage < -5 ? 'down' : 'stable';
    
    return { percentage: Math.abs(percentage), trend };
  };

  const getPredictions = async (metric: string, days: number = 30) => {
    try {
      // Placeholder for AI-powered predictions
      toast.success('Previsões com IA serão implementadas em breve');
      return null;
    } catch (error) {
      console.error('Erro ao gerar previsões:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return {
    metrics,
    loading,
    filters,
    fetchAnalytics,
    generateReport,
    exportData,
    applyFilters,
    getKPIComparison,
    getPredictions,
    refetch: () => fetchAnalytics()
  };
};
