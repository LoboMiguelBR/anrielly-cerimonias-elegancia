
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
      <Text style={{...styles.sectionTitle, color: colors.primary}}>Detalhes do Evento</Text>
      <Text style={{...styles.text, color: colors.text}}>
        <Text style={{...styles.textBold, color: colors.primary}}>Tipo de Evento:</Text> {eventType}
      </Text>
      <Text style={{...styles.text, color: colors.text}}>
        <Text style={{...styles.textBold, color: colors.primary}}>Data:</Text> {eventDate}
      </Text>
      <Text style={{...styles.text, color: colors.text}}>
        <Text style={{...styles.textBold, color: colors.primary}}>Local:</Text> {eventLocation}
      </Text>
    </View>
  );
};

export default EventDetailsSection;
