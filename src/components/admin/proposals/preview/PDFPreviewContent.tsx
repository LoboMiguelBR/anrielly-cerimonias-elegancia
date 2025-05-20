
import React, { useState } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import { ProposalData } from '@/components/admin/pdf/types';
import ProposalPDF from '@/components/admin/ProposalPDF';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import IncompletePropState from './IncompletePropState';

interface PDFPreviewContentProps {
  proposal: ProposalData;
  isLoading: boolean;
  pdfError: string | null;
  onBack: () => void;
  onError: (error: string) => void;
}

const PDFPreviewContent: React.FC<PDFPreviewContentProps> = ({ 
  proposal, 
  isLoading, 
  pdfError,
  onBack,
  onError
}) => {
  // Verifica se todos os campos necessários da proposta estão preenchidos
  const proposalIsComplete = proposal && 
                          proposal.client_name && 
                          proposal.event_type && 
                          Array.isArray(proposal.services) &&
                          proposal.services.length > 0;

  // Handler para erros do PDFViewer (não pode usar onError diretamente)
  const handlePdfRenderError = () => {
    console.error('Erro ao renderizar PDF');
    onError('Ocorreu um erro ao renderizar o PDF. Verifique os dados da proposta.');
  };

  if (pdfError) {
    return <ErrorState errorMessage={pdfError} />;
  }

  if (isLoading) {
    return <LoadingState />;
  }

  if (!proposalIsComplete) {
    return <IncompletePropState proposal={proposal} onBack={onBack} />;
  }

  return (
    <div className="h-[800px]">
      <PDFViewer 
        width="100%" 
        height="100%" 
        className="border"
        showToolbar={true}
      >
        <ProposalPDF proposal={proposal} />
      </PDFViewer>
    </div>
  );
};

export default PDFPreviewContent;
