
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from './styles';
import { formatCurrency } from '@/lib/utils';
import { PricingSectionProps } from './types';

const PricingSection: React.FC<PricingSectionProps> = ({ totalPrice, paymentTerms, colors }) => {
  return (
    <View style={styles.priceSection}>
      <Text style={{
        ...styles.totalPrice, 
        color: colors.primary,
        fontFamily: 'Helvetica',
        fontWeight: 'bold'
      }}>
        Valor Total: R$ {formatCurrency(totalPrice)}
      </Text>
      <Text style={{
        ...styles.text, 
        color: colors.text,
        fontFamily: 'Helvetica'
      }}>
        <Text style={{
          ...styles.textBold, 
          color: colors.primary,
          fontFamily: 'Helvetica',
          fontWeight: 'bold'
        }}>
          Condições de Pagamento:
        </Text>
      </Text>
      <Text style={{
        ...styles.text, 
        color: colors.text,
        fontFamily: 'Helvetica'
      }}>
        {paymentTerms}
      </Text>
    </View>
  );
};

export default PricingSection;

// Fix the export for use in page components
export { PricingSection };
