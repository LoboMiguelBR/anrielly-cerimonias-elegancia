
import React from 'react';
import { View, Text, Image } from '@react-pdf/renderer';
import { styles } from './styles';
import { CoverPageProps } from './types';

const CoverPage: React.FC<CoverPageProps> = ({ 
  clientName, 
  eventType, 
  eventDate,
  totalPrice,
  logoUrl,
  colors 
}) => {
  // Format the price for display
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(totalPrice);

  // Default Supabase logo URL as fallback
  const defaultLogoUrl = "https://oampddkpuybkbwqggrty.supabase.co/storage/v1/object/public/proposals/LogoAG.png";

  return (
    <View style={{
      ...styles.coverPage,
      backgroundColor: colors.background
    }}>
      <Image 
        src={logoUrl || defaultLogoUrl}
        style={{
          ...styles.coverPageImage,
          borderColor: colors.primary
        }}
        cache={true}
      />
      <Text style={{
        ...styles.coverPageTitle,
        color: colors.primary,
        fontFamily: 'Times-Roman'
      }}>
        Proposta de Serviços
      </Text>
      <Text style={{
        ...styles.coverPageSubtitle,
        color: colors.secondary,
        fontFamily: 'Helvetica'
      }}>
        {eventType}
      </Text>
      <Text style={{
        ...styles.coverPageSubtitle,
        color: colors.text,
        fontFamily: 'Helvetica'
      }}>
        Data: {eventDate}
      </Text>
      <Text style={{
        ...styles.coverPageClientName,
        color: colors.accent,
        fontFamily: 'Times-Roman',
      }}>
        {clientName}
      </Text>
      <Text style={{
        fontSize: 16,
        marginTop: 10,
        color: colors.primary,
        textAlign: 'center',
        fontFamily: 'Helvetica',
      }}>
        Valor: {formattedPrice}
      </Text>
    </View>
  );
};

export default CoverPage;

// Fix export for the component that was previously using CoverPageComponent
export { CoverPage as CoverPageComponent };
