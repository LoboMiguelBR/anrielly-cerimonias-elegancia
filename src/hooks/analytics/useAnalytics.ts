import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AnalyticsMetric {
  id: string;
  metric_name: string;
  metric_value: number;
  metric_date: string;
  metric_type: 'revenue' | 'conversion' | 'leads' | 'events' | 'satisfaction';
  metadata?: Record<string, any>;
  created_at: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalLeads: number;
  totalProposals: number;
  totalContracts: number;
  conversionRate: number;
  monthlyGrowth: number;
}

export const useAnalytics = (dateFrom?: string, dateTo?: string) => {
  return useQuery({
    queryKey: ['analytics', dateFrom, dateTo],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analytics_metrics')
        .select('*')
        .gte('metric_date', dateFrom || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .lte('metric_date', dateTo || new Date().toISOString().split('T')[0])
        .order('metric_date', { ascending: false });

      if (error) throw error;
      return data as AnalyticsMetric[];
    },
  });
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      // Buscar métricas dos últimos 30 dias
      const today = new Date();
      const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      const sixtyDaysAgo = new Date(today.getTime() - 60 * 24 * 60 * 60 * 1000);

      const { data: currentMetrics } = await supabase
        .from('analytics_metrics')
        .select('*')
        .gte('metric_date', thirtyDaysAgo.toISOString().split('T')[0])
        .lte('metric_date', today.toISOString().split('T')[0]);

      const { data: previousMetrics } = await supabase
        .from('analytics_metrics')
        .select('*')
        .gte('metric_date', sixtyDaysAgo.toISOString().split('T')[0])
        .lt('metric_date', thirtyDaysAgo.toISOString().split('T')[0]);

      // Calcular totais atuais
      const currentTotals = currentMetrics?.reduce((acc, metric) => {
        switch (metric.metric_name) {
          case 'daily_revenue':
            acc.totalRevenue += metric.metric_value;
            break;
          case 'daily_leads':
            acc.totalLeads += metric.metric_value;
            break;
          case 'daily_proposals':
            acc.totalProposals += metric.metric_value;
            break;
          case 'daily_contracts':
            acc.totalContracts += metric.metric_value;
            break;
        }
        return acc;
      }, {
        totalRevenue: 0,
        totalLeads: 0,
        totalProposals: 0,
        totalContracts: 0,
      }) || { totalRevenue: 0, totalLeads: 0, totalProposals: 0, totalContracts: 0 };

      // Calcular totais anteriores para comparação
      const previousTotals = previousMetrics?.reduce((acc, metric) => {
        switch (metric.metric_name) {
          case 'daily_revenue':
            acc.totalRevenue += metric.metric_value;
            break;
        }
        return acc;
      }, { totalRevenue: 0 }) || { totalRevenue: 0 };

      // Calcular taxa de conversão média
      const conversionMetrics = currentMetrics?.filter(m => m.metric_name === 'conversion_rate') || [];
      const avgConversionRate = conversionMetrics.length > 0 
        ? conversionMetrics.reduce((sum, m) => sum + m.metric_value, 0) / conversionMetrics.length 
        : 0;

      // Calcular crescimento mensal
      const monthlyGrowth = previousTotals.totalRevenue > 0
        ? ((currentTotals.totalRevenue - previousTotals.totalRevenue) / previousTotals.totalRevenue) * 100
        : 0;

      return {
        ...currentTotals,
        conversionRate: avgConversionRate,
        monthlyGrowth,
      } as DashboardStats;
    },
    refetchInterval: 5 * 60 * 1000, // Refetch a cada 5 minutos
  });
};

export const useCustomReport = (reportType: string, filters?: Record<string, any>) => {
  return useQuery({
    queryKey: ['custom-report', reportType, filters],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('generate_custom_report', {
        p_report_type: reportType,
        p_filters: filters || {},
        p_date_from: filters?.dateFrom || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        p_date_to: filters?.dateTo || new Date().toISOString().split('T')[0],
      });

      if (error) throw error;
      return data;
    },
    enabled: !!reportType,
  });
};