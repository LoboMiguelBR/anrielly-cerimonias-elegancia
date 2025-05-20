
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from './styles';

interface PDFFooterProps {
  validUntil: string;
}

const PDFFooter: React.FC<PDFFooterProps> = ({ validUntil }) => {
  return (
    <>
      <View style={styles.footer}>
        <Text>Esta proposta é válida até {validUntil}</Text>
        
        <View style={styles.contactInfoFooter}>
          <Text>Anrielly Gomes - Mestre de Cerimonia</Text>
          <Text style={{ marginTop: 3 }}>anrielly@yahoo.com.br | +55 (24) 98888-8888</Text>
          <Text style={{ marginTop: 3 }}>www.anriellygomes.com.br</Text>
        </View>
      </View>
      
      <Text 
        style={styles.pageNumber} 
        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} 
        fixed 
      />
    </>
  );
};

export default PDFFooter;
