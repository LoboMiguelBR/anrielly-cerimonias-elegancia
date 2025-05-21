
import React from 'react';
import { View, Text, Image } from '@react-pdf/renderer';
import { styles } from './styles';
import { QRCodeSectionProps } from './types';
import { generateQRCode } from '../utils/qrCodeGenerator';

const QRCodeSection: React.FC<QRCodeSectionProps> = ({ url, colors }) => {
  // Generate QR Code data URL
  const qrCodeDataUrl = generateQRCode(url);
  
  return (
    <View style={{
      ...styles.section,
      alignItems: 'center',
      marginVertical: 20
    }}>
      <Text style={{
        ...styles.text, 
        color: colors.secondary,
        marginBottom: 10,
        textAlign: 'center',
        fontFamily: 'Helvetica'
      }}>
        Para mais informações, visite nosso site:
      </Text>
      <Image src={qrCodeDataUrl} style={{ width: 100, height: 100 }} />
      <Text style={{
        ...styles.text, 
        color: colors.primary,
        marginTop: 10,
        textAlign: 'center',
        fontFamily: 'Helvetica'
      }}>
        www.anriellygomes.com.br
      </Text>
    </View>
  );
};

export default QRCodeSection;

// Fix the export for use in page components
export { QRCodeSection };
