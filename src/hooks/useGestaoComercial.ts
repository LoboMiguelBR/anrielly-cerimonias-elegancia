
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuoteRequests } from './useQuoteRequests';

export interface FunilItem {
  id: string;
  name: string;
  email: string;
  phone?: string;
  event_type: string;
  event_date?: string;
  event_location?: string;
  status: string;
  type: 'quote' | 'proposal' | 'contract';
  created_at: string;
  total_price?: number;
  originalId: string; // Para rastrear o ID original
}

export interface FinancialMetrics {
  orcamentosAbertos: number;
  contratosAndamento: number;
  contratosAssinados: number;
  valorOrcamentosAbertos: number;
  valorContratosAssinados: number;
  ticketMedio: number;
  taxaConversao: number;
}

export const useGestaoComercial = () => {
  const [proposals, setProposals] = useState<any[]>([]);
  const [contracts, setContracts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: quoteRequests = [] } = useQuoteRequests();

  const fetchProposals = async () => {
    try {
      const { data, error } = await supabase
        .from('proposals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProposals(data || []);
    } catch (error) {
      console.error('Erro ao buscar propostas:', error);
    }
  };

  const fetchContracts = async () => {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContracts(data || []);
    } catch (error) {
      console.error('Erro ao buscar contratos:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchProposals(), fetchContracts()]);
      setIsLoading(false);
    };
    
    loadData();
  }, []);

  // Função para determinar o estágio correto no funil baseado no tipo e status
  const getCorrectFunilStage = (item: FunilItem) => {
    if (item.status === 'perdido') return 'perdido';
    
    switch (item.type) {
      case 'quote':
        if (['aguardando', 'novo'].includes(item.status)) return 'lead-captado';
        if (item.status === 'contatado') return 'contato-realizado';
        break;
      case 'proposal':
        if (['draft', 'enviado'].includes(item.status)) return 'orcamento-enviado';
        if (item.status === 'negociacao') return 'em-negociacao';
        if (item.status === 'aprovado') return 'pronto-contrato';
        break;
      case 'contract':
        if (item.status === 'assinado') return 'contrato-assinado';
        break;
    }
    return 'lead-captado'; // fallback
  };

  // Converter dados para o funil com deduplicação
  const getFunilData = useMemo((): Record<string, FunilItem[]> => {
    const processedItems = new Map<string, FunilItem>();

    // Processar quotes
    quoteRequests.forEach(quote => {
      const item: FunilItem = {
        id: `quote-${quote.id}`,
        originalId: quote.id,
        name: quote.name,
        email: quote.email,
        phone: quote.phone,
        event_type: quote.event_type,
        event_date: quote.event_date,
        event_location: quote.event_location,
        status: quote.status || 'aguardando',
        type: 'quote',
        created_at: quote.created_at
      };
      
      // Usar email como chave única para evitar duplicação
      const key = `${quote.email}-${quote.event_type}`;
      if (!processedItems.has(key) || processedItems.get(key)!.type === 'quote') {
        processedItems.set(key, item);
      }
    });

    // Processar propostas (sobrescrever quotes relacionados)
    proposals.forEach(proposal => {
      const item: FunilItem = {
        id: `proposal-${proposal.id}`,
        originalId: proposal.id,
        name: proposal.client_name,
        email: proposal.client_email,
        phone: proposal.client_phone,
        event_type: proposal.event_type,
        event_date: proposal.event_date,
        event_location: proposal.event_location,
        status: proposal.status || 'draft',
        type: 'proposal',
        created_at: proposal.created_at,
        total_price: proposal.total_price
      };
      
      const key = `${proposal.client_email}-${proposal.event_type}`;
      processedItems.set(key, item);
    });

    // Processar contratos (sobrescrever propostas relacionadas)
    contracts.forEach(contract => {
      const item: FunilItem = {
        id: `contract-${contract.id}`,
        originalId: contract.id,
        name: contract.client_name,
        email: contract.client_email,
        phone: contract.client_phone,
        event_type: contract.event_type,
        event_date: contract.event_date,
        event_location: contract.event_location,
        status: contract.status || 'draft',
        type: 'contract',
        created_at: contract.created_at,
        total_price: contract.total_price
      };
      
      const key = `${contract.client_email}-${contract.event_type}`;
      processedItems.set(key, item);
    });

    // Agrupar por estágio do funil
    const grouped: Record<string, FunilItem[]> = {
      'lead-captado': [],
      'contato-realizado': [],
      'orcamento-enviado': [],
      'em-negociacao': [],
      'pronto-contrato': [],
      'contrato-assinado': [],
      'perdido': []
    };

    processedItems.forEach(item => {
      const stage = getCorrectFunilStage(item);
      grouped[stage].push(item);
    });

    // Ordenar por data de criação (mais recente primeiro)
    Object.keys(grouped).forEach(stage => {
      grouped[stage].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    });

    return grouped;
  }, [quoteRequests, proposals, contracts]);

  // Calcular métricas financeiras
  const getFinancialMetrics = (): FinancialMetrics => {
    const orcamentosAbertos = proposals.filter(p => p.status === 'enviado').length;
    const contratosAndamento = contracts.filter(c => c.status === 'em_andamento').length;
    const contratosAssinados = contracts.filter(c => c.status === 'assinado').length;
    
    const valorOrcamentosAbertos = proposals
      .filter(p => p.status === 'enviado')
      .reduce((sum, p) => sum + (parseFloat(p.total_price) || 0), 0);
    
    const valorContratosAssinados = contracts
      .filter(c => c.status === 'assinado')
      .reduce((sum, c) => sum + (parseFloat(c.total_price) || 0), 0);
    
    const ticketMedio = contratosAssinados > 0 ? valorContratosAssinados / contratosAssinados : 0;
    
    const totalLeads = quoteRequests.length;
    const taxaConversao = totalLeads > 0 ? (contratosAssinados / totalLeads) * 100 : 0;

    return {
      orcamentosAbertos,
      contratosAndamento,
      contratosAssinados,
      valorOrcamentosAbertos,
      valorContratosAssinados,
      ticketMedio,
      taxaConversao
    };
  };

  const updateItemStatus = async (itemId: string, newStatus: string, itemType: 'quote' | 'proposal' | 'contract') => {
    try {
      console.log('Updating item status:', { itemId, newStatus, itemType });
      
      // Extrair o ID real removendo o prefixo
      const realId = itemId.replace(`${itemType}-`, '');
      
      switch (itemType) {
        case 'quote':
          const { error: quoteError } = await supabase
            .from('quote_requests')
            .update({ status: newStatus })
            .eq('id', realId);
          if (quoteError) throw quoteError;
          break;
          
        case 'proposal':
          const { error: proposalError } = await supabase
            .from('proposals')
            .update({ status: newStatus })
            .eq('id', realId);
          if (proposalError) throw proposalError;
          
          // Se a proposta foi aprovada, criar um evento automaticamente
          if (newStatus === 'aprovado') {
            await createEventFromProposal(realId);
          }
          break;
          
        case 'contract':
          const { error: contractError } = await supabase
            .from('contracts')
            .update({ status: newStatus })
            .eq('id', realId);
          if (contractError) throw contractError;
          break;
          
        default:
          throw new Error(`Tipo de item inválido: ${itemType}`);
      }

      // Recarregar dados após atualização
      await Promise.all([fetchProposals(), fetchContracts()]);
      
      console.log('Status updated successfully');
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      throw error;
    }
  };

  // Função para criar evento automaticamente quando proposta é aprovada
  const createEventFromProposal = async (proposalId: string) => {
    try {
      const proposal = proposals.find(p => p.id === proposalId);
      if (!proposal) return;

      const { error } = await supabase
        .from('events')
        .insert([{
          type: proposal.event_type,
          date: proposal.event_date,
          location: proposal.event_location,
          description: `Evento criado automaticamente da proposta aprovada para ${proposal.client_name}`,
          status: 'em_planejamento',
          proposal_id: proposalId,
          notes: proposal.notes
        }]);

      if (error) {
        console.error('Erro ao criar evento:', error);
      } else {
        console.log('Evento criado automaticamente para proposta:', proposalId);
      }
    } catch (error) {
      console.error('Erro ao criar evento automaticamente:', error);
    }
  };

  return {
    funilData: getFunilData,
    financialMetrics: getFinancialMetrics(),
    isLoading,
    updateItemStatus,
    refetch: async () => {
      await Promise.all([fetchProposals(), fetchContracts()]);
    }
  };
};
