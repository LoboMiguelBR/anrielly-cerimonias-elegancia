
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGestaoComercial } from '@/hooks/useGestaoComercial';
import KanbanBoard from './funil/KanbanBoard';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ProposalGeneratorRefactored from '../proposals/ProposalGeneratorRefactored';
import { useQuoteRequests } from '@/hooks/useQuoteRequests';

const FunilVendas = () => {
  const { funilData, isLoading, updateItemStatus } = useGestaoComercial();
  const { data: quoteRequests = [] } = useQuoteRequests();
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);

  const handleCreateProposal = (quoteId: string) => {
    setSelectedQuoteId(quoteId);
    setShowProposalModal(true);
  };

  const handleCloseProposalModal = () => {
    setShowProposalModal(false);
    setSelectedQuoteId(null);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Funil de Vendas</CardTitle>
        </CardHeader>
        <CardContent>
          <KanbanBoard 
            funilData={funilData}
            onUpdateStatus={updateItemStatus}
            onCreateProposal={handleCreateProposal}
          />
        </CardContent>
      </Card>

      {/* Modal para criar proposta */}
      <Dialog open={showProposalModal} onOpenChange={setShowProposalModal}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nova Proposta</DialogTitle>
          </DialogHeader>
          
          <ProposalGeneratorRefactored 
            quoteRequests={quoteRequests}
            quoteIdFromUrl={selectedQuoteId}
            onClose={handleCloseProposalModal}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FunilVendas;
