
import { useState, useEffect } from 'react';
import { ProposalsTable, EmptyState, LoadingState } from './index';
import { useProposalList } from '../../hooks/useProposalList';
import { ProposalData } from '../../hooks/proposal';

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
  onViewProposal: (proposal: ProposalData) => void;
  onCreateNew: () => void;
}

const ProposalsList: React.FC<ProposalsListProps> = ({ 
  quoteRequests, 
  quoteIdFromUrl,
  onViewProposal,
  onCreateNew
}) => {
  const {
    proposals,
    isLoading,
    handleDelete
  } = useProposalList();

  const handleViewProposal = (proposal: ProposalData) => {
    onViewProposal(proposal);
  };

  return (
    <div className="space-y-4">
      {isLoading ? (
        <LoadingState />
      ) : proposals.length === 0 ? (
        <EmptyState onAddNew={onCreateNew} />
      ) : (
        <ProposalsTable 
          proposals={proposals} 
          onEdit={handleViewProposal}
          onDelete={handleDelete} 
        />
      )}
    </div>
  );
};

export default ProposalsList;
