
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from './styles';
import { ProposalData } from './types';

interface ClientInfoSectionProps {
  client: Pick<ProposalData, 'client_name' | 'client_email' | 'client_phone'>;
}

const ClientInfoSection: React.FC<ClientInfoSectionProps> = ({ client }) => {
  return (
    <View style={styles.clientInfo}>
      <Text style={styles.sectionTitle}>Informações do Cliente</Text>
      <Text style={styles.text}>
        <Text style={styles.textBold}>Nome:</Text> {client.client_name}
      </Text>
      <Text style={styles.text}>
        <Text style={styles.textBold}>Email:</Text> {client.client_email}
      </Text>
      <Text style={styles.text}>
        <Text style={styles.textBold}>Telefone:</Text> {client.client_phone}
      </Text>
    </View>
  );
};

export default ClientInfoSection;
