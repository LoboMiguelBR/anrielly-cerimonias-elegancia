
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from './styles';

interface PDFTitleProps {
  eventType: string;
  colors: {
    primary: string;
    secondary: string;
    text: string;
  };
}

const PDFTitle: React.FC<PDFTitleProps> = ({ eventType, colors }) => {
  return (
    <View style={styles.section}>
      <Text style={{
        ...styles.title, 
        color: colors.primary, 
        fontFamily: 'Times-Roman'
      }}>
        Proposta de Serviço
      </Text>
      <Text style={{
        ...styles.subtitle, 
        color: colors.secondary, 
        fontFamily: 'Times-Roman'
      }}>
        {eventType || 'Evento'}
      </Text>
    </View>
  );
};

export default PDFTitle;
export { PDFTitle };
