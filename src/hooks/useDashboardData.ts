
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DashboardMetrics {
  leadsNovosMes: number;
  orcamentosPendentes: number;
  contratosAndamento: number;
  contratosAssinados: number;
  valorTotalPropostas: number;
  ticketMedioContratos: number;
  taxaConversao: number;
  crescimentoMensal: number;
}

interface AlertaOperacional {
  id: string;
  tipo: 'orcamento_vencido' | 'contrato_vencendo' | 'lead_sem_orcamento';
  titulo: string;
  descricao: string;
  clienteNome: string;
  dataLimite?: string;
  acoes: Array<{
    label: string;
    type: 'reenviar' | 'editar' | 'criar';
    url?: string;
  }>;
}

interface AtividadeRecente {
  id: string;
  tipo: 'lead' | 'proposal' | 'contract';
  clienteNome: string;
  clienteEmail: string;
  data: string;
  status: string;
  valor?: number;
}

export const useDashboardData = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    leadsNovosMes: 0,
    orcamentosPendentes: 0,
    contratosAndamento: 0,
    contratosAssinados: 0,
    valorTotalPropostas: 0,
    ticketMedioContratos: 0,
    taxaConversao: 0,
    crescimentoMensal: 0,
  });

  const [alertas, setAlertas] = useState<AlertaOperacional[]>([]);
  const [atividades, setAtividades] = useState<AtividadeRecente[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMetrics = async () => {
    try {
      const hoje = new Date();
      const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
      const primeiroDiaMesPassado = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1);
      const ultimoDiaMesPassado = new Date(hoje.getFullYear(), hoje.getMonth(), 0);

      // Leads novos este mês
      const { count: leadsNovosMes } = await supabase
        .from('quote_requests')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', primeiroDiaMes.toISOString());

      // Orçamentos pendentes
      const { count: orcamentosPendentes } = await supabase
        .from('proposals')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'draft');

      // Contratos em andamento
      const { count: contratosAndamento } = await supabase
        .from('contracts')
        .select('*', { count: 'exact', head: true })
        .in('status', ['draft', 'sent']);

      // Contratos assinados
      const { count: contratosAssinados } = await supabase
        .from('contracts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'signed');

      // Valor total propostas
      const { data: propostas } = await supabase
        .from('proposals')
        .select('total_price')
        .eq('status', 'draft');

      const valorTotalPropostas = propostas?.reduce((sum, p) => sum + (p.total_price || 0), 0) || 0;

      // Ticket médio contratos
      const { data: contratos } = await supabase
        .from('contracts')
        .select('total_price')
        .eq('status', 'signed');

      const ticketMedioContratos = contratos?.length 
        ? contratos.reduce((sum, c) => sum + (c.total_price || 0), 0) / contratos.length 
        : 0;

      // Taxa de conversão (leads -> contratos)
      const taxaConversao = leadsNovosMes > 0 ? (contratosAssinados / leadsNovosMes) * 100 : 0;

      // Leads mês passado para crescimento
      const { count: leadsMesPassado } = await supabase
        .from('quote_requests')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', primeiroDiaMesPassado.toISOString())
        .lte('created_at', ultimoDiaMesPassado.toISOString());

      const crescimentoMensal = leadsMesPassado > 0 
        ? ((leadsNovosMes - leadsMesPassado) / leadsMesPassado) * 100 
        : 0;

      setMetrics({
        leadsNovosMes: leadsNovosMes || 0,
        orcamentosPendentes: orcamentosPendentes || 0,
        contratosAndamento: contratosAndamento || 0,
        contratosAssinados: contratosAssinados || 0,
        valorTotalPropostas,
        ticketMedioContratos,
        taxaConversao,
        crescimentoMensal,
      });

    } catch (error) {
      console.error('Erro ao buscar métricas:', error);
    }
  };

  const fetchAlertas = async () => {
    try {
      const alertasArray: AlertaOperacional[] = [];
      const seteDiasAtras = new Date();
      seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);

      // Orçamentos antigos sem retorno
      const { data: orcamentosAntigos } = await supabase
        .from('proposals')
        .select('id, client_name, client_email, updated_at')
        .eq('status', 'draft')
        .lt('updated_at', seteDiasAtras.toISOString());

      orcamentosAntigos?.forEach(orc => {
        alertasArray.push({
          id: `orc-${orc.id}`,
          tipo: 'orcamento_vencido',
          titulo: 'Orçamento sem retorno há +7 dias',
          descricao: `Cliente ${orc.client_name} não respondeu ao orçamento`,
          clienteNome: orc.client_name,
          acoes: [
            { label: 'Reenviar', type: 'reenviar' },
            { label: 'Editar', type: 'editar', url: `/proposals/${orc.id}` }
          ]
        });
      });

      // Contratos próximos do vencimento
      const cincoDiasFrente = new Date();
      cincoDiasFrente.setDate(cincoDiasFrente.getDate() + 5);

      const { data: contratosVencendo } = await supabase
        .from('contracts')
        .select('id, client_name, event_date')
        .in('status', ['draft', 'sent'])
        .lt('event_date', cincoDiasFrente.toISOString());

      contratosVencendo?.forEach(cont => {
        alertasArray.push({
          id: `cont-${cont.id}`,
          tipo: 'contrato_vencendo',
          titulo: 'Contrato próximo do evento',
          descricao: `Evento de ${cont.client_name} em ${cont.event_date}`,
          clienteNome: cont.client_name,
          dataLimite: cont.event_date,
          acoes: [
            { label: 'Ver contrato', type: 'editar', url: `/contracts/${cont.id}` }
          ]
        });
      });

      setAlertas(alertasArray);

    } catch (error) {
      console.error('Erro ao buscar alertas:', error);
    }
  };

  const fetchAtividades = async () => {
    try {
      const atividades: AtividadeRecente[] = [];

      // Últimos leads
      const { data: leads } = await supabase
        .from('quote_requests')
        .select('id, name, email, created_at, status')
        .order('created_at', { ascending: false })
        .limit(5);

      leads?.forEach(lead => {
        atividades.push({
          id: `lead-${lead.id}`,
          tipo: 'lead',
          clienteNome: lead.name,
          clienteEmail: lead.email,
          data: lead.created_at,
          status: lead.status
        });
      });

      // Últimas propostas
      const { data: propostas } = await supabase
        .from('proposals')
        .select('id, client_name, client_email, created_at, status, total_price')
        .order('created_at', { ascending: false })
        .limit(5);

      propostas?.forEach(prop => {
        atividades.push({
          id: `prop-${prop.id}`,
          tipo: 'proposal',
          clienteNome: prop.client_name,
          clienteEmail: prop.client_email,
          data: prop.created_at,
          status: prop.status,
          valor: prop.total_price
        });
      });

      // Últimos contratos
      const { data: contratos } = await supabase
        .from('contracts')
        .select('id, client_name, client_email, created_at, status, total_price')
        .order('created_at', { ascending: false })
        .limit(5);

      contratos?.forEach(cont => {
        atividades.push({
          id: `cont-${cont.id}`,
          tipo: 'contract',
          clienteNome: cont.client_name,
          clienteEmail: cont.client_email,
          data: cont.created_at,
          status: cont.status,
          valor: cont.total_price
        });
      });

      // Ordenar por data mais recente
      atividades.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

      setAtividades(atividades.slice(0, 10));

    } catch (error) {
      console.error('Erro ao buscar atividades:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchMetrics(), fetchAlertas(), fetchAtividades()]);
      setIsLoading(false);
    };

    loadData();
  }, []);

  const refetchData = () => {
    fetchMetrics();
    fetchAlertas();
    fetchAtividades();
  };

  return {
    metrics,
    alertas,
    atividades,
    isLoading,
    refetchData
  };
};
