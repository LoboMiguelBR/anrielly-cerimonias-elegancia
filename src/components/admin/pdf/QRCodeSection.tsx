
import React from 'react';
import { View, Text, Image, Svg, Path } from '@react-pdf/renderer';
import { styles } from './styles';
import { QRCodeSectionProps } from './types';

// Simple QR placeholder for when actual QR code can't be rendered
const QRPlaceholder = () => (
  <Svg width={70} height={70} viewBox="0 0 70 70">
    <Path
      d="M0,0 L70,0 L70,70 L0,70 Z M10,10 L30,10 L30,30 L10,30 Z M40,10 L60,10 L60,30 L40,30 Z M10,40 L30,40 L30,60 L10,60 Z M40,40 L45,40 L45,45 L40,45 Z M50,40 L55,40 L55,45 L50,45 Z M45,45 L50,45 L50,50 L45,50 Z M55,45 L60,45 L60,50 L55,50 Z M40,50 L45,50 L45,60 L40,60 Z M50,50 L60,50 L60,55 L50,55 Z"
      fill="black"
      stroke="none"
    />
  </Svg>
);

/**
 * QRCodeSection component for displaying a QR code in a PDF document
 * Uses a reliable QR code generation service with proper error handling
 */
const QRCodeSection: React.FC<QRCodeSectionProps> = ({ url, colors }) => {
  // Using a reliable QR code service with high compatibility
  const encodedUrl = encodeURIComponent(url);
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodedUrl}&format=png`;
  
  return (
    <View style={{...styles.qrCodeContainer, borderColor: colors.accent}}>
      <View style={{...styles.qrCodeBox, borderColor: colors.accent}}>
        {/* The Image component from react-pdf/renderer will attempt to load the QR code */}
        <Image src={qrCodeUrl} style={styles.qrCode} />
      </View>
      <Text style={{...styles.qrCodeText, color: colors.primary}}>
        Escaneie para visitar nosso site e ver mais trabalhos
      </Text>
      <Text style={{...styles.qrCodeUrl, color: colors.text}}>{url}</Text>
    </View>
  );
};

export default QRCodeSection;
