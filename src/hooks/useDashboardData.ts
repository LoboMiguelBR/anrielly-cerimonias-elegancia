
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
  const [hasError, setHasError] = useState(false);

  // Função para validar e sanitizar números
  const safeNumber = (value: any): number => {
    if (typeof value === 'number' && !isNaN(value)) {
      return value;
    }
    return 0;
  };

  const fetchMetrics = async () => {
    try {
      const hoje = new Date();
      const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
      const primeiroDiaMesPassado = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1);
      const ultimoDiaMesPassado = new Date(hoje.getFullYear(), hoje.getMonth(), 0);

      // Leads novos este mês
      const { count: leadsNovosMes, error: leadsError } = await supabase
        .from('quote_requests')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', primeiroDiaMes.toISOString());

      if (leadsError) {
        console.warn('Erro ao buscar leads novos:', leadsError);
      }

      // Orçamentos pendentes
      const { count: orcamentosPendentes, error: orcError } = await supabase
        .from('proposals')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'draft');

      if (orcError) {
        console.warn('Erro ao buscar orçamentos pendentes:', orcError);
      }

      // Contratos em andamento
      const { count: contratosAndamento, error: contAndError } = await supabase
        .from('contracts')
        .select('*', { count: 'exact', head: true })
        .in('status', ['draft', 'sent']);

      if (contAndError) {
        console.warn('Erro ao buscar contratos em andamento:', contAndError);
      }

      // Contratos assinados
      const { count: contratosAssinados, error: contAssError } = await supabase
        .from('contracts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'signed');

      if (contAssError) {
        console.warn('Erro ao buscar contratos assinados:', contAssError);
      }

      // Valor total propostas
      const { data: propostas, error: propError } = await supabase
        .from('proposals')
        .select('total_price')
        .eq('status', 'draft');

      if (propError) {
        console.warn('Erro ao buscar valor das propostas:', propError);
      }

      const valorTotalPropostas = propostas?.reduce((sum, p) => sum + safeNumber(p.total_price), 0) || 0;

      // Ticket médio contratos
      const { data: contratos, error: contTicketError } = await supabase
        .from('contracts')
        .select('total_price')
        .eq('status', 'signed');

      if (contTicketError) {
        console.warn('Erro ao buscar valor dos contratos:', contTicketError);
      }

      const ticketMedioContratos = contratos?.length 
        ? contratos.reduce((sum, c) => sum + safeNumber(c.total_price), 0) / contratos.length 
        : 0;

      // Taxa de conversão (leads -> contratos)
      const leadsSafe = safeNumber(leadsNovosMes);
      const contratosSafe = safeNumber(contratosAssinados);
      const taxaConversao = leadsSafe > 0 ? (contratosSafe / leadsSafe) * 100 : 0;

      // Leads mês passado para crescimento
      const { count: leadsMesPassado, error: leadsPrevError } = await supabase
        .from('quote_requests')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', primeiroDiaMesPassado.toISOString())
        .lte('created_at', ultimoDiaMesPassado.toISOString());

      if (leadsPrevError) {
        console.warn('Erro ao buscar leads mês passado:', leadsPrevError);
      }

      const leadsPrevSafe = safeNumber(leadsMesPassado);
      const crescimentoMensal = leadsPrevSafe > 0 
        ? ((leadsSafe - leadsPrevSafe) / leadsPrevSafe) * 100 
        : 0;

      setMetrics({
        leadsNovosMes: leadsSafe,
        orcamentosPendentes: safeNumber(orcamentosPendentes),
        contratosAndamento: safeNumber(contratosAndamento),
        contratosAssinados: contratosSafe,
        valorTotalPropostas: safeNumber(valorTotalPropostas),
        ticketMedioContratos: safeNumber(ticketMedioContratos),
        taxaConversao: safeNumber(taxaConversao),
        crescimentoMensal: safeNumber(crescimentoMensal),
      });

    } catch (error) {
      console.error('Erro crítico ao buscar métricas:', error);
      setHasError(true);
    }
  };

  const fetchAlertas = async () => {
    try {
      const alertasArray: AlertaOperacional[] = [];
      const seteDiasAtras = new Date();
      seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);

      // Orçamentos antigos sem retorno
      const { data: orcamentosAntigos, error: orcAntigosError } = await supabase
        .from('proposals')
        .select('id, client_name, client_email, updated_at')
        .eq('status', 'draft')
        .lt('updated_at', seteDiasAtras.toISOString());

      if (orcAntigosError) {
        console.warn('Erro ao buscar orçamentos antigos:', orcAntigosError);
      }

      orcamentosAntigos?.forEach(orc => {
        if (orc && orc.id && orc.client_name) {
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
        }
      });

      // Contratos próximos do vencimento
      const cincoDiasFrente = new Date();
      cincoDiasFrente.setDate(cincoDiasFrente.getDate() + 5);

      const { data: contratosVencendo, error: contVencError } = await supabase
        .from('contracts')
        .select('id, client_name, event_date')
        .in('status', ['draft', 'sent'])
        .lt('event_date', cincoDiasFrente.toISOString());

      if (contVencError) {
        console.warn('Erro ao buscar contratos vencendo:', contVencError);
      }

      contratosVencendo?.forEach(cont => {
        if (cont && cont.id && cont.client_name) {
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
        }
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
      const { data: leads, error: leadsError } = await supabase
        .from('quote_requests')
        .select('id, name, email, created_at, status')
        .order('created_at', { ascending: false })
        .limit(5);

      if (leadsError) {
        console.warn('Erro ao buscar leads recentes:', leadsError);
      }

      leads?.forEach(lead => {
        if (lead && lead.id && lead.name && lead.email) {
          atividades.push({
            id: `lead-${lead.id}`,
            tipo: 'lead',
            clienteNome: lead.name,
            clienteEmail: lead.email,
            data: lead.created_at,
            status: lead.status || 'aguardando'
          });
        }
      });

      // Últimas propostas
      const { data: propostas, error: propError } = await supabase
        .from('proposals')
        .select('id, client_name, client_email, created_at, status, total_price')
        .order('created_at', { ascending: false })
        .limit(5);

      if (propError) {
        console.warn('Erro ao buscar propostas recentes:', propError);
      }

      propostas?.forEach(prop => {
        if (prop && prop.id && prop.client_name && prop.client_email) {
          atividades.push({
            id: `prop-${prop.id}`,
            tipo: 'proposal',
            clienteNome: prop.client_name,
            clienteEmail: prop.client_email,
            data: prop.created_at,
            status: prop.status || 'draft',
            valor: safeNumber(prop.total_price)
          });
        }
      });

      // Últimos contratos
      const { data: contratos, error: contError } = await supabase
        .from('contracts')
        .select('id, client_name, client_email, created_at, status, total_price')
        .order('created_at', { ascending: false })
        .limit(5);

      if (contError) {
        console.warn('Erro ao buscar contratos recentes:', contError);
      }

      contratos?.forEach(cont => {
        if (cont && cont.id && cont.client_name && cont.client_email) {
          atividades.push({
            id: `cont-${cont.id}`,
            tipo: 'contract',
            clienteNome: cont.client_name,
            clienteEmail: cont.client_email,
            data: cont.created_at,
            status: cont.status || 'draft',
            valor: safeNumber(cont.total_price)
          });
        }
      });

      // Ordenar por data mais recente e filtrar itens válidos
      const atividadesValidas = atividades.filter(ativ => 
        ativ && ativ.id && ativ.clienteNome && ativ.data
      );
      
      atividadesValidas.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

      setAtividades(atividadesValidas.slice(0, 10));

    } catch (error) {
      console.error('Erro ao buscar atividades:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setHasError(false);
      
      try {
        await Promise.all([fetchMetrics(), fetchAlertas(), fetchAtividades()]);
      } catch (error) {
        console.error('Erro crítico ao carregar dados do dashboard:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const refetchData = async () => {
    setHasError(false);
    try {
      await Promise.all([fetchMetrics(), fetchAlertas(), fetchAtividades()]);
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
      setHasError(true);
    }
  };

  return {
    metrics,
    alertas,
    atividades,
    isLoading,
    hasError,
    refetchData
  };
};
