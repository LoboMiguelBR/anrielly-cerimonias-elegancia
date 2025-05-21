
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from './styles';
import { ClientInfoSectionProps } from './types';

const ClientInfoSection: React.FC<ClientInfoSectionProps> = ({ client, colors }) => {
  return (
    <View style={styles.clientInfo}>
      <Text style={{
        ...styles.sectionTitle, 
        color: colors.primary,
        fontFamily: 'Times-Roman'
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
          fontFamily: 'Helvetica',
          fontWeight: 'bold'
        }}>
          Nome:
        </Text> {client.client_name}
      </Text>
      <Text style={{
        ...styles.text, 
        color: colors.text,
        fontFamily: 'Helvetica'
      }}>
        <Text style={{
          ...styles.textBold, 
          color: colors.primary,
          fontFamily: 'Helvetica',
          fontWeight: 'bold'
        }}>
          Email:
        </Text> {client.client_email}
      </Text>
      <Text style={{
        ...styles.text, 
        color: colors.text,
        fontFamily: 'Helvetica'
      }}>
        <Text style={{
          ...styles.textBold, 
          color: colors.primary,
          fontFamily: 'Helvetica',
          fontWeight: 'bold'
        }}>
          Telefone:
        </Text> {client.client_phone}
      </Text>
    </View>
  );
};

export default ClientInfoSection;
