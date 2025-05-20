
import React from 'react';
import { View, Text, Image } from '@react-pdf/renderer';
import { styles } from './styles';

interface QRCodeSectionProps {
  url: string;
}

const QRCodeSection: React.FC<QRCodeSectionProps> = ({ url }) => {
  // Using a reliable QR code service that generates PNG format (compatible with React PDF)
  // Avoiding CORS issues by using a widely compatible service
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(url)}&format=png`;
  
  return (
    <View style={styles.qrCodeContainer}>
      <View style={{ width: 80, height: 80, border: '1px solid #000', padding: 5, backgroundColor: '#fff' }}>
        <Image src={qrCodeUrl} style={{ width: 70, height: 70 }} />
      </View>
      <Text style={styles.qrCodeText}>Escaneie para visitar nosso site e ver mais trabalhos</Text>
    </View>
  );
};

export default QRCodeSection;
