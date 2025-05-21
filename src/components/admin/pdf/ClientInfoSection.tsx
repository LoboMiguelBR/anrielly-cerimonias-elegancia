
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from './styles';
import { ClientInfoSectionProps } from './types';

const ClientInfoSection: React.FC<ClientInfoSectionProps> = ({ client, colors }) => {
  return (
    <View style={styles.clientInfo}>
      <Text style={{...styles.sectionTitle, color: colors.primary}}>Informações do Cliente</Text>
      <Text style={{...styles.text, color: colors.text}}>
        <Text style={{...styles.textBold, color: colors.primary}}>Nome:</Text> {client.client_name}
      </Text>
      <Text style={{...styles.text, color: colors.text}}>
        <Text style={{...styles.textBold, color: colors.primary}}>Email:</Text> {client.client_email}
      </Text>
      <Text style={{...styles.text, color: colors.text}}>
        <Text style={{...styles.textBold, color: colors.primary}}>Telefone:</Text> {client.client_phone}
      </Text>
    </View>
  );
};

export default ClientInfoSection;
