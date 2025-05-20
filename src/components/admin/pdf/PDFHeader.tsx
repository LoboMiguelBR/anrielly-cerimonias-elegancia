
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from './styles';

interface PDFHeaderProps {
  proposalId: string;
  createdDate: string;
}

const PDFHeader: React.FC<PDFHeaderProps> = ({ proposalId, createdDate }) => {
  return (
    <View style={styles.header}>
      <View>
        <Text style={{ fontFamily: 'Playfair Display', fontSize: 18, color: '#7E69AB' }}>
          Anrielly Gomes - Mestre de Cerimonia
        </Text>
        <Text style={{ fontSize: 10, color: '#777' }}>
          Celebrante de Casamentos
        </Text>
      </View>
      <View style={styles.headerRight}>
        <Text>Proposta #{proposalId.substring(0, 8)}</Text>
        <Text>Data: {createdDate}</Text>
      </View>
    </View>
  );
};

export default PDFHeader;
