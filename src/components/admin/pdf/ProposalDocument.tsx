
import React from 'react';
import { Document } from '@react-pdf/renderer';
import { ProposalData } from '../hooks/proposal';
import { ProposalTemplateData } from '../proposals/templates/shared/types';
import { defaultTemplate } from '../proposals/templates/shared/templateService';
import { CoverPage } from './pages/CoverPage';
import { MainContentPage } from './pages/MainContentPage';
import { ServicesAndPricingPage } from './pages/ServicesAndPricingPage';
import { TestimonialsAndSignaturePage } from './pages/TestimonialsAndSignaturePage';

interface ProposalDocumentProps {
  proposal: ProposalData;
  template?: ProposalTemplateData;
}

const ProposalDocument: React.FC<ProposalDocumentProps> = ({ 
  proposal, 
  template = defaultTemplate 
}) => {
  // Apply template colors to styles with same logic as before
  
  return (
    <Document>
      <CoverPage 
        proposal={proposal}
        template={template}
      />
      <MainContentPage 
        proposal={proposal}
        template={template}
      />
      <ServicesAndPricingPage 
        proposal={proposal}
        template={template}
      />
      <TestimonialsAndSignaturePage 
        proposal={proposal}
        template={template}
      />
    </Document>
  );
};

export default ProposalDocument;
