
import React, { useState, useEffect, useRef } from 'react';
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
  const [hasGenerated, setHasGenerated] = useState<boolean>(false);
  const mountedRef = useRef(true);

  // Generate PDF blob when component mounts
  useEffect(() => {
    // Add this flag to prevent infinite loop
    if (hasGenerated) return;

    const generatePdf = async () => {
      try {
        const doc = <ProposalPDF proposal={proposal} template={template} />;
        
        if (!mountedRef.current) return;
        
        setPdfDocument(doc);
        setHasGenerated(true);
        
        // Generate PDF blob if callback is provided
        if (onPdfReady) {
          const blob = await pdf(doc).toBlob();
          
          if (!mountedRef.current) return;
          
          onPdfReady(blob);
        }
      } catch (error: any) {
        console.error('Error generating PDF blob:', error);
        if (mountedRef.current) {
          onError(error.message || 'Erro ao gerar PDF');
        }
      }
    };
    
    generatePdf();
    
    return () => {
      mountedRef.current = false;
    };
  }, [proposal.id, template.id, hasGenerated, onPdfReady, onError]);

  return <>{children(pdfDocument)}</>;
};

export default PDFGenerator;
