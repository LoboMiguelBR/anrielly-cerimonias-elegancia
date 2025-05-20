
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
      
      if (data) {
        // Fix type conversion and ensure all fields are properly set
        const typedProposals = data.map(item => {
          // Ensure services is an array
          const services = Array.isArray(item.services) 
            ? item.services 
            : [];
            
          return {
            ...item,
            // Preserve all fields from the database
            id: item.id,
            client_name: item.client_name,
            client_email: item.client_email,
            client_phone: item.client_phone,
            event_type: item.event_type,
            event_date: item.event_date,
            event_location: item.event_location,
            services: services,
            total_price: Number(item.total_price),
            payment_terms: item.payment_terms,
            notes: item.notes,
            quote_request_id: item.quote_request_id,
            validity_date: item.validity_date,
            created_at: item.created_at,
          } as ProposalData;
        });
        
        setProposals(typedProposals);
      }
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
