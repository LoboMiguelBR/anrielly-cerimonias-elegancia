
import React from 'react';
import { Page, View } from '@react-pdf/renderer';
import { ProposalData } from '../../hooks/proposal';
import { ProposalTemplateData } from '../../proposals/templates/shared/types';
import { styles } from '../styles';
import { PDFHeader } from '../PDFHeader';
import { PDFTitle } from '../PDFTitle';
import { ClientInfoSection } from '../ClientInfoSection';
import { EventDetailsSection } from '../EventDetailsSection';
import { AboutSection } from '../AboutSection';

interface MainContentPageProps {
  proposal: ProposalData;
  template: ProposalTemplateData;
}

export const MainContentPage: React.FC<MainContentPageProps> = ({ proposal, template }) => {
  const customStyles = {
    ...styles,
    divider: {
      ...styles.divider, 
      borderBottomColor: template.colors.primary,
    },
  };

  // Create formatted dates
  const createdDate = proposal.created_at 
    ? new Date(proposal.created_at).toLocaleDateString('pt-BR')
    : new Date().toLocaleDateString('pt-BR');
  
  const formattedDate = proposal.event_date 
    ? new Date(proposal.event_date).toLocaleDateString('pt-BR')
    : 'A definir';

  return (
    <Page size="A4" style={styles.page}>
      <PDFHeader 
        proposalId={proposal.id} 
        createdDate={createdDate}
        colors={template.colors}
      />
      
      <PDFTitle 
        eventType={proposal.event_type} 
        colors={template.colors}
      />
      
      <View style={customStyles.divider} />
      
      <ClientInfoSection 
        client={proposal} 
        colors={template.colors}
      />
      
      <EventDetailsSection 
        eventType={proposal.event_type}
        eventDate={formattedDate}
        eventLocation={proposal.event_location}
        colors={template.colors}
      />
      
      {template.showAboutSection && (
        <AboutSection colors={template.colors} />
      )}
    </Page>
  );
};
