
import React from 'react';
import { Page } from '@react-pdf/renderer';
import { ProposalData } from '../../hooks/proposal';
import { ProposalTemplateData } from '../../proposals/templates/shared/types';
import { styles } from '../styles';
import { CoverPageComponent } from '../CoverPage';

interface CoverPageProps {
  proposal: ProposalData;
  template: ProposalTemplateData;
}

export const CoverPage: React.FC<CoverPageProps> = ({ proposal, template }) => {
  const customStyles = {
    ...styles,
    coverPage: {
      ...styles.coverPage,
      backgroundColor: template.colors.background,
    },
  };

  // Format date strings for better display with fallbacks
  const formattedDate = proposal.event_date 
    ? new Date(proposal.event_date).toLocaleDateString('pt-BR')
    : 'A definir';

  return (
    <Page size="A4" style={customStyles.page}>
      <CoverPageComponent 
        clientName={proposal.client_name}
        eventType={proposal.event_type}
        eventDate={formattedDate}
        totalPrice={proposal.total_price}
        logoUrl={template.logo}
        colors={template.colors}
      />
    </Page>
  );
};
