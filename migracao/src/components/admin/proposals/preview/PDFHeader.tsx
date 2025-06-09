
import React from 'react';
import { ProposalData } from '@/components/admin/hooks/proposal';
import { ProposalTemplateData } from '../templates/shared/types';
import PDFActions from './PDFActions';

interface PDFHeaderProps {
  proposal: ProposalData;
  template: ProposalTemplateData;
  onBack: () => void;
  pdfBlob?: Blob | null;
}

const PDFHeader: React.FC<PDFHeaderProps> = ({ 
  proposal, 
  template,
  onBack,
  pdfBlob
}) => {
  return (
    <div className="flex justify-between items-center p-4 border-b">
      <h3 className="text-lg font-medium">
        Proposta para {proposal.client_name || "Cliente"}
      </h3>
      <PDFActions 
        proposal={proposal} 
        template={template}
        pdfBlob={pdfBlob}
        onBack={onBack} 
      />
    </div>
  );
};

export default PDFHeader;
