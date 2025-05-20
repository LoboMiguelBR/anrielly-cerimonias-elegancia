import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { formatCurrency } from '@/lib/utils';
import { ProposalData } from './hooks/useProposalForm';

interface ProposalProps {
  proposal: ProposalData;
}

// Estilos para o PDF
const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottom: '1px solid #ccc',
    paddingBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    padding: 5,
    backgroundColor: '#f3f4f6',
  },
  clientInfo: {
    marginBottom: 20,
  },
  textBold: {
    fontWeight: 'bold',
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
    lineHeight: 1.5,
  },
  serviceItem: {
    marginBottom: 5,
    fontSize: 12,
    flexDirection: 'row',
  },
  dot: {
    marginRight: 5,
  },
  priceSection: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f3f4f6',
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  footer: {
    marginTop: 40,
    borderTop: '1px solid #ccc',
    paddingTop: 10,
    fontSize: 10,
    textAlign: 'center',
    color: '#666',
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
          {/* Aqui você pode adicionar uma Logo quando disponível */}
          {/* <Image style={styles.logo} src="/logo.png" /> */}
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Proposta de Serviço</Text>
          <Text style={{ fontSize: 12 }}>Data: {createdDate}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>
            Proposta para {proposal.event_type}
          </Text>
        </View>

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
          <Text style={{ marginTop: 5 }}>
            Proposta #{proposal.id.substring(0, 8)}
          </Text>
        </View>

        <View style={styles.signature}>
          <Text>Assinatura do Cliente</Text>
        </View>
      </Page>
    </Document>
  );
};

export default ProposalPDF;
