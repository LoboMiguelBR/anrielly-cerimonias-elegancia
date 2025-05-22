
import React from 'react';
import { View, Text, Image } from '@react-pdf/renderer';
import { styles } from './styles';
import { QRCodeSectionProps } from './types';

const QRCodeSection: React.FC<QRCodeSectionProps> = ({ url, colors }) => {
  // QR code data URL (using a reliable external service)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}&format=svg`;
  
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
      <Image src={qrCodeUrl} style={{ width: 100, height: 100 }} />
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
