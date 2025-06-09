
import { useState } from 'react';
import { ProposalData } from '../../hooks/proposal';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface UseProposalActionsProps {
  refetch: () => void;
}

export const useProposalActions = ({ refetch }: UseProposalActionsProps) => {
  const [currentView, setCurrentView] = useState<'list' | 'create' | 'edit' | 'view'>('list');
  const [selectedProposal, setSelectedProposal] = useState<ProposalData | null>(null);
  const [proposalToDelete, setProposalToDelete] = useState<ProposalData | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = () => {
    setSelectedProposal(null);
    setCurrentView('create');
    setShowCreateModal(true);
  };

  const handleEdit = (proposal: ProposalData) => {
    setSelectedProposal(proposal);
    setCurrentView('edit');
    setShowEditModal(true);
  };

  const handleView = (proposal: ProposalData) => {
    setSelectedProposal(proposal);
    setCurrentView('view');
  };

  const handleDelete = (proposal: ProposalData) => {
    setProposalToDelete(proposal);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!proposalToDelete?.id) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('proposals')
        .delete()
        .eq('id', proposalToDelete.id);

      if (error) throw error;

      toast.success('Proposta excluída com sucesso!');
      setProposalToDelete(null);
      setShowDeleteDialog(false);
      refetch();
    } catch (error) {
      console.error('Error deleting proposal:', error);
      toast.error('Erro ao excluir proposta');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setCurrentView('list');
    setSelectedProposal(null);
  };

  return {
    currentView,
    selectedProposal,
    proposalToDelete,
    showCreateModal,
    showEditModal,
    showDeleteDialog,
    isSubmitting,
    handleCreate,
    handleEdit,
    handleView,
    handleDelete,
    confirmDelete,
    handleCloseModal,
    setProposalToDelete
  };
};
