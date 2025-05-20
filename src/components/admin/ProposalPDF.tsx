
import React from 'react';
import { Document, Page, View } from '@react-pdf/renderer';
import { ProposalData } from './pdf/types';
import { styles } from './pdf/styles';
import {
  PDFHeader,
  PDFTitle,
  ClientInfoSection,
  EventDetailsSection,
  ServicesSection,
  PricingSection,
  NotesSection,
  PDFFooter,
  AboutSection,
  TestimonialsSection,
  DifferentialsSection,
  QRCodeSection,
  CoverPage
} from './pdf';

interface ProposalProps {
  proposal: ProposalData;
}

const ProposalPDF = ({ proposal }: ProposalProps) => {
  const formattedDate = proposal.event_date 
    ? new Date(proposal.event_date).toLocaleDateString('pt-BR')
    : 'A definir';

  const createdDate = proposal.created_at 
    ? new Date(proposal.created_at).toLocaleDateString('pt-BR')
    : new Date().toLocaleDateString('pt-BR');
  
  const validUntil = new Date(proposal.validity_date).toLocaleDateString('pt-BR');

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.page}>
        <CoverPage 
          clientName={proposal.client_name}
          eventType={proposal.event_type}
          eventDate={formattedDate}
          totalPrice={proposal.total_price}
        />
      </Page>

      {/* Main Content Page */}
      <Page size="A4" style={styles.page}>
        <PDFHeader 
          proposalId={proposal.id} 
          createdDate={createdDate} 
        />

        <PDFTitle eventType={proposal.event_type} />

        <View style={styles.divider} />

        <ClientInfoSection client={proposal} />

        <EventDetailsSection 
          eventType={proposal.event_type}
          eventDate={formattedDate}
          eventLocation={proposal.event_location}
        />
        
        <AboutSection />
      </Page>

      {/* Services and Pricing Page */}
      <Page size="A4" style={styles.page}>
        <PDFHeader 
          proposalId={proposal.id} 
          createdDate={createdDate} 
        />
        
        <ServicesSection services={proposal.services} />
        
        <DifferentialsSection />

        <PricingSection 
          totalPrice={proposal.total_price}
          paymentTerms={proposal.payment_terms}
        />

        <NotesSection notes={proposal.notes} />
      </Page>

      {/* Testimonials and Signature Page */}
      <Page size="A4" style={styles.page}>
        <PDFHeader 
          proposalId={proposal.id} 
          createdDate={createdDate} 
        />
        
        <TestimonialsSection />
        
        <QRCodeSection url="https://www.anriellygomes.com.br" />
        
        <View style={styles.signature}>
          <Text>Assinatura do Cliente</Text>
        </View>
        
        <PDFFooter validUntil={validUntil} />
      </Page>
    </Document>
  );
};

export default ProposalPDF;
