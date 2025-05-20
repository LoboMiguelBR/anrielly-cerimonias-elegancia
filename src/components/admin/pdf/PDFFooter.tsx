
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
        <Text style={{ marginTop: 5 }}>
          Anrielly Gomes - Mestre de Cerimonia | anrielly@yahoo.com.br
        </Text>
      </View>

      <View style={styles.signature}>
        <Text>Assinatura do Cliente</Text>
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
