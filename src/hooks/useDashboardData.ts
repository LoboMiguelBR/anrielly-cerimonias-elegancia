
import { useState, useEffect, useCallback } from 'react';
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
  const safeNumber = useCallback((value: any): number => {
    if (typeof value === 'number' && !isNaN(value) && isFinite(value)) {
      return value;
    }
    return 0;
  }, []);

  // Função para validar dados de entrada
  const validateData = useCallback((data: any, fieldName: string): boolean => {
    if (!data) {
      console.warn(`useDashboardData: ${fieldName} is null/undefined`);
      return false;
    }
    return true;
  }, []);

  const fetchMetrics = useCallback(async () => {
    try {
      console.log('useDashboardData: Iniciando busca de métricas...');
      
      const hoje = new Date();
      const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
      const primeiroDiaMesPassado = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1);
      const ultimoDiaMesPassado = new Date(hoje.getFullYear(), hoje.getMonth(), 0);

      // Verificar conectividade com Supabase
      const { error: pingError } = await supabase.from('quote_requests').select('id').limit(1);
      if (pingError && pingError.message.includes('fetch')) {
        throw new Error('Erro de conectividade');
      }

      // Leads novos este mês
      const { count: leadsNovosMes, error: leadsError } = await supabase
        .from('quote_requests')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', primeiroDiaMes.toISOString());

      if (leadsError && !leadsError.message.includes('count')) {
        console.warn('useDashboardData: Erro ao buscar leads novos:', leadsError);
      }

      // Orçamentos pendentes
      const { count: orcamentosPendentes, error: orcError } = await supabase
        .from('proposals')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'draft');

      if (orcError && !orcError.message.includes('count')) {
        console.warn('useDashboardData: Erro ao buscar orçamentos pendentes:', orcError);
      }

      // Contratos em andamento
      const { count: contratosAndamento, error: contAndError } = await supabase
        .from('contracts')
        .select('*', { count: 'exact', head: true })
        .in('status', ['draft', 'sent']);

      if (contAndError && !contAndError.message.includes('count')) {
        console.warn('useDashboardData: Erro ao buscar contratos em andamento:', contAndError);
      }

      // Contratos assinados
      const { count: contratosAssinados, error: contAssError } = await supabase
        .from('contracts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'signed');

      if (contAssError && !contAssError.message.includes('count')) {
        console.warn('useDashboardData: Erro ao buscar contratos assinados:', contAssError);
      }

      // Valor total propostas com validação
      const { data: propostas, error: propError } = await supabase
        .from('proposals')
        .select('total_price')
        .eq('status', 'draft');

      if (propError && !propError.message.includes('count')) {
        console.warn('useDashboardData: Erro ao buscar valor das propostas:', propError);
      }

      const valorTotalPropostas = Array.isArray(propostas) 
        ? propostas.reduce((sum, p) => sum + safeNumber(p?.total_price), 0) 
        : 0;

      // Ticket médio contratos com validação
      const { data: contratos, error: contTicketError } = await supabase
        .from('contracts')
        .select('total_price')
        .eq('status', 'signed');

      if (contTicketError && !contTicketError.message.includes('count')) {
        console.warn('useDashboardData: Erro ao buscar valor dos contratos:', contTicketError);
      }

      const ticketMedioContratos = Array.isArray(contratos) && contratos.length > 0
        ? contratos.reduce((sum, c) => sum + safeNumber(c?.total_price), 0) / contratos.length 
        : 0;

      // Taxa de conversão (leads -> contratos) com validação
      const leadsSafe = safeNumber(leadsNovosMes);
      const contratosSafe = safeNumber(contratosAssinados);
      const taxaConversao = leadsSafe > 0 ? (contratosSafe / leadsSafe) * 100 : 0;

      // Leads mês passado para crescimento
      const { count: leadsMesPassado, error: leadsPrevError } = await supabase
        .from('quote_requests')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', primeiroDiaMesPassado.toISOString())
        .lte('created_at', ultimoDiaMesPassado.toISOString());

      if (leadsPrevError && !leadsPrevError.message.includes('count')) {
        console.warn('useDashboardData: Erro ao buscar leads mês passado:', leadsPrevError);
      }

      const leadsPrevSafe = safeNumber(leadsMesPassado);
      const crescimentoMensal = leadsPrevSafe > 0 
        ? ((leadsSafe - leadsPrevSafe) / leadsPrevSafe) * 100 
        : 0;

      const newMetrics = {
        leadsNovosMes: leadsSafe,
        orcamentosPendentes: safeNumber(orcamentosPendentes),
        contratosAndamento: safeNumber(contratosAndamento),
        contratosAssinados: contratosSafe,
        valorTotalPropostas: safeNumber(valorTotalPropostas),
        ticketMedioContratos: safeNumber(ticketMedioContratos),
        taxaConversao: safeNumber(taxaConversao),
        crescimentoMensal: safeNumber(crescimentoMensal),
      };

      console.log('useDashboardData: Métricas calculadas:', newMetrics);
      setMetrics(newMetrics);

    } catch (error) {
      console.error('useDashboardData: Erro crítico ao buscar métricas:', error);
      setHasError(true);
    }
  }, [safeNumber]);

  const fetchAlertas = useCallback(async () => {
    try {
      console.log('useDashboardData: Buscando alertas...');
      const alertasArray: AlertaOperacional[] = [];
      const seteDiasAtras = new Date();
      seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);

      // Orçamentos antigos sem retorno com validação
      const { data: orcamentosAntigos, error: orcAntigosError } = await supabase
        .from('proposals')
        .select('id, client_name, client_email, updated_at')
        .eq('status', 'draft')
        .lt('updated_at', seteDiasAtras.toISOString());

      if (orcAntigosError) {
        console.warn('useDashboardData: Erro ao buscar orçamentos antigos:', orcAntigosError);
      }

      if (Array.isArray(orcamentosAntigos)) {
        orcamentosAntigos.forEach(orc => {
          if (validateData(orc, 'orçamento') && orc.id && orc.client_name) {
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
      }

      // Contratos próximos do vencimento com validação
      const cincoDiasFrente = new Date();
      cincoDiasFrente.setDate(cincoDiasFrente.getDate() + 5);

      const { data: contratosVencendo, error: contVencError } = await supabase
        .from('contracts')
        .select('id, client_name, event_date')
        .in('status', ['draft', 'sent'])
        .lt('event_date', cincoDiasFrente.toISOString());

      if (contVencError) {
        console.warn('useDashboardData: Erro ao buscar contratos vencendo:', contVencError);
      }

      if (Array.isArray(contratosVencendo)) {
        contratosVencendo.forEach(cont => {
          if (validateData(cont, 'contrato') && cont.id && cont.client_name) {
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
      }

      console.log('useDashboardData: Alertas encontrados:', alertasArray.length);
      setAlertas(alertasArray);

    } catch (error) {
      console.error('useDashboardData: Erro ao buscar alertas:', error);
    }
  }, [validateData]);

  const fetchAtividades = useCallback(async () => {
    try {
      console.log('useDashboardData: Buscando atividades...');
      const atividades: AtividadeRecente[] = [];

      // Últimos leads com validação
      const { data: leads, error: leadsError } = await supabase
        .from('quote_requests')
        .select('id, name, email, created_at, status')
        .order('created_at', { ascending: false })
        .limit(5);

      if (leadsError) {
        console.warn('useDashboardData: Erro ao buscar leads recentes:', leadsError);
      }

      if (Array.isArray(leads)) {
        leads.forEach(lead => {
          if (validateData(lead, 'lead') && lead.id && lead.name && lead.email) {
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
      }

      // Últimas propostas com validação
      const { data: propostas, error: propError } = await supabase
        .from('proposals')
        .select('id, client_name, client_email, created_at, status, total_price')
        .order('created_at', { ascending: false })
        .limit(5);

      if (propError) {
        console.warn('useDashboardData: Erro ao buscar propostas recentes:', propError);
      }

      if (Array.isArray(propostas)) {
        propostas.forEach(prop => {
          if (validateData(prop, 'proposta') && prop.id && prop.client_name && prop.client_email) {
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
      }

      // Últimos contratos com validação
      const { data: contratos, error: contError } = await supabase
        .from('contracts')
        .select('id, client_name, client_email, created_at, status, total_price')
        .order('created_at', { ascending: false })
        .limit(5);

      if (contError) {
        console.warn('useDashboardData: Erro ao buscar contratos recentes:', contError);
      }

      if (Array.isArray(contratos)) {
        contratos.forEach(cont => {
          if (validateData(cont, 'contrato') && cont.id && cont.client_name && cont.client_email) {
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
      }

      // Ordenar por data mais recente e filtrar itens válidos
      const atividadesValidas = atividades.filter(ativ => 
        ativ && ativ.id && ativ.clienteNome && ativ.data
      );
      
      atividadesValidas.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

      console.log('useDashboardData: Atividades processadas:', atividadesValidas.length);
      setAtividades(atividadesValidas.slice(0, 10));

    } catch (error) {
      console.error('useDashboardData: Erro ao buscar atividades:', error);
    }
  }, [validateData, safeNumber]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setHasError(false);
      
      try {
        console.log('useDashboardData: Carregando dados do dashboard...');
        await Promise.all([fetchMetrics(), fetchAlertas(), fetchAtividades()]);
        console.log('useDashboardData: Dados carregados com sucesso');
      } catch (error) {
        console.error('useDashboardData: Erro crítico ao carregar dados do dashboard:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [fetchMetrics, fetchAlertas, fetchAtividades]);

  const refetchData = useCallback(async () => {
    setHasError(false);
    try {
      console.log('useDashboardData: Atualizando dados...');
      await Promise.all([fetchMetrics(), fetchAlertas(), fetchAtividades()]);
      console.log('useDashboardData: Dados atualizados com sucesso');
    } catch (error) {
      console.error('useDashboardData: Erro ao atualizar dados:', error);
      setHasError(true);
    }
  }, [fetchMetrics, fetchAlertas, fetchAtividades]);

  return {
    metrics,
    alertas,
    atividades,
    isLoading,
    hasError,
    refetchData
  };
};
