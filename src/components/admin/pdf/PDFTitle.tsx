
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from './styles';

interface PDFTitleProps {
  eventType: string;
}

const PDFTitle: React.FC<PDFTitleProps> = ({ eventType }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>
        Proposta de Serviço
      </Text>
      <Text style={styles.subtitle}>
        {eventType}
      </Text>
    </View>
  );
};

export default PDFTitle;
