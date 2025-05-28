
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from './styles';
import { ProposalHelper } from './utils/ProposalHelper';

interface PricingSectionProps {
  totalPrice: number;
  paymentTerms: string;
  colors: {
    primary: string;
    text: string;
  };
}

const PricingSection: React.FC<PricingSectionProps> = ({ totalPrice, paymentTerms, colors }) => {
  const formattedPrice = ProposalHelper.formatCurrency(totalPrice);
  const safePaymentTerms = paymentTerms?.trim() || "A definir";

  return (
    <View style={styles.priceSection}>
      <Text style={{
        ...styles.totalPrice, 
        color: colors.primary,
        fontFamily: 'Helvetica'
      }}>
        Valor Total: R$ {formattedPrice}
      </Text>
      <Text style={{
        ...styles.text, 
        color: colors.text,
        fontFamily: 'Helvetica',
        marginTop: 10
      }}>
        <Text style={{
          ...styles.textBold, 
          color: colors.primary,
          fontFamily: 'Helvetica'
        }}>
          Condições de Pagamento:
        </Text>
      </Text>
      <Text style={{
        ...styles.text, 
        color: colors.text,
        fontFamily: 'Helvetica'
      }}>
        {safePaymentTerms}
      </Text>
    </View>
  );
};

export default PricingSection;
export { PricingSection };
