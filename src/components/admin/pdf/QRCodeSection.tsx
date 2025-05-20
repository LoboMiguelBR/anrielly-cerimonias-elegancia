
import React from 'react';
import { View, Text, Image } from '@react-pdf/renderer';
import { styles } from './styles';

interface QRCodeSectionProps {
  url: string;
}

// Implementamos um QR code estático mais simples e confiável
const QRCodeSection: React.FC<QRCodeSectionProps> = ({ url }) => {
  // Usando o serviço QR Code Generator com parâmetros específicos para evitar problemas de CORS
  // e garantir que o QR code esteja em um formato que o React PDF possa renderizar
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(url)}&format=png&margin=10`;
  
  return (
    <View style={styles.qrCodeContainer}>
      <View style={{ width: 80, height: 80, border: '1px solid #000', padding: 5, backgroundColor: '#fff' }}>
        {/* O serviço api.qrserver.com é muito confiável e funciona bem com React PDF */}
        <Image src={qrCodeUrl} style={{ width: 70, height: 70 }} />
      </View>
      <Text style={styles.qrCodeText}>Escaneie para visitar nosso site e ver mais trabalhos</Text>
    </View>
  );
};

export default QRCodeSection;
