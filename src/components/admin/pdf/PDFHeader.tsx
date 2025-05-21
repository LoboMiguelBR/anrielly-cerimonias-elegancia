
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from './styles';
import { PDFHeaderProps } from './types';

const PDFHeader: React.FC<PDFHeaderProps> = ({ proposalId, createdDate, colors }) => {
  return (
    <View style={styles.header}>
      <View>
        <Text style={{ 
          fontSize: 18, 
          color: colors.primary,
          fontFamily: 'Times-Roman'
        }}>
          Anrielly Gomes - Mestre de Cerimonia
        </Text>
        <Text style={{ 
          fontSize: 10, 
          color: colors.text,
          fontFamily: 'Helvetica' 
        }}>
          Celebrante de Casamentos
        </Text>
      </View>
      <View style={styles.headerRight}>
        <Text style={{ fontFamily: 'Helvetica' }}>Proposta #{proposalId.substring(0, 8)}</Text>
        <Text style={{ fontFamily: 'Helvetica' }}>Data: {createdDate}</Text>
      </View>
    </View>
  );
};

export default PDFHeader;

// Fix the export for use in page components
export { PDFHeader };
