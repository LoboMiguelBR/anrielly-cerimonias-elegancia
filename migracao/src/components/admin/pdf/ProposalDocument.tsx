
import React from 'react';
import { Document } from '@react-pdf/renderer';
import { ProposalData } from '../hooks/proposal';
import { ProposalTemplateData } from '../proposals/templates/shared/types';
import { CoverPage } from './pages/CoverPage';
import { MainContentPage } from './pages/MainContentPage';
import { ServicesAndPricingPage } from './pages/ServicesAndPricingPage';
import { TestimonialsAndSignaturePage } from './pages/TestimonialsAndSignaturePage';

interface ProposalDocumentProps {
  proposal: ProposalData;
  template?: ProposalTemplateData;
}

// Default template inline
const defaultTemplate: ProposalTemplateData = {
  id: 'default',
  name: 'Template Padrão',
  colors: {
    primary: '#8A2BE2',
    secondary: '#F2AE30',
    accent: '#E57373',
    text: '#333333',
    background: '#FFFFFF'
  },
  fonts: {
    title: 'Playfair Display, serif',
    body: 'Inter, sans-serif'
  },
  logo: "https://oampddkpuybkbwqggrty.supabase.co/storage/v1/object/public/proposals/LogoAG.png",
  showQrCode: true,
  showTestimonials: true,
  showDifferentials: true,
  showAboutSection: true
};

const ProposalDocument: React.FC<ProposalDocumentProps> = ({ 
  proposal, 
  template = defaultTemplate 
}) => {
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
