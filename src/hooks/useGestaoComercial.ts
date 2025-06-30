
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuoteRequests } from './useQuoteRequests';
import { useFunilData } from './gestao-comercial/useFunilData';
import { useFinancialMetrics } from './gestao-comercial/useFinancialMetrics';
import { useStatusUpdater } from './gestao-comercial/useStatusUpdater';

// Re-export types for backward compatibility
export type { FunilItem, FinancialMetrics } from './gestao-comercial/types';

export const useGestaoComercial = () => {
  const [proposals, setProposals] = useState<any[]>([]);
  const [contracts, setContracts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: quoteRequests = [], mutate: mutateQuotes } = useQuoteRequests();

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

  // Wrapper para converter mutateQuotes para Promise<void>
  const refetchQuotes = async (): Promise<void> => {
    try {
      await mutateQuotes();
    } catch (error) {
      console.error('Erro ao refetch quotes:', error);
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

  // Use hooks compostos
  const funilData = useFunilData(quoteRequests, proposals, contracts);
  const financialMetrics = useFinancialMetrics(quoteRequests, proposals, contracts);
  const { updateItemStatus } = useStatusUpdater(
    proposals,
    contracts,
    refetchQuotes,
    fetchProposals,
    fetchContracts
  );

  return {
    funilData,
    financialMetrics,
    isLoading,
    updateItemStatus,
    refetch: async () => {
      await Promise.all([fetchProposals(), fetchContracts(), refetchQuotes()]);
    }
  };
};
