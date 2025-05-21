
import React from 'react';
import { Document, Page, View, Text } from '@react-pdf/renderer';
import { ProposalData } from './hooks/proposal';
import { styles } from './pdf/styles';
import { ProposalTemplateData } from './proposals/templates/shared/types';
import { defaultTemplate } from './proposals/templates/shared/templateService';
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
  template?: ProposalTemplateData;
}

const ProposalPDF: React.FC<ProposalProps> = ({ proposal, template = defaultTemplate }) => {
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

  // Apply template colors to styles
  const customStyles = {
    ...styles,
    coverPage: {
      ...styles.coverPage,
      background: template.colors.background,
    },
    title: {
      ...styles.title,
      color: template.colors.primary,
    },
    subtitle: {
      ...styles.subtitle,
      color: template.colors.secondary,
    },
    // Remove the heading style that doesn't exist
    text: {
      ...styles.text,
      color: template.colors.text,
    },
    section: {
      ...styles.section,
      borderColor: template.colors.accent,
    }
  };

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={customStyles.page}>
        <CoverPage 
          clientName={safeProposal.client_name}
          eventType={safeProposal.event_type}
          eventDate={formattedDate}
          totalPrice={safeProposal.total_price}
          colors={template.colors}
        />
      </Page>

      {/* Main Content Page */}
      <Page size="A4" style={customStyles.page}>
        <PDFHeader 
          proposalId={safeProposal.id} 
          createdDate={createdDate}
          colors={template.colors}
        />

        <PDFTitle 
          eventType={safeProposal.event_type} 
          colors={template.colors}
        />

        <View style={{...customStyles.divider, backgroundColor: template.colors.primary}} />

        <ClientInfoSection 
          client={safeProposal} 
          colors={template.colors}
        />

        <EventDetailsSection 
          eventType={safeProposal.event_type}
          eventDate={formattedDate}
          eventLocation={safeProposal.event_location}
          colors={template.colors}
        />
        
        {template.showAboutSection && (
          <AboutSection colors={template.colors} />
        )}
      </Page>

      {/* Services and Pricing Page */}
      <Page size="A4" style={customStyles.page}>
        <PDFHeader 
          proposalId={safeProposal.id} 
          createdDate={createdDate}
          colors={template.colors}
        />
        
        <ServicesSection 
          services={safeProposal.services} 
          colors={template.colors}
        />
        
        {template.showDifferentials && (
          <DifferentialsSection colors={template.colors} />
        )}

        <PricingSection 
          totalPrice={safeProposal.total_price}
          paymentTerms={safeProposal.payment_terms}
          colors={template.colors}
        />

        <NotesSection 
          notes={safeProposal.notes} 
          colors={template.colors}
        />
      </Page>

      {/* Testimonials and Signature Page */}
      <Page size="A4" style={customStyles.page}>
        <PDFHeader 
          proposalId={safeProposal.id} 
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
        
        <View style={{...customStyles.signature, borderColor: template.colors.primary}}>
          <Text style={{...customStyles.text, color: template.colors.text}}>Assinatura do Cliente</Text>
        </View>
        
        <PDFFooter 
          validUntil={validUntil}
          colors={template.colors}
        />
      </Page>
    </Document>
  );
};

export default ProposalPDF;
