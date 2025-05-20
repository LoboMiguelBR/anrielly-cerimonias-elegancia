
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from './styles';
import { formatCurrency } from '@/lib/utils';

interface PricingSectionProps {
  totalPrice: number;
  paymentTerms: string;
}

const PricingSection: React.FC<PricingSectionProps> = ({ totalPrice, paymentTerms }) => {
  return (
    <View style={styles.priceSection}>
      <Text style={styles.totalPrice}>
        Valor Total: R$ {formatCurrency(totalPrice)}
      </Text>
      <Text style={styles.text}>
        <Text style={styles.textBold}>Condições de Pagamento:</Text>
      </Text>
      <Text style={styles.text}>{paymentTerms}</Text>
    </View>
  );
};

export default PricingSection;
