
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProposalData } from './proposal';

export const useProposalList = () => {
  const [proposals, setProposals] = useState<ProposalData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedProposal, setSelectedProposal] = useState<ProposalData | null>(null);
  const [showAddEditDialog, setShowAddEditDialog] = useState<boolean>(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);

  // Fetch all proposals
  const fetchProposals = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('proposals')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Convert data to the correct type using type assertion
      const typedProposals = data.map(item => ({
        ...item,
        services: (item.services as unknown) as Array<{name: string, included: boolean}>
      })) as ProposalData[];
      
      setProposals(typedProposals);
    } catch (error) {
      console.error('Erro ao buscar propostas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
    
    // Setup realtime subscription
    const channel = supabase
      .channel('proposals_changes')
      .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'proposals' },
          (payload) => {
            fetchProposals();
          })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleAddNew = () => {
    setSelectedProposal(null);
    setShowAddEditDialog(true);
  };

  const handleEdit = (proposal: ProposalData) => {
    setSelectedProposal(proposal);
    setShowAddEditDialog(true);
  };

  const handleDelete = (proposal: ProposalData) => {
    setSelectedProposal(proposal);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!selectedProposal) return;
    
    try {
      const { error } = await supabase
        .from('proposals')
        .delete()
        .eq('id', selectedProposal.id);
        
      if (error) throw error;
      
      await fetchProposals();
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Erro ao excluir proposta:', error);
    }
  };

  return {
    proposals,
    isLoading,
    selectedProposal,
    showAddEditDialog,
    showDeleteDialog,
    handleAddNew,
    handleEdit,
    handleDelete,
    handleDeleteConfirmed,
    setShowAddEditDialog,
    setShowDeleteDialog,
    fetchProposals
  };
};
