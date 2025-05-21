
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from './styles';
import { PDFFooterProps } from './types';

const PDFFooter: React.FC<PDFFooterProps> = ({ validUntil, colors }) => {
  return (
    <>
      <View style={{
        ...styles.footer,
        borderTopColor: colors.text,
      }}>
        <Text style={{color: colors.text}}>Esta proposta é válida até {validUntil}</Text>
        
        <View style={styles.contactInfoFooter}>
          <Text style={{color: colors.text}}>Anrielly Gomes - Mestre de Cerimonia</Text>
          <Text style={{ marginTop: 3, color: colors.text }}>anrielly@yahoo.com.br | +55 (24) 98888-8888</Text>
          <Text style={{ marginTop: 3, color: colors.text }}>www.anriellygomes.com.br</Text>
        </View>
      </View>
      
      <Text 
        style={{...styles.pageNumber, color: colors.text}} 
        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} 
        fixed 
      />
    </>
  );
};

export default PDFFooter;
