
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ProposalData } from './proposal/types';
import { fetchProposals, deleteProposal } from './proposal/proposalApi';

export interface UseProposalListReturn {
  proposals: ProposalData[];
  isLoading: boolean;
  selectedProposal: ProposalData | null;
  showAddEditDialog: boolean;
  showDeleteDialog: boolean;
  refetch: () => void;
  handleAddNew: () => void;
  handleEdit: (proposal: ProposalData) => void;
  handleDelete: (proposal: ProposalData) => void;
  handleDeleteConfirmed: () => Promise<void>;
  setShowAddEditDialog: (show: boolean) => void;
  setShowDeleteDialog: (show: boolean) => void;
}

export const useProposalList = (): UseProposalListReturn => {
  const [proposals, setProposals] = useState<ProposalData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProposal, setSelectedProposal] = useState<ProposalData | null>(null);
  const [showAddEditDialog, setShowAddEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    loadProposals();
  }, []);

  const loadProposals = async () => {
    setIsLoading(true);
    try {
      const fetchedProposals = await fetchProposals();
      setProposals(fetchedProposals);
    } catch (error) {
      console.error('Error loading proposals:', error);
      toast.error('Erro ao carregar propostas');
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = () => {
    loadProposals();
  };

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
    if (!selectedProposal?.id) return;

    try {
      const success = await deleteProposal(selectedProposal.id);
      if (success) {
        setProposals(prev => prev.filter(p => p.id !== selectedProposal.id));
        toast.success('Proposta excluída com sucesso!');
        setShowDeleteDialog(false);
        setSelectedProposal(null);
      }
    } catch (error) {
      console.error('Error deleting proposal:', error);
      toast.error('Erro ao excluir proposta');
    }
  };

  return {
    proposals,
    isLoading,
    selectedProposal,
    showAddEditDialog,
    showDeleteDialog,
    refetch,
    handleAddNew,
    handleEdit,
    handleDelete,
    handleDeleteConfirmed,
    setShowAddEditDialog,
    setShowDeleteDialog
  };
};
