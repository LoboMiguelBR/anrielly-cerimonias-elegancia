
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProposalData } from './proposal';
import { Service } from './proposal/types';
import { toast } from 'sonner';

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
        
      if (error) {
        console.error('Erro ao buscar propostas:', error);
        toast.error('Erro ao carregar propostas');
        throw error;
      }
      
      if (data) {
        // Fix type conversion and ensure all fields are properly set
        const typedProposals = data.map(item => {
          // Ensure services is an array of Service objects with name and included properties
          let parsedServices: Service[] = [];
          
          try {
            // Verificamos se services é um array e se cada item tem as propriedades necessárias
            if (item.services && typeof item.services === 'object') {
              if (Array.isArray(item.services)) {
                parsedServices = item.services.map((service: any) => ({
                  name: service.name || '',
                  included: service.included === undefined ? true : !!service.included
                }));
              } else {
                // Caso services não seja um array mas ainda seja um objeto
                console.warn('services não é um array:', item.services);
                parsedServices = [];
              }
            } else {
              // Fallback para um array vazio se services não for um objeto ou array
              console.warn('services não é um objeto ou está vazio:', item.services);
              parsedServices = [];
            }
          } catch (err) {
            console.error('Erro ao analisar services:', err, item.services);
            parsedServices = [];
          }
            
          return {
            id: item.id,
            client_name: item.client_name || 'Cliente sem nome',
            client_email: item.client_email || '',
            client_phone: item.client_phone || '',
            event_type: item.event_type || 'Evento',
            event_date: item.event_date,
            event_location: item.event_location || '',
            services: parsedServices,
            total_price: Number(item.total_price) || 0,
            payment_terms: item.payment_terms || '',
            notes: item.notes,
            quote_request_id: item.quote_request_id,
            validity_date: item.validity_date || new Date().toISOString().split('T')[0],
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
