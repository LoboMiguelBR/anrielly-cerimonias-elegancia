
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from './styles';
import { DifferentialsSectionProps } from './types';

const DifferentialsSection: React.FC<DifferentialsSectionProps> = ({ colors }) => {
  const differentials = [
    'Cerimônias personalizadas para sua história',
    'Atendimento exclusivo durante todo o processo',
    'Voz profissional e dicção impecável',
    'Experiência em diversos tipos de cerimônias',
    'Suporte na organização do roteiro cerimonial'
  ];
  
  return (
    <View style={styles.section}>
      <Text style={{
        ...styles.sectionTitle, 
        color: colors.primary,
        fontFamily: 'Times-Roman'
      }}>
        Diferenciais
      </Text>
      
      {differentials.map((differential, index) => (
        <View key={index} style={styles.serviceItem}>
          <Text style={{
            ...styles.dot, 
            color: colors.accent,
            fontFamily: 'Helvetica'
          }}>
            •
          </Text>
          <Text style={{
            color: colors.text,
            fontFamily: 'Helvetica'
          }}>
            {differential}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default DifferentialsSection;

// Fix the export for use in page components
export { DifferentialsSection };
