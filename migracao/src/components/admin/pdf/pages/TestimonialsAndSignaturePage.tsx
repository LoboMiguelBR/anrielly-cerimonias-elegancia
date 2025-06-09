
import React from 'react';
import { Page } from '@react-pdf/renderer';
import { ProposalData } from '../../hooks/proposal';
import { ProposalTemplateData } from '../../proposals/templates/shared/types';
import { styles } from '../styles';
import { TestimonialsSection } from '../TestimonialsSection';
import { QRCodeSection } from '../QRCodeSection';
import { AboutSection } from '../AboutSection';

interface TestimonialsAndSignaturePageProps {
  proposal: ProposalData;
  template: ProposalTemplateData;
}

export const TestimonialsAndSignaturePage: React.FC<TestimonialsAndSignaturePageProps> = ({ 
  proposal, 
  template 
}) => {
  // Website URL for QR code - can be customized per template
  const websiteUrl = "https://www.anriellygomes.com.br";
  
  return (
    <Page size="A4" style={styles.page}>
      {/* Only show testimonials if enabled in template */}
      {template.showTestimonials && (
        <TestimonialsSection colors={template.colors} />
      )}
      
      {/* About section */}
      {template.showAboutSection && (
        <AboutSection colors={template.colors} />
      )}
      
      {/* QR Code section */}
      {template.showQrCode && (
        <QRCodeSection url={websiteUrl} colors={template.colors} />
      )}
    </Page>
  );
};
