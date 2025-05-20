
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from './styles';

const TestimonialsSection: React.FC = () => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>O que nossos clientes dizem</Text>
      <View style={styles.testimonialSection}>
        <Text style={styles.testimonialQuote}>
          "A Anrielly trouxe magia para nossa cerimônia. Cada palavra foi escolhida com carinho e emocionou a todos os presentes."
        </Text>
        <Text style={styles.testimonialAuthor}>
          Mariana e Pedro, Casamento em Volta Redonda
        </Text>
      </View>
      <View style={styles.testimonialSection}>
        <Text style={styles.testimonialQuote}>
          "Profissionalismo impecável. A Anrielly conseguiu captar nossa história e transformá-la em uma narrativa emocionante."
        </Text>
        <Text style={styles.testimonialAuthor}>
          Família Silva, Bodas de Prata
        </Text>
      </View>
    </View>
  );
};

export default TestimonialsSection;
