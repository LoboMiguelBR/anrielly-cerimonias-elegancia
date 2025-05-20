
import React from 'react';
import { Document, Page, View, Text } from '@react-pdf/renderer';
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

const ProposalPDF: React.FC<ProposalProps> = ({ proposal }) => {
  // Ensure we have valid data with fallbacks
  const safeProposal = {
    ...proposal,
    client_name: proposal.client_name || "Cliente",
    client_email: proposal.client_email || "",
    client_phone: proposal.client_phone || "",
    event_type: proposal.event_type || "Evento",
    event_location: proposal.event_location || "A definir",
    services: Array.isArray(proposal.services) ? proposal.services : [],
    total_price: proposal.total_price || 0,
    payment_terms: proposal.payment_terms || "",
    notes: proposal.notes || "",
    validity_date: proposal.validity_date || new Date().toISOString(),
  };
  
  // Format date strings for better display with fallbacks
  const formattedDate = safeProposal.event_date 
    ? new Date(safeProposal.event_date).toLocaleDateString('pt-BR')
    : 'A definir';

  const createdDate = safeProposal.created_at 
    ? new Date(safeProposal.created_at).toLocaleDateString('pt-BR')
    : new Date().toLocaleDateString('pt-BR');
  
  const validUntil = safeProposal.validity_date 
    ? new Date(safeProposal.validity_date).toLocaleDateString('pt-BR')
    : new Date().toLocaleDateString('pt-BR');
    
  // Website URL with fallback
  const websiteUrl = "https://www.anriellygomes.com.br";

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.page}>
        <CoverPage 
          clientName={safeProposal.client_name}
          eventType={safeProposal.event_type}
          eventDate={formattedDate}
          totalPrice={safeProposal.total_price}
        />
      </Page>

      {/* Main Content Page */}
      <Page size="A4" style={styles.page}>
        <PDFHeader 
          proposalId={safeProposal.id} 
          createdDate={createdDate} 
        />

        <PDFTitle eventType={safeProposal.event_type} />

        <View style={styles.divider} />

        <ClientInfoSection client={safeProposal} />

        <EventDetailsSection 
          eventType={safeProposal.event_type}
          eventDate={formattedDate}
          eventLocation={safeProposal.event_location}
        />
        
        <AboutSection />
      </Page>

      {/* Services and Pricing Page */}
      <Page size="A4" style={styles.page}>
        <PDFHeader 
          proposalId={safeProposal.id} 
          createdDate={createdDate} 
        />
        
        <ServicesSection services={safeProposal.services} />
        
        <DifferentialsSection />

        <PricingSection 
          totalPrice={safeProposal.total_price}
          paymentTerms={safeProposal.payment_terms}
        />

        <NotesSection notes={safeProposal.notes} />
      </Page>

      {/* Testimonials and Signature Page */}
      <Page size="A4" style={styles.page}>
        <PDFHeader 
          proposalId={safeProposal.id} 
          createdDate={createdDate} 
        />
        
        <TestimonialsSection />
        
        <QRCodeSection url={websiteUrl} />
        
        <View style={styles.signature}>
          <Text>Assinatura do Cliente</Text>
        </View>
        
        <PDFFooter validUntil={validUntil} />
      </Page>
    </Document>
  );
};

export default ProposalPDF;
