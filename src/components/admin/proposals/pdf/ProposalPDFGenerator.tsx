
import React, { useState, useRef } from 'react';
import { ProposalData } from '../../hooks/proposal';
import { ProposalTemplateData } from '../api/proposalTemplates';
import { generateProposalHTML } from './utils/proposalHtmlTemplate';
import { usePDFGeneration } from './hooks/useProposalPDFGeneration';
import PDFActionButtons from '../../contracts/pdf/components/PDFActionButtons';
import CompactPDFView from '../../contracts/pdf/components/CompactPDFView';

interface ProposalPDFGeneratorProps {
  proposal: ProposalData;
  template?: ProposalTemplateData;
  onPdfReady?: (blob: Blob) => void;
  onError?: (error: string) => void;
  compact?: boolean;
}

const ProposalPDFGenerator: React.FC<ProposalPDFGeneratorProps> = ({
  proposal,
  template,
  onPdfReady,
  onError,
  compact = false
}) => {
  const [isViewing, setIsViewing] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  const { generatePDF, isGenerating } = usePDFGeneration({
    onSuccess: onPdfReady,
    onError: onError
  });

  const handleViewPDF = async () => {
    try {
      setIsViewing(true);
      
      const htmlContent = template 
        ? generateProposalHTML(proposal, template)
        : generateProposalHTML(proposal);
      
      if (iframeRef.current) {
        const doc = iframeRef.current.contentDocument;
        if (doc) {
          doc.open();
          doc.write(htmlContent);
          doc.close();
        }
      }
    } catch (error) {
      console.error('Error viewing PDF:', error);
      onError?.('Erro ao visualizar PDF');
    } finally {
      setIsViewing(false);
    }
  };

  const handleGeneratePDF = async () => {
    try {
      const htmlContent = template 
        ? generateProposalHTML(proposal, template)
        : generateProposalHTML(proposal);
      
      await generatePDF(htmlContent, `proposta_${proposal.client_name.replace(/\s+/g, '_').toLowerCase()}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      onError?.('Erro ao gerar PDF');
    }
  };

  if (compact) {
    return (
      <CompactPDFView
        onGeneratePDF={handleGeneratePDF}
        isGenerating={isGenerating}
      />
    );
  }

  return (
    <div className="space-y-4">
      <PDFActionButtons
        onViewPDF={handleViewPDF}
        onGeneratePDF={handleGeneratePDF}
        isViewing={isViewing}
        isGenerating={isGenerating}
      />
      
      <div className="border rounded-lg">
        <iframe
          ref={iframeRef}
          className="w-full h-[600px] border-none"
          title="Proposal Preview"
        />
      </div>
    </div>
  );
};

export default ProposalPDFGenerator;
