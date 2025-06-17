
import React, { useState, useEffect, useRef } from 'react';
import { pdf } from '@react-pdf/renderer';
import { ProposalData } from '@/components/admin/hooks/proposal';
import { ProposalTemplateData } from '../templates/shared/types';
import ProposalPDF from '@/components/admin/ProposalPDF';

interface SimplifiedPDFGeneratorProps {
  proposal: ProposalData;
  template: ProposalTemplateData;
  onPdfReady?: (blob: Blob) => void;
  onError: (error: string) => void;
  children: (pdfDocument: React.ReactElement | null) => React.ReactNode;
}

const SimplifiedPDFGenerator: React.FC<SimplifiedPDFGeneratorProps> = ({
  proposal,
  template,
  onPdfReady,
  onError,
  children
}) => {
  const [pdfDocument, setPdfDocument] = useState<React.ReactElement | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const mountedRef = useRef(true);
  
  const templateWithLogo = {
    ...template,
    logo: template.logo || "https://oampddkpuybkbwqggrty.supabase.co/storage/v1/object/public/proposals/LogoAG.png"
  };

  useEffect(() => {
    const generatePdf = async () => {
      if (isGenerating) return;
      
      try {
        setIsGenerating(true);
        const doc = <ProposalPDF proposal={proposal} template={templateWithLogo} />;
        
        if (!mountedRef.current) return;
        
        setPdfDocument(doc);
        
        if (onPdfReady) {
          console.log('Generating PDF blob...');
          const blob = await pdf(doc).toBlob();
          
          if (!mountedRef.current) return;
          
          console.log('PDF blob generated successfully');
          onPdfReady(blob);
        }
      } catch (error: any) {
        console.error('Error generating PDF:', error);
        if (mountedRef.current) {
          onError(`Erro ao gerar PDF: ${error.message || 'Erro desconhecido'}`);
        }
      } finally {
        if (mountedRef.current) {
          setIsGenerating(false);
        }
      }
    };
    
    generatePdf();
    
    return () => {
      mountedRef.current = false;
    };
  }, [proposal.id, template.id]);

  return <>{children(pdfDocument)}</>;
};

export default SimplifiedPDFGenerator;
