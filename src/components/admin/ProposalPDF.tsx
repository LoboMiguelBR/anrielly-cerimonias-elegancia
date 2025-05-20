
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { formatCurrency } from '@/lib/utils';
import { ProposalData } from './hooks/useProposalForm';

interface ProposalProps {
  proposal: ProposalData;
}

// Register fonts
Font.register({
  family: 'Playfair Display',
  src: 'https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvUDQZNLo_U2r.ttf',
  fontWeight: 'normal',
});

Font.register({
  family: 'Playfair Display',
  src: 'https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKeiukDQZNLo_U2r.ttf',
  fontWeight: 'bold',
});

Font.register({
  family: 'Montserrat',
  src: 'https://fonts.gstatic.com/s/montserrat/v25/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Ew-Y3tcoqK5.ttf',
  fontWeight: 'normal',
});

Font.register({
  family: 'Montserrat',
  src: 'https://fonts.gstatic.com/s/montserrat/v25/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtZ6Ew-Y3tcoqK5.ttf',
  fontWeight: 'medium',
});

Font.register({
  family: 'Montserrat',
  src: 'https://fonts.gstatic.com/s/montserrat/v25/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCuM70w-Y3tcoqK5.ttf',
  fontWeight: 'bold',
});

// Estilos para o PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Montserrat',
    color: '#333',
  },
  header: {
    marginBottom: 20,
    borderBottom: '2px solid #D4AF37',
    paddingBottom: 15,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    marginBottom: 10,
  },
  headerRight: {
    textAlign: 'right',
    fontSize: 10,
  },
  title: {
    fontFamily: 'Playfair Display',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1A1F2C',
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Playfair Display',
    fontSize: 16,
    marginBottom: 5,
    color: '#7E69AB',
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Playfair Display',
    fontWeight: 'bold',
    marginBottom: 10,
    padding: 5,
    backgroundColor: '#E6E6FA',
    borderLeft: '4px solid #9b87f5',
  },
  clientInfo: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
  },
  textBold: {
    fontWeight: 'bold',
  },
  text: {
    fontSize: 11,
    marginBottom: 5,
    lineHeight: 1.5,
  },
  serviceItem: {
    marginBottom: 8,
    fontSize: 11,
    flexDirection: 'row',
  },
  dot: {
    marginRight: 5,
    color: '#9b87f5',
  },
  priceSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f3f4f6',
    borderRadius: 5,
    borderTop: '2px solid #D4AF37',
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#7E69AB',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    paddingTop: 10,
    borderTop: '1px solid #ccc',
    fontSize: 9,
    color: '#666',
  },
  divider: {
    borderBottom: '1px solid #E6E6FA',
    marginVertical: 10,
  },
  signature: {
    marginTop: 50,
    borderTop: '1px solid #999',
    width: '60%',
    marginHorizontal: 'auto',
    paddingTop: 5,
    textAlign: 'center',
    fontSize: 10,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 30,
    right: 40,
    fontSize: 9,
    color: '#666',
  },
});

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
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={{ fontFamily: 'Playfair Display', fontSize: 18, color: '#7E69AB' }}>Anrielly Gomes - Mestre de Cerimonia</Text>
            <Text style={{ fontSize: 10, color: '#777' }}>Celebrante de Casamentos</Text>
          </View>
          <View style={styles.headerRight}>
            <Text>Proposta #{proposal.id.substring(0, 8)}</Text>
            <Text>Data: {createdDate}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>
            Proposta de Serviço
          </Text>
          <Text style={styles.subtitle}>
            {proposal.event_type}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.clientInfo}>
          <Text style={styles.sectionTitle}>Informações do Cliente</Text>
          <Text style={styles.text}><Text style={styles.textBold}>Nome:</Text> {proposal.client_name}</Text>
          <Text style={styles.text}><Text style={styles.textBold}>Email:</Text> {proposal.client_email}</Text>
          <Text style={styles.text}><Text style={styles.textBold}>Telefone:</Text> {proposal.client_phone}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalhes do Evento</Text>
          <Text style={styles.text}><Text style={styles.textBold}>Tipo de Evento:</Text> {proposal.event_type}</Text>
          <Text style={styles.text}><Text style={styles.textBold}>Data:</Text> {formattedDate}</Text>
          <Text style={styles.text}><Text style={styles.textBold}>Local:</Text> {proposal.event_location}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Serviços Incluídos</Text>
          {proposal.services.map((service, index) => (
            <View key={index} style={styles.serviceItem}>
              <Text style={styles.dot}>•</Text>
              <Text>{service.name}</Text>
            </View>
          ))}
        </View>

        <View style={styles.priceSection}>
          <Text style={styles.totalPrice}>
            Valor Total: R$ {formatCurrency(proposal.total_price)}
          </Text>
          <Text style={styles.text}><Text style={styles.textBold}>Condições de Pagamento:</Text></Text>
          <Text style={styles.text}>{proposal.payment_terms}</Text>
        </View>

        {proposal.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Observações</Text>
            <Text style={styles.text}>{proposal.notes}</Text>
          </View>
        )}

        <View style={styles.footer}>
          <Text>Esta proposta é válida até {validUntil}</Text>
          <Text style={{ marginTop: 5 }}>Anrielly Gomes - Mestre de Cerimonia | anrielly@yahoo.com.br</Text>
        </View>

        <View style={styles.signature}>
          <Text>Assinatura do Cliente</Text>
        </View>
        
        <Text 
          style={styles.pageNumber} 
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} 
          fixed 
        />
      </Page>
    </Document>
  );
};

export default ProposalPDF;
