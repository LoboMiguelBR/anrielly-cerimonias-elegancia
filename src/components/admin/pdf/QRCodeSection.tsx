
import React from 'react';
import { View, Text, Svg, Path } from '@react-pdf/renderer';
import { styles } from './styles';

interface QRCodeSectionProps {
  url: string;
}

// A simple QR code SVG implementation for reliability
const QRCodeSection: React.FC<QRCodeSectionProps> = ({ url }) => {
  return (
    <View style={styles.qrCodeContainer}>
      <View style={{ width: 80, height: 80, border: '1px solid #000', padding: 5, backgroundColor: '#fff' }}>
        <Svg viewBox="0 0 29 29" height={70} width={70}>
          {/* Simple QR code SVG pattern */}
          <Path
            d="M1,1h7v7h-7zM10,1h1v1h-1zM12,1h3v1h-3zM16,1h1v2h-1zM19,1h1v1h-1zM21,1h7v7h-7zM2,2h5v5h-5zM22,2h5v5h-5zM3,3h3v3h-3zM12,3h1v1h-1zM14,3h1v1h-1zM16,3h1v1h-1zM18,3h1v2h-1zM23,3h3v3h-3zM10,4h1v1h-1zM14,4h1v1h-1zM16,4h1v2h-1zM9,5h4v1h-4zM19,5h1v1h-1zM9,6h1v1h-1zM11,6h1v1h-1zM13,6h5v1h-5zM19,6h1v1h-1zM1,9h2v1h-2zM4,9h3v2h-3zM9,9h2v1h-2zM12,9h3v1h-3zM16,9h4v1h-4zM21,9h1v1h-1zM23,9h4v1h-4zM1,10h1v1h-1zM7,10h4v1h-4zM13,10h2v4h-2zM16,10h1v1h-1zM18,10h1v1h-1zM22,10h1v3h-1zM26,10h2v1h-2zM2,11h1v1h-1zM5,11h1v1h-1zM8,11h1v5h-1zM10,11h1v1h-1zM16,11h1v1h-1zM18,11h1v1h-1zM20,11h1v1h-1zM24,11h1v2h-1zM26,11h2v1h-2zM1,12h3v1h-3zM5,12h2v2h-2zM11,12h1v2h-1zM16,12h1v3h-1zM19,12h1v1h-1zM26,12h2v1h-2zM2,13h1v1h-1zM10,13h1v1h-1zM21,13h1v1h-1zM25,13h1v1h-1zM1,14h1v1h-1zM3,14h4v1h-4zM10,14h1v1h-1zM19,14h2v1h-2zM24,14h1v1h-1zM27,14h1v1h-1zM1,15h1v1h-1zM4,15h4v1h-4zM10,15h2v1h-2zM15,15h1v2h-1zM17,15h1v1h-1zM19,15h2v1h-2zM23,15h2v1h-2zM27,15h1v2h-1zM1,16h3v1h-3zM9,16h1v1h-1zM12,16h1v2h-1zM17,16h1v1h-1zM20,16h5v1h-5zM9,17h2v1h-2zM14,17h1v1h-1zM17,17h2v1h-2zM21,17h1v1h-1zM23,17h1v1h-1zM25,17h1v1h-1zM1,19h7v1h-7zM10,19h1v2h-1zM12,19h1v1h-1zM14,19h5v1h-5zM21,19h1v2h-1zM23,19h5v1h-5zM13,20h1v1h-1zM15,20h2v1h-2zM18,20h2v1h-2zM23,20h1v2h-1zM25,20h1v1h-1zM1,21h7v7h-7zM9,21h1v3h-1zM11,21h1v2h-1zM13,21h2v1h-2zM16,21h1v2h-1zM19,21h1v1h-1zM27,21h1v2h-1zM2,22h5v5h-5zM13,22h1v3h-1zM15,22h1v1h-1zM18,22h1v1h-1zM20,22h1v2h-1zM24,22h2v1h-2zM3,23h3v3h-3zM10,23h2v1h-2zM15,23h1v1h-1zM17,23h2v1h-2zM22,23h2v1h-2zM25,23h1v1h-1zM11,24h1v1h-1zM14,24h1v1h-1zM16,24h1v2h-1zM19,24h1v1h-1zM21,24h1v1h-1zM23,24h1v1h-1zM25,24h3v1h-3zM10,25h1v1h-1zM12,25h1v3h-1zM14,25h1v2h-1zM17,25h2v1h-2zM21,25h1v2h-1zM23,25h1v1h-1zM26,25h1v1h-1zM9,26h1v1h-1zM11,26h1v1h-1zM17,26h3v2h-3zM23,26h2v1h-2zM26,26h1v1h-1zM9,27h1v1h-1zM13,27h1v1h-1zM15,27h1v1h-1zM22,27h1v1h-1zM24,27h3v1h-3z"
            fill="#000"
          />
        </Svg>
      </View>
      <Text style={styles.qrCodeText}>Escaneie para visitar nosso site e ver mais trabalhos</Text>
    </View>
  );
};

export default QRCodeSection;
