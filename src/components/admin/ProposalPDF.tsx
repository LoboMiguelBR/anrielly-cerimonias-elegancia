
import React from 'react';
import { ProposalData } from './hooks/proposal';
import { ProposalTemplateData } from './proposals/templates/shared/types';
import ProposalDocument from './pdf/ProposalDocument';
import { ProposalHelper } from './pdf/utils/ProposalHelper';

interface ProposalProps {
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

const ProposalPDF: React.FC<ProposalProps> = ({ proposal, template = defaultTemplate }) => {
  // Ensure we have valid data with comprehensive fallbacks for PDF generation
  const safeProposal = ProposalHelper.ensureValidProposal(proposal);
  
  // Additional validation for PDF generation
  if (!ProposalHelper.isValidForPDF(safeProposal)) {
    console.warn('ProposalPDF: Invalid proposal data provided', safeProposal);
    // Return a minimal document for invalid data
    return (
      <ProposalDocument 
        proposal={{
          ...safeProposal,
          client_name: safeProposal.client_name || 'Cliente',
          event_type: safeProposal.event_type || 'Evento',
          services: [],
          total_price: 0
        }}
        template={template}
      />
    );
  }
  
  return (
    <ProposalDocument 
      proposal={safeProposal}
      template={template}
    />
  );
};

export default ProposalPDF;
