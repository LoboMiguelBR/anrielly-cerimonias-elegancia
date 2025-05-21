
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from './styles';
import { ServicesSectionProps } from './types';

const ServicesSection: React.FC<ServicesSectionProps> = ({ services, colors }) => {
  return (
    <View style={styles.section}>
      <Text style={{...styles.sectionTitle, color: colors.primary}}>Serviços Incluídos</Text>
      {services.map((service, index) => (
        <View key={index} style={styles.serviceItem}>
          <Text style={{...styles.dot, color: colors.accent}}>•</Text>
          <Text style={{color: colors.text}}>{service.name}</Text>
        </View>
      ))}
    </View>
  );
};

export default ServicesSection;
