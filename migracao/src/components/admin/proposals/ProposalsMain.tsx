
import React from 'react';
import { useProposalList } from '../hooks/useProposalList';
import { useProposalActions } from './hooks/useProposalActions';
import ProposalsHeader from './list/ProposalsHeader';
import ProposalsList from './list/ProposalsList';
import ProposalGeneratorRefactored from './ProposalGeneratorRefactored';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface QuoteRequest {
  id: string;
  name: string;
  eventType?: string;
  event_type?: string;
  email?: string;
  phone?: string;
  event_date?: string;
  event_location?: string;
}

interface ProposalsMainProps {
  quoteRequests: QuoteRequest[];
  quoteIdFromUrl?: string | null;
}

const ProposalsMain: React.FC<ProposalsMainProps> = ({ 
  quoteRequests, 
  quoteIdFromUrl 
}) => {
  const {
    proposals,
    isLoading,
    refetch
  } = useProposalList();

  const {
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
  } = useProposalActions({ refetch });

  // Enhanced handleCloseModal to ensure refetch is called
  const handleCloseModalWithRefetch = () => {
    handleCloseModal();
    refetch(); // Always refetch when closing the modal
  };

  if (currentView === 'view' && selectedProposal) {
    return (
      <ProposalGeneratorRefactored 
        quoteRequests={quoteRequests}
        initialProposalId={selectedProposal.id}
        onClose={handleCloseModalWithRefetch}
      />
    );
  }

  return (
    <div className="space-y-6">
      <ProposalsHeader onAddNew={handleCreate} />

      <ProposalsList 
        quoteRequests={quoteRequests} 
        quoteIdFromUrl={quoteIdFromUrl}
        onViewProposal={handleView}
        onCreateNew={handleCreate}
      />

      {/* Create/Edit Proposal Modal */}
      <Dialog open={showCreateModal || showEditModal} onOpenChange={handleCloseModalWithRefetch}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {showEditModal ? 'Editar Proposta' : 'Nova Proposta'}
            </DialogTitle>
            <DialogDescription>
              {showEditModal 
                ? `Editando proposta para ${selectedProposal?.client_name}`
                : 'Preencha os detalhes para criar uma nova proposta.'
              }
            </DialogDescription>
          </DialogHeader>
          
          <ProposalGeneratorRefactored 
            quoteRequests={quoteRequests}
            quoteIdFromUrl={quoteIdFromUrl}
            initialProposalId={showEditModal ? selectedProposal?.id : undefined}
            onClose={handleCloseModalWithRefetch}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onClose={() => setProposalToDelete(null)}
        onConfirm={confirmDelete}
        title="Excluir Proposta"
        description={`Tem certeza que deseja excluir a proposta para ${proposalToDelete?.client_name}? Esta ação não pode ser desfeita.`}
      />
    </div>
  );
};

export default ProposalsMain;
