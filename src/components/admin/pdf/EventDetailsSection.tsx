
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from './styles';
import { EventDetailsSectionProps } from './types';

const EventDetailsSection: React.FC<EventDetailsSectionProps> = ({ 
  eventType, 
  eventDate, 
  eventLocation,
  colors 
}) => {
  return (
    <View style={styles.section}>
      <Text style={{
        ...styles.sectionTitle, 
        color: colors.primary,
        fontFamily: 'Times-Roman'
      }}>
        Detalhes do Evento
      </Text>
      <Text style={{
        ...styles.text, 
        color: colors.text,
        fontFamily: 'Helvetica'
      }}>
        <Text style={{
          ...styles.textBold, 
          color: colors.primary,
          fontFamily: 'Helvetica'
        }}>
          Tipo de Evento:
        </Text> {eventType}
      </Text>
      <Text style={{
        ...styles.text, 
        color: colors.text,
        fontFamily: 'Helvetica'
      }}>
        <Text style={{
          ...styles.textBold, 
          color: colors.primary,
          fontFamily: 'Helvetica'
        }}>
          Data do Evento:
        </Text> {eventDate}
      </Text>
      <Text style={{
        ...styles.text, 
        color: colors.text,
        fontFamily: 'Helvetica'
      }}>
        <Text style={{
          ...styles.textBold, 
          color: colors.primary,
          fontFamily: 'Helvetica'
        }}>
          Local do Evento:
        </Text> {eventLocation}
      </Text>
    </View>
  );
};

export default EventDetailsSection;

// Fix the export for use in page components
export { EventDetailsSection };
