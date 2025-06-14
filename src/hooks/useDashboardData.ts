
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  totalReceita: number;
  totalLeads: number;
  clientesAtivos: number;
  proposalsCount: number;
  contractsCount: number;
}

export const useDashboardData = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalReceita: 0,
    totalLeads: 0,
    clientesAtivos: 0,
    proposalsCount: 0,
    contractsCount: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      // Buscar leads
      const { count: leadsCount } = await supabase
        .from('quote_requests')
        .select('*', { count: 'exact', head: true });

      // Buscar clientes ativos
      const { count: clientesCount } = await supabase
        .from('clientes')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'ativo');

      // Buscar propostas
      const { count: proposalsCount } = await supabase
        .from('proposals')
        .select('*', { count: 'exact', head: true });

      // Buscar contratos
      const { count: contractsCount } = await supabase
        .from('contracts')
        .select('*', { count: 'exact', head: true });

      // Calcular receita total dos contratos assinados
      const { data: contracts } = await supabase
        .from('contracts')
        .select('total_price')
        .eq('status', 'signed');

      const totalReceita = contracts?.reduce((sum, contract) => {
        return sum + (Number(contract.total_price) || 0);
      }, 0) || 0;

      setStats({
        totalReceita,
        totalLeads: leadsCount || 0,
        clientesAtivos: clientesCount || 0,
        proposalsCount: proposalsCount || 0,
        contractsCount: contractsCount || 0,
      });

    } catch (error) {
      console.error('Erro ao buscar estatísticas do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return {
    stats,
    loading,
    refetch: fetchDashboardStats,
  };
};
