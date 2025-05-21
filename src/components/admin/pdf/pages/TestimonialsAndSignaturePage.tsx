
import React from 'react';
import { Page, View, Text } from '@react-pdf/renderer';
import { ProposalData } from '../../hooks/proposal';
import { ProposalTemplateData } from '../../proposals/templates/shared/types';
import { styles } from '../styles';
import { PDFHeader } from '../PDFHeader';
import { TestimonialsSection } from '../TestimonialsSection';
import { QRCodeSection } from '../QRCodeSection';
import { PDFFooter } from '../PDFFooter';

interface TestimonialsAndSignaturePageProps {
  proposal: ProposalData;
  template: ProposalTemplateData;
}

export const TestimonialsAndSignaturePage: React.FC<TestimonialsAndSignaturePageProps> = ({ proposal, template }) => {
  const customStyles = {
    ...styles,
    signature: {
      ...styles.signature, 
      borderTopColor: template.colors.primary,
      width: 250, // Fixed width instead of percentage
    },
  };

  // Create formatted dates
  const createdDate = proposal.created_at 
    ? new Date(proposal.created_at).toLocaleDateString('pt-BR')
    : new Date().toLocaleDateString('pt-BR');
  
  const validUntil = proposal.validity_date 
    ? new Date(proposal.validity_date).toLocaleDateString('pt-BR')
    : new Date().toLocaleDateString('pt-BR');
  
  // Website URL with fallback
  const websiteUrl = "https://www.anriellygomes.com.br";

  return (
    <Page size="A4" style={styles.page}>
      <PDFHeader 
        proposalId={proposal.id} 
        createdDate={createdDate}
        colors={template.colors}
      />
      
      {template.showTestimonials && (
        <TestimonialsSection colors={template.colors} />
      )}
      
      {template.showQrCode && (
        <QRCodeSection 
          url={websiteUrl} 
          colors={template.colors}
        />
      )}
      
      <View style={customStyles.signature}>
        <Text style={{color: template.colors.text, fontFamily: 'Helvetica'}}>
          Assinatura do Cliente
        </Text>
      </View>
      
      <PDFFooter 
        validUntil={validUntil}
        colors={template.colors}
      />
    </Page>
  );
};
