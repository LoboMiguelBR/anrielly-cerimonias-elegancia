
import React, { useState } from 'react';
import { PDFViewer, PDFDownloadLink, pdf } from '@react-pdf/renderer';
import { ProposalData } from '@/components/admin/hooks/proposal';
import { ProposalTemplateData } from '../templates/shared/types';
import ProposalPDF from '@/components/admin/ProposalPDF';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import IncompletePropState from './IncompletePropState';
import { useEffect } from 'react';

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
  const [pdfDocument, setPdfDocument] = useState<React.ReactElement | null>(null);
  
  // Verifica se todos os campos necessários da proposta estão preenchidos
  const proposalIsComplete = proposal && 
                          proposal.client_name && 
                          proposal.event_type && 
                          Array.isArray(proposal.services) &&
                          proposal.services.length > 0;

  // Generate PDF blob for saving when component mounts
  useEffect(() => {
    const generatePdf = async () => {
      if (proposalIsComplete && onPdfReady) {
        try {
          const doc = <ProposalPDF proposal={proposal} template={template} />;
          setPdfDocument(doc);
          
          // Generate PDF blob
          const blob = await pdf(doc).toBlob();
          onPdfReady(blob);
        } catch (error: any) {
          console.error('Error generating PDF blob:', error);
          onError(error.message || 'Erro ao gerar PDF');
        }
      }
    };
    
    generatePdf();
  }, [proposal, template, proposalIsComplete, onPdfReady, onError]);

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
        {pdfDocument || <ProposalPDF proposal={proposal} template={template} />}
      </PDFViewer>
    </div>
  );
};

export default PDFPreviewContent;
