
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import ProposalGenerator from './ProposalGenerator';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import { useProposalList } from '../hooks/useProposalList';
import { 
  ProposalsTable, 
  EmptyState, 
  LoadingState, 
  ProposalsHeader
} from './list';

interface ProposalsListProps {
  quoteRequests: Array<{
    id: string;
    name: string;
    eventType?: string;
    event_type?: string;
    email?: string;
    phone?: string;
    event_date?: string;
    event_location?: string;
  }>;
  quoteIdFromUrl?: string | null;
}

const ProposalsList: React.FC<ProposalsListProps> = ({ quoteRequests, quoteIdFromUrl }) => {
  const {
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
    setShowDeleteDialog
  } = useProposalList();

  return (
    <div className="space-y-4">
      <ProposalsHeader onAddNew={handleAddNew} />

      {isLoading ? (
        <LoadingState />
      ) : proposals.length === 0 ? (
        <EmptyState onAddNew={handleAddNew} />
      ) : (
        <ProposalsTable 
          proposals={proposals} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      )}

      {/* Add/Edit Proposal Dialog */}
      <Dialog open={showAddEditDialog} onOpenChange={setShowAddEditDialog}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedProposal ? 'Editar Proposta' : 'Nova Proposta'}</DialogTitle>
            <DialogDescription>
              {selectedProposal 
                ? `Editando proposta para ${selectedProposal.client_name}`
                : 'Preencha os detalhes para criar uma nova proposta.'
              }
            </DialogDescription>
          </DialogHeader>
          
          <ProposalGenerator 
            quoteRequests={quoteRequests}
            quoteIdFromUrl={quoteIdFromUrl}
            initialProposalId={selectedProposal?.id}
            onClose={() => setShowAddEditDialog(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirmed}
        title="Excluir Proposta"
        description={`Tem certeza que deseja excluir a proposta para ${selectedProposal?.client_name}? Esta ação não pode ser desfeita.`}
      />
    </div>
  );
};

export default ProposalsList;
