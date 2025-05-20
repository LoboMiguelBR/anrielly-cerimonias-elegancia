
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from './styles';
import { Service } from './types';

interface ServicesSectionProps {
  services: Service[];
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ services }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Serviços Incluídos</Text>
      {services.map((service, index) => (
        <View key={index} style={styles.serviceItem}>
          <Text style={styles.dot}>•</Text>
          <Text>{service.name}</Text>
        </View>
      ))}
    </View>
  );
};

export default ServicesSection;
