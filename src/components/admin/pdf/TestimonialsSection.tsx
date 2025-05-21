
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from './styles';
import { GenericSectionProps } from './types';

const TestimonialsSection: React.FC<GenericSectionProps> = ({ colors }) => {
  return (
    <View style={styles.section}>
      <Text style={{...styles.sectionTitle, color: colors.primary}}>O que nossos clientes dizem</Text>
      <View style={styles.testimonialSection}>
        <Text style={{...styles.testimonialQuote, color: colors.text}}>
          "A Anrielly trouxe magia para nossa cerimônia. Cada palavra foi escolhida com carinho e emocionou a todos os presentes."
        </Text>
        <Text style={{...styles.testimonialAuthor, color: colors.secondary}}>
          Mariana e Pedro, Casamento em Volta Redonda
        </Text>
      </View>
      <View style={styles.testimonialSection}>
        <Text style={{...styles.testimonialQuote, color: colors.text}}>
          "Profissionalismo impecável. A Anrielly conseguiu captar nossa história e transformá-la em uma narrativa emocionante."
        </Text>
        <Text style={{...styles.testimonialAuthor, color: colors.secondary}}>
          Família Silva, Bodas de Prata
        </Text>
      </View>
    </View>
  );
};

export default TestimonialsSection;
