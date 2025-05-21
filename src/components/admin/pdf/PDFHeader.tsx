
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from './styles';
import { PDFHeaderProps } from './types';

const PDFHeader: React.FC<PDFHeaderProps> = ({ proposalId, createdDate, colors }) => {
  return (
    <View style={styles.header}>
      <View>
        <Text style={{ fontFamily: 'Playfair Display', fontSize: 18, color: colors.primary }}>
          Anrielly Gomes - Mestre de Cerimonia
        </Text>
        <Text style={{ fontSize: 10, color: colors.text }}>
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
