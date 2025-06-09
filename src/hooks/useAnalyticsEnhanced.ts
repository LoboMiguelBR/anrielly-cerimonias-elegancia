
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface DashboardMetrics {
  // Métricas de vendas
  total_revenue: number;
  monthly_revenue: number;
  revenue_growth: number;
  
  // Métricas de clientes
  total_clients: number;
  new_clients_this_month: number;
  client_retention_rate: number;
  
  // Métricas de eventos
  total_events: number;
  upcoming_events: number;
  completed_events: number;
  
  // Métricas de propostas
  total_proposals: number;
  proposals_this_month: number;
  proposal_conversion_rate: number;
  
  // Métricas de contratos
  total_contracts: number;
  contracts_this_month: number;
  contract_value_total: number;
  
  // Métricas de fornecedores
  total_suppliers: number;
  verified_suppliers: number;
  supplier_satisfaction: number;
}

export interface ChartData {
  name: string;
  value: number;
  date?: string;
  category?: string;
}

export interface AnalyticsData {
  revenue_chart: ChartData[];
  events_by_type: ChartData[];
  clients_by_month: ChartData[];
  proposals_funnel: ChartData[];
  top_services: ChartData[];
  supplier_performance: ChartData[];
}

export const useAnalyticsEnhanced = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      
      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      
      // Fetch clients data
      const { data: clientsData } = await supabase
        .from('clientes')
        .select('created_at, status');
      
      // Fetch events data
      const { data: eventsData } = await supabase
        .from('events')
        .select('created_at, status, date');
      
      // Fetch proposals data
      const { data: proposalsData } = await supabase
        .from('proposals')
        .select('created_at, status, total_price');
      
      // Fetch contracts data
      const { data: contractsData } = await supabase
        .from('contracts')
        .select('created_at, status, total_price');
      
      // Fetch suppliers data
      const { data: suppliersData } = await supabase
        .from('professionals')
        .select('created_at, rating');

      // Calculate metrics
      const totalClients = clientsData?.length || 0;
      const newClientsThisMonth = clientsData?.filter(c => 
        new Date(c.created_at) >= thisMonth
      ).length || 0;
      
      const totalEvents = eventsData?.length || 0;
      const upcomingEvents = eventsData?.filter(e => 
        e.date && new Date(e.date) > now
      ).length || 0;
      const completedEvents = eventsData?.filter(e => 
        e.status === 'concluido' || e.status === 'finalizado'
      ).length || 0;
      
      const totalProposals = proposalsData?.length || 0;
      const proposalsThisMonth = proposalsData?.filter(p => 
        new Date(p.created_at) >= thisMonth
      ).length || 0;
      
      const totalContracts = contractsData?.length || 0;
      const contractsThisMonth = contractsData?.filter(c => 
        new Date(c.created_at) >= thisMonth
      ).length || 0;
      const contractValueTotal = contractsData?.reduce((sum, c) => 
        sum + (parseFloat(c.total_price) || 0), 0
      ) || 0;
      
      const totalSuppliers = suppliersData?.length || 0;
      const verifiedSuppliers = suppliersData?.filter(s => s.rating >= 4).length || 0;
      
      const monthlyRevenue = contractsData?.filter(c => 
        new Date(c.created_at) >= thisMonth
      ).reduce((sum, c) => sum + (parseFloat(c.total_price) || 0), 0) || 0;
      
      const lastMonthRevenue = contractsData?.filter(c => 
        new Date(c.created_at) >= lastMonth && new Date(c.created_at) < thisMonth
      ).reduce((sum, c) => sum + (parseFloat(c.total_price) || 0), 0) || 0;
      
      const revenueGrowth = lastMonthRevenue > 0 
        ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
        : 0;

      const metrics: DashboardMetrics = {
        total_revenue: contractValueTotal,
        monthly_revenue: monthlyRevenue,
        revenue_growth: revenueGrowth,
        total_clients: totalClients,
        new_clients_this_month: newClientsThisMonth,
        client_retention_rate: 85, // Mock value
        total_events: totalEvents,
        upcoming_events: upcomingEvents,
        completed_events: completedEvents,
        total_proposals: totalProposals,
        proposals_this_month: proposalsThisMonth,
        proposal_conversion_rate: totalProposals > 0 ? (totalContracts / totalProposals) * 100 : 0,
        total_contracts: totalContracts,
        contracts_this_month: contractsThisMonth,
        contract_value_total: contractValueTotal,
        total_suppliers: totalSuppliers,
        verified_suppliers: verifiedSuppliers,
        supplier_satisfaction: 4.2 // Mock value
      };
      
      setMetrics(metrics);
      
    } catch (error: any) {
      console.error('Erro ao buscar métricas:', error);
      toast.error('Erro ao carregar métricas do dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalyticsData = async () => {
    try {
      // Fetch revenue chart data
      const { data: contractsData } = await supabase
        .from('contracts')
        .select('created_at, total_price')
        .gte('created_at', dateRange.start)
        .lte('created_at', dateRange.end);

      // Fetch events by type
      const { data: eventsData } = await supabase
        .from('events')
        .select('type')
        .gte('created_at', dateRange.start)
        .lte('created_at', dateRange.end);

      // Fetch clients by month
      const { data: clientsData } = await supabase
        .from('clientes')
        .select('created_at')
        .gte('created_at', dateRange.start)
        .lte('created_at', dateRange.end);

      // Process revenue chart data
      const revenueByMonth = contractsData?.reduce((acc, contract) => {
        const month = new Date(contract.created_at).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
        acc[month] = (acc[month] || 0) + (parseFloat(contract.total_price) || 0);
        return acc;
      }, {} as Record<string, number>) || {};

      const revenueChart = Object.entries(revenueByMonth).map(([name, value]) => ({
        name,
        value
      }));

      // Process events by type
      const eventsByType = eventsData?.reduce((acc, event) => {
        acc[event.type] = (acc[event.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const eventsChart = Object.entries(eventsByType).map(([name, value]) => ({
        name,
        value
      }));

      // Process clients by month
      const clientsByMonth = clientsData?.reduce((acc, client) => {
        const month = new Date(client.created_at).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const clientsChart = Object.entries(clientsByMonth).map(([name, value]) => ({
        name,
        value
      }));

      const analyticsData: AnalyticsData = {
        revenue_chart: revenueChart,
        events_by_type: eventsChart,
        clients_by_month: clientsChart,
        proposals_funnel: [
          { name: 'Propostas', value: 100 },
          { name: 'Negociação', value: 75 },
          { name: 'Contratos', value: 50 },
          { name: 'Concluídos', value: 40 }
        ],
        top_services: [
          { name: 'Casamento', value: 45 },
          { name: 'Aniversário', value: 25 },
          { name: 'Formatura', value: 15 },
          { name: 'Corporativo', value: 15 }
        ],
        supplier_performance: [
          { name: 'Fotografia', value: 4.8 },
          { name: 'Decoração', value: 4.5 },
          { name: 'Buffet', value: 4.2 },
          { name: 'Música', value: 4.0 }
        ]
      };

      setAnalyticsData(analyticsData);

    } catch (error: any) {
      console.error('Erro ao buscar dados de analytics:', error);
      toast.error('Erro ao carregar dados de analytics');
    }
  };

  const exportReport = async (type: 'revenue' | 'clients' | 'events' | 'full', format: 'pdf' | 'excel' = 'pdf') => {
    try {
      toast.success('Funcionalidade de relatórios será implementada em breve');
    } catch (error) {
      toast.error('Erro ao gerar relatório');
    }
  };

  const updateDateRange = (start: string, end: string) => {
    setDateRange({ start, end });
    fetchAnalyticsData();
  };

  useEffect(() => {
    fetchMetrics();
    fetchAnalyticsData();
  }, []);

  return {
    metrics,
    analyticsData,
    loading,
    dateRange,
    fetchMetrics,
    fetchAnalyticsData,
    exportReport,
    updateDateRange,
    refetch: () => {
      fetchMetrics();
      fetchAnalyticsData();
    }
  };
};
