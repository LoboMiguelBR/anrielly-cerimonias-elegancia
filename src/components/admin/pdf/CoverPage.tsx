
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
  return (
    <View style={styles.coverPage}>
      <Image 
        src="/lovable-uploads/99442f1a-9c10-4e95-a063-bd0bda0a998c.png"
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
