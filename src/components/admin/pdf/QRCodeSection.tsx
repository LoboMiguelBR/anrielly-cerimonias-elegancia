
import React from 'react';
import { View, Text, Image } from '@react-pdf/renderer';
import { styles } from './styles';

interface QRCodeSectionProps {
  url: string;
}

const QRCodeSection: React.FC<QRCodeSectionProps> = ({ url }) => {
  // Using a reliable QR code service that generates PNG format (compatible with React PDF)
  // Encode the URL for safety and avoid CORS issues by using a widely compatible service
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(url)}&format=png`;
  
  // Fallback QR image - a simple data URI for a blank white square with border
  const fallbackQrImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAYAAAA8AXHiAAAACXBIWXMAAAsTAAALEwEAmpwYAAADIUlEQVR4nO3dsW0UQRSA4XEEITaCAAkiV0CARAkOlED5DkggEUJGQAnELgCXQAWEbkVu/QQnSITsicV3RwD36hnN/5lmZ3Z33+rt7tvZWQEAAAAAAAAAAAAAAHAQuq5bVNXzqnpbVd+r6me9dF1V56vqWdd1C7UdoK7rjqrqWYzkvKreV9VJnP6squd931+p9YB0XXccYb2Lx9Oq+lxVX6rqdFXdqqqLcby01gPSdd2j3qD6Uv/2raq+xhXsQV3sFRJGXXH+xGvfr+nTVdyVHtveCYdfVfVwk45W1f24mn2Iq9qR2g/IpsG6qJpPRkaj94MC8/0OSK9l9N1wmf31lfvur8hN4Rpa8r3zvgujX1hpXMKaibBmIqyZCGsmwpqJsGYirJkIaybCmsk+w7qzeILw5GZVPVzcKTPr+/72ZFfKBXGe8mpmUIv5DuvcS7O3LXarXL7e5IdeXv2svY7nHzKs47FBFFUvVn7cndA5ne1dY87mtJnT9Z4b/Bwz6/OJ7X6u/Lx8PlbMdT67A4aV/WhZ8ZkdcMXKBjt3xcp2nVPiKXO2b7sIa/OFDc9H9tXPTTelN2zp5+Rzp59XfZPfnD6G3RQe9X6OzOtepudcPnZt3/fAm8KcnsuK5ThcwsKKsLAiLKwICyvCwoqwsCIsrAgLK8LCirCwIiysCAsrwsKKsLAiLKwICyvCwoqwsCIsrAgLK8LCirCwIiysCAsrwsKKsLAiLKwICyvCwoqwsCIsrAgLK8LCirCwIiysCAsrwsKKsLAiLKwICyvCwoqwsCIsrAgLK8LCirCwIiysCAsrwsKKsLAiLKwICyvCwoqwsCIsrAgLK8LCirCwIiysCAsrwsKKsLAiLKwICyvCwoqwsCIsrAgLK8LCirCwIiysCAsrwsKKsLAiLKwICyvCwoqwsCIsrAgLK8LCirCwIiysCAsrwsKKsLAiLKwICyvCwoqwsCIsrAgLK8LCirCwIiwAAAAAAAAAAAAAAOBQ/QF85Mmwusx6GAAAAABJRU5ErkJggg==';

  return (
    <View style={styles.qrCodeContainer}>
      <View style={{ width: 80, height: 80, border: '1px solid #000', padding: 5, backgroundColor: '#fff' }}>
        {/* Using a try-catch pattern within the Image component since errors will render fallback */}
        <Image 
          src={qrCodeUrl} 
          style={{ width: 70, height: 70 }}
          cache={false}
          onError={() => console.error("Error loading QR code image")} // Log error but continue rendering
        />
      </View>
      <Text style={styles.qrCodeText}>Escaneie para visitar nosso site e ver mais trabalhos</Text>
    </View>
  );
};

export default QRCodeSection;
