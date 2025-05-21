
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from './styles';
import { PDFTitleProps } from './types';

const PDFTitle: React.FC<PDFTitleProps> = ({ eventType, colors }) => {
  return (
    <View style={styles.section}>
      <Text style={{...styles.title, color: colors.primary}}>
        Proposta de Serviço
      </Text>
      <Text style={{...styles.subtitle, color: colors.secondary}}>
        {eventType}
      </Text>
    </View>
  );
};

export default PDFTitle;
