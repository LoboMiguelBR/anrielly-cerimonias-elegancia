
import React, { useState, useEffect } from 'react';
import { pdf } from '@react-pdf/renderer';
import { ProposalData } from '@/components/admin/hooks/proposal';
import { ProposalTemplateData } from '../templates/shared/types';
import ProposalPDF from '@/components/admin/ProposalPDF';

interface PDFGeneratorProps {
  proposal: ProposalData;
  template: ProposalTemplateData;
  onPdfReady?: (blob: Blob) => void;
  onError: (error: string) => void;
  children: (pdfDocument: React.ReactElement | null) => React.ReactNode;
}

const PDFGenerator: React.FC<PDFGeneratorProps> = ({
  proposal,
  template,
  onPdfReady,
  onError,
  children
}) => {
  const [pdfDocument, setPdfDocument] = useState<React.ReactElement | null>(null);

  // Generate PDF blob when component mounts
  useEffect(() => {
    const generatePdf = async () => {
      try {
        const doc = <ProposalPDF proposal={proposal} template={template} />;
        setPdfDocument(doc);
        
        // Generate PDF blob if callback is provided
        if (onPdfReady) {
          const blob = await pdf(doc).toBlob();
          onPdfReady(blob);
        }
      } catch (error: any) {
        console.error('Error generating PDF blob:', error);
        onError(error.message || 'Erro ao gerar PDF');
      }
    };
    
    generatePdf();
  }, [proposal, template, onPdfReady, onError]);

  return <>{children(pdfDocument)}</>;
};

export default PDFGenerator;
