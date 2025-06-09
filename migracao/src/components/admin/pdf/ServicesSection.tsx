
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from './styles';

interface Service {
  name: string;
  description?: string;
  price?: number;
  quantity?: number;
  included: boolean;
}

interface ServicesSectionProps {
  services: Service[];
  colors: {
    primary: string;
    accent: string;
    text: string;
  };
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ services, colors }) => {
  // Ensure services is a valid array
  const safeServices = Array.isArray(services) ? services : [];
  
  return (
    <View style={styles.section}>
      <Text style={{
        ...styles.sectionTitle, 
        color: colors.primary,
        fontFamily: 'Times-Roman'
      }}>
        Serviços Incluídos
      </Text>
      {safeServices.length > 0 ? (
        safeServices.map((service, index) => (
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
              {service?.name || 'Serviço não especificado'}
            </Text>
          </View>
        ))
      ) : (
        <Text style={{
          color: colors.text,
          fontFamily: 'Helvetica',
          fontStyle: 'italic'
        }}>
          Nenhum serviço especificado
        </Text>
      )}
    </View>
  );
};

export default ServicesSection;
export { ServicesSection };
