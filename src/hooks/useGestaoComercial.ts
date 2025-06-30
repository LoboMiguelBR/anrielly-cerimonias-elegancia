
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
  leadId?: string; // ID do lead original para rastreabilidade
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
  const { data: quoteRequests = [], mutate: refetchQuotes } = useQuoteRequests();

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

  // Função para determinar o estágio correto no funil baseado no Lead como origem
  const getCorrectFunilStage = (item: FunilItem) => {
    if (item.status === 'perdido') return 'perdido';
    
    switch (item.type) {
      case 'quote':
        if (['aguardando', 'novo'].includes(item.status)) return 'lead-captado';
        if (item.status === 'contatado') return 'contato-realizado';
        break;
      case 'proposal':
        if (['draft', 'rascunho'].includes(item.status)) return 'orcamento-enviado';
        if (item.status === 'enviado') return 'orcamento-enviado';
        if (item.status === 'negociacao') return 'em-negociacao';
        if (item.status === 'aprovado') return 'pronto-contrato';
        break;
      case 'contract':
        if (['draft', 'enviado', 'em_andamento'].includes(item.status)) return 'pronto-contrato';
        if (item.status === 'assinado') return 'contrato-assinado';
        break;
    }
    return 'lead-captado'; // fallback
  };

  // Converter dados para o funil com Lead como base - sem duplicação
  const getFunilData = useMemo((): Record<string, FunilItem[]> => {
    const processedItems = new Map<string, FunilItem>();

    // 1. Processar LEADS primeiro (base do funil)
    quoteRequests.forEach(quote => {
      const leadKey = `${quote.email}-${quote.event_type}-${quote.event_date || 'no-date'}`;
      const item: FunilItem = {
        id: `quote-${quote.id}`,
        originalId: quote.id,
        leadId: quote.id, // Rastreabilidade do lead original
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
      
      processedItems.set(leadKey, item);
    });

    // 2. Processar PROPOSTAS vinculadas aos leads
    proposals.forEach(proposal => {
      if (proposal.quote_request_id) {
        const relatedLead = quoteRequests.find(q => q.id === proposal.quote_request_id);
        if (relatedLead) {
          const leadKey = `${relatedLead.email}-${relatedLead.event_type}-${relatedLead.event_date || 'no-date'}`;
          const existingLead = processedItems.get(leadKey);
          
          if (existingLead) {
            // Atualizar o item existente para proposta, mantendo dados do lead
            const updatedItem: FunilItem = {
              ...existingLead,
              id: `proposal-${proposal.id}`,
              originalId: proposal.id,
              status: proposal.status || 'draft',
              type: 'proposal',
              created_at: proposal.created_at,
              total_price: proposal.total_price,
              // Manter dados do cliente da proposta se diferentes
              name: proposal.client_name || existingLead.name,
              email: proposal.client_email || existingLead.email,
              phone: proposal.client_phone || existingLead.phone,
            };
            
            processedItems.set(leadKey, updatedItem);
          }
        }
      }
    });

    // 3. Processar CONTRATOS vinculados às propostas/leads
    contracts.forEach(contract => {
      let relatedLead = null;
      
      // Buscar pelo proposal_id primeiro
      if (contract.proposal_id) {
        const relatedProposal = proposals.find(p => p.id === contract.proposal_id);
        if (relatedProposal && relatedProposal.quote_request_id) {
          relatedLead = quoteRequests.find(q => q.id === relatedProposal.quote_request_id);
        }
      }
      
      // Se não encontrou pelo proposal, buscar pelo quote_request_id direto
      if (!relatedLead && contract.quote_request_id) {
        relatedLead = quoteRequests.find(q => q.id === contract.quote_request_id);
      }
      
      if (relatedLead) {
        const leadKey = `${relatedLead.email}-${relatedLead.event_type}-${relatedLead.event_date || 'no-date'}`;
        const existingItem = processedItems.get(leadKey);
        
        if (existingItem) {
          // Atualizar para contrato, mantendo rastreabilidade do lead
          const updatedItem: FunilItem = {
            ...existingItem,
            id: `contract-${contract.id}`,
            originalId: contract.id,
            status: contract.status || 'draft',
            type: 'contract',
            created_at: contract.created_at,
            total_price: contract.total_price,
            // Manter dados do cliente do contrato se diferentes
            name: contract.client_name || existingItem.name,
            email: contract.client_email || existingItem.email,
            phone: contract.client_phone || existingItem.phone,
          };
          
          processedItems.set(leadKey, updatedItem);
        }
      }
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
          // Refetch quotes para atualizar o estado
          await refetchQuotes();
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
          
          // Se contrato foi assinado, criar cliente automaticamente
          if (newStatus === 'assinado') {
            await createClientFromContract(realId);
          }
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
          quote_id: proposal.quote_request_id,
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

  // Função para criar cliente automaticamente quando contrato é assinado
  const createClientFromContract = async (contractId: string) => {
    try {
      const contract = contracts.find(c => c.id === contractId);
      if (!contract) return;

      // Verificar se já existe cliente com este email
      const { data: existingClient } = await supabase
        .from('clientes')
        .select('id')
        .eq('email', contract.client_email)
        .maybeSingle();

      if (existingClient) {
        console.log('Cliente já existe:', existingClient.id);
        return;
      }

      const { error } = await supabase
        .from('clientes')
        .insert([{
          name: contract.client_name,
          email: contract.client_email,
          phone: contract.client_phone,
          event_type: contract.event_type,
          event_date: contract.event_date,
          event_location: contract.event_location,
          quote_id: contract.quote_request_id,
          origin: 'contrato_assinado',
          status: 'ativo'
        }]);

      if (error) {
        console.error('Erro ao criar cliente:', error);
      } else {
        console.log('Cliente criado automaticamente do contrato:', contractId);
      }
    } catch (error) {
      console.error('Erro ao criar cliente automaticamente:', error);
    }
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

  return {
    funilData: getFunilData,
    financialMetrics: getFinancialMetrics(),
    isLoading,
    updateItemStatus,
    refetch: async () => {
      await Promise.all([fetchProposals(), fetchContracts(), refetchQuotes()]);
    }
  };
};
