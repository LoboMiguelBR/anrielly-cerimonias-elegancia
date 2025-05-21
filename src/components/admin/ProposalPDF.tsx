
import React from 'react';
import { ProposalData } from './hooks/proposal';
import { ProposalTemplateData } from './proposals/templates/shared/types';
import { defaultTemplate } from './proposals/templates/shared/templateService';
import ProposalDocument from './pdf/ProposalDocument';
import { ProposalHelper } from './pdf/utils/ProposalHelper';

interface ProposalProps {
  proposal: ProposalData;
  template?: ProposalTemplateData;
}

const ProposalPDF: React.FC<ProposalProps> = ({ proposal, template = defaultTemplate }) => {
  // Ensure we have valid data with fallbacks
  const safeProposal = ProposalHelper.ensureValidProposal(proposal);
  
  return (
    <ProposalDocument 
      proposal={safeProposal}
      template={template}
    />
  );
};

export default ProposalPDF;
