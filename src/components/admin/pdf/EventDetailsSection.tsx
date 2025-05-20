
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from './styles';

interface EventDetailsSectionProps {
  eventType: string;
  eventDate: string;
  eventLocation: string;
}

const EventDetailsSection: React.FC<EventDetailsSectionProps> = ({ 
  eventType, 
  eventDate, 
  eventLocation 
}) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Detalhes do Evento</Text>
      <Text style={styles.text}>
        <Text style={styles.textBold}>Tipo de Evento:</Text> {eventType}
      </Text>
      <Text style={styles.text}>
        <Text style={styles.textBold}>Data:</Text> {eventDate}
      </Text>
      <Text style={styles.text}>
        <Text style={styles.textBold}>Local:</Text> {eventLocation}
      </Text>
    </View>
  );
};

export default EventDetailsSection;
