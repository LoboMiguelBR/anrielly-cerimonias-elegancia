
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from './styles';
import { TestimonialsSectionProps } from './types';

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ colors }) => {
  const testimonials = [
    {
      quote: "A Anrielly conduziu nossa cerimônia de forma impecável. Todos os convidados elogiaram a emoção e personalização do momento.",
      author: "Ana e Paulo"
    },
    {
      quote: "Melhor decisão que tomamos para nosso casamento. Anrielly tornou nosso momento especial ainda mais único.",
      author: "Camila e Bruno"
    }
  ];
  
  return (
    <View style={styles.section}>
      <Text style={{
        ...styles.sectionTitle, 
        color: colors.primary,
        fontFamily: 'Times-Roman'
      }}>
        O que dizem nossos clientes
      </Text>
      
      {testimonials.map((testimonial, index) => (
        <View key={index} style={styles.testimonialSection}>
          <Text style={{
            ...styles.testimonialQuote, 
            color: colors.text,
            fontFamily: 'Helvetica'
          }}>
            "{testimonial.quote}"
          </Text>
          <Text style={{
            ...styles.testimonialAuthor, 
            color: colors.secondary,
            fontFamily: 'Helvetica'
          }}>
            {testimonial.author}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default TestimonialsSection;

// Fix the export for use in page components
export { TestimonialsSection };
