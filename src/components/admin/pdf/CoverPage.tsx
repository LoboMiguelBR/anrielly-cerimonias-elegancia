
import React from 'react';
import { View, Text, Image } from '@react-pdf/renderer';
import { styles } from './styles';
import { formatCurrency } from '@/lib/utils';

interface CoverPageProps {
  clientName: string;
  eventType: string;
  eventDate: string;
  totalPrice: number;
}

const CoverPage: React.FC<CoverPageProps> = ({ clientName, eventType, eventDate, totalPrice }) => {
  // Use a reliable placeholder image URL
  const logoUrl = "https://via.placeholder.com/200x200/7E69AB/FFFFFF?text=AG";
  
  return (
    <View style={styles.coverPage}>
      <Image 
        src={logoUrl}
        style={styles.coverPageImage}
      />
      
      <Text style={styles.coverPageTitle}>
        Anrielly Gomes
      </Text>
      
      <Text style={styles.coverPageSubtitle}>
        Mestre de Cerimônia | Celebrante de Casamentos
      </Text>
      
      <View style={styles.divider} />
      
      <Text style={styles.coverPageTitle}>
        Proposta de Serviço
      </Text>
      
      <Text style={styles.subtitle}>
        {eventType}
      </Text>
      
      <Text style={styles.subtitle}>
        {eventDate}
      </Text>
      
      <Text style={[styles.subtitle, {marginTop: 20}]}>
        Valor: R$ {formatCurrency(totalPrice)}
      </Text>
      
      <Text style={styles.coverPageClientName}>
        Para: {clientName}
      </Text>
    </View>
  );
};

export default CoverPage;
