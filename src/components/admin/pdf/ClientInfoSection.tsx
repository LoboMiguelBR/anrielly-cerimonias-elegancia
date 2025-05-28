
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from './styles';

interface ClientData {
  client_name: string;
  client_email?: string;
  client_phone?: string;
}

interface ClientInfoSectionProps {
  client: ClientData;
  colors: {
    primary: string;
    text: string;
  };
}

const ClientInfoSection: React.FC<ClientInfoSectionProps> = ({ client, colors }) => {
  return (
    <View style={styles.clientInfo}>
      <Text style={{
        ...styles.sectionTitle, 
        color: colors.primary,
        fontFamily: 'Times-Roman',
        backgroundColor: 'transparent',
        borderLeftWidth: 0
      }}>
        Informações do Cliente
      </Text>
      <Text style={{
        ...styles.text, 
        color: colors.text,
        fontFamily: 'Helvetica'
      }}>
        <Text style={{
          ...styles.textBold, 
          color: colors.primary,
          fontFamily: 'Helvetica'
        }}>
          Nome:
        </Text> {client.client_name || 'Cliente'}
      </Text>
      {client.client_email && (
        <Text style={{
          ...styles.text, 
          color: colors.text,
          fontFamily: 'Helvetica'
        }}>
          <Text style={{
            ...styles.textBold, 
            color: colors.primary,
            fontFamily: 'Helvetica'
          }}>
            Email:
          </Text> {client.client_email}
        </Text>
      )}
      {client.client_phone && (
        <Text style={{
          ...styles.text, 
          color: colors.text,
          fontFamily: 'Helvetica'
        }}>
          <Text style={{
            ...styles.textBold, 
            color: colors.primary,
            fontFamily: 'Helvetica'
          }}>
            Telefone:
          </Text> {client.client_phone}
        </Text>
      )}
    </View>
  );
};

export default ClientInfoSection;
export { ClientInfoSection };
