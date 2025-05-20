
import React from 'react';
import { View, Text, Image } from '@react-pdf/renderer';
import { styles } from './styles';

interface QRCodeSectionProps {
  url: string;
}

const QRCodeSection: React.FC<QRCodeSectionProps> = ({ url }) => {
  // Usando uma URL externa para gerar o QR code em tempo de renderização
  // Evita problemas com Buffer no navegador
  const qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(url)}&format=png`;
  
  return (
    <View style={styles.qrCodeContainer}>
      <Image src={qrCode} style={{ width: 80, height: 80 }} />
      <Text style={styles.qrCodeText}>Escaneie para visitar nosso site e ver mais trabalhos</Text>
    </View>
  );
};

export default QRCodeSection;
