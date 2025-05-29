
import { useState, useEffect } from 'react';
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

  // Converter dados para o funil
  const getFunilData = (): Record<string, FunilItem[]> => {
    const funilItems: FunilItem[] = [];

    // Adicionar quote requests
    quoteRequests.forEach(quote => {
      funilItems.push({
        id: quote.id,
        name: quote.name,
        email: quote.email,
        phone: quote.phone,
        event_type: quote.event_type,
        event_date: quote.event_date,
        event_location: quote.event_location,
        status: quote.status || 'aguardando',
        type: 'quote',
        created_at: quote.created_at
      });
    });

    // Adicionar propostas
    proposals.forEach(proposal => {
      funilItems.push({
        id: proposal.id,
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
      });
    });

    // Adicionar contratos
    contracts.forEach(contract => {
      funilItems.push({
        id: contract.id,
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
      });
    });

    // Agrupar por status do funil
    const grouped: Record<string, FunilItem[]> = {
      'lead-captado': funilItems.filter(item => 
        (item.type === 'quote' && ['aguardando', 'novo'].includes(item.status))
      ),
      'contato-realizado': funilItems.filter(item => 
        (item.type === 'quote' && item.status === 'contatado')
      ),
      'orcamento-enviado': funilItems.filter(item => 
        (item.type === 'proposal' && ['enviado', 'draft'].includes(item.status))
      ),
      'em-negociacao': funilItems.filter(item => 
        (item.type === 'proposal' && item.status === 'negociacao')
      ),
      'pronto-contrato': funilItems.filter(item => 
        (item.type === 'proposal' && item.status === 'aprovado')
      ),
      'contrato-assinado': funilItems.filter(item => 
        (item.type === 'contract' && item.status === 'assinado')
      ),
      'perdido': funilItems.filter(item => item.status === 'perdido')
    };

    return grouped;
  };

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
      let table = '';
      switch (itemType) {
        case 'quote':
          table = 'quote_requests';
          break;
        case 'proposal':
          table = 'proposals';
          break;
        case 'contract':
          table = 'contracts';
          break;
      }

      const { error } = await supabase
        .from(table)
        .update({ status: newStatus })
        .eq('id', itemId);

      if (error) throw error;

      // Recarregar dados após atualização
      await Promise.all([fetchProposals(), fetchContracts()]);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      throw error;
    }
  };

  return {
    funilData: getFunilData(),
    financialMetrics: getFinancialMetrics(),
    isLoading,
    updateItemStatus,
    refetch: async () => {
      await Promise.all([fetchProposals(), fetchContracts()]);
    }
  };
};
