
import React from 'react';
import { View, Text, Image } from '@react-pdf/renderer';
import { styles } from './styles';

interface QRCodeSectionProps {
  url: string;
}

const QRCodeSection: React.FC<QRCodeSectionProps> = ({ url }) => {
  // Using a dynamic QR code service to generate QR code image
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(url)}`;

  return (
    <View style={styles.qrCodeContainer}>
      <Image src={qrCodeUrl} style={{ width: 80, height: 80 }} />
      <Text style={styles.qrCodeText}>Escaneie para visitar nosso site e ver mais trabalhos</Text>
    </View>
  );
};

export default QRCodeSection;
