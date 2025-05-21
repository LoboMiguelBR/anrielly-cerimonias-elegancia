
import React from 'react';
import { Page } from '@react-pdf/renderer';
import { ProposalData } from '../../hooks/proposal';
import { ProposalTemplateData } from '../../proposals/templates/shared/types';
import { styles } from '../styles';
import { PDFHeader } from '../PDFHeader';
import { ServicesSection } from '../ServicesSection';
import { DifferentialsSection } from '../DifferentialsSection';
import { PricingSection } from '../PricingSection';
import { NotesSection } from '../NotesSection';

interface ServicesAndPricingPageProps {
  proposal: ProposalData;
  template: ProposalTemplateData;
}

export const ServicesAndPricingPage: React.FC<ServicesAndPricingPageProps> = ({ proposal, template }) => {
  // Create formatted date
  const createdDate = proposal.created_at 
    ? new Date(proposal.created_at).toLocaleDateString('pt-BR')
    : new Date().toLocaleDateString('pt-BR');

  return (
    <Page size="A4" style={styles.page}>
      <PDFHeader 
        proposalId={proposal.id} 
        createdDate={createdDate}
        colors={template.colors}
      />
      
      <ServicesSection 
        services={proposal.services} 
        colors={template.colors}
      />
      
      {template.showDifferentials && (
        <DifferentialsSection colors={template.colors} />
      )}
      
      <PricingSection 
        totalPrice={proposal.total_price}
        paymentTerms={proposal.payment_terms}
        colors={template.colors}
      />
      
      <NotesSection 
        notes={proposal.notes} 
        colors={template.colors}
      />
    </Page>
  );
};
