
import React, { useState } from 'react';
import { ProposalData } from '@/components/admin/hooks/proposal';
import { ProposalTemplateData } from '../templates/shared/types';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import IncompletePropState from './IncompletePropState';
import PDFViewer from './PDFViewer';
import PDFGenerator from './PDFGenerator';
import { proposalUtils } from './utils/proposalUtils';
import { toast } from 'sonner';

interface PDFPreviewContentProps {
  proposal: ProposalData;
  template: ProposalTemplateData;
  isLoading: boolean;
  pdfError: string | null;
  onBack: () => void;
  onError: (error: string) => void;
  onPdfReady?: (blob: Blob) => void;
}

const PDFPreviewContent: React.FC<PDFPreviewContentProps> = ({ 
  proposal, 
  template,
  isLoading, 
  pdfError,
  onBack,
  onError,
  onPdfReady
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Check if all required proposal fields are filled
  const proposalIsComplete = proposalUtils.isProposalComplete(proposal);

  // Handle different states
  if (pdfError) {
    return <ErrorState errorMessage={pdfError} />;
  }

  if (isLoading || isGenerating) {
    return <LoadingState />;
  }

  if (!proposalIsComplete) {
    return <IncompletePropState proposal={proposal} onBack={onBack} />;
  }

  // Handle PDF blob generation
  const handlePdfReadyInternal = (blob: Blob) => {
    setIsGenerating(true);
    try {
      if (onPdfReady) {
        onPdfReady(blob);
      }
    } catch (error: any) {
      console.error('Error handling PDF blob:', error);
      toast.error('Erro ao processar o PDF');
      onError(error.message || 'Erro ao processar PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  // Render the PDF viewer with generated content
  return (
    <PDFGenerator
      proposal={proposal}
      template={template}
      onPdfReady={handlePdfReadyInternal}
      onError={onError}
    >
      {(pdfDocument) => (
        <PDFViewer
          proposal={proposal}
          template={template}
          pdfDocument={pdfDocument}
        />
      )}
    </PDFGenerator>
  );
};

export default PDFPreviewContent;
