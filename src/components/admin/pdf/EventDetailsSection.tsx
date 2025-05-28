
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from './styles';

interface EventDetailsSectionProps {
  eventType: string;
  eventDate: string;
  eventLocation: string;
  colors: {
    primary: string;
    text: string;
  };
}

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
        </Text> {eventType || 'Evento'}
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
        </Text> {eventDate || 'A definir'}
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
        </Text> {eventLocation || 'A definir'}
      </Text>
    </View>
  );
};

export default EventDetailsSection;
export { EventDetailsSection };
