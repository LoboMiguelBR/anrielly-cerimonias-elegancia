
import { useMemo } from 'react';
import { FunilItem } from './types';

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

export const useFunilData = (
  quoteRequests: any[],
  proposals: any[],
  contracts: any[]
): Record<string, FunilItem[]> => {
  return useMemo((): Record<string, FunilItem[]> => {
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
};
