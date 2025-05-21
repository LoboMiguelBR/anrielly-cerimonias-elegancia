
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from './styles';
import { ServicesSectionProps } from './types';

const ServicesSection: React.FC<ServicesSectionProps> = ({ services, colors }) => {
  return (
    <View style={styles.section}>
      <Text style={{
        ...styles.sectionTitle, 
        color: colors.primary,
        fontFamily: 'Times-Roman'
      }}>
        Serviços Incluídos
      </Text>
      {services.map((service, index) => (
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
            {service.name}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default ServicesSection;
