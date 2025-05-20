
import React from 'react';
import { View, Text, Image } from '@react-pdf/renderer';
import { styles } from './styles';

interface QRCodeSectionProps {
  url: string;
}

const QRCodeSection: React.FC<QRCodeSectionProps> = ({ url }) => {
  // Using a data URI QR code instead of dynamic service to avoid Buffer issues
  const qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + encodeURIComponent(url) + "&format=png";

  return (
    <View style={styles.qrCodeContainer}>
      <Image src={{ uri: qrCodeUrl }} style={{ width: 80, height: 80 }} />
      <Text style={styles.qrCodeText}>Escaneie para visitar nosso site e ver mais trabalhos</Text>
    </View>
  );
};

export default QRCodeSection;
