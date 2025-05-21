
import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { styles } from './styles';
import { PDFFooterProps } from './types';

const PDFFooter: React.FC<PDFFooterProps> = ({ validUntil, colors }) => {
  return (
    <View style={styles.footer}>
      <Text style={{ 
        color: colors.text,
        fontFamily: 'Helvetica',
        fontSize: 9
      }}>
        Esta proposta é válida até {validUntil}
      </Text>
      <View style={styles.contactInfoFooter}>
        <Text style={{ 
          color: colors.text,
          fontFamily: 'Helvetica',
          fontSize: 9
        }}>
          Anrielly Gomes | Tel: (11) 99999-9999 | Email: contato@anriellygomes.com.br
        </Text>
        <Text style={{ 
          color: colors.text,
          fontFamily: 'Helvetica',
          fontSize: 9
        }}>
          www.anriellygomes.com.br
        </Text>
      </View>
    </View>
  );
};

export default PDFFooter;

// Fix the export for use in page components
export { PDFFooter };
